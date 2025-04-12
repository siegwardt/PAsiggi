import { Request } from 'express';
import { UserRole } from '@prisma/client';

export interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
}

export interface AuthRequest extends Request {
  user?: JwtPayload;
}
