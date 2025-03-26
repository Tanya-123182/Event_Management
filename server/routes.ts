import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Service Categories
  app.get("/api/categories", async (req, res, next) => {
    try {
      const categories = await storage.getAllServiceCategories();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/categories/:id", async (req, res, next) => {
    try {
      const category = await storage.getServiceCategory(parseInt(req.params.id));
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      next(error);
    }
  });

  // Service Providers
  app.get("/api/providers", async (req, res, next) => {
    try {
      const providers = await storage.getAllServiceProviders();
      res.json(providers);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/providers/top", async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const providers = await storage.getTopRatedServiceProviders(limit);
      res.json(providers);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/providers/:id", async (req, res, next) => {
    try {
      const provider = await storage.getServiceProvider(parseInt(req.params.id));
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      res.json(provider);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/providers/category/:categoryId", async (req, res, next) => {
    try {
      const providers = await storage.getServiceProvidersByCategory(parseInt(req.params.categoryId));
      res.json(providers);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/providers/user/:userId", async (req, res, next) => {
    try {
      const provider = await storage.getServiceProviderByUserId(parseInt(req.params.userId));
      if (!provider) {
        return res.status(404).json({ message: "Provider not found" });
      }
      res.json(provider);
    } catch (error) {
      next(error);
    }
  });

  // Reviews
  app.get("/api/reviews/provider/:providerId", async (req, res, next) => {
    try {
      const reviews = await storage.getReviewsByProvider(parseInt(req.params.providerId));
      res.json(reviews);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/reviews", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to submit a review" });
      }

      // Ensure the reviewer is a customer
      if (req.user.userType !== "customer") {
        return res.status(403).json({ message: "Only customers can submit reviews" });
      }

      const review = await storage.createReview({
        ...req.body,
        customerId: req.user.id
      });
      
      res.status(201).json(review);
    } catch (error) {
      next(error);
    }
  });

  // Event Requests
  app.get("/api/requests/customer", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view requests" });
      }

      const requests = await storage.getEventRequestsByCustomer(req.user.id);
      res.json(requests);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/requests/provider", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view requests" });
      }

      // Get provider profile for this user
      const provider = await storage.getServiceProviderByUserId(req.user.id);
      if (!provider) {
        return res.status(404).json({ message: "Provider profile not found" });
      }

      const requests = await storage.getEventRequestsByProvider(provider.id);
      res.json(requests);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/requests", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to create a request" });
      }

      // Ensure the requester is a customer
      if (req.user.userType !== "customer") {
        return res.status(403).json({ message: "Only customers can create event requests" });
      }

      const request = await storage.createEventRequest({
        ...req.body,
        customerId: req.user.id
      });
      
      res.status(201).json(request);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/requests/:id/status", async (req, res, next) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to update request status" });
      }

      const requestId = parseInt(req.params.id);
      const status = req.body.status;
      
      const request = await storage.getEventRequest(requestId);
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }

      // Get provider profile for this user to check permissions
      const provider = await storage.getServiceProviderByUserId(req.user.id);
      
      // Check if user has permission (either the customer or the provider for this request)
      if (request.customerId !== req.user.id && (!provider || request.providerId !== provider.id)) {
        return res.status(403).json({ message: "You don't have permission to update this request" });
      }

      const updatedRequest = await storage.updateEventRequestStatus(requestId, status);
      res.json(updatedRequest);
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
