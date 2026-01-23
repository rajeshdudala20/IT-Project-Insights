import { type User, type InsertUser, type Project, type ProjectsResponse } from "@shared/schema";
import { randomUUID } from "crypto";
import * as path from "path";
import * as fs from "fs";

// xlsx supports both CJS and ESM - use dynamic import
let xlsxModule: any;
async function loadXLSX() {
  if (!xlsxModule) {
    const imported = await import("xlsx");
    // Handle both ESM and CJS module structures
    xlsxModule = imported.default || imported;
  }
  return xlsxModule;
}

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

    // Load xlsx library
    const xlsx = await loadXLSX();
    
    // In production, the file is copied to dist/attached_assets
    // In development, it's at attached_assets
    const fileName = "KLG_Portfolio_Overview-Summary_2020-Present_1769180079644.xlsx";
    let filePath = path.join(process.cwd(), "attached_assets", fileName);
    
    // Check if running from dist folder (production)
    if (process.env.NODE_ENV === "production") {
      const distPath = path.join(process.cwd(), "dist", "attached_assets", fileName);
      if (fs.existsSync(distPath)) {
        filePath = distPath;
      }
    }
    
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    
    // Use header: 1 to get raw arrays, skip title row and header row
    const rawArrayData = xlsx.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
    
    // Find the header row (the one that contains "Year", "Project", etc.)
    let headerRowIndex = -1;
    let headers: string[] = [];
    for (let i = 0; i < Math.min(5, rawArrayData.length); i++) {
      const row = rawArrayData[i];
      if (row && row.some((cell: any) => String(cell).trim() === "Year")) {
        headerRowIndex = i;
        headers = row.map((cell: any) => String(cell || "").trim());
        break;
      }
    }
    
    // Parse and clean the data
    const projects: Project[] = [];
    let id = 1;
    
    // Get column indices
    const yearIdx = headers.findIndex(h => h === "Year");
    const projectIdx = headers.findIndex(h => h === "Project");
    const businessUnitIdx = headers.findIndex(h => h === "Business Unit");
    const categoryIdx = headers.findIndex(h => h === "Category");
    const sizeIdx = headers.findIndex(h => h === "Size");

    // Process data rows (skip header)
    for (let i = headerRowIndex + 1; i < rawArrayData.length; i++) {
      const row = rawArrayData[i];
      if (!row || row.length === 0) continue;
      
      const year = yearIdx >= 0 ? row[yearIdx] : undefined;
      const project = projectIdx >= 0 ? row[projectIdx] : undefined;
      const businessUnit = businessUnitIdx >= 0 ? row[businessUnitIdx] : undefined;
      const category = categoryIdx >= 0 ? row[categoryIdx] : undefined;
      const size = sizeIdx >= 0 ? row[sizeIdx] : undefined;

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

    const years = Array.from(new Set(projects.map((p) => p.year))).sort((a, b) => a - b);
    const businessUnits = Array.from(new Set(projects.map((p) => p.businessUnit))).sort();
    const categories = Array.from(new Set(projects.map((p) => p.category))).sort();
    const sizes = Array.from(new Set(projects.map((p) => p.size)));

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
