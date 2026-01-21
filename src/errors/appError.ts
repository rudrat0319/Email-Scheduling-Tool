export class appError extends Error{
    constructor(
        public statuscode: number,
        public code: string,
        message: string,
        public details?: any
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}