import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/CustomErrors';

/**
 * Request Validation Middleware
 * Provides common validation functions
 */
export class ValidationMiddleware {
    /**
     * Validate book creation data
     */
    static validateCreateBook(req: Request, res: Response, next: NextFunction): void {
        const { title, author, isbn, publishedYear, genre, price, stockQuantity } = req.body;

        const errors: string[] = [];

        if (!title || typeof title !== 'string' || !title.trim()) {
            errors.push('Title is required and must be a non-empty string');
        }

        if (!author || typeof author !== 'string' || !author.trim()) {
            errors.push('Author is required and must be a non-empty string');
        }

        if (!isbn || typeof isbn !== 'string' || !isbn.trim()) {
            errors.push('ISBN is required and must be a non-empty string');
        }

        if (publishedYear !== undefined) {
            if (typeof publishedYear !== 'number' || publishedYear < 1000 || publishedYear > new Date().getFullYear() + 1) {
                errors.push('Published year must be a valid year');
            }
        }

        if (price !== undefined) {
            if (typeof price !== 'number' || price < 0) {
                errors.push('Price must be a non-negative number');
            }
        }

        if (stockQuantity !== undefined) {
            if (typeof stockQuantity !== 'number' || stockQuantity < 0 || !Number.isInteger(stockQuantity)) {
                errors.push('Stock quantity must be a non-negative integer');
            }
        }

        if (errors.length > 0) {
            throw new ValidationError(errors.join('; '));
        }

        next();
    }

    /**
     * Validate book update data
     */
    static validateUpdateBook(req: Request, res: Response, next: NextFunction): void {
        const { title, author, publishedYear, price, stockQuantity, rating, pages } = req.body;

        const errors: string[] = [];

        if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
            errors.push('Title must be a non-empty string');
        }

        if (author !== undefined && (typeof author !== 'string' || !author.trim())) {
            errors.push('Author must be a non-empty string');
        }

        if (publishedYear !== undefined) {
            if (typeof publishedYear !== 'number' || publishedYear < 1000 || publishedYear > new Date().getFullYear() + 1) {
                errors.push('Published year must be a valid year');
            }
        }

        if (price !== undefined && (typeof price !== 'number' || price < 0)) {
            errors.push('Price must be a non-negative number');
        }

        if (stockQuantity !== undefined && (typeof stockQuantity !== 'number' || stockQuantity < 0 || !Number.isInteger(stockQuantity))) {
            errors.push('Stock quantity must be a non-negative integer');
        }

        if (rating !== undefined && (typeof rating !== 'number' || rating < 0 || rating > 5)) {
            errors.push('Rating must be between 0 and 5');
        }

        if (pages !== undefined && (typeof pages !== 'number' || pages < 1 || !Number.isInteger(pages))) {
            errors.push('Pages must be a positive integer');
        }

        if (errors.length > 0) {
            throw new ValidationError(errors.join('; '));
        }

        next();
    }

    /**
     * Validate query parameters
     */
    static validateQueryParams(req: Request, res: Response, next: NextFunction): void {
        const { page, limit, sortBy, sortOrder } = req.query;

        const errors: string[] = [];

        if (page !== undefined) {
            const pageNum = Number(page);
            if (isNaN(pageNum) || pageNum < 1 || !Number.isInteger(pageNum)) {
                errors.push('Page must be a positive integer');
            }
        }

        if (limit !== undefined) {
            const limitNum = Number(limit);
            if (isNaN(limitNum) || limitNum < 1 || limitNum > 100 || !Number.isInteger(limitNum)) {
                errors.push('Limit must be an integer between 1 and 100');
            }
        }

        if (sortOrder !== undefined && sortOrder !== 'asc' && sortOrder !== 'desc') {
            errors.push('Sort order must be either "asc" or "desc"');
        }

        if (errors.length > 0) {
            throw new ValidationError(errors.join('; '));
        }

        next();
    }

    /**
     * Validate registration data
     */
    static validateRegister(req: Request, res: Response, next: NextFunction): void {
        const { username, email, password } = req.body;

        const errors: string[] = [];

        if (!username || typeof username !== 'string' || username.trim().length < 3) {
            errors.push('Username is required and must be at least 3 characters');
        }

        if (!email || typeof email !== 'string' || !ValidationMiddleware.isValidEmail(email)) {
            errors.push('Valid email is required');
        }

        if (!password || typeof password !== 'string' || password.length < 6) {
            errors.push('Password is required and must be at least 6 characters');
        }

        if (errors.length > 0) {
            throw new ValidationError(errors.join('; '));
        }

        next();
    }

    /**
     * Validate login data
     */
    static validateLogin(req: Request, res: Response, next: NextFunction): void {
        const { email, password } = req.body;

        const errors: string[] = [];

        if (!email || typeof email !== 'string' || !email.trim()) {
            errors.push('Email is required');
        }

        if (!password || typeof password !== 'string' || !password.trim()) {
            errors.push('Password is required');
        }

        if (errors.length > 0) {
            throw new ValidationError(errors.join('; '));
        }

        next();
    }

    /**
     * Validate email format
     */
    private static isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
