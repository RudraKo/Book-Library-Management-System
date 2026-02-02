import { Router } from 'express';
import { BookController } from '../controllers/Book.controller';
import { ValidationMiddleware } from '../middleware/ValidationMiddleware';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

/**
 * Book Routes
 * Defines all routes for book operations
 */
export class BookRoutes {
    public router: Router;
    private controller: BookController;
    private authMiddleware: AuthMiddleware;

    constructor() {
        this.router = Router();
        this.controller = new BookController();
        this.authMiddleware = new AuthMiddleware();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Public routes (no authentication required)
        
        // GET /api/books/stats - Get statistics (before /:id to avoid conflict)
        this.router.get(
            '/stats',
            this.controller.getStatistics
        );

        // GET /api/books/search - Search books
        this.router.get(
            '/search',
            ValidationMiddleware.validateQueryParams,
            this.controller.search
        );

        // GET /api/books/available - Get available books
        this.router.get(
            '/available',
            ValidationMiddleware.validateQueryParams,
            this.controller.getAvailableBooks
        );

        // GET /api/books/genre/:genre - Get books by genre
        this.router.get(
            '/genre/:genre',
            this.controller.getByGenre
        );

        // GET /api/books/author/:author - Get books by author
        this.router.get(
            '/author/:author',
            this.controller.getByAuthor
        );

        // GET /api/books - Get all books with pagination, filtering, sorting
        this.router.get(
            '/',
            ValidationMiddleware.validateQueryParams,
            this.controller.getAll
        );

        // GET /api/books/:id - Get a single book
        this.router.get(
            '/:id',
            this.controller.getById
        );

        // Protected routes (authentication required)

        // POST /api/books/:id/borrow - Borrow a book (authenticated users)
        this.router.post(
            '/:id/borrow',
            this.authMiddleware.authenticate,
            this.controller.borrowBook
        );

        // POST /api/books/:id/return - Return a book (authenticated users)
        this.router.post(
            '/:id/return',
            this.authMiddleware.authenticate,
            this.controller.returnBook
        );

        // Admin only routes

        // POST /api/books - Create a new book (admin only)
        this.router.post(
            '/',
            this.authMiddleware.authenticate,
            this.authMiddleware.isAdmin,
            ValidationMiddleware.validateCreateBook,
            this.controller.create
        );

        // PUT /api/books/:id - Update a book (admin only)
        this.router.put(
            '/:id',
            this.authMiddleware.authenticate,
            this.authMiddleware.isAdmin,
            ValidationMiddleware.validateUpdateBook,
            this.controller.update
        );

        // DELETE /api/books/:id - Delete a book (admin only)
        this.router.delete(
            '/:id',
            this.authMiddleware.authenticate,
            this.authMiddleware.isAdmin,
            this.controller.delete
        );
    }
}
