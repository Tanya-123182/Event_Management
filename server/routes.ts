import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";
import { insertReviewSchema, insertBookingSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // API routes
  // Get all service categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getServiceCategories();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch service categories" });
    }
  });

  // Get a specific service category by ID
  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const category = await storage.getServiceCategory(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch service category" });
    }
  });

  // Get service providers
  app.get("/api/providers", async (req, res) => {
    try {
      const providers = await storage.getProviders();
      
      // Don't return password field
      const safeProviders = providers.map(provider => {
        const { password, ...safeProvider } = provider;
        return safeProvider;
      });
      
      res.json(safeProviders);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch service providers" });
    }
  });

  // Get services by category ID
  app.get("/api/categories/:id/services", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.id);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      
      const services = await storage.getServicesByCategory(categoryId);
      res.json(services);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  // Get provider details by ID
  app.get("/api/providers/:id", async (req, res) => {
    try {
      const providerId = parseInt(req.params.id);
      if (isNaN(providerId)) {
        return res.status(400).json({ message: "Invalid provider ID" });
      }
      
      const provider = await storage.getUser(providerId);
      if (!provider || provider.userType !== "provider") {
        return res.status(404).json({ message: "Provider not found" });
      }
      
      // Don't return password
      const { password, ...safeProvider } = provider;
      
      // Get provider's services
      const services = await storage.getServicesByProvider(providerId);
      
      // Get reviews for this provider
      const reviews = await storage.getReviewsByProvider(providerId);
      
      res.json({
        provider: safeProvider,
        services,
        reviews
      });
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch provider details" });
    }
  });

  // Create a service (for providers)
  app.post("/api/services", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      if (req.user.userType !== "provider") {
        return res.status(403).json({ message: "Only providers can create services" });
      }
      
      // Set the providerId from the authenticated user
      const serviceData = {
        ...req.body,
        providerId: req.user.id
      };
      
      const service = await storage.createService(serviceData);
      res.status(201).json(service);
    } catch (err) {
      res.status(500).json({ message: "Failed to create service" });
    }
  });

  // Submit a review for a provider
  app.post("/api/reviews", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      if (req.user.userType !== "customer") {
        return res.status(403).json({ message: "Only customers can submit reviews" });
      }
      
      // Validate review data
      const reviewData = insertReviewSchema.parse({
        ...req.body,
        customerId: req.user.id
      });
      
      // Ensure provider exists
      const provider = await storage.getUser(reviewData.providerId);
      if (!provider || provider.userType !== "provider") {
        return res.status(404).json({ message: "Provider not found" });
      }
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: err.errors });
      }
      res.status(500).json({ message: "Failed to submit review" });
    }
  });

  // Create a booking request
  app.post("/api/bookings", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      if (req.user.userType !== "customer") {
        return res.status(403).json({ message: "Only customers can create bookings" });
      }
      
      // Validate booking data
      const bookingData = insertBookingSchema.parse({
        ...req.body,
        customerId: req.user.id
      });
      
      // Ensure provider exists
      const provider = await storage.getUser(bookingData.providerId);
      if (!provider || provider.userType !== "provider") {
        return res.status(404).json({ message: "Provider not found" });
      }
      
      // Ensure service exists
      const service = await storage.getService(bookingData.serviceId);
      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }
      
      const booking = await storage.createBooking(bookingData);
      res.status(201).json(booking);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid booking data", errors: err.errors });
      }
      res.status(500).json({ message: "Failed to create booking" });
    }
  });

  // Get bookings for the current user
  app.get("/api/bookings", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      let bookings;
      if (req.user.userType === "customer") {
        bookings = await storage.getBookingsByCustomer(req.user.id);
      } else if (req.user.userType === "provider") {
        bookings = await storage.getBookingsByProvider(req.user.id);
      } else {
        return res.status(400).json({ message: "Invalid user type" });
      }
      
      res.json(bookings);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  // Update booking status (for providers)
  app.patch("/api/bookings/:id/status", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      if (req.user.userType !== "provider") {
        return res.status(403).json({ message: "Only providers can update booking status" });
      }
      
      const bookingId = parseInt(req.params.id);
      if (isNaN(bookingId)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }
      
      const { status } = req.body;
      if (!status || !["accepted", "rejected", "completed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      // Ensure booking exists and belongs to this provider
      const bookings = await storage.getBookingsByProvider(req.user.id);
      const booking = bookings.find(b => b.id === bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      const updatedBooking = await storage.updateBookingStatus(bookingId, status);
      res.json(updatedBooking);
    } catch (err) {
      res.status(500).json({ message: "Failed to update booking status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
