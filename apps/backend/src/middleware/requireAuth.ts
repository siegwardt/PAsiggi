import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { AppJwtPayload } from "../types/common";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Kein Token bereitgestellt" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AppJwtPayload;

    const role = (decoded.role as string).toLowerCase() as AppJwtPayload["role"];

    req.user = { id: decoded.id, email: decoded.email, role };

    if (process.env.NODE_ENV !== "production") {
      console.log(`[AUTH] user=${decoded.email} role=${role}`);
    }

    next();
  } catch (err: any) {
    return res.status(403).json({ error: "Ungültiges Token", detail: err?.message });
  }
}
