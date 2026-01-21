import { appError } from "./appError";

export class validationError extends appError{
    constructor(message: string, details?: any){
        super(400, 'VALIDATION_ERROR', message, details);
    }
}