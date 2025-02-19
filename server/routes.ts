import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBiomarkerEntrySchema } from "@shared/schema";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/biomarkers", async (_req, res) => {
    const entries = await storage.getBiomarkerEntries();
    console.log("Sending biomarker entries:", entries);
    res.json(entries);
  });

  app.post("/api/biomarkers", async (req, res) => {
    try {
      console.log("Received date:", req.body.date);
      const data = insertBiomarkerEntrySchema.parse(req.body);
      console.log("Parsed date:", data.date);

      // Check if entry already exists for this date
      const existingEntry = await storage.getEntryByDate(data.date);
      if (existingEntry) {
        return res.status(400).json({
          message: "An entry already exists for this date",
        });
      }

      const entry = await storage.createBiomarkerEntry(data);
      console.log("Created entry:", entry);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        console.error("Error creating biomarker entry:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.delete("/api/biomarkers/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    const entry = await storage.getBiomarkerEntry(id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    await storage.deleteBiomarkerEntry(id);
    res.status(204).send();
  });

  const httpServer = createServer(app);
  return httpServer;
}
