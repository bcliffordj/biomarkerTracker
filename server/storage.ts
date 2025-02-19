import { BiomarkerEntry, type InsertBiomarkerEntry } from "@shared/schema";

export interface IStorage {
  getBiomarkerEntries(): Promise<BiomarkerEntry[]>;
  getBiomarkerEntry(id: number): Promise<BiomarkerEntry | undefined>;
  createBiomarkerEntry(entry: InsertBiomarkerEntry): Promise<BiomarkerEntry>;
  deleteBiomarkerEntry(id: number): Promise<void>;
  getEntryByDate(date: Date): Promise<BiomarkerEntry | undefined>;
}

export class MemStorage implements IStorage {
  private entries: Map<number, BiomarkerEntry>;
  private currentId: number;

  constructor() {
    this.entries = new Map();
    this.currentId = 1;
  }

  async getBiomarkerEntries(): Promise<BiomarkerEntry[]> {
    return Array.from(this.entries.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async getBiomarkerEntry(id: number): Promise<BiomarkerEntry | undefined> {
    return this.entries.get(id);
  }

  async getEntryByDate(date: Date): Promise<BiomarkerEntry | undefined> {
    // Convert to local date string for comparison
    const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      .toISOString()
      .split('T')[0];

    return Array.from(this.entries.values()).find(entry => {
      const entryDate = new Date(entry.date);
      const entryLocalDate = new Date(
        entryDate.getFullYear(),
        entryDate.getMonth(),
        entryDate.getDate()
      )
        .toISOString()
        .split('T')[0];
      return entryLocalDate === localDate;
    });
  }

  async createBiomarkerEntry(entry: InsertBiomarkerEntry): Promise<BiomarkerEntry> {
    const id = this.currentId++;

    // Create a local date without time component
    const localDate = new Date(
      entry.date.getFullYear(),
      entry.date.getMonth(),
      entry.date.getDate()
    );

    const biomarkerEntry: BiomarkerEntry = {
      ...entry,
      id,
      date: localDate.toISOString().split('T')[0]
    };

    this.entries.set(id, biomarkerEntry);
    return biomarkerEntry;
  }

  async deleteBiomarkerEntry(id: number): Promise<void> {
    this.entries.delete(id);
  }
}

export const storage = new MemStorage();