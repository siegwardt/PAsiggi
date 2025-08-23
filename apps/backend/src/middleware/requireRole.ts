import type { Request, Response, NextFunction } from "express";

export function requireRole(...allowed: Array<"owner" | "admin" | "user">) {
  const allowedSet = new Set(allowed.map((r) => r.toLowerCase()));

  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req.user?.role as string | undefined)?.toLowerCase();

    if (!role) {
      return res.status(401).json({ error: "Nicht authentifiziert (keine Rolle im Request)" });
    }
    if (role === "owner") return next();
    if (allowedSet.has(role as any)) return next();

    if (process.env.NODE_ENV !== "production") {
      console.warn(`[ROLE] Zugriff verweigert: role=${role}, erlaubt=${[...allowedSet].join(", ")}`);
    }
    return res.status(403).json({ error: "Zugriff verweigert", need: [...allowedSet], have: role });
  };
}
