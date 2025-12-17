import { 
  type User, 
  type InsertUser, 
  type Destination,
  type InsertDestination,
  type EmergencyContact,
  type InsertEmergencyContact,
  type Volunteer,
  type InsertVolunteer,
  type TripPlan,
  type InsertTripPlan,
  type BlogPost,
  type InsertBlogPost
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getDestinations(): Promise<Destination[]>;
  getDestination(id: string): Promise<Destination | undefined>;
  createDestination(destination: InsertDestination): Promise<Destination>;
  
  getEmergencyContacts(userId?: string): Promise<EmergencyContact[]>;
  getEmergencyContact(id: string): Promise<EmergencyContact | undefined>;
  createEmergencyContact(contact: InsertEmergencyContact): Promise<EmergencyContact>;
  deleteEmergencyContact(id: string): Promise<boolean>;
  
  getVolunteers(): Promise<Volunteer[]>;
  getVolunteer(id: string): Promise<Volunteer | undefined>;
  createVolunteer(volunteer: InsertVolunteer): Promise<Volunteer>;
  
  getTripPlans(userId?: string): Promise<TripPlan[]>;
  getTripPlan(id: string): Promise<TripPlan | undefined>;
  createTripPlan(plan: InsertTripPlan): Promise<TripPlan>;
  
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private destinations: Map<string, Destination>;
  private emergencyContacts: Map<string, EmergencyContact>;
  private volunteers: Map<string, Volunteer>;
  private tripPlans: Map<string, TripPlan>;
  private blogPosts: Map<string, BlogPost>;

  constructor() {
    this.users = new Map();
    this.destinations = new Map();
    this.emergencyContacts = new Map();
    this.volunteers = new Map();
    this.tripPlans = new Map();
    this.blogPosts = new Map();
    
    this.seedData();
  }

  private seedData() {
    const destinations: InsertDestination[] = [
      {
        name: "Louvre Museum",
        description: "World-famous art museum with excellent accessibility features including tactile tours and wheelchair-friendly paths throughout.",
        location: "Paris, France",
        latitude: "48.8606",
        longitude: "2.3376",
        imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800",
        accessibilityScore: 5,
        wheelchairAccess: true,
        tactilePaths: true,
        audioGuides: true,
        signLanguageSupport: true,
        category: "museum",
      },
      {
        name: "Central Park",
        description: "Iconic urban park with accessible pathways, sensory gardens, and adaptive recreation programs.",
        location: "New York, USA",
        latitude: "40.7829",
        longitude: "-73.9654",
        imageUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800",
        accessibilityScore: 4,
        wheelchairAccess: true,
        tactilePaths: true,
        audioGuides: true,
        signLanguageSupport: false,
        category: "park",
      },
      {
        name: "Tokyo Skytree",
        description: "Observation tower with barrier-free access, braille signage, and multi-language audio guides.",
        location: "Tokyo, Japan",
        latitude: "35.7101",
        longitude: "139.8107",
        imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
        accessibilityScore: 5,
        wheelchairAccess: true,
        tactilePaths: true,
        audioGuides: true,
        signLanguageSupport: true,
        category: "attraction",
      },
      {
        name: "Sydney Opera House",
        description: "Iconic performing arts venue with accessibility services including captioning and audio description.",
        location: "Sydney, Australia",
        latitude: "-33.8568",
        longitude: "151.2153",
        imageUrl: "https://images.unsplash.com/photo-1523059623039-a9ed027e7fad?w=800",
        accessibilityScore: 4,
        wheelchairAccess: true,
        tactilePaths: false,
        audioGuides: true,
        signLanguageSupport: true,
        category: "attraction",
      },
      {
        name: "British Museum",
        description: "Historic museum with comprehensive accessibility including wheelchairs for loan and BSL tours.",
        location: "London, UK",
        latitude: "51.5194",
        longitude: "-0.1270",
        imageUrl: "https://images.unsplash.com/photo-1590080875852-ba44e8c98a52?w=800",
        accessibilityScore: 5,
        wheelchairAccess: true,
        tactilePaths: true,
        audioGuides: true,
        signLanguageSupport: true,
        category: "museum",
      },
      {
        name: "Sagrada Familia",
        description: "Gaudi's masterpiece with accessible entrances and audio guides in multiple languages.",
        location: "Barcelona, Spain",
        latitude: "41.4036",
        longitude: "2.1744",
        imageUrl: "https://images.unsplash.com/photo-1583779457703-7cc0d9e0d7b0?w=800",
        accessibilityScore: 3,
        wheelchairAccess: true,
        tactilePaths: false,
        audioGuides: true,
        signLanguageSupport: false,
        category: "attraction",
      },
      {
        name: "Accessible Beach Resort",
        description: "Fully accessible beach resort with beach wheelchairs, accessible rooms, and trained staff.",
        location: "Cancun, Mexico",
        latitude: "21.1619",
        longitude: "-86.8515",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        accessibilityScore: 5,
        wheelchairAccess: true,
        tactilePaths: true,
        audioGuides: false,
        signLanguageSupport: true,
        category: "hotel",
      },
      {
        name: "Sensory Garden Cafe",
        description: "Restaurant with Braille menus, quiet seating areas, and staff trained in accessibility.",
        location: "Amsterdam, Netherlands",
        latitude: "52.3676",
        longitude: "4.9041",
        imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
        accessibilityScore: 4,
        wheelchairAccess: true,
        tactilePaths: false,
        audioGuides: false,
        signLanguageSupport: true,
        category: "restaurant",
      },
    ];

    destinations.forEach(d => this.createDestination(d));

    const volunteers: InsertVolunteer[] = [
      {
        name: "Sarah Johnson",
        photo: null,
        languages: ["English", "Spanish"],
        specializations: ["visual", "mobility"],
        location: "New York, USA",
        availability: "available",
        rating: 5,
        bio: "Certified accessibility guide with 5 years of experience helping travelers with disabilities explore the city.",
      },
      {
        name: "Takeshi Yamamoto",
        photo: null,
        languages: ["Japanese", "English"],
        specializations: ["hearing", "mobility"],
        location: "Tokyo, Japan",
        availability: "available",
        rating: 5,
        bio: "Former sign language interpreter, now volunteering to make Japan accessible for all travelers.",
      },
      {
        name: "Marie Dubois",
        photo: null,
        languages: ["French", "English", "German"],
        specializations: ["visual"],
        location: "Paris, France",
        availability: "busy",
        rating: 4,
        bio: "Museum guide specializing in audio description and tactile tours for visually impaired visitors.",
      },
      {
        name: "James Wilson",
        photo: null,
        languages: ["English"],
        specializations: ["mobility"],
        location: "London, UK",
        availability: "available",
        rating: 5,
        bio: "Wheelchair user myself, I know the best accessible routes and hidden gems in London.",
      },
      {
        name: "Ana Garcia",
        photo: null,
        languages: ["Spanish", "English", "Portuguese"],
        specializations: ["hearing", "visual"],
        location: "Barcelona, Spain",
        availability: "available",
        rating: 4,
        bio: "Healthcare professional with experience in assisting travelers with various disabilities.",
      },
      {
        name: "Emma Thompson",
        photo: null,
        languages: ["English", "Auslan"],
        specializations: ["hearing"],
        location: "Sydney, Australia",
        availability: "offline",
        rating: 5,
        bio: "Deaf community advocate and Auslan interpreter, helping deaf travelers experience Australia.",
      },
    ];

    volunteers.forEach(v => this.createVolunteer(v));

    const blogPosts: InsertBlogPost[] = [
      {
        title: "My Journey Across Japan in a Wheelchair",
        excerpt: "How I navigated one of the world's most accessible countries and discovered hidden gems along the way.",
        content: "When I first planned my trip to Japan, I was nervous about accessibility. But what I found exceeded all expectations. From the seamless train system to the thoughtful design of temples and shrines, Japan showed me that travel is truly possible for everyone...",
        imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
        author: "Michael Chen",
        category: "travel-stories",
        disabilityTags: ["mobility"],
      },
      {
        title: "Essential Tips for Deaf Travelers",
        excerpt: "Practical advice for navigating airports, hotels, and tourist attractions when you can't hear announcements.",
        content: "Traveling while deaf comes with unique challenges, but with the right preparation, you can explore the world confidently. Here are my top tips after visiting 30 countries...",
        imageUrl: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800",
        author: "Lisa Park",
        category: "tips",
        disabilityTags: ["hearing"],
      },
      {
        title: "The Most Accessible Cities in Europe",
        excerpt: "A comprehensive guide to European cities that are leading the way in accessible tourism.",
        content: "Europe has made tremendous strides in accessibility over the past decade. Here's my ranking of the most accessible cities for travelers with disabilities...",
        imageUrl: "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800",
        author: "David Miller",
        category: "guides",
        disabilityTags: ["mobility", "visual"],
      },
      {
        title: "Traveling Solo with Low Vision",
        excerpt: "How I overcame my fears and discovered the joy of independent travel despite my visual impairment.",
        content: "For years, I thought solo travel was impossible for someone with my level of vision. Then I decided to take the leap, and it changed my life...",
        imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
        author: "Rachel Adams",
        category: "travel-stories",
        disabilityTags: ["visual"],
      },
      {
        title: "New Accessibility Standards Coming to Airlines",
        excerpt: "Major changes are coming to air travel that will make flying easier for passengers with disabilities.",
        content: "The aviation industry is finally catching up with accessibility needs. Here's what you need to know about the upcoming changes...",
        imageUrl: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800",
        author: "Knight Guide Team",
        category: "accessibility",
        disabilityTags: ["mobility", "hearing", "visual"],
      },
      {
        title: "Best Apps for Accessible Travel",
        excerpt: "A curated list of smartphone apps that make traveling with a disability easier and more enjoyable.",
        content: "Technology has revolutionized accessible travel. Here are the essential apps every traveler with a disability should have on their phone...",
        imageUrl: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
        author: "Tech Team",
        category: "tips",
        disabilityTags: ["mobility", "visual", "hearing"],
      },
    ];

    blogPosts.forEach(p => this.createBlogPost(p));

    const emergencyContacts: InsertEmergencyContact[] = [
      {
        userId: null,
        name: "Emergency Services",
        phone: "112",
        relationship: "hospital",
        isDefault: true,
      },
      {
        userId: null,
        name: "Disability Rights NGO",
        phone: "+1-800-555-0199",
        relationship: "ngo",
        isDefault: false,
      },
    ];

    emergencyContacts.forEach(c => this.createEmergencyContact(c));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async getDestination(id: string): Promise<Destination | undefined> {
    return this.destinations.get(id);
  }

  async createDestination(insertDestination: InsertDestination): Promise<Destination> {
    const id = randomUUID();
    const destination: Destination = { ...insertDestination, id };
    this.destinations.set(id, destination);
    return destination;
  }

  async getEmergencyContacts(userId?: string): Promise<EmergencyContact[]> {
    const contacts = Array.from(this.emergencyContacts.values());
    if (userId) {
      return contacts.filter(c => c.userId === userId || c.userId === null);
    }
    return contacts;
  }

  async getEmergencyContact(id: string): Promise<EmergencyContact | undefined> {
    return this.emergencyContacts.get(id);
  }

  async createEmergencyContact(insertContact: InsertEmergencyContact): Promise<EmergencyContact> {
    const id = randomUUID();
    const contact: EmergencyContact = { ...insertContact, id };
    this.emergencyContacts.set(id, contact);
    return contact;
  }

  async deleteEmergencyContact(id: string): Promise<boolean> {
    return this.emergencyContacts.delete(id);
  }

  async getVolunteers(): Promise<Volunteer[]> {
    return Array.from(this.volunteers.values());
  }

  async getVolunteer(id: string): Promise<Volunteer | undefined> {
    return this.volunteers.get(id);
  }

  async createVolunteer(insertVolunteer: InsertVolunteer): Promise<Volunteer> {
    const id = randomUUID();
    const volunteer: Volunteer = { ...insertVolunteer, id };
    this.volunteers.set(id, volunteer);
    return volunteer;
  }

  async getTripPlans(userId?: string): Promise<TripPlan[]> {
    const plans = Array.from(this.tripPlans.values());
    if (userId) {
      return plans.filter(p => p.userId === userId);
    }
    return plans;
  }

  async getTripPlan(id: string): Promise<TripPlan | undefined> {
    return this.tripPlans.get(id);
  }

  async createTripPlan(insertPlan: InsertTripPlan): Promise<TripPlan> {
    const id = randomUUID();
    const plan: TripPlan = { ...insertPlan, id };
    this.tripPlans.set(id, plan);
    return plan;
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values());
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = { ...insertPost, id };
    this.blogPosts.set(id, post);
    return post;
  }
}

export const storage = new MemStorage();
