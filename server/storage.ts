import { type User, type InsertUser, type Project, type ProjectsResponse } from "@shared/schema";
import { randomUUID } from "crypto";
import * as path from "path";
import { createRequire } from "module";

// Use require for xlsx as ESM import has issues with this library
const require = createRequire(import.meta.url);
const XLSX = require("xlsx");

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getProjects(): Promise<ProjectsResponse>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projectsCache: ProjectsResponse | null = null;

  constructor() {
    this.users = new Map();
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

  async getProjects(): Promise<ProjectsResponse> {
    if (this.projectsCache) {
      return this.projectsCache;
    }

    const filePath = path.join(process.cwd(), "attached_assets", "KLG_Projects_1769167456131.xlsx");
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rawData = XLSX.utils.sheet_to_json(sheet) as any[];

    // Parse and clean the data - use flexible key matching
    const projects: Project[] = [];
    let id = 1;

    for (const row of rawData) {
      const keys = Object.keys(row);
      
      // Find keys that match our expected column names (with or without trailing spaces)
      const yearKey = keys.find(k => k.trim() === "Year");
      const projectKey = keys.find(k => k.trim() === "Project");
      const businessUnitKey = keys.find(k => k.trim() === "Business Unit");
      const categoryKey = keys.find(k => k.trim() === "Category");
      const sizeKey = keys.find(k => k.trim() === "Size");

      const year = yearKey ? row[yearKey] : undefined;
      const project = projectKey ? row[projectKey] : undefined;
      const businessUnit = businessUnitKey ? row[businessUnitKey] : undefined;
      const category = categoryKey ? row[categoryKey] : undefined;
      const size = sizeKey ? row[sizeKey] : undefined;

      if (year && typeof year === "number" && project) {
        const cleanProject = String(project).trim();
        const cleanBusinessUnit = String(businessUnit || "").trim();
        const cleanCategory = String(category || "").trim();
        const cleanSize = String(size || "").trim();

        if (cleanProject && cleanBusinessUnit && cleanCategory && cleanSize) {
          projects.push({
            id: id++,
            year,
            project: cleanProject,
            businessUnit: cleanBusinessUnit,
            category: cleanCategory,
            size: cleanSize,
          });
        }
      }
    }

    // Calculate summary statistics
    const projectsByYear: Record<string, number> = {};
    const projectsByBusinessUnit: Record<string, number> = {};
    const projectsByCategory: Record<string, number> = {};
    const projectsBySize: Record<string, number> = {};

    for (const project of projects) {
      const yearKey = String(project.year);
      projectsByYear[yearKey] = (projectsByYear[yearKey] || 0) + 1;
      projectsByBusinessUnit[project.businessUnit] = (projectsByBusinessUnit[project.businessUnit] || 0) + 1;
      projectsByCategory[project.category] = (projectsByCategory[project.category] || 0) + 1;
      projectsBySize[project.size] = (projectsBySize[project.size] || 0) + 1;
    }

    const years = [...new Set(projects.map((p) => p.year))].sort((a, b) => a - b);
    const businessUnits = [...new Set(projects.map((p) => p.businessUnit))].sort();
    const categories = [...new Set(projects.map((p) => p.category))].sort();
    const sizes = [...new Set(projects.map((p) => p.size))];

    this.projectsCache = {
      projects,
      summary: {
        totalProjects: projects.length,
        projectsByYear,
        projectsByBusinessUnit,
        projectsByCategory,
        projectsBySize,
        years,
        businessUnits,
        categories,
        sizes,
      },
    };

    return this.projectsCache;
  }
}

export const storage = new MemStorage();
