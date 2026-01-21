import { appError } from "./appError";

export class conflictError extends appError{
    constructor(message: string){
        super(409, 'CONFLICT', message);
    }
}