import { ValidationError } from 'express-validator';

export class RequestValidationError extends Error {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super();
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  seriazlizeErrors() {
    return this.errors.map((error) => {
      return {
        message: error.msg,
        field: error.param,
      };
    });
  }
}
