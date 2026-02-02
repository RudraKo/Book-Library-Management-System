import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/CustomErrors';

/**
 * Global Error Handler Middleware
 * Catches all errors and sends appropriate responses
 */
export class ErrorHandler {
    /**
     * Handle all errors
     */
    static handle(err: Error, req: Request, res: Response, next: NextFunction): void {
        // Log error for debugging
        console.error('Error:', err);

        // Handle custom errors
        if (err instanceof CustomError) {
            res.status(err.statusCode).json({
                success: false,
                error: {
                    name: err.name,
                    message: err.message,
                    statusCode: err.statusCode
                }
            });
            return;
        }

        // Handle validation errors (e.g., from express-validator)
        if (err.name === 'ValidationError') {
            res.status(400).json({
                success: false,
                error: {
                    name: 'ValidationError',
                    message: err.message,
                    statusCode: 400
                }
            });
            return;
        }

        // Handle default errors
        res.status(500).json({
            success: false,
            error: {
                name: 'InternalServerError',
                message: process.env.NODE_ENV === 'production' 
                    ? 'Something went wrong' 
                    : err.message,
                statusCode: 500
            }
        });
    }

    /**
     * Handle 404 - Not Found
     */
    static notFound(req: Request, res: Response): void {
        res.status(404).json({
            success: false,
            error: {
                name: 'NotFoundError',
                message: `Route ${req.originalUrl} not found`,
                statusCode: 404
            }
        });
    }
}
