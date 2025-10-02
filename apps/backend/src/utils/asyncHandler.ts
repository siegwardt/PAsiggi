import type { Request, Response, NextFunction, RequestHandler } from "express";

type AnyHandler = (req: Request, res: Response, next: NextFunction) => any;

export const asyncHandler =
  (fn: AnyHandler): RequestHandler =>
  (req, res, next) => {
    try {
      const out = fn(req, res, next);
      if (out && typeof (out as any).catch === "function") {
        (out as Promise<unknown>).catch(next);
      }
    } catch (err) {
      next(err as any);
    }
  };
