import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import { ApiError } from '../utils/ApiError';
import httpStatus from 'http-status';

const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body); // ou adapte para params, query etc se precisar
    next();
  } catch (err) {
    if (err instanceof Error) {
      return next(new ApiError(httpStatus.BAD_REQUEST, err.message));
    }
    next(err);
  }
};

export default validate;
