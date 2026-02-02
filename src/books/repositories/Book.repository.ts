import { Book } from '../models/Book.model';
import { IRepository, QueryOptions, PaginatedResponse } from '../interfaces/IRepository';

/**
 * BookRepository - Data Access Layer
 * Implements repository pattern with in-memory storage
 * In production, this would interact with a real database
 */
export class BookRepository implements IRepository<Book> {
    private books: Map<string, Book> = new Map();

    constructor() {
        // Initialize with some sample data
        this.seedData();
    }

    /**
     * Find all books with optional query options
     */
    async findAll(options?: QueryOptions): Promise<Book[]> {
        let books = Array.from(this.books.values());
        
        // Apply search filter
        if (options?.search) {
            const searchLower = options.search.toLowerCase();
            books = books.filter(book => 
                book.title.toLowerCase().includes(searchLower) ||
                book.author.toLowerCase().includes(searchLower) ||
                book.isbn.toLowerCase().includes(searchLower) ||
                book.genre.toLowerCase().includes(searchLower)
            );
        }

        // Apply custom filters
        if (options?.filters) {
            books = this.applyFilters(books, options.filters);
        }

        // Apply sorting
        if (options?.sortBy) {
            books = this.sortBooks(books, options.sortBy, options.sortOrder || 'asc');
        }

        return books;
    }

    /**
     * Find all books with pagination
     */
    async findAllPaginated(options: QueryOptions): Promise<PaginatedResponse<Book>> {
        const allBooks = await this.findAll(options);
        
        const page = options.page || 1;
        const limit = options.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        
        const paginatedBooks = allBooks.slice(startIndex, endIndex);
        const totalItems = allBooks.length;
        const totalPages = Math.ceil(totalItems / limit);

        return {
            data: paginatedBooks,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems,
                itemsPerPage: limit,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            }
        };
    }

    /**
     * Find a book by ID
     */
    async findById(id: string): Promise<Book | null> {
        return this.books.get(id) || null;
    }

    /**
     * Find a book by ISBN
     */
    async findByISBN(isbn: string): Promise<Book | null> {
        const books = Array.from(this.books.values());
        return books.find(book => book.isbn === isbn) || null;
    }

    /**
     * Find books by genre
     */
    async findByGenre(genre: string): Promise<Book[]> {
        const books = Array.from(this.books.values());
        return books.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
    }

    /**
     * Find books by author
     */
    async findByAuthor(author: string): Promise<Book[]> {
        const books = Array.from(this.books.values());
        return books.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
    }

    /**
     * Create a new book
     */
    async create(book: Book): Promise<Book> {
        this.books.set(book.id, book);
        return book;
    }

    /**
     * Update a book
     */
    async update(id: string, bookData: Partial<Book>): Promise<Book | null> {
        const book = this.books.get(id);
        if (!book) {
            return null;
        }
        
        book.update(bookData);
        this.books.set(id, book);
        return book;
    }

    /**
     * Delete a book
     */
    async delete(id: string): Promise<boolean> {
        return this.books.delete(id);
    }

    /**
     * Get total count of books
     */
    async count(): Promise<number> {
        return this.books.size;
    }

    /**
     * Check if ISBN exists
     */
    async isISBNExists(isbn: string, excludeId?: string): Promise<boolean> {
        const books = Array.from(this.books.values());
        return books.some(book => book.isbn === isbn && book.id !== excludeId);
    }

    /**
     * Apply custom filters to books
     */
    private applyFilters(books: Book[], filters: Record<string, any>): Book[] {
        return books.filter(book => {
            for (const [key, value] of Object.entries(filters)) {
                if (key === 'minPrice' && book.price < value) return false;
                if (key === 'maxPrice' && book.price > value) return false;
                if (key === 'minYear' && book.publishedYear < value) return false;
                if (key === 'maxYear' && book.publishedYear > value) return false;
                if (key === 'genre' && book.genre.toLowerCase() !== value.toLowerCase()) return false;
                if (key === 'language' && book.language.toLowerCase() !== value.toLowerCase()) return false;
                if (key === 'availableOnly' && value && !book.isAvailable()) return false;
                if (key === 'minRating' && book.rating && book.rating < value) return false;
            }
            return true;
        });
    }

    /**
     * Sort books by field
     */
    private sortBooks(books: Book[], sortBy: string, sortOrder: 'asc' | 'desc'): Book[] {
        return books.sort((a, b) => {
            let aValue: any = (a as any)[sortBy];
            let bValue: any = (b as any)[sortBy];

            // Handle string comparisons
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }

    /**
     * Seed initial data
     */
    private seedData(): void {
        const sampleBooks = [
            new Book({
                title: "The Great Gatsby",
                author: "F. Scott Fitzgerald",
                isbn: "978-0-7432-7356-5",
                publishedYear: 1925,
                genre: "Classic Fiction",
                description: "A novel set in the Jazz Age that explores themes of wealth, love, and the American Dream.",
                price: 12.99,
                stockQuantity: 50,
                availableQuantity: 45,
                publisher: "Scribner",
                language: "English",
                pages: 180,
                rating: 4.4
            }),
            new Book({
                title: "To Kill a Mockingbird",
                author: "Harper Lee",
                isbn: "978-0-06-112008-4",
                publishedYear: 1960,
                genre: "Classic Fiction",
                description: "A gripping tale of racial injustice and childhood innocence in the American South.",
                price: 14.99,
                stockQuantity: 40,
                availableQuantity: 38,
                publisher: "J.B. Lippincott & Co.",
                language: "English",
                pages: 324,
                rating: 4.8
            }),
            new Book({
                title: "1984",
                author: "George Orwell",
                isbn: "978-0-452-28423-4",
                publishedYear: 1949,
                genre: "Science Fiction",
                description: "A dystopian social science fiction novel and cautionary tale about totalitarianism.",
                price: 13.99,
                stockQuantity: 60,
                availableQuantity: 55,
                publisher: "Secker & Warburg",
                language: "English",
                pages: 328,
                rating: 4.7
            }),
            new Book({
                title: "Pride and Prejudice",
                author: "Jane Austen",
                isbn: "978-0-14-143951-8",
                publishedYear: 1813,
                genre: "Romance",
                description: "A romantic novel of manners that critiques the British landed gentry at the end of the 18th century.",
                price: 11.99,
                stockQuantity: 45,
                availableQuantity: 42,
                publisher: "T. Egerton",
                language: "English",
                pages: 432,
                rating: 4.6
            }),
            new Book({
                title: "The Catcher in the Rye",
                author: "J.D. Salinger",
                isbn: "978-0-316-76948-0",
                publishedYear: 1951,
                genre: "Fiction",
                description: "A story about teenage rebellion and alienation.",
                price: 10.99,
                stockQuantity: 35,
                availableQuantity: 30,
                publisher: "Little, Brown and Company",
                language: "English",
                pages: 234,
                rating: 3.8
            })
        ];

        sampleBooks.forEach(book => this.books.set(book.id, book));
    }
}
