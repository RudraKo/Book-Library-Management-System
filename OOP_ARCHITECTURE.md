# OOP Architecture Documentation

## Overview

This Book Library Management System demonstrates **Object-Oriented Programming (OOP)** principles with a clean, layered architecture following industry best practices.

## Architecture Layers

```
┌─────────────────────────────────────┐
│     HTTP Request (Client)           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│         Routes Layer                │
│  (Book.routes.ts, Auth.routes.ts)  │
│  - Route definitions                │
│  - Middleware binding               │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Middleware Layer               │
│  - Authentication                   │
│  - Authorization                    │
│  - Validation                       │
│  - Error Handling                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Controller Layer               │
│  (Book.controller, Auth.controller) │
│  - HTTP request/response handling   │
│  - Input parsing                    │
│  - Response formatting              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│       Service Layer                 │
│  (Book.service, Auth.service)       │
│  - Business logic                   │
│  - Validation rules                 │
│  - Orchestration                    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Repository Layer               │
│  (Book.repository, User.repository) │
│  - Data access                      │
│  - CRUD operations                  │
│  - Queries                          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│        Model Layer                  │
│    (Book.model, User.model)         │
│  - Domain entities                  │
│  - Business rules                   │
│  - Entity behavior                  │
└─────────────────────────────────────┘
```

## OOP Principles Applied

### 1. Encapsulation

**Definition**: Bundling data and methods that operate on that data within a single unit (class), hiding internal state.

**Implementation**:

```typescript
// Book.model.ts
export class Book {
    // Private data (encapsulated)
    private id: string;
    private availableQuantity: number;
    
    // Public interface
    public borrow(): void {
        if (!this.isAvailable()) {
            throw new Error('Book is not available');
        }
        this.availableQuantity--;
    }
    
    public isAvailable(): boolean {
        return this.availableQuantity > 0;
    }
}
```

**Benefits**:
- Internal state is protected
- Business rules are enforced
- Implementation details are hidden

### 2. Abstraction

**Definition**: Hiding complex implementation details and exposing only essential features.

**Implementation**:

```typescript
// IRepository.ts
export interface IRepository<T> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(entity: T): Promise<T>;
    update(id: string, entity: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}

// BookRepository implements the abstraction
export class BookRepository implements IRepository<Book> {
    // Implementation details hidden
}
```

**Benefits**:
- Code depends on abstractions, not concrete classes
- Easy to swap implementations
- Testability improved

### 3. Inheritance

**Definition**: Creating new classes based on existing classes, inheriting properties and methods.

**Implementation**:

```typescript
// CustomErrors.ts
export class CustomError extends Error {
    statusCode: number;
    isOperational: boolean;
    
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
    }
}

export class ValidationError extends CustomError {
    constructor(message: string) {
        super(message, 400);
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string) {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}
```

**Benefits**:
- Code reuse
- Hierarchical class structure
- Polymorphic behavior

### 4. Polymorphism

**Definition**: Objects of different classes can be treated through the same interface.

**Implementation**:

```typescript
// All repositories can be used interchangeably through IRepository
function processRepository<T>(repo: IRepository<T>) {
    // Works with any repository implementation
    const items = await repo.findAll();
    const item = await repo.findById('123');
}

// All errors can be handled uniformly
function handleError(error: CustomError) {
    // Works with ValidationError, NotFoundError, etc.
    res.status(error.statusCode).json({
        error: error.message
    });
}
```

**Benefits**:
- Flexible code
- Easy to extend
- Uniform interfaces

## SOLID Principles

### 1. Single Responsibility Principle (SRP)

**Definition**: A class should have only one reason to change.

**Implementation**:

| Class | Single Responsibility |
|-------|----------------------|
| `Book` | Represent a book entity and its business rules |
| `BookRepository` | Handle data access for books |
| `BookService` | Contain business logic for book operations |
| `BookController` | Handle HTTP requests and responses |
| `ValidationMiddleware` | Validate request data |
| `AuthMiddleware` | Handle authentication |
| `ErrorHandler` | Handle and format errors |

