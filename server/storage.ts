import { 
  User, InsertUser,
  ServiceCategory, InsertServiceCategory,
  ServiceProvider, InsertServiceProvider,
  Review, InsertReview,
  EventRequest, InsertEventRequest
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Modify the interface with CRUD methods needed
export interface IStorage {
  // Session store
  sessionStore: session.SessionStore;

  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Service Categories
  getServiceCategory(id: number): Promise<ServiceCategory | undefined>;
  getAllServiceCategories(): Promise<ServiceCategory[]>;
  createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory>;

  // Service Providers
  getServiceProvider(id: number): Promise<ServiceProvider | undefined>;
  getServiceProviderByUserId(userId: number): Promise<ServiceProvider | undefined>;
  getServiceProvidersByCategory(categoryId: number): Promise<ServiceProvider[]>;
  getAllServiceProviders(): Promise<ServiceProvider[]>;
  getTopRatedServiceProviders(limit: number): Promise<ServiceProvider[]>;
  createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider>;
  updateServiceProviderRating(id: number, rating: number, reviewCount: number): Promise<ServiceProvider>;

  // Reviews
  getReview(id: number): Promise<Review | undefined>;
  getReviewsByProvider(providerId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Event Requests
  getEventRequest(id: number): Promise<EventRequest | undefined>;
  getEventRequestsByCustomer(customerId: number): Promise<EventRequest[]>;
  getEventRequestsByProvider(providerId: number): Promise<EventRequest[]>;
  createEventRequest(request: InsertEventRequest): Promise<EventRequest>;
  updateEventRequestStatus(id: number, status: string): Promise<EventRequest>;
}

export class MemStorage implements IStorage {
  sessionStore: session.SessionStore;
  private users: Map<number, User>;
  private serviceCategories: Map<number, ServiceCategory>;
  private serviceProviders: Map<number, ServiceProvider>;
  private reviews: Map<number, Review>;
  private eventRequests: Map<number, EventRequest>;
  private userIdCounter: number;
  private categoryIdCounter: number;
  private providerIdCounter: number;
  private reviewIdCounter: number;
  private requestIdCounter: number;

  constructor() {
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    this.users = new Map();
    this.serviceCategories = new Map();
    this.serviceProviders = new Map();
    this.reviews = new Map();
    this.eventRequests = new Map();
    this.userIdCounter = 1;
    this.categoryIdCounter = 1;
    this.providerIdCounter = 1;
    this.reviewIdCounter = 1;
    this.requestIdCounter = 1;

    // Initialize with predefined data
    this.initializeData();
  }

  private initializeData(): void {
    // Create service categories
    const categories = [
      { name: "Wedding Events", description: "From intimate ceremonies to grand celebrations, we provide comprehensive wedding planning services.", imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
      { name: "Birthday Celebrations", description: "Create unforgettable birthday experiences with our themed party planning and decoration services.", imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
      { name: "Corporate Events", description: "Professional planning for conferences, team-building activities, and corporate celebrations.", imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
      { name: "Anniversary Events", description: "Celebrate your special milestones with romantic anniversary planning and coordination.", imageUrl: "https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
      { name: "Farewell Parties", description: "Give a proper send-off with our farewell event planning and nostalgic themed decorations.", imageUrl: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
      { name: "Festival & Cultural Events", description: "Organize cultural celebrations and festivals with authentic themes and traditional elements.", imageUrl: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" }
    ];
    
    categories.forEach(category => {
      this.createServiceCategory({
        name: category.name,
        description: category.description,
        imageUrl: category.imageUrl
      });
    });

    // Create sample users (service providers and customers)
    const users = [
      // Providers
      { username: "elegant_affairs", password: "password123", email: "contact@elegantaffairs.com", fullName: "Elegant Affairs", userType: "provider" },
      { username: "party_perfect", password: "password123", email: "info@partyperfect.com", fullName: "Party Perfect", userType: "provider" },
      { username: "summit_events", password: "password123", email: "contact@summitevents.com", fullName: "Summit Events", userType: "provider" },
      { username: "celebration_experts", password: "password123", email: "info@celebrationexperts.com", fullName: "Celebration Experts", userType: "provider" },
      { username: "event_masters", password: "password123", email: "contact@eventmasters.com", fullName: "Event Masters", userType: "provider" },
      { username: "festive_planners", password: "password123", email: "info@festiveplanners.com", fullName: "Festive Planners", userType: "provider" },
      
      // Customers
      { username: "sarah_m", password: "password123", email: "sarah@example.com", fullName: "Sarah Johnson", userType: "customer" },
      { username: "james_t", password: "password123", email: "james@example.com", fullName: "James Thompson", userType: "customer" },
      { username: "lisa_p", password: "password123", email: "lisa@example.com", fullName: "Lisa Peterson", userType: "customer" },
      { username: "robert_j", password: "password123", email: "robert@example.com", fullName: "Robert Johnson", userType: "customer" }
    ];

    const createdUsers: User[] = [];
    users.forEach(user => {
      const createdUser = this.createUser(user);
      createdUsers.push(createdUser);
    });

    // Create service providers
    const providers = [
      { 
        userId: 1, 
        companyName: "Elegant Affairs", 
        description: "Creating magical wedding experiences with personalized themes and attention to every detail. Specialized in luxury weddings.", 
        location: "New York, NY", 
        experience: 8, 
        contactInfo: "contact@elegantaffairs.com", 
        categoryId: 1, 
        tags: ["Weddings", "Engagement", "Receptions"], 
        imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
      },
      { 
        userId: 2, 
        companyName: "Party Perfect", 
        description: "Specializing in creative birthday celebrations for all ages with custom themes, entertainment, and memorable experiences.", 
        location: "Los Angeles, CA", 
        experience: 5, 
        contactInfo: "info@partyperfect.com", 
        categoryId: 2, 
        tags: ["Birthdays", "Kids Events", "Themed Parties"], 
        imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
      },
      { 
        userId: 3, 
        companyName: "Summit Events", 
        description: "Professional corporate event management with expertise in conferences, product launches, and executive retreats.", 
        location: "Chicago, IL", 
        experience: 10, 
        contactInfo: "contact@summitevents.com", 
        categoryId: 3, 
        tags: ["Conferences", "Team Building", "Corporate Galas"], 
        imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
      },
      { 
        userId: 4, 
        companyName: "Celebration Experts", 
        description: "Anniversary celebration specialists creating memorable moments for couples celebrating any milestone year.", 
        location: "Boston, MA", 
        experience: 6, 
        contactInfo: "info@celebrationexperts.com", 
        categoryId: 4, 
        tags: ["Anniversaries", "Romantic Events", "Milestone Celebrations"], 
        imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
      },
      { 
        userId: 5, 
        companyName: "Event Masters", 
        description: "Expert farewell party planners specializing in memorable send-offs for retiring employees or relocating friends.", 
        location: "Seattle, WA", 
        experience: 7, 
        contactInfo: "contact@eventmasters.com", 
        categoryId: 5, 
        tags: ["Farewells", "Retirement Parties", "Going Away Events"], 
        imageUrl: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
      },
      { 
        userId: 6, 
        companyName: "Festive Planners", 
        description: "Cultural event specialists creating authentic cultural experiences for various festivals and traditional celebrations.", 
        location: "Miami, FL", 
        experience: 9, 
        contactInfo: "info@festiveplanners.com", 
        categoryId: 6, 
        tags: ["Cultural Events", "Festivals", "Traditional Celebrations"], 
        imageUrl: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
      }
    ];

    providers.forEach(provider => {
      this.createServiceProvider(provider);
    });

    // Create sample reviews
    const sampleReviews = [
      { providerId: 1, customerId: 7, rating: 5, comment: "Amazing wedding planning service! Everything was perfect." },
      { providerId: 1, customerId: 8, rating: 4, comment: "Great attention to detail, would recommend." },
      { providerId: 2, customerId: 9, rating: 5, comment: "The birthday party was a huge hit with all the kids!" },
      { providerId: 2, customerId: 10, rating: 5, comment: "Incredibly creative themes and decorations." },
      { providerId: 3, customerId: 7, rating: 4, comment: "Very professional corporate event management." },
      { providerId: 3, customerId: 8, rating: 4, comment: "Our conference ran smoothly thanks to Summit Events." },
      { providerId: 4, customerId: 9, rating: 5, comment: "Made our 10th anniversary truly special!" },
      { providerId: 4, customerId: 10, rating: 4, comment: "Beautiful decorations and excellent service." },
      { providerId: 5, customerId: 7, rating: 4, comment: "Great farewell party organization." },
      { providerId: 5, customerId: 8, rating: 4, comment: "Creative and emotional farewell event." },
      { providerId: 6, customerId: 9, rating: 5, comment: "Authentic cultural elements made the festival amazing!" },
      { providerId: 6, customerId: 10, rating: 4, comment: "Excellent attention to traditional details." }
    ];

    sampleReviews.forEach(review => {
      this.createReview(review);
    });

    // Update provider ratings based on reviews
    for (let i = 1; i <= 6; i++) {
      const reviews = this.getReviewsByProvider(i);
      if (reviews.length > 0) {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const avgRating = totalRating / reviews.length;
        this.updateServiceProviderRating(i, avgRating, reviews.length);
      }
    }

    // Create sample event requests
    const sampleRequests = [
      { customerId: 7, providerId: 1, categoryId: 1, title: "Summer Wedding", description: "Planning a summer wedding for 150 guests", eventDate: new Date(2023, 6, 15), status: "accepted" },
      { customerId: 8, providerId: 3, categoryId: 3, title: "Annual Corporate Retreat", description: "Team building event for 50 employees", eventDate: new Date(2023, 8, 10), status: "completed" },
      { customerId: 9, providerId: 2, categoryId: 2, title: "Sweet 16 Birthday", description: "Planning a sweet 16 party with a Hollywood theme", eventDate: new Date(2023, 5, 22), status: "pending" },
      { customerId: 10, providerId: 4, categoryId: 4, title: "25th Anniversary Celebration", description: "Silver anniversary dinner for 40 guests", eventDate: new Date(2023, 10, 5), status: "accepted" }
    ];

    sampleRequests.forEach(request => {
      this.createEventRequest(request);
    });
  }

  // User methods
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

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Service Category methods
  async getServiceCategory(id: number): Promise<ServiceCategory | undefined> {
    return this.serviceCategories.get(id);
  }

  async getAllServiceCategories(): Promise<ServiceCategory[]> {
    return Array.from(this.serviceCategories.values());
  }

  async createServiceCategory(category: InsertServiceCategory): Promise<ServiceCategory> {
    const id = this.categoryIdCounter++;
    const newCategory: ServiceCategory = { ...category, id };
    this.serviceCategories.set(id, newCategory);
    return newCategory;
  }

  // Service Provider methods
  async getServiceProvider(id: number): Promise<ServiceProvider | undefined> {
    return this.serviceProviders.get(id);
  }

  async getServiceProviderByUserId(userId: number): Promise<ServiceProvider | undefined> {
    return Array.from(this.serviceProviders.values()).find(
      (provider) => provider.userId === userId
    );
  }

  async getServiceProvidersByCategory(categoryId: number): Promise<ServiceProvider[]> {
    return Array.from(this.serviceProviders.values()).filter(
      (provider) => provider.categoryId === categoryId
    );
  }

  async getAllServiceProviders(): Promise<ServiceProvider[]> {
    return Array.from(this.serviceProviders.values());
  }

  async getTopRatedServiceProviders(limit: number): Promise<ServiceProvider[]> {
    return Array.from(this.serviceProviders.values())
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  async createServiceProvider(provider: InsertServiceProvider): Promise<ServiceProvider> {
    const id = this.providerIdCounter++;
    const newProvider: ServiceProvider = { ...provider, id, rating: 0, reviewCount: 0 };
    this.serviceProviders.set(id, newProvider);
    return newProvider;
  }

  async updateServiceProviderRating(id: number, rating: number, reviewCount: number): Promise<ServiceProvider> {
    const provider = await this.getServiceProvider(id);
    if (!provider) {
      throw new Error("Service provider not found");
    }
    
    const updatedProvider: ServiceProvider = { ...provider, rating, reviewCount };
    this.serviceProviders.set(id, updatedProvider);
    return updatedProvider;
  }

  // Review methods
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
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
    
    // Update provider rating
    const providerReviews = await this.getReviewsByProvider(review.providerId);
    const totalRating = providerReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / providerReviews.length;
    
    await this.updateServiceProviderRating(
      review.providerId,
      avgRating,
      providerReviews.length
    );
    
    return newReview;
  }

  // Event Request methods
  async getEventRequest(id: number): Promise<EventRequest | undefined> {
    return this.eventRequests.get(id);
  }

  async getEventRequestsByCustomer(customerId: number): Promise<EventRequest[]> {
    return Array.from(this.eventRequests.values()).filter(
      (request) => request.customerId === customerId
    );
  }

  async getEventRequestsByProvider(providerId: number): Promise<EventRequest[]> {
    return Array.from(this.eventRequests.values()).filter(
      (request) => request.providerId === providerId
    );
  }

  async createEventRequest(request: InsertEventRequest): Promise<EventRequest> {
    const id = this.requestIdCounter++;
    const newRequest: EventRequest = { 
      ...request, 
      id, 
      status: "pending", 
      createdAt: new Date() 
    };
    this.eventRequests.set(id, newRequest);
    return newRequest;
  }

  async updateEventRequestStatus(id: number, status: string): Promise<EventRequest> {
    const request = await this.getEventRequest(id);
    if (!request) {
      throw new Error("Event request not found");
    }
    
    const updatedRequest: EventRequest = { ...request, status };
    this.eventRequests.set(id, updatedRequest);
    return updatedRequest;
  }
}

// Importing DatabaseStorage implementation instead of using MemStorage
import { DatabaseStorage } from "./storage-db";
export const storage = new DatabaseStorage();
