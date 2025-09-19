import type { AppJwtPayload } from "./common";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: AppJwtPayload["role"];
      };
    }
  }
}