### 2. Open/Closed Principle (OCP)

**Definition**: Classes should be open for extension but closed for modification.

**Implementation**:

```typescript
// Easy to add new error types without modifying existing code
export class ConflictError extends CustomError {
    constructor(message: string) {
        super(message, 409);
    }
}

// Easy to add new repository methods without breaking existing ones
export class BookRepository implements IRepository<Book> {
    // Existing methods remain unchanged
    
    // New functionality added
    async findByISBN(isbn: string): Promise<Book | null> {
        // New method
    }
}
```

### 3. Liskov Substitution Principle (LSP)

**Definition**: Objects of a superclass should be replaceable with objects of a subclass without affecting correctness.

**Implementation**:

```typescript
// Any CustomError subclass can replace CustomError
function logError(error: CustomError) {
    console.error(`[${error.name}] ${error.message}`);
}

// Works with any error type
logError(new ValidationError('Invalid input'));
logError(new NotFoundError('Book not found'));
logError(new UnauthorizedError('Invalid token'));
```

### 4. Interface Segregation Principle (ISP)

**Definition**: Clients should not be forced to depend on interfaces they don't use.

**Implementation**:

```typescript
// Separate interfaces for different concerns
export interface IRepository<T> {
    // Data access operations
}

export interface IService<T> {
    // Business logic operations
}

// Classes implement only what they need
export class BookService implements IService<Book> {
    // Only implements service operations
}
```

### 5. Dependency Inversion Principle (DIP)

**Definition**: High-level modules should not depend on low-level modules. Both should depend on abstractions.

**Implementation**:

```typescript
// Service depends on abstraction, not concrete implementation
export class BookService {
    constructor(private repository: IRepository<Book>) {
        // Depends on interface, not BookRepository directly
    }
}

// Easy to inject different implementations
const memoryRepo = new BookRepository();
const databaseRepo = new DatabaseBookRepository(); // Could be added later

const service1 = new BookService(memoryRepo);
const service2 = new BookService(databaseRepo);
```

## Design Patterns Used

### 1. Repository Pattern

**Purpose**: Separate data access logic from business logic.

**Implementation**:
```
BookService → IRepository ← BookRepository
                                 ↓
                            Data Storage
```

**Benefits**:
- Business logic doesn't know about data storage
- Easy to switch storage (memory → database)
- Testable with mock repositories

### 2. Service Layer Pattern

**Purpose**: Encapsulate business logic in a separate layer.

**Structure**:
```
Controller → Service → Repository
```

**Responsibilities**:
- **Controller**: HTTP handling
- **Service**: Business logic, validation
- **Repository**: Data access

### 3. Dependency Injection

**Purpose**: Provide dependencies from outside rather than creating them internally.

**Implementation**:

```typescript
// Dependencies injected via constructor
export class BookService {
    constructor(private repository: BookRepository) {}
}

export class BookController {
    constructor() {
        const repository = new BookRepository();
        this.service = new BookService(repository);
    }
}
```

**Benefits**:
- Loose coupling
- Easy testing with mocks
- Flexibility to swap implementations

### 4. Factory Pattern (Error Classes)

**Purpose**: Create objects without specifying exact class.

**Implementation**:

```typescript
function createError(type: string, message: string): CustomError {
    switch (type) {
        case 'validation':
            return new ValidationError(message);
        case 'notFound':
            return new NotFoundError(message);
        case 'unauthorized':
            return new UnauthorizedError(message);
        default:
            return new CustomError(message, 500);
    }
}
```

### 5. Middleware Pattern

**Purpose**: Process requests through a chain of handlers.

**Implementation**:

```typescript
// Request flows through middleware chain
app.use(express.json());
app.use(authMiddleware);
app.use(validationMiddleware);
app.use(controller);
app.use(errorHandler);
```

## Class Diagram

