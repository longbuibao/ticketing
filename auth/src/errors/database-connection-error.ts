import { CustomError } from './cutom-error';

export class DatabaseConnectionError extends CustomError {
  reason = 'Something wrong in the server';
  statusCode = 500;
  constructor() {
    super('Error connecting to database');
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  serializeErrors() {
    return [{ message: this.reason }];
  }
}
