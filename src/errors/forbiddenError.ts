import { appError } from "./appError";

export class forbiddenError extends appError{
    constructor(message = 'FORBIDDEN'){
        super(403, 'FORBIDDEN', message);
    }
}