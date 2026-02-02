/**
 * Book Entity - Domain Model
 * Represents a book in the library system
 */
export class Book {
    id: string;
    title: string;
    author: string;
    isbn: string;
    publishedYear: number;
    genre: string;
    description: string;
    price: number;
    stockQuantity: number;
    availableQuantity: number;
    publisher?: string;
    language: string;
    pages?: number;
    rating?: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<Book>) {
        this.id = data.id || this.generateId();
        this.title = data.title || '';
        this.author = data.author || '';
        this.isbn = data.isbn || '';
        this.publishedYear = data.publishedYear || new Date().getFullYear();
        this.genre = data.genre || 'General';
        this.description = data.description || '';
        this.price = data.price || 0;
        this.stockQuantity = data.stockQuantity || 0;
        this.availableQuantity = data.availableQuantity ?? data.stockQuantity ?? 0;
        this.publisher = data.publisher;
        this.language = data.language || 'English';
        this.pages = data.pages;
        this.rating = data.rating;
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    private generateId(): string {
        return `book_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Business logic: Check if book is available for borrowing
     */
    isAvailable(): boolean {
        return this.availableQuantity > 0;
    }

    /**
     * Business logic: Borrow a book
     */
    borrow(): void {
        if (!this.isAvailable()) {
            throw new Error('Book is not available');
        }
        this.availableQuantity--;
        this.updatedAt = new Date();
    }

    /**
     * Business logic: Return a book
     */
    returnBook(): void {
        if (this.availableQuantity >= this.stockQuantity) {
            throw new Error('Cannot return more books than stock quantity');
        }
        this.availableQuantity++;
        this.updatedAt = new Date();
    }

    /**
     * Update book details
     */
    update(data: Partial<Book>): void {
        Object.assign(this, data);
        this.updatedAt = new Date();
    }

    /**
     * Convert to plain object for JSON serialization
     */
    toJSON(): Record<string, any> {
        return {
            id: this.id,
            title: this.title,
            author: this.author,
            isbn: this.isbn,
            publishedYear: this.publishedYear,
            genre: this.genre,
            description: this.description,
            price: this.price,
            stockQuantity: this.stockQuantity,
            availableQuantity: this.availableQuantity,
            publisher: this.publisher,
            language: this.language,
            pages: this.pages,
            rating: this.rating,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}
