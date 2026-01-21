import { appError } from "./appError";

export class notFoundError extends appError{
    constructor(message: string){
        super(404, 'NOT_FOUND', message);
    }
}