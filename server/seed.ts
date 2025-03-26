import { db } from "./db";
import { users, serviceCategories, serviceProviders, reviews, eventRequests } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";
import { eq } from "drizzle-orm";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seedDatabase() {
  console.log("Seeding database...");

  // Check if we have any data already
  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) {
    console.log("Database already has data. Skipping seed.");
    return;
  }

  // Create service categories
  const categories = [
    { name: "Wedding Events", description: "From intimate ceremonies to grand celebrations, we provide comprehensive wedding planning services.", imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
    { name: "Birthday Celebrations", description: "Create unforgettable birthday experiences with our themed party planning and decoration services.", imageUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
    { name: "Corporate Events", description: "Professional planning for conferences, team-building activities, and corporate celebrations.", imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
    { name: "Anniversary Events", description: "Celebrate your special milestones with romantic anniversary planning and coordination.", imageUrl: "https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
    { name: "Farewell Parties", description: "Give a proper send-off with our farewell event planning and nostalgic themed decorations.", imageUrl: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" },
    { name: "Festival & Cultural Events", description: "Organize cultural celebrations and festivals with authentic themes and traditional elements.", imageUrl: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" }
  ];

  const insertedCategories = await db.insert(serviceCategories).values(categories).returning({ id: serviceCategories.id });
  console.log(`Inserted ${insertedCategories.length} categories`);

  // Create users with hashed passwords
  const usersList = [
    // Providers
    { username: "elegant_affairs", password: await hashPassword("password123"), email: "contact@elegantaffairs.com", fullName: "Elegant Affairs", userType: "provider" },
    { username: "party_perfect", password: await hashPassword("password123"), email: "info@partyperfect.com", fullName: "Party Perfect", userType: "provider" },
    { username: "summit_events", password: await hashPassword("password123"), email: "contact@summitevents.com", fullName: "Summit Events", userType: "provider" },
    { username: "celebration_experts", password: await hashPassword("password123"), email: "info@celebrationexperts.com", fullName: "Celebration Experts", userType: "provider" },
    { username: "event_masters", password: await hashPassword("password123"), email: "contact@eventmasters.com", fullName: "Event Masters", userType: "provider" },
    { username: "festive_planners", password: await hashPassword("password123"), email: "info@festiveplanners.com", fullName: "Festive Planners", userType: "provider" },
    
    // Customers
    { username: "sarah_m", password: await hashPassword("password123"), email: "sarah@example.com", fullName: "Sarah Johnson", userType: "customer" },
    { username: "james_t", password: await hashPassword("password123"), email: "james@example.com", fullName: "James Thompson", userType: "customer" },
    { username: "lisa_p", password: await hashPassword("password123"), email: "lisa@example.com", fullName: "Lisa Peterson", userType: "customer" },
    { username: "robert_j", password: await hashPassword("password123"), email: "robert@example.com", fullName: "Robert Johnson", userType: "customer" },
    
    // Test customer account for easy login
    { username: "customer", password: await hashPassword("password"), email: "customer@example.com", fullName: "Test Customer", userType: "customer" },
    { username: "provider", password: await hashPassword("password"), email: "provider@example.com", fullName: "Test Provider", userType: "provider" }
  ];

  const insertedUsers = await db.insert(users).values(usersList).returning({ id: users.id });
  console.log(`Inserted ${insertedUsers.length} users`);

  // Create service providers
  const providers = [
    { 
      userId: insertedUsers[0].id, 
      companyName: "Elegant Affairs", 
      description: "Creating magical wedding experiences with personalized themes and attention to every detail. Specialized in luxury weddings.", 
      location: "New York, NY", 
      experience: 8, 
      contactInfo: "contact@elegantaffairs.com | (555) 123-4567", 
      categoryId: insertedCategories[0].id, 
      tags: ["Weddings", "Engagement", "Receptions"], 
      imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 0,
      reviewCount: 0
    },
    { 
      userId: insertedUsers[1].id, 
      companyName: "Party Perfect", 
      description: "Specializing in creative birthday celebrations for all ages with custom themes, entertainment, and memorable experiences.", 
      location: "Los Angeles, CA", 
      experience: 5, 
      contactInfo: "info@partyperfect.com | (555) 987-6543", 
      categoryId: insertedCategories[1].id, 
      tags: ["Birthdays", "Kids Events", "Themed Parties"], 
      imageUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 0,
      reviewCount: 0 
    },
    { 
      userId: insertedUsers[2].id, 
      companyName: "Summit Events", 
      description: "Professional corporate event management with expertise in conferences, product launches, and executive retreats.", 
      location: "Chicago, IL", 
      experience: 10, 
      contactInfo: "contact@summitevents.com | (555) 456-7890", 
      categoryId: insertedCategories[2].id, 
      tags: ["Conferences", "Team Building", "Corporate Galas"], 
      imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 0,
      reviewCount: 0
    },
    { 
      userId: insertedUsers[3].id, 
      companyName: "Celebration Experts", 
      description: "Anniversary celebration specialists creating memorable moments for couples celebrating any milestone year.", 
      location: "Boston, MA", 
      experience: 6, 
      contactInfo: "info@celebrationexperts.com | (555) 234-5678", 
      categoryId: insertedCategories[3].id, 
      tags: ["Anniversaries", "Romantic Events", "Milestone Celebrations"], 
      imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 0,
      reviewCount: 0
    },
    { 
      userId: insertedUsers[4].id, 
      companyName: "Event Masters", 
      description: "Expert farewell party planners specializing in memorable send-offs for retiring employees or relocating friends.", 
      location: "Seattle, WA", 
      experience: 7, 
      contactInfo: "contact@eventmasters.com | (555) 876-5432", 
      categoryId: insertedCategories[4].id, 
      tags: ["Farewells", "Retirement Parties", "Going Away Events"], 
      imageUrl: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 0,
      reviewCount: 0
    },
    { 
      userId: insertedUsers[5].id, 
      companyName: "Festive Planners", 
      description: "Cultural event specialists creating authentic cultural experiences for various festivals and traditional celebrations.", 
      location: "Miami, FL", 
      experience: 9, 
      contactInfo: "info@festiveplanners.com | (555) 345-6789", 
      categoryId: insertedCategories[5].id, 
      tags: ["Cultural Events", "Festivals", "Traditional Celebrations"], 
      imageUrl: "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 0,
      reviewCount: 0
    },
    {
      userId: insertedUsers[11].id,
      companyName: "Test Provider Services",
      description: "This is a test provider account that you can use to try out provider features.",
      location: "Test City, CA",
      experience: 5,
      contactInfo: "provider@example.com | (555) 123-4567",
      categoryId: insertedCategories[0].id,
      tags: ["Testing", "Demo", "Examples"],
      imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      rating: 0,
      reviewCount: 0
    }
  ];

  const insertedProviders = await db.insert(serviceProviders).values(providers).returning({ id: serviceProviders.id });
  console.log(`Inserted ${insertedProviders.length} providers`);

  // Create reviews
  const reviewsData = [
    { providerId: insertedProviders[0].id, customerId: insertedUsers[6].id, rating: 5, comment: "Amazing wedding planning service! Everything was perfect.", createdAt: new Date() },
    { providerId: insertedProviders[0].id, customerId: insertedUsers[7].id, rating: 4, comment: "Great attention to detail, would recommend.", createdAt: new Date() },
    { providerId: insertedProviders[1].id, customerId: insertedUsers[8].id, rating: 5, comment: "The birthday party was a huge hit with all the kids!", createdAt: new Date() },
    { providerId: insertedProviders[1].id, customerId: insertedUsers[9].id, rating: 5, comment: "Incredibly creative themes and decorations.", createdAt: new Date() },
    { providerId: insertedProviders[2].id, customerId: insertedUsers[6].id, rating: 4, comment: "Very professional corporate event management.", createdAt: new Date() },
    { providerId: insertedProviders[2].id, customerId: insertedUsers[7].id, rating: 4, comment: "Our conference ran smoothly thanks to Summit Events.", createdAt: new Date() },
    { providerId: insertedProviders[3].id, customerId: insertedUsers[8].id, rating: 5, comment: "Made our 10th anniversary truly special!", createdAt: new Date() },
    { providerId: insertedProviders[3].id, customerId: insertedUsers[9].id, rating: 4, comment: "Beautiful decorations and excellent service.", createdAt: new Date() },
    { providerId: insertedProviders[4].id, customerId: insertedUsers[6].id, rating: 4, comment: "Great farewell party organization.", createdAt: new Date() },
    { providerId: insertedProviders[4].id, customerId: insertedUsers[7].id, rating: 4, comment: "Creative and emotional farewell event.", createdAt: new Date() },
    { providerId: insertedProviders[5].id, customerId: insertedUsers[8].id, rating: 5, comment: "Authentic cultural elements made the festival amazing!", createdAt: new Date() },
    { providerId: insertedProviders[5].id, customerId: insertedUsers[9].id, rating: 4, comment: "Excellent attention to traditional details.", createdAt: new Date() }
  ];

  const insertedReviews = await db.insert(reviews).values(reviewsData).returning({ id: reviews.id });
  console.log(`Inserted ${insertedReviews.length} reviews`);

  // Update provider ratings
  for (let i = 0; i < 6; i++) {
    const providerReviews = await db.select().from(reviews).where(eq(reviews.providerId, insertedProviders[i].id));
    if (providerReviews.length > 0) {
      const totalRating = providerReviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = totalRating / providerReviews.length;
      await db.update(serviceProviders)
        .set({ rating: avgRating, reviewCount: providerReviews.length })
        .where(eq(serviceProviders.id, insertedProviders[i].id));
    }
  }

  // Create event requests
  const now = new Date();
  const requestsData = [
    { 
      customerId: insertedUsers[6].id, 
      providerId: insertedProviders[0].id, 
      categoryId: insertedCategories[0].id, 
      title: "Summer Wedding", 
      description: "Planning a summer wedding for 150 guests", 
      eventDate: new Date(now.getFullYear(), now.getMonth() + 2, 15), 
      status: "accepted", 
      createdAt: new Date() 
    },
    { 
      customerId: insertedUsers[7].id, 
      providerId: insertedProviders[2].id, 
      categoryId: insertedCategories[2].id, 
      title: "Annual Corporate Retreat", 
      description: "Team building event for 50 employees", 
      eventDate: new Date(now.getFullYear(), now.getMonth() + 3, 10), 
      status: "completed", 
      createdAt: new Date() 
    },
    { 
      customerId: insertedUsers[8].id, 
      providerId: insertedProviders[1].id, 
      categoryId: insertedCategories[1].id, 
      title: "Sweet 16 Birthday", 
      description: "Planning a sweet 16 party with a Hollywood theme", 
      eventDate: new Date(now.getFullYear(), now.getMonth() + 1, 22), 
      status: "pending", 
      createdAt: new Date() 
    },
    { 
      customerId: insertedUsers[9].id, 
      providerId: insertedProviders[3].id, 
      categoryId: insertedCategories[3].id, 
      title: "25th Anniversary Celebration", 
      description: "Silver anniversary dinner for 40 guests", 
      eventDate: new Date(now.getFullYear(), now.getMonth() + 4, 5), 
      status: "accepted", 
      createdAt: new Date() 
    },
    { 
      customerId: insertedUsers[10].id, 
      providerId: insertedProviders[6].id, 
      categoryId: insertedCategories[0].id, 
      title: "Test Wedding Event", 
      description: "This is a test event request for demo purposes", 
      eventDate: new Date(now.getFullYear(), now.getMonth() + 1, 15), 
      status: "pending", 
      createdAt: new Date() 
    }
  ];

  const insertedRequests = await db.insert(eventRequests).values(requestsData).returning({ id: eventRequests.id });
  console.log(`Inserted ${insertedRequests.length} event requests`);

  console.log("Database seeding completed successfully!");
}

// Export the seed function
export { seedDatabase };