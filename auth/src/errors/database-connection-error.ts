export class DatabaseConnectionError extends Error {
  reason = 'Something wrong in the server';
  constructor() {
    super();
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
