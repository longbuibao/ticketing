export class DatabaseConnectionError extends Error {
  reason = 'Something wrong in the server';
  statusCode = 500;
  constructor() {
    super();
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  seriazlizeErrors() {
    return [{ message: this.reason }];
  }
}
