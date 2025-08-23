import { ZodError, ZodTypeAny, infer as zInfer } from "zod";
import { RequestHandler } from "express";

export const validate =
  <T extends ZodTypeAny>(schema: T): RequestHandler =>
  (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as zInfer<T>;

      if ((parsed as any).body) req.body = (parsed as any).body;
      if ((parsed as any).query) req.query = (parsed as any).query;
      if ((parsed as any).params) req.params = (parsed as any).params;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: "ValidationError",
          details: err.flatten(),
        });
      }
      next(err);
    }
  };
