import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/Auth.service';
import { UserRepository } from '../repositories/User.repository';
import { UnauthorizedError, ForbiddenError } from '../utils/CustomErrors';
import { User } from '../models/User.model';

// Extend Express Request to include user
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */
export class AuthMiddleware {
    private authService: AuthService;

    constructor() {
        const userRepository = new UserRepository();
        this.authService = new AuthService(userRepository);
    }

    /**
     * Verify authentication token
     */
    authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Get token from header
            const authHeader = req.headers.authorization;
            
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new UnauthorizedError('No token provided');
            }

            const token = authHeader.substring(7); // Remove 'Bearer ' prefix

            // Verify token and get user
            const user = await this.authService.verifyToken(token);
            
            if (!user) {
                throw new UnauthorizedError('Invalid token');
            }

            // Attach user to request
            req.user = user;
            next();
        } catch (error) {
            next(error);
        }
    };

    /**
     * Check if user is admin
     */
    isAdmin = (req: Request, res: Response, next: NextFunction): void => {
        try {
            if (!req.user) {
                throw new UnauthorizedError('Authentication required');
            }

            if (!req.user.isAdmin()) {
                throw new ForbiddenError('Admin access required');
            }

            next();
        } catch (error) {
            next(error);
        }
    };

    /**
     * Optional authentication (attach user if token exists, but don't require it)
     */
    optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;
            
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.substring(7);
                const user = await this.authService.verifyToken(token);
                
                if (user) {
                    req.user = user;
                }
            }
            
            next();
        } catch (error) {
            // Don't throw error for optional auth, just continue
            next();
        }
    };
}
