import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@prisma/client';

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; 

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: 'Zugriff verweigert' });
    }

    next();
  };
};
