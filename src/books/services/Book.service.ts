import { Book } from '../models/Book.model';
import { BookRepository } from '../repositories/Book.repository';
import { IService } from '../interfaces/IService';
import { QueryOptions, PaginatedResponse } from '../interfaces/IRepository';
import { ValidationError, NotFoundError, ConflictError } from '../utils/CustomErrors';

/**
 * BookService - Business Logic Layer
 * Handles all business operations related to books
 */
export class BookService implements IService<Book> {
    private repository: BookRepository;

    constructor(repository: BookRepository) {
        this.repository = repository;
    }

    /**
     * Get all books with pagination, search, filter, and sort
     */
    async getAll(options: QueryOptions = {}): Promise<PaginatedResponse<Book>> {
        try {
            // Set defaults
            const queryOptions: QueryOptions = {
                page: options.page || 1,
                limit: options.limit || 10,
                sortBy: options.sortBy || 'title',
                sortOrder: options.sortOrder || 'asc',
                search: options.search,
                filters: options.filters
            };

            return await this.repository.findAllPaginated(queryOptions);
        } catch (error) {
            throw new Error(`Error fetching books: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Get a single book by ID
     */
    async getById(id: string): Promise<Book | null> {
        if (!id) {
            throw new ValidationError('Book ID is required');
        }

        const book = await this.repository.findById(id);
        if (!book) {
            throw new NotFoundError(`Book with ID ${id} not found`);
        }

        return book;
    }

    /**
     * Create a new book
     */
    async create(data: Partial<Book>): Promise<Book> {
        // Validate required fields
        this.validateBookData(data);

        // Check if ISBN already exists
        if (data.isbn) {
            const existingBook = await this.repository.findByISBN(data.isbn);
            if (existingBook) {
                throw new ConflictError(`Book with ISBN ${data.isbn} already exists`);
            }
        }

        // Create new book instance
        const book = new Book(data);

        // Save to repository
        return await this.repository.create(book);
    }

    /**
     * Update an existing book
     */
    async update(id: string, data: Partial<Book>): Promise<Book | null> {
        if (!id) {
            throw new ValidationError('Book ID is required');
        }

        // Check if book exists
        const existingBook = await this.repository.findById(id);
        if (!existingBook) {
            throw new NotFoundError(`Book with ID ${id} not found`);
        }

        // Validate update data
        if (data.isbn && data.isbn !== existingBook.isbn) {
            const isbnExists = await this.repository.isISBNExists(data.isbn, id);
            if (isbnExists) {
                throw new ConflictError(`Book with ISBN ${data.isbn} already exists`);
            }
        }

        // Validate fields if provided
        if (data.title !== undefined && !data.title.trim()) {
            throw new ValidationError('Title cannot be empty');
        }

        if (data.price !== undefined && data.price < 0) {
            throw new ValidationError('Price cannot be negative');
        }

        if (data.stockQuantity !== undefined && data.stockQuantity < 0) {
            throw new ValidationError('Stock quantity cannot be negative');
        }

        // Update book
        return await this.repository.update(id, data);
    }

    /**
     * Delete a book
     */
    async delete(id: string): Promise<boolean> {
        if (!id) {
            throw new ValidationError('Book ID is required');
        }

        const book = await this.repository.findById(id);
        if (!book) {
            throw new NotFoundError(`Book with ID ${id} not found`);
        }

        return await this.repository.delete(id);
    }

    /**
     * Search books by query
     */
    async search(query: string, options: QueryOptions = {}): Promise<PaginatedResponse<Book>> {
        if (!query) {
            throw new ValidationError('Search query is required');
        }

        const searchOptions: QueryOptions = {
            ...options,
            search: query
        };

        return await this.repository.findAllPaginated(searchOptions);
    }

    /**
     * Get books by genre
     */
    async getByGenre(genre: string): Promise<Book[]> {
        if (!genre) {
            throw new ValidationError('Genre is required');
        }

        return await this.repository.findByGenre(genre);
    }

    /**
     * Get books by author
     */
    async getByAuthor(author: string): Promise<Book[]> {
        if (!author) {
            throw new ValidationError('Author name is required');
        }

        return await this.repository.findByAuthor(author);
    }

    /**
     * Borrow a book
     */
    async borrowBook(id: string): Promise<Book> {
        const book = await this.repository.findById(id);
        if (!book) {
            throw new NotFoundError(`Book with ID ${id} not found`);
        }

        if (!book.isAvailable()) {
            throw new ConflictError('Book is not available for borrowing');
        }

        book.borrow();
        await this.repository.update(id, book);
        
        return book;
    }

    /**
     * Return a book
     */
    async returnBook(id: string): Promise<Book> {
        const book = await this.repository.findById(id);
        if (!book) {
            throw new NotFoundError(`Book with ID ${id} not found`);
        }

        book.returnBook();
        await this.repository.update(id, book);
        
        return book;
    }

    /**
     * Get available books only
     */
    async getAvailableBooks(options: QueryOptions = {}): Promise<PaginatedResponse<Book>> {
        const queryOptions: QueryOptions = {
            ...options,
            filters: {
                ...options.filters,
                availableOnly: true
            }
        };

        return await this.repository.findAllPaginated(queryOptions);
    }

    /**
     * Get statistics about books
     */
    async getStatistics(): Promise<any> {
        const allBooks = await this.repository.findAll();
        
        const totalBooks = allBooks.length;
        const availableBooks = allBooks.filter(book => book.isAvailable()).length;
        const totalStock = allBooks.reduce((sum, book) => sum + book.stockQuantity, 0);
        const borrowedBooks = allBooks.reduce((sum, book) => sum + (book.stockQuantity - book.availableQuantity), 0);
        
        const genreDistribution = allBooks.reduce((acc, book) => {
            acc[book.genre] = (acc[book.genre] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalBooks,
            availableBooks,
            totalStock,
            borrowedBooks,
            genreDistribution
        };
    }

    /**
     * Validate book data
     */
    private validateBookData(data: Partial<Book>): void {
        if (!data.title || !data.title.trim()) {
            throw new ValidationError('Title is required');
        }

        if (!data.author || !data.author.trim()) {
            throw new ValidationError('Author is required');
        }

        if (!data.isbn || !data.isbn.trim()) {
            throw new ValidationError('ISBN is required');
        }

        // Validate ISBN format (basic validation)
        const isbnRegex = /^(?:\d{9}[\dX]|\d{13}|(?:\d{3}-?)?\d{1,5}-?\d{1,7}-?\d{1,7}-?[\dX])$/;
        if (!isbnRegex.test(data.isbn.replace(/[-\s]/g, ''))) {
            throw new ValidationError('Invalid ISBN format');
        }

        if (data.publishedYear && (data.publishedYear < 1000 || data.publishedYear > new Date().getFullYear() + 1)) {
            throw new ValidationError('Invalid published year');
        }

        if (data.price !== undefined && data.price < 0) {
            throw new ValidationError('Price cannot be negative');
        }

        if (data.stockQuantity !== undefined && data.stockQuantity < 0) {
            throw new ValidationError('Stock quantity cannot be negative');
        }

        if (data.rating !== undefined && (data.rating < 0 || data.rating > 5)) {
            throw new ValidationError('Rating must be between 0 and 5');
        }

        if (data.pages !== undefined && data.pages < 1) {
            throw new ValidationError('Pages must be at least 1');
        }
    }
}
