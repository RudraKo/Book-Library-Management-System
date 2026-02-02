/**
 * Custom Error Classes for better error handling
 */

export class CustomError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ValidationError extends CustomError {
    constructor(message: string) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string) {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}

export class ConflictError extends CustomError {
    constructor(message: string) {
        super(message, 409);
        this.name = 'ConflictError';
    }
}

export class UnauthorizedError extends CustomError {
    constructor(message: string) {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends CustomError {
    constructor(message: string) {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}

export class InternalServerError extends CustomError {
    constructor(message: string = 'Internal server error') {
        super(message, 500);
        this.name = 'InternalServerError';
    }
}
