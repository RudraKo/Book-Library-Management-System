/**
 * User Entity - Domain Model for Authentication
 */
export class User {
    id: string;
    username: string;
    email: string;
    password: string; // In production, this should be hashed
    role: 'admin' | 'user';
    createdAt: Date;
    updatedAt: Date;

    constructor(data: Partial<User>) {
        this.id = data.id || this.generateId();
        this.username = data.username || '';
        this.email = data.email || '';
        this.password = data.password || '';
        this.role = data.role || 'user';
        this.createdAt = data.createdAt || new Date();
        this.updatedAt = data.updatedAt || new Date();
    }

    private generateId(): string {
        return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Check if user is admin
     */
    isAdmin(): boolean {
        return this.role === 'admin';
    }

    /**
     * Convert to plain object for JSON serialization (without password)
     */
    toJSON(): Record<string, any> {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            role: this.role,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Get user with password for authentication
     */
    toAuthJSON(): Record<string, any> {
        return {
            ...this.toJSON(),
            password: this.password
        };
    }
}
