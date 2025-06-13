import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AuthenticatedRequest } from '../middlewares/auth';

const catchAsync = (
  fn: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    fn(req as AuthenticatedRequest, res, next).catch(next);
  };
};

export default catchAsync;
