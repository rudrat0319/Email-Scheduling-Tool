import { appError } from "./appError";

export class unauthorisedError extends appError{
    constructor(message = 'Unauthorised'){
        super(401, 'UNAUTHORISED', message);
    }
}