```
┌─────────────────┐
│   BookApp       │
│  (Main App)     │
└────────┬────────┘
         │
         ├─────────────┬─────────────┐
         │             │             │
    ┌────▼────┐   ┌───▼────┐   ┌───▼────┐
    │ Routes  │   │Middleware│ │Handlers│
    └────┬────┘   └─────────┘ └────────┘
         │
    ┌────▼──────────────┐
    │  BookController   │
    │  - getAll()       │
    │  - getById()      │
    │  - create()       │
    │  - update()       │
    │  - delete()       │
    └────┬──────────────┘
         │
    ┌────▼──────────────┐
    │  BookService      │
    │  - getAll()       │
    │  - getById()      │
    │  - create()       │
    │  - update()       │
    │  - delete()       │
    │  - validation     │
    └────┬──────────────┘
         │
    ┌────▼──────────────┐
    │ BookRepository    │
    │  - findAll()      │
    │  - findById()     │
    │  - create()       │
    │  - update()       │
    │  - delete()       │
    └────┬──────────────┘
         │
    ┌────▼──────────────┐
    │    Book Model     │
    │  - id             │
    │  - title          │
    │  - author         │
    │  - methods...     │
    └───────────────────┘
```

## Benefits of This Architecture

### 1. Maintainability
- Each layer has clear responsibility
- Changes are isolated to specific layers
- Easy to understand and modify

### 2. Testability
- Each component can be tested independently
- Easy to mock dependencies
- Business logic separated from infrastructure

### 3. Scalability
- Easy to add new features
- Can replace implementations without affecting other layers
- Database can be added without changing business logic

### 4. Reusability
- Services can be reused by different controllers
- Repositories can be reused by different services
- Models represent domain knowledge

### 5. Flexibility
- Easy to switch between implementations
- Can add new features without modifying existing code
- Adapts to changing requirements

## Example: Adding a New Feature

To add a "Review" feature:

1. **Create Model**: `Review.model.ts`
```typescript
export class Review {
    id: string;
    bookId: string;
    userId: string;
    rating: number;
    comment: string;
}
```

2. **Create Repository**: `Review.repository.ts`
```typescript
export class ReviewRepository implements IRepository<Review> {
    // Data access methods
}
```

3. **Create Service**: `Review.service.ts`
```typescript
export class ReviewService implements IService<Review> {
    constructor(private repository: ReviewRepository) {}
    // Business logic
}
```

4. **Create Controller**: `Review.controller.ts`
```typescript
export class ReviewController {
    constructor() {
        this.service = new ReviewService(new ReviewRepository());
    }
    // HTTP handlers
}
```

5. **Create Routes**: `Review.routes.ts`
```typescript
export class ReviewRoutes {
    // Route definitions
}
```

6. **Register in App**: `BookApp.ts`
```typescript
const reviewRoutes = new ReviewRoutes();
this.app.use('/api/reviews', reviewRoutes.router);
```

**No existing code needs to be modified!** This is the power of good OOP design.

## Testing Strategy

### Unit Tests
- Test each class in isolation
- Mock dependencies
- Focus on business logic

### Integration Tests
- Test layer interactions
- Use test database
- Verify end-to-end flows

### Example Test Structure
```typescript
describe('BookService', () => {
    let service: BookService;
    let mockRepository: jest.Mocked<IRepository<Book>>;
    
    beforeEach(() => {
        mockRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            // ... other mocked methods
        };
        service = new BookService(mockRepository);
    });
    
    it('should create a book with valid data', async () => {
        const bookData = { title: 'Test Book', author: 'Author' };
        mockRepository.create.mockResolvedValue(new Book(bookData));
        
        const result = await service.create(bookData);
        
        expect(result).toBeDefined();
        expect(result.title).toBe('Test Book');
    });
});
```

## Conclusion

This architecture demonstrates professional-level OOP implementation with:
- Clear separation of concerns
- SOLID principles applied
- Design patterns utilized
- Clean, maintainable code
- Easy to test and extend
- Production-ready structure

It serves as an excellent foundation for building scalable, enterprise-level applications.
