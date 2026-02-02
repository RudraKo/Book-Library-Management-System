import { User } from '../models/User.model';
import { UserRepository } from '../repositories/User.repository';
import { ValidationError, NotFoundError, ConflictError, UnauthorizedError } from '../utils/CustomErrors';

/**
 * AuthService - Business Logic for Authentication
 */
export class AuthService {
    private repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    /**
     * Register a new user
     */
    async register(username: string, email: string, password: string, role: 'admin' | 'user' = 'user'): Promise<User> {
        // Validate input
        this.validateRegistrationData(username, email, password);

        // Check if user exists
        const existingUserByEmail = await this.repository.findByEmail(email);
        if (existingUserByEmail) {
            throw new ConflictError('Email already registered');
        }

        const existingUserByUsername = await this.repository.findByUsername(username);
        if (existingUserByUsername) {
            throw new ConflictError('Username already taken');
        }

        // In production, password should be hashed using bcrypt
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            username,
            email,
            password, // In production: hashedPassword
            role
        });

        return await this.repository.create(user);
    }

    /**
     * Login user
     */
    async login(email: string, password: string): Promise<{ user: User; token: string }> {
        if (!email || !password) {
            throw new ValidationError('Email and password are required');
        }

        // Find user
        const user = await this.repository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedError('Invalid credentials');
        }

        // In production, use bcrypt to compare passwords
        // const isPasswordValid = await bcrypt.compare(password, user.password);
        const isPasswordValid = password === user.password;

        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid credentials');
        }

        // Generate token (simplified - in production use JWT)
        const token = this.generateToken(user);

        return { user, token };
    }

    /**
     * Verify token (simplified)
     */
    async verifyToken(token: string): Promise<User | null> {
        try {
            // In production, use JWT verification
            // const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Simplified token format: "user_<userId>"
            const userId = token.replace('token_', '');
            return await this.repository.findById(userId);
        } catch (error) {
            throw new UnauthorizedError('Invalid token');
        }
    }

    /**
     * Get user by ID
     */
    async getUserById(id: string): Promise<User> {
        const user = await this.repository.findById(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }
        return user;
    }

    /**
     * Update user profile
     */
    async updateProfile(id: string, data: Partial<User>): Promise<User> {
        const user = await this.repository.findById(id);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        // Validate email if being updated
        if (data.email && data.email !== user.email) {
            const emailExists = await this.repository.isEmailExists(data.email, id);
            if (emailExists) {
                throw new ConflictError('Email already in use');
            }
        }

        // Validate username if being updated
        if (data.username && data.username !== user.username) {
            const usernameExists = await this.repository.isUsernameExists(data.username, id);
            if (usernameExists) {
                throw new ConflictError('Username already taken');
            }
        }

        const updatedUser = await this.repository.update(id, data);
        if (!updatedUser) {
            throw new Error('Failed to update user');
        }

        return updatedUser;
    }

    /**
     * Generate authentication token (simplified)
     */
    private generateToken(user: User): string {
        // In production, use JWT
        // return jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        
        // Simplified token for demo
        return `token_${user.id}`;
    }

    /**
     * Validate registration data
     */
    private validateRegistrationData(username: string, email: string, password: string): void {
        if (!username || username.trim().length < 3) {
            throw new ValidationError('Username must be at least 3 characters');
        }

        if (!email || !this.isValidEmail(email)) {
            throw new ValidationError('Invalid email format');
        }

        if (!password || password.length < 6) {
            throw new ValidationError('Password must be at least 6 characters');
        }
    }

    /**
     * Validate email format
     */
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
