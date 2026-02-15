import type { Request, Response, NextFunction, RequestHandler } from "express";

export const asynHandler =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => {
      res.status(500).json(`The error message is ${err}`);
    });
  };
