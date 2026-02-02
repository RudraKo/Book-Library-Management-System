import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/Auth.service';
import { UserRepository } from '../repositories/User.repository';

/**
 * AuthController - HTTP Request Handler for Authentication
 */
export class AuthController {
    private service: AuthService;

    constructor() {
        const repository = new UserRepository();
        this.service = new AuthService(repository);
    }

    /**
     * Register a new user
     * POST /api/auth/register
     */
    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { username, email, password, role } = req.body;
            
            const user = await this.service.register(username, email, password, role);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: user.toJSON()
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Login user
     * POST /api/auth/login
     */
    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            
            const { user, token } = await this.service.login(email, password);

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user: user.toJSON(),
                    token
                }
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get current user profile
     * GET /api/auth/profile
     */
    getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) {
                throw new Error('User not authenticated');
            }

            res.status(200).json({
                success: true,
                data: req.user.toJSON()
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update user profile
     * PUT /api/auth/profile
     */
    updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            if (!req.user) {
                throw new Error('User not authenticated');
            }

            const updatedUser = await this.service.updateProfile(req.user.id, req.body);

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: updatedUser.toJSON()
            });
        } catch (error) {
            next(error);
        }
    };
}
