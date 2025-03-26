import { 
  users, type User, type InsertUser,
  serviceCategories, type ServiceCategory, type InsertServiceCategory,
  services, type Service, type InsertService,
  reviews, type Review, type InsertReview,
  bookings, type Booking, type InsertBooking
} from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  getProviders(): Promise<User[]>;
  updateUserRating(id: number, rating: number, reviewCount: number): Promise<User>;
  
  // Service category operations
  getServiceCategories(): Promise<ServiceCategory[]>;
  getServiceCategory(id: number): Promise<ServiceCategory | undefined>;
  createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory>;
  
  // Service operations
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  getServicesByProvider(providerId: number): Promise<Service[]>;
  getServicesByCategory(categoryId: number): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  
  // Review operations
  getReviews(): Promise<Review[]>;
  getReviewsByProvider(providerId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Booking operations
  getBookings(): Promise<Booking[]>;
  getBookingsByCustomer(customerId: number): Promise<Booking[]>;
  getBookingsByProvider(providerId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking>;

  // Session store
  sessionStore: session.SessionStore;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private serviceCategories: Map<number, ServiceCategory>;
  private services: Map<number, Service>;
  private reviews: Map<number, Review>;
  private bookings: Map<number, Booking>;
  sessionStore: session.SessionStore;
  
  private userIdCounter: number;
  private categoryIdCounter: number;
  private serviceIdCounter: number;
  private reviewIdCounter: number;
  private bookingIdCounter: number;

  constructor() {
    this.users = new Map();
    this.serviceCategories = new Map();
    this.services = new Map();
    this.reviews = new Map();
    this.bookings = new Map();
    
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.serviceIdCounter = 1;
    this.reviewIdCounter = 1;
    this.bookingIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // Clear expired sessions every 24h
    });
    
    // Initialize with sample data
    this.initSampleData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }
  
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async getProviders(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.userType === "provider"
    );
  }
  
  async updateUserRating(id: number, rating: number, reviewCount: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    const updatedUser = { ...user, rating, reviewCount };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Service category operations
  async getServiceCategories(): Promise<ServiceCategory[]> {
    return Array.from(this.serviceCategories.values());
  }
  
  async getServiceCategory(id: number): Promise<ServiceCategory | undefined> {
    return this.serviceCategories.get(id);
  }
  
  async createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory> {
    const id = this.categoryIdCounter++;
    const newCategory: ServiceCategory = { ...category, id };
    this.serviceCategories.set(id, newCategory);
    return newCategory;
  }

  // Service operations
  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }
  
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }
  
  async getServicesByProvider(providerId: number): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      (service) => service.providerId === providerId
    );
  }
  
  async getServicesByCategory(categoryId: number): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      (service) => service.categoryId === categoryId
    );
  }
  
  async createService(service: InsertService): Promise<Service> {
    const id = this.serviceIdCounter++;
    const newService: Service = { ...service, id };
    this.services.set(id, newService);
    return newService;
  }

  // Review operations
  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }
  
  async getReviewsByProvider(providerId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.providerId === providerId
    );
  }
  
  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const newReview: Review = { ...review, id, createdAt: new Date() };
    this.reviews.set(id, newReview);
    
    // Update provider's average rating
    const providerReviews = await this.getReviewsByProvider(review.providerId);
    const totalRating = providerReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = Math.round(totalRating / providerReviews.length);
    
    await this.updateUserRating(review.providerId, avgRating, providerReviews.length);
    
    return newReview;
  }

  // Booking operations
  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }
  
  async getBookingsByCustomer(customerId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.customerId === customerId
    );
  }
  
  async getBookingsByProvider(providerId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(
      (booking) => booking.providerId === providerId
    );
  }
  
  async createBooking(booking: InsertBooking): Promise<Booking> {
    const id = this.bookingIdCounter++;
    const newBooking: Booking = { ...booking, id, createdAt: new Date() };
    this.bookings.set(id, newBooking);
    return newBooking;
  }
  
  async updateBookingStatus(id: number, status: string): Promise<Booking> {
    const booking = this.bookings.get(id);
    if (!booking) {
      throw new Error(`Booking with ID ${id} not found`);
    }
    
    const updatedBooking = { ...booking, status };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Initialize sample data
  private async initSampleData() {
    // Sample service categories
    const categories = [
      {
        name: "Wedding",
        description: "Create magical memories for your special day with our curated wedding services",
        image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6"
      },
      {
        name: "Birthday",
        description: "Make every birthday unforgettable with themed celebrations for all ages",
        image: "https://images.unsplash.com/photo-1502035229833-deb79d276dba"
      },
      {
        name: "Anniversary",
        description: "Celebrate your journey together with romantic anniversary arrangements",
        image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678"
      },
      {
        name: "Corporate",
        description: "Professional event planning for conferences, team building, and corporate functions",
        image: "https://images.unsplash.com/photo-1540317580384-e5d43867caa6"
      },
      {
        name: "Farewell",
        description: "Give a proper sendoff with memorable farewell party arrangements",
        image: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70"
      },
      {
        name: "Graduation",
        description: "Celebrate academic achievements with custom graduation ceremonies and parties",
        image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1"
      }
    ];

    for (const category of categories) {
      await this.createServiceCategory(category);
    }

    // Create sample users and services after initial deployment
  }
}

export const storage = new MemStorage();
