import { pgTable, text, serial, integer, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const biomarkerEntries = pgTable("biomarker_entries", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  sleep: integer("sleep").notNull(),
  sexDrive: integer("sex_drive").notNull(),
  bloating: integer("bloating").notNull(),
  gas: integer("gas").notNull(),
  dailyPoop: integer("daily_poop").notNull(),
  overallDigestion: integer("overall_digestion").notNull(),
  strength: integer("strength").notNull(),
  stamina: integer("stamina").notNull(),
  articulation: integer("articulation").notNull(),
  mood: integer("mood").notNull(),
  energy: integer("energy").notNull(),
  mindSharpness: integer("mind_sharpness").notNull(),
  creativity: integer("creativity").notNull(),
  inspiration: integer("inspiration").notNull(),
});

export const insertBiomarkerEntrySchema = createInsertSchema(biomarkerEntries).omit({
  id: true,
}).extend({
  date: z.coerce.date().refine((date) => {
    // Create today at midnight in local timezone
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create input date at midnight in local timezone
    const inputDate = new Date(date);
    inputDate.setHours(0, 0, 0, 0);

    return inputDate <= today;
  }, "Cannot select future dates"),
});

export type InsertBiomarkerEntry = z.infer<typeof insertBiomarkerEntrySchema>;
export type BiomarkerEntry = typeof biomarkerEntries.$inferSelect;

export const biomarkerNames = [
  "sleep",
  "sexDrive",
  "bloating",
  "gas",
  "dailyPoop",
  "overallDigestion", 
  "strength",
  "stamina",
  "articulation",
  "mood",
  "energy",
  "mindSharpness",
  "creativity",
  "inspiration",
] as const;

export type BiomarkerName = typeof biomarkerNames[number];

export const biomarkerLabels: Record<BiomarkerName, string> = {
  sleep: "Sleep",
  sexDrive: "Sex Drive",
  bloating: "Bloating",
  gas: "Gas",
  dailyPoop: "Daily Poop",
  overallDigestion: "Overall Digestion",
  strength: "Strength", 
  stamina: "Stamina",
  articulation: "Articulation",
  mood: "Mood",
  energy: "Energy",
  mindSharpness: "Mind Sharpness",
  creativity: "Creativity",
  inspiration: "Inspiration"
};