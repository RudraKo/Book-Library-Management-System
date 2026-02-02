import { Router } from 'express';
import { AuthController } from '../controllers/Auth.controller';
import { ValidationMiddleware } from '../middleware/ValidationMiddleware';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

/**
 * Authentication Routes
 * Defines all routes for authentication operations
 */
export class AuthRoutes {
    public router: Router;
    private controller: AuthController;
    private authMiddleware: AuthMiddleware;

    constructor() {
        this.router = Router();
        this.controller = new AuthController();
        this.authMiddleware = new AuthMiddleware();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        // Public routes

        // POST /api/auth/register - Register a new user
        this.router.post(
            '/register',
            ValidationMiddleware.validateRegister,
            this.controller.register
        );

        // POST /api/auth/login - Login user
        this.router.post(
            '/login',
            ValidationMiddleware.validateLogin,
            this.controller.login
        );

        // Protected routes (authentication required)

        // GET /api/auth/profile - Get current user profile
        this.router.get(
            '/profile',
            this.authMiddleware.authenticate,
            this.controller.getProfile
        );

        // PUT /api/auth/profile - Update user profile
        this.router.put(
            '/profile',
            this.authMiddleware.authenticate,
            this.controller.updateProfile
        );
    }
}
