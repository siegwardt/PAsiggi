import type { Request } from "express";
import type { UserRole } from "@prisma/client";

export interface AppJwtPayload {
  id: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export type AuthRequest = Request;
