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
    const dateString = date.toISOString().split('T')[0];
    return Array.from(this.entries.values()).find(
      entry => new Date(entry.date).toISOString().split('T')[0] === dateString
    );
  }

  async createBiomarkerEntry(entry: InsertBiomarkerEntry): Promise<BiomarkerEntry> {
    const id = this.currentId++;
    const biomarkerEntry: BiomarkerEntry = { 
      ...entry,
      id,
      date: entry.date.toISOString().split('T')[0]
    };
    this.entries.set(id, biomarkerEntry);
    return biomarkerEntry;
  }

  async deleteBiomarkerEntry(id: number): Promise<void> {
    this.entries.delete(id);
  }
}

export const storage = new MemStorage();