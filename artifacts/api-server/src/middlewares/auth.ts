import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = getAuth(req) as {
    userId?: string | null;
    sessionClaims?: { userId?: string };
  };
  const userId = auth.userId ?? auth.sessionClaims?.userId;

  if (!userId) {
    res.status(401).json({ error: "Please sign in to talk with Mia." });
    return;
  }

  req.userId = userId;
  next();
}