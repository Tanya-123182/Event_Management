import { pgTable, text, serial, integer, boolean, timestamp, json, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table for both customers and service providers
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  userType: text("user_type").notNull(), // 'customer' or 'provider'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Service categories
export const serviceCategories = pgTable("service_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
});

// Service providers with additional details
export const serviceProviders = pgTable("service_providers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  companyName: text("company_name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  experience: integer("experience").notNull(),
  contactInfo: text("contact_info"),
  categoryId: integer("category_id").notNull().references(() => serviceCategories.id),
  tags: json("tags").$type<string[]>(),
  rating: doublePrecision("rating").default(0),
  reviewCount: integer("review_count").default(0),
  imageUrl: text("image_url"),
});

// Reviews for service providers
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  providerId: integer("provider_id").notNull().references(() => serviceProviders.id),
  customerId: integer("customer_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Event requests from customers
export const eventRequests = pgTable("event_requests", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id").notNull().references(() => users.id),
  providerId: integer("provider_id").references(() => serviceProviders.id),
  categoryId: integer("category_id").notNull().references(() => serviceCategories.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  eventDate: timestamp("event_date"),
  status: text("status").notNull().default("pending"), // pending, accepted, completed, cancelled
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  userType: true,
});

export const insertServiceCategorySchema = createInsertSchema(serviceCategories).pick({
  name: true,
  description: true,
  imageUrl: true,
});

export const insertServiceProviderSchema = createInsertSchema(serviceProviders).pick({
  userId: true,
  companyName: true,
  description: true,
  location: true,
  experience: true,
  contactInfo: true,
  categoryId: true,
  tags: true,
  imageUrl: true,
});

export const insertReviewSchema = createInsertSchema(reviews).pick({
  providerId: true,
  customerId: true,
  rating: true,
  comment: true,
});

export const insertEventRequestSchema = createInsertSchema(eventRequests).pick({
  customerId: true,
  providerId: true,
  categoryId: true,
  title: true,
  description: true,
  eventDate: true,
});

// Type definitions
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type InsertServiceCategory = z.infer<typeof insertServiceCategorySchema>;

export type ServiceProvider = typeof serviceProviders.$inferSelect;
export type InsertServiceProvider = z.infer<typeof insertServiceProviderSchema>;

export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;

export type EventRequest = typeof eventRequests.$inferSelect;
export type InsertEventRequest = z.infer<typeof insertEventRequestSchema>;

// Authentication schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginData = z.infer<typeof loginSchema>;
