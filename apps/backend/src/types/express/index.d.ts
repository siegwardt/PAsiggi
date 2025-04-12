import { UserRole } from '@prisma/client';

declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      email: string;
      role: UserRole;
    };
  }
}
