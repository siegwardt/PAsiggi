import type { Request, Response, NextFunction } from "express";

export function requireRole(role: "admin" | "user") {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Nicht eingeloggt" });
    }

    if (req.user.role !== role) {
      return res.status(403).json({ error: "Keine Berechtigung" });
    }

    next();
  };
}
