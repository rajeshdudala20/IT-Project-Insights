import { z } from "zod";

export const projectSchema = z.object({
  id: z.number(),
  year: z.number(),
  project: z.string(),
  businessUnit: z.string(),
  category: z.string(),
  size: z.string(),
});

export type Project = z.infer<typeof projectSchema>;

export const projectsResponseSchema = z.object({
  projects: z.array(projectSchema),
  summary: z.object({
    totalProjects: z.number(),
    projectsByYear: z.record(z.string(), z.number()),
    projectsByBusinessUnit: z.record(z.string(), z.number()),
    projectsByCategory: z.record(z.string(), z.number()),
    projectsBySize: z.record(z.string(), z.number()),
    years: z.array(z.number()),
    businessUnits: z.array(z.string()),
    categories: z.array(z.string()),
    sizes: z.array(z.string()),
  }),
});

export type ProjectsResponse = z.infer<typeof projectsResponseSchema>;

// Re-export user types for compatibility
import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
