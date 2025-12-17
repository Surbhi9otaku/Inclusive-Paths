import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";
import { tripPlannerFormSchema, insertEmergencyContactSchema } from "@shared/schema";
import { z } from "zod";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Destinations
  app.get("/api/destinations", async (req, res) => {
    try {
      const destinations = await storage.getDestinations();
      res.json(destinations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch destinations" });
    }
  });

  app.get("/api/destinations/:id", async (req, res) => {
    try {
      const destination = await storage.getDestination(req.params.id);
      if (!destination) {
        return res.status(404).json({ error: "Destination not found" });
      }
      res.json(destination);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch destination" });
    }
  });

  // Emergency Contacts
  app.get("/api/emergency-contacts", async (req, res) => {
    try {
      const contacts = await storage.getEmergencyContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch emergency contacts" });
    }
  });

  app.post("/api/emergency-contacts", async (req, res) => {
    try {
      const validatedData = insertEmergencyContactSchema.parse(req.body);
      const contact = await storage.createEmergencyContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create emergency contact" });
    }
  });

  app.delete("/api/emergency-contacts/:id", async (req, res) => {
    try {
      const success = await storage.deleteEmergencyContact(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Contact not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete emergency contact" });
    }
  });

  // Volunteers
  app.get("/api/volunteers", async (req, res) => {
    try {
      const volunteers = await storage.getVolunteers();
      res.json(volunteers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch volunteers" });
    }
  });

  app.get("/api/volunteers/:id", async (req, res) => {
    try {
      const volunteer = await storage.getVolunteer(req.params.id);
      if (!volunteer) {
        return res.status(404).json({ error: "Volunteer not found" });
      }
      res.json(volunteer);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch volunteer" });
    }
  });

  // Blog Posts
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Trip Plans
  app.get("/api/trip-plans", async (req, res) => {
    try {
      const plans = await storage.getTripPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trip plans" });
    }
  });

  app.post("/api/trip-plans/generate", async (req, res) => {
    try {
      const validatedData = tripPlannerFormSchema.parse(req.body);
      
      const accessibilityNeeds = Object.entries(validatedData.accessibilityNeeds)
        .filter(([_, value]) => value)
        .map(([key]) => key.replace(/([A-Z])/g, ' $1').toLowerCase())
        .join(", ");

      const prompt = `You are an expert accessible travel planner. Create a detailed 3-day travel itinerary for a person with ${validatedData.disabilityType} disability traveling to ${validatedData.destination}.

Their accessibility needs include: ${accessibilityNeeds || "general accessibility accommodations"}.
${validatedData.additionalNotes ? `Additional notes: ${validatedData.additionalNotes}` : ""}

Create a JSON response with this exact structure:
{
  "title": "Accessible Trip to [Destination]",
  "summary": "A brief 2-3 sentence summary of the trip highlighting accessibility features",
  "itinerary": [
    {
      "day": 1,
      "title": "Day title (e.g., 'Arrival and City Center')",
      "activities": [
        {
          "time": "9:00 AM",
          "activity": "Activity name",
          "location": "Specific location",
          "accessibilityNotes": "Specific accessibility features available",
          "icon": "building" // Use: building, utensils, camera, mapPin, route
        }
      ]
    }
  ],
  "tips": [
    "Practical accessibility tip 1",
    "Practical accessibility tip 2",
    "Practical accessibility tip 3",
    "Practical accessibility tip 4",
    "Practical accessibility tip 5"
  ]
}

Include 4-5 activities per day. Focus on accessible venues, transportation, and accommodations. Be specific about accessibility features like ramps, elevators, audio guides, sign language availability, etc.`;

      const response = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are an expert accessible travel planner. Always respond with valid JSON only, no markdown or extra text."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 4096,
      });

      const generatedPlan = JSON.parse(response.choices[0].message.content || "{}");

      const savedPlan = await storage.createTripPlan({
        userId: null,
        title: generatedPlan.title,
        destination: validatedData.destination,
        disabilityType: validatedData.disabilityType,
        accessibilityNeeds: validatedData.accessibilityNeeds,
        itinerary: generatedPlan,
        startDate: validatedData.travelDates?.startDate || null,
        endDate: validatedData.travelDates?.endDate || null,
      });

      res.json(generatedPlan);
    } catch (error) {
      console.error("Error generating trip plan:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to generate trip plan" });
    }
  });

  return httpServer;
}
