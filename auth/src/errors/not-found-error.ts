import { CustomError } from './cutom-error';

export class NotFoundError extends CustomError {
  constructor() {
    super('Not found');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  statusCode = 404;
  serializeErrors() {
    return [{ message: 'Not found this route' }];
  }
}
