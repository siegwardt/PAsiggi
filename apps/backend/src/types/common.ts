import type { Request } from "express";
import type { UserRole } from "@prisma/client";

/**
 * Payload, das wir in unseren JWTs tragen.
 * (Nicht mit jwt.JsonWebTokenPayload verwechseln)
 */
export interface AppJwtPayload {
  id: number;
  email: string;
  role: UserRole; // 'owner' | 'admin' | 'user'
  iat?: number;
  exp?: number;
}

/**
 * Express-Request um `user` erweitern.
 * -> Nur HIER definieren (global augmentation).
 */
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Request {
      user?: {
        id: number;
        email: string;
        role: UserRole;
      };
    }
  }
}

/** Hilfstyp, falls du ihn irgendwo direkt brauchst */
export type AuthRequest = Request;

export {};
