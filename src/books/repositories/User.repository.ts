import { User } from '../models/User.model';
import { IRepository } from '../interfaces/IRepository';

/**
 * UserRepository - Data Access Layer for User management
 * Implements repository pattern with in-memory storage
 */
export class UserRepository implements IRepository<User> {
    private users: Map<string, User> = new Map();

    constructor() {
        this.seedData();
    }

    /**
     * Find all users
     */
    async findAll(): Promise<User[]> {
        return Array.from(this.users.values());
    }

    /**
     * Find a user by ID
     */
    async findById(id: string): Promise<User | null> {
        return this.users.get(id) || null;
    }

    /**
     * Find a user by email
     */
    async findByEmail(email: string): Promise<User | null> {
        const users = Array.from(this.users.values());
        return users.find(user => user.email === email) || null;
    }

    /**
     * Find a user by username
     */
    async findByUsername(username: string): Promise<User | null> {
        const users = Array.from(this.users.values());
        return users.find(user => user.username === username) || null;
    }

    /**
     * Create a new user
     */
    async create(user: User): Promise<User> {
        this.users.set(user.id, user);
        return user;
    }

    /**
     * Update a user
     */
    async update(id: string, userData: Partial<User>): Promise<User | null> {
        const user = this.users.get(id);
        if (!user) {
            return null;
        }
        
        Object.assign(user, userData);
        user.updatedAt = new Date();
        this.users.set(id, user);
        return user;
    }

    /**
     * Delete a user
     */
    async delete(id: string): Promise<boolean> {
        return this.users.delete(id);
    }

    /**
     * Check if email exists
     */
    async isEmailExists(email: string, excludeId?: string): Promise<boolean> {
        const users = Array.from(this.users.values());
        return users.some(user => user.email === email && user.id !== excludeId);
    }

    /**
     * Check if username exists
     */
    async isUsernameExists(username: string, excludeId?: string): Promise<boolean> {
        const users = Array.from(this.users.values());
        return users.some(user => user.username === username && user.id !== excludeId);
    }

    /**
     * Seed initial data
     */
    private seedData(): void {
        const adminUser = new User({
            username: 'admin',
            email: 'admin@library.com',
            password: 'admin123', // In production, this should be hashed
            role: 'admin'
        });

        const regularUser = new User({
            username: 'user',
            email: 'user@library.com',
            password: 'user123', // In production, this should be hashed
            role: 'user'
        });

        this.users.set(adminUser.id, adminUser);
        this.users.set(regularUser.id, regularUser);
    }
}
