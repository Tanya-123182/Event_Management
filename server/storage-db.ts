import { db } from "./db";
import { 
  users, serviceCategories, serviceProviders, reviews, eventRequests,
  type User, type ServiceCategory, type ServiceProvider, type Review, type EventRequest,
  type InsertUser, type InsertServiceCategory, type InsertServiceProvider, 
  type InsertReview, type InsertEventRequest
} from "@shared/schema";
import { eq, desc, and, SQL } from "drizzle-orm";
import connectPg from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

// Database implementation of the storage interface
export class DatabaseStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Service Category methods
  async getServiceCategory(id: number): Promise<ServiceCategory | undefined> {
    const [category] = await db.select().from(serviceCategories).where(eq(serviceCategories.id, id));
    return category;
  }

  async getAllServiceCategories(): Promise<ServiceCategory[]> {
    return await db.select().from(serviceCategories);
  }

  async createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory> {
    const [newCategory] = await db.insert(serviceCategories).values(category).returning();
    return newCategory;
  }

  // Service Provider methods
  async getServiceProvider(id: number): Promise<ServiceProvider | undefined> {
    const [provider] = await db.select().from(serviceProviders).where(eq(serviceProviders.id, id));
    return provider;
  }

  async getServiceProviderByUserId(userId: number): Promise<ServiceProvider | undefined> {
    const [provider] = await db.select().from(serviceProviders).where(eq(serviceProviders.userId, userId));
    return provider;
  }

  async getServiceProvidersByCategory(categoryId: number): Promise<ServiceProvider[]> {
    return await db.select().from(serviceProviders).where(eq(serviceProviders.categoryId, categoryId));
  }

  async getAllServiceProviders(): Promise<ServiceProvider[]> {
    return await db.select().from(serviceProviders);
  }

  async getTopRatedServiceProviders(limit: number): Promise<ServiceProvider[]> {
    // Order by rating and limit results
    return await db.select()
      .from(serviceProviders)
      .orderBy(desc(serviceProviders.rating))
      .limit(limit);
  }

  async createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider> {
    // Ensure we're not passing additional fields that aren't in the schema
    const { userId, companyName, description, location, experience, contactInfo, categoryId, tags, imageUrl } = provider;
    
    const [newProvider] = await db.insert(serviceProviders)
      .values({
        userId,
        companyName,
        description, 
        location,
        experience,
        contactInfo,
        categoryId,
        tags,
        imageUrl,
        rating: 0,
        reviewCount: 0
      })
      .returning();
    return newProvider;
  }

  async updateServiceProviderRating(id: number, rating: number, reviewCount: number): Promise<ServiceProvider> {
    const [updatedProvider] = await db.update(serviceProviders)
      .set({ rating, reviewCount })
      .where(eq(serviceProviders.id, id))
      .returning();
    return updatedProvider;
  }

  // Review methods
  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  async getReviewsByProvider(providerId: number): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.providerId, providerId));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    
    // Update provider rating after adding review
    const providerReviews = await this.getReviewsByProvider(review.providerId);
    if (providerReviews.length > 0) {
      const totalRating = providerReviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / providerReviews.length;
      
      await this.updateServiceProviderRating(
        review.providerId, 
        averageRating, 
        providerReviews.length
      );
    }
    
    return newReview;
  }

  // Event Request methods
  async getEventRequest(id: number): Promise<EventRequest | undefined> {
    const [request] = await db.select().from(eventRequests).where(eq(eventRequests.id, id));
    return request;
  }

  async getEventRequestsByCustomer(customerId: number): Promise<EventRequest[]> {
    return await db.select()
      .from(eventRequests)
      .where(eq(eventRequests.customerId, customerId));
  }

  async getEventRequestsByProvider(providerId: number): Promise<EventRequest[]> {
    return await db.select()
      .from(eventRequests)
      .where(eq(eventRequests.providerId, providerId));
  }

  async createEventRequest(request: InsertEventRequest): Promise<EventRequest> {
    const [newRequest] = await db.insert(eventRequests)
      .values({
        ...request,
        status: "pending"
      })
      .returning();
    return newRequest;
  }

  async updateEventRequestStatus(id: number, status: string): Promise<EventRequest> {
    const [updatedRequest] = await db.update(eventRequests)
      .set({ status })
      .where(eq(eventRequests.id, id))
      .returning();
    return updatedRequest;
  }
}

export const storage = new DatabaseStorage();