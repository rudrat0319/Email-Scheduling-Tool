import { appError } from "./appError";

export class InternalServerError extends appError {
  constructor(message = 'Internal server error') {
    super(500, 'INTERNAL_ERROR', message);
  }
}