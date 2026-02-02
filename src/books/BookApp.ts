import express, { Application, Request, Response } from 'express';
import { BookRoutes } from './routes/Book.routes';
import { AuthRoutes } from './routes/Auth.routes';
import { ErrorHandler } from './middleware/ErrorHandler';

/**
 * BookApp - Main Application Class
 * Implements OOP structure with proper separation of concerns
 */
export class BookApp {
    private app: Application;
    private readonly PORT: number;

    constructor(port: number = 5000) {
        this.app = express();
        this.PORT = port;
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    /**
     * Initialize middleware
     */
    private initializeMiddleware(): void {
        // Body parsing middleware
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        // CORS middleware (in production, configure properly)
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            
            if (req.method === 'OPTIONS') {
                return res.sendStatus(200);
            }
            next();
        });

        // Request logging middleware
        this.app.use((req, res, next) => {
            console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
            next();
        });
    }

    /**
     * Initialize routes
     */
    private initializeRoutes(): void {
        // Welcome route
        this.app.get('/', (req: Request, res: Response) => {
            res.json({
                success: true,
                message: 'Welcome to Book Library Management System API',
                version: '1.0.0',
                endpoints: {
                    books: '/api/books',
                    auth: '/api/auth',
                    docs: '/api/docs'
                }
            });
        });

        // API documentation route
        this.app.get('/api/docs', (req: Request, res: Response) => {
            res.json({
                success: true,
                message: 'API Documentation',
                version: '1.0.0',
                endpoints: {
                    books: {
                        getAll: 'GET /api/books - Get all books with pagination, search, filter, sort',
                        getById: 'GET /api/books/:id - Get a single book',
                        search: 'GET /api/books/search?q=query - Search books',
                        byGenre: 'GET /api/books/genre/:genre - Get books by genre',
                        byAuthor: 'GET /api/books/author/:author - Get books by author',
                        available: 'GET /api/books/available - Get available books',
                        statistics: 'GET /api/books/stats - Get library statistics',
                        create: 'POST /api/books - Create a new book (Admin only)',
                        update: 'PUT /api/books/:id - Update a book (Admin only)',
                        delete: 'DELETE /api/books/:id - Delete a book (Admin only)',
                        borrow: 'POST /api/books/:id/borrow - Borrow a book (Auth required)',
                        return: 'POST /api/books/:id/return - Return a book (Auth required)'
                    },
                    auth: {
                        register: 'POST /api/auth/register - Register a new user',
                        login: 'POST /api/auth/login - Login user',
                        profile: 'GET /api/auth/profile - Get current user profile (Auth required)',
                        updateProfile: 'PUT /api/auth/profile - Update user profile (Auth required)'
                    }
                },
                queryParameters: {
                    pagination: 'page, limit',
                    sorting: 'sortBy, sortOrder (asc/desc)',
                    search: 'search',
                    filters: 'genre, language, minPrice, maxPrice, minYear, maxYear, availableOnly, minRating'
                },
                authentication: {
                    header: 'Authorization: Bearer <token>',
                    defaultUsers: [
                        { email: 'admin@library.com', password: 'admin123', role: 'admin' },
                        { email: 'user@library.com', password: 'user123', role: 'user' }
                    ]
                }
            });
        });

        // Health check route
        this.app.get('/health', (req: Request, res: Response) => {
            res.json({
                success: true,
                status: 'healthy',
                timestamp: new Date().toISOString()
            });
        });

        // Initialize feature routes
        const bookRoutes = new BookRoutes();
        const authRoutes = new AuthRoutes();

        this.app.use('/api/books', bookRoutes.router);
        this.app.use('/api/auth', authRoutes.router);
    }

    /**
     * Initialize error handling
     */
    private initializeErrorHandling(): void {
        // 404 handler
        this.app.use(ErrorHandler.notFound);

        // Global error handler
        this.app.use(ErrorHandler.handle);
    }

    /**
     * Start the server
     */
    public start(): void {
        this.app.listen(this.PORT, () => {
            console.log('='.repeat(50));
            console.log('📚 Book Library Management System API');
            console.log('='.repeat(50));
            console.log(`🚀 Server is running on port ${this.PORT}`);
            console.log(`📖 API Documentation: http://localhost:${this.PORT}/api/docs`);
            console.log(`🏥 Health Check: http://localhost:${this.PORT}/health`);
            console.log('='.repeat(50));
            console.log('Default Users:');
            console.log('  Admin: admin@library.com / admin123');
            console.log('  User:  user@library.com / user123');
            console.log('='.repeat(50));
        });
    }

    /**
     * Get Express application instance
     */
    public getApp(): Application {
        return this.app;
    }
}
