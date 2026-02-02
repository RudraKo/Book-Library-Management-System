import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/Book.service';
import { BookRepository } from '../repositories/Book.repository';
import { QueryOptions } from '../interfaces/IRepository';

/**
 * BookController - HTTP Request Handler
 * Handles all HTTP requests related to books
 */
export class BookController {
    private service: BookService;

    constructor() {
        const repository = new BookRepository();
        this.service = new BookService(repository);
    }

    /**
     * Get all books with pagination, filtering, sorting
     * GET /api/books
     */
    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const queryOptions: QueryOptions = {
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
                sortBy: (req.query.sortBy as string) || 'title',
                sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
                search: req.query.search as string,
                filters: {}
            };

            // Add custom filters
            if (req.query.genre) queryOptions.filters!.genre = String(req.query.genre);
            if (req.query.language) queryOptions.filters!.language = String(req.query.language);
            if (req.query.minPrice) queryOptions.filters!.minPrice = Number(req.query.minPrice);
            if (req.query.maxPrice) queryOptions.filters!.maxPrice = Number(req.query.maxPrice);
            if (req.query.minYear) queryOptions.filters!.minYear = Number(req.query.minYear);
            if (req.query.maxYear) queryOptions.filters!.maxYear = Number(req.query.maxYear);
            if (req.query.availableOnly === 'true') queryOptions.filters!.availableOnly = true;
            if (req.query.minRating) queryOptions.filters!.minRating = Number(req.query.minRating);

            const result = await this.service.getAll(queryOptions);

            res.status(200).json({
                success: true,
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get a single book by ID
     * GET /api/books/:id
     */
    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const book = await this.service.getById(String(req.params.id));
            
            res.status(200).json({
                success: true,
                data: book
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Create a new book
     * POST /api/books
     */
    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const book = await this.service.create(req.body);

            res.status(201).json({
                success: true,
                message: 'Book created successfully',
                data: book
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update a book
     * PUT /api/books/:id
     */
    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const book = await this.service.update(String(req.params.id), req.body);

            res.status(200).json({
                success: true,
                message: 'Book updated successfully',
                data: book
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Delete a book
     * DELETE /api/books/:id
     */
    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this.service.delete(String(req.params.id));

            res.status(200).json({
                success: true,
                message: 'Book deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Search books
     * GET /api/books/search
     */
    search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const query = String(req.query.q || '');
            
            const queryOptions: QueryOptions = {
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
                sortBy: (req.query.sortBy as string) || 'title',
                sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc'
            };

            const result = await this.service.search(query, queryOptions);

            res.status(200).json({
                success: true,
                query,
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get books by genre
     * GET /api/books/genre/:genre
     */
    getByGenre = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const books = await this.service.getByGenre(String(req.params.genre));

            res.status(200).json({
                success: true,
                genre: req.params.genre,
                count: books.length,
                data: books
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get books by author
     * GET /api/books/author/:author
     */
    getByAuthor = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const books = await this.service.getByAuthor(String(req.params.author));

            res.status(200).json({
                success: true,
                author: req.params.author,
                count: books.length,
                data: books
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Borrow a book
     * POST /api/books/:id/borrow
     */
    borrowBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const book = await this.service.borrowBook(String(req.params.id));

            res.status(200).json({
                success: true,
                message: 'Book borrowed successfully',
                data: book
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Return a book
     * POST /api/books/:id/return
     */
    returnBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const book = await this.service.returnBook(String(req.params.id));

            res.status(200).json({
                success: true,
                message: 'Book returned successfully',
                data: book
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get available books
     * GET /api/books/available
     */
    getAvailableBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const queryOptions: QueryOptions = {
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
                sortBy: (req.query.sortBy as string) || 'title',
                sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc'
            };

            const result = await this.service.getAvailableBooks(queryOptions);

            res.status(200).json({
                success: true,
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get statistics
     * GET /api/books/stats
     */
    getStatistics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const stats = await this.service.getStatistics();

            res.status(200).json({
                success: true,
                data: stats
            });
        } catch (error) {
            next(error);
        }
    };
}
