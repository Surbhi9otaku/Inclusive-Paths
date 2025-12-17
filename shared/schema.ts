import { pgTable, text, varchar, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

// User profiles with disability preferences
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name"),
  disabilityType: text("disability_type"), // visual, hearing, mobility, cognitive
  accessibilityPreferences: jsonb("accessibility_preferences"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  disabilityType: true,
  accessibilityPreferences: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Destinations with accessibility scores
export const destinations = pgTable("destinations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  latitude: text("latitude"),
  longitude: text("longitude"),
  imageUrl: text("image_url"),
  accessibilityScore: integer("accessibility_score").notNull(), // 1-5
  wheelchairAccess: boolean("wheelchair_access").default(false),
  tactilePaths: boolean("tactile_paths").default(false),
  audioGuides: boolean("audio_guides").default(false),
  signLanguageSupport: boolean("sign_language_support").default(false),
  category: text("category"), // museum, park, restaurant, hotel, attraction
});

export const insertDestinationSchema = createInsertSchema(destinations).omit({ id: true });
export type InsertDestination = z.infer<typeof insertDestinationSchema>;
export type Destination = typeof destinations.$inferSelect;

// Emergency contacts
export const emergencyContacts = pgTable("emergency_contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  relationship: text("relationship"), // hospital, ngo, guardian, caretaker
  isDefault: boolean("is_default").default(false),
});

export const insertEmergencyContactSchema = createInsertSchema(emergencyContacts).omit({ id: true });
export type InsertEmergencyContact = z.infer<typeof insertEmergencyContactSchema>;
export type EmergencyContact = typeof emergencyContacts.$inferSelect;

// Volunteers/Caretakers
export const volunteers = pgTable("volunteers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  photo: text("photo"),
  languages: text("languages").array(),
  specializations: text("specializations").array(), // visual, hearing, mobility
  location: text("location"),
  availability: text("availability"), // available, busy, offline
  rating: integer("rating").default(5),
  bio: text("bio"),
});

export const insertVolunteerSchema = createInsertSchema(volunteers).omit({ id: true });
export type InsertVolunteer = z.infer<typeof insertVolunteerSchema>;
export type Volunteer = typeof volunteers.$inferSelect;

// Trip plans
export const tripPlans = pgTable("trip_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  title: text("title").notNull(),
  destination: text("destination").notNull(),
  disabilityType: text("disability_type"),
  accessibilityNeeds: jsonb("accessibility_needs"),
  itinerary: jsonb("itinerary"), // AI-generated itinerary
  startDate: text("start_date"),
  endDate: text("end_date"),
});

export const insertTripPlanSchema = createInsertSchema(tripPlans).omit({ id: true });
export type InsertTripPlan = z.infer<typeof insertTripPlanSchema>;
export type TripPlan = typeof tripPlans.$inferSelect;

// Blog posts
export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  author: text("author"),
  category: text("category"), // travel-stories, tips, guides, accessibility
  disabilityTags: text("disability_tags").array(), // visual, hearing, mobility
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({ id: true });
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

// Trip planner form types
export const tripPlannerFormSchema = z.object({
  destination: z.string().min(1, "Please enter a destination"),
  disabilityType: z.enum(["visual", "hearing", "mobility", "cognitive", "multiple"]),
  accessibilityNeeds: z.object({
    wheelchairAccess: z.boolean().default(false),
    tactilePaths: z.boolean().default(false),
    audioGuides: z.boolean().default(false),
    signLanguageSupport: z.boolean().default(false),
    quietSpaces: z.boolean().default(false),
    assistanceRequired: z.boolean().default(false),
  }),
  travelDates: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  }).optional(),
  additionalNotes: z.string().optional(),
});

export type TripPlannerForm = z.infer<typeof tripPlannerFormSchema>;

// AI Chat message type
export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
