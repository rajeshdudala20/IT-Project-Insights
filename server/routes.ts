import type { Express, Request, Response, NextFunction } from "express";
import { type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import crypto from "crypto";

const MASTER_PASSWORD = process.env.MASTER_PASSWORD || "Bright-Winter-Portfolio-2026!";

const magicLinkTokens = new Map<string, { email: string; expires: number }>();

declare module "express-session" {
  interface SessionData {
    authenticated: boolean;
    email?: string;
  }
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session.authenticated) {
    return next();
  }
  return res.status(401).json({ error: "Authentication required" });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const sessionSecret = process.env.SESSION_SECRET;
  if (!sessionSecret && process.env.NODE_ENV === "production") {
    console.error("SESSION_SECRET environment variable is required in production");
    process.exit(1);
  }

  // Trust proxy for production (Replit runs behind a reverse proxy)
  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  app.use(
    session({
      secret: sessionSecret || "dev-only-secret-not-for-production",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days for better persistence
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      },
    })
  );

  app.get("/api/auth/check", (req: Request, res: Response) => {
    res.json({ authenticated: req.session.authenticated === true });
  });

  app.post("/api/auth/login", (req: Request, res: Response) => {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    if (password === MASTER_PASSWORD) {
      req.session.authenticated = true;
      return res.json({ success: true, message: "Login successful" });
    }

    return res.status(401).json({ error: "Invalid password" });
  });

  app.post("/api/auth/magic-link", (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email || typeof email !== "string") {
      return res.status(400).json({ error: "Valid email is required" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = Date.now() + 15 * 60 * 1000;

    magicLinkTokens.set(token, { email, expires });

    const magicLink = `${req.protocol}://${req.get("host")}/api/auth/verify?token=${token}`;
    
    console.log(`Magic link for ${email}: ${magicLink}`);

    return res.json({ 
      success: true, 
      message: "Magic link sent to email",
      note: "Email delivery requires configuration. Check server logs for the magic link."
    });
  });

  app.get("/api/auth/verify", (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(400).send("Invalid token");
    }

    const tokenData = magicLinkTokens.get(token);

    if (!tokenData) {
      return res.status(401).send("Token not found or expired");
    }

    if (Date.now() > tokenData.expires) {
      magicLinkTokens.delete(token);
      return res.status(401).send("Token expired");
    }

    magicLinkTokens.delete(token);
    req.session.authenticated = true;
    req.session.email = tokenData.email;

    return res.redirect("/dashboard");
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      return res.json({ success: true });
    });
  });

  app.get("/api/projects", requireAuth, async (req: Request, res: Response) => {
    try {
      const data = await storage.getProjects();
      res.json(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  return httpServer;
}
