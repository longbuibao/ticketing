import { Response, Request, NextFunction } from 'express';

import { DatabaseConnectionError, RequestValidationError } from '../errors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof RequestValidationError) return res.status(err.statusCode).send({ errors: err.seriazlizeErrors() });
  if (err instanceof DatabaseConnectionError) return res.status(err.statusCode).send({ errors: err.seriazlizeErrors() });
};
