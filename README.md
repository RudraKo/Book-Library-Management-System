# Book Library Management System 📚

A full-featured **RESTful API** for managing a book library system built with **Node.js**, **Express**, and **TypeScript** following **Object-Oriented Programming (OOP)** principles and **clean architecture**.

## 🎯 Features

### Core CRUD Operations

- ✅ **Create** books
- ✅ **Read** books (single and list)
- ✅ **Update** books
- ✅ **Delete** books

### Advanced Features

- 🔍 **Search**: Search books by title, author, ISBN, or genre
- 🎯 **Filter**: Filter by genre, language, price range, year range, availability, rating
- 📊 **Sort**: Sort by any field (title, author, price, year, rating, etc.)
- 📄 **Pagination**: Efficient pagination for large datasets
- ✅ **Validation**: Comprehensive input validation with detailed error messages
- 🛡️ **Authentication**: JWT-based authentication system
- 👥 **Authorization**: Role-based access control (Admin/User)
- 📚 **Borrow/Return**: Book borrowing system with availability tracking
- 📈 **Statistics**: Library statistics and analytics

## 🏗️ Architecture

This project follows **Clean Architecture** principles with clear separation of concerns:

```
src/books/
├── models/              # Domain entities (Book, User)
├── interfaces/          # Contracts and interfaces
├── repositories/        # Data access layer
├── services/           # Business logic layer
├── controllers/        # HTTP request handlers
├── routes/             # API route definitions
├── middleware/         # Custom middleware (Auth, Validation, Errors)
├── utils/              # Utility classes (Custom Errors)
└── BookApp.ts          # Main application class
```

### Layer Responsibilities

1. **Models (Entities)**: Domain objects with business logic
2. **Repositories**: Data access and persistence
3. **Services**: Business logic and orchestration
4. **Controllers**: HTTP request/response handling
5. **Routes**: API endpoint definitions
6. **Middleware**: Cross-cutting concerns (auth, validation, errors)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- TypeScript

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd TODODODO
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file (optional):

```env
PORT=5000
NODE_ENV=development
```

4. Run the application:

```bash
npm run dev
```

The server will start at `http://localhost:5000`

### Available Scripts

```bash
npm run dev        # Start development server with auto-reload
npm run build      # Build TypeScript to JavaScript
npm start          # Start production server
npm run start:books # Start book library API
```

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Default Test Users

| Email             | Password | Role  |
| ----------------- | -------- | ----- |
| admin@library.com | admin123 | admin |
| user@library.com  | user123  | user  |

### Authentication

Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-token>
```

### Endpoints

#### 🔐 Authentication

| Method | Endpoint         | Description         | Auth Required |
| ------ | ---------------- | ------------------- | ------------- |
| POST   | `/auth/register` | Register new user   | No            |
| POST   | `/auth/login`    | Login user          | No            |
| GET    | `/auth/profile`  | Get current user    | Yes           |
| PUT    | `/auth/profile`  | Update user profile | Yes           |

#### 📖 Books

| Method | Endpoint                | Description               | Auth Required |
| ------ | ----------------------- | ------------------------- | ------------- |
| GET    | `/books`                | Get all books (paginated) | No            |
| GET    | `/books/:id`            | Get single book           | No            |
| GET    | `/books/search?q=query` | Search books              | No            |
| GET    | `/books/genre/:genre`   | Get books by genre        | No            |
| GET    | `/books/author/:author` | Get books by author       | No            |
| GET    | `/books/available`      | Get available books       | No            |
| GET    | `/books/stats`          | Get library statistics    | No            |
| POST   | `/books`                | Create new book           | Yes (Admin)   |
| PUT    | `/books/:id`            | Update book               | Yes (Admin)   |
| DELETE | `/books/:id`            | Delete book               | Yes (Admin)   |
| POST   | `/books/:id/borrow`     | Borrow book               | Yes           |
| POST   | `/books/:id/return`     | Return book               | Yes           |

### Query Parameters

#### Pagination

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

#### Sorting

- `sortBy`: Field to sort by (title, author, price, publishedYear, rating)
- `sortOrder`: Sort order (asc, desc)

#### Filtering

- `genre`: Filter by genre
- `language`: Filter by language
- `minPrice`: Minimum price
- `maxPrice`: Maximum price
- `minYear`: Minimum published year
- `maxYear`: Maximum published year
- `minRating`: Minimum rating
- `availableOnly`: Show only available books (true/false)

#### Search

- `search`: Search query (searches in title, author, ISBN, genre)

### Example Requests

#### 1. Register a User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### 2. Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@library.com",
  "password": "admin123"
}
```

Response:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_xxx",
      "username": "admin",
      "email": "admin@library.com",
      "role": "admin"
    },
    "token": "token_xxx"
  }
}
```

#### 3. Get All Books (with filters)

```bash
GET /api/books?page=1&limit=10&sortBy=title&sortOrder=asc&genre=Fiction&minPrice=10&maxPrice=20&availableOnly=true
```

#### 4. Search Books

```bash
GET /api/books/search?q=gatsby&page=1&limit=10
```

#### 5. Create a Book (Admin only)

```bash
POST /api/books
Authorization: Bearer token_xxx
Content-Type: application/json

{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "978-0-13-235088-4",
  "publishedYear": 2008,
  "genre": "Technology",
  "description": "A handbook of agile software craftsmanship",
  "price": 35.99,
  "stockQuantity": 25,
  "publisher": "Prentice Hall",
  "language": "English",
  "pages": 464
}
```

#### 6. Borrow a Book

```bash
POST /api/books/:id/borrow
Authorization: Bearer token_xxx
```

#### 7. Get Statistics

```bash
GET /api/books/stats
```

Response:

```json
{
  "success": true,
  "data": {
    "totalBooks": 5,
    "availableBooks": 4,
    "totalStock": 230,
    "borrowedBooks": 15,
    "genreDistribution": {
      "Classic Fiction": 2,
      "Science Fiction": 1,
      "Romance": 1,
      "Fiction": 1
    }
  }
}
```

## 🏛️ OOP Design Patterns Used

### 1. Repository Pattern

Separates data access logic from business logic:

```typescript
class BookRepository implements IRepository<Book> {
  async findAll(): Promise<Book[]> {
    /* ... */
  }
  async findById(id: string): Promise<Book | null> {
    /* ... */
  }
  // ...
}
```

### 2. Service Layer Pattern

Encapsulates business logic:

```typescript
class BookService implements IService<Book> {
  constructor(private repository: BookRepository) {}

  async create(data: Partial<Book>): Promise<Book> {
    // Validation and business logic
  }
}
```

### 3. Dependency Injection

Services depend on abstractions, not concrete implementations:

```typescript
class BookService {
  constructor(private repository: IRepository<Book>) {}
}
```

### 4. Single Responsibility Principle

Each class has one well-defined responsibility:

- **Models**: Domain entities and business rules
- **Repositories**: Data access
- **Services**: Business logic
- **Controllers**: HTTP handling
- **Middleware**: Cross-cutting concerns

### 5. Interface Segregation

Clients depend only on methods they use:

```typescript
interface IRepository<T> {
  /* ... */
}
interface IService<T> {
  /* ... */
}
```

## 🛡️ Error Handling

The API uses custom error classes for consistent error responses:

- `ValidationError` (400): Invalid input data
- `UnauthorizedError` (401): Authentication failed
- `ForbiddenError` (403): Insufficient permissions
- `NotFoundError` (404): Resource not found
- `ConflictError` (409): Resource conflict (e.g., duplicate ISBN)
- `InternalServerError` (500): Server errors

Example error response:

```json
{
  "success": false,
  "error": {
    "name": "ValidationError",
    "message": "Title is required; Author is required",
    "statusCode": 400
  }
}
```

## 🔒 Security Features

- ✅ Input validation on all endpoints
- ✅ JWT-based authentication
- ✅ Role-based authorization
- ✅ Password requirements (min 6 characters)
- ✅ Email format validation
- ✅ ISBN format validation
- ✅ Protected admin routes
- ⚠️ Note: In production, implement:
  - Password hashing (bcrypt)
  - Real JWT tokens with expiry
  - Rate limiting
  - HTTPS
  - Environment variables for secrets

## 📊 Sample Data

The application comes with 5 pre-loaded books:

1. The Great Gatsby - F. Scott Fitzgerald
2. To Kill a Mockingbird - Harper Lee
3. 1984 - George Orwell
4. Pride and Prejudice - Jane Austen
5. The Catcher in the Rye - J.D. Salinger

## 🧪 Testing the API

### Using cURL

```bash
# Health Check
curl http://localhost:5000/health

# Get API Documentation
curl http://localhost:5000/api/docs

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@library.com","password":"admin123"}'

# Get all books
curl http://localhost:5000/api/books

# Search books
curl "http://localhost:5000/api/books/search?q=gatsby"

# Get books by genre
curl http://localhost:5000/api/books/genre/Fiction
```

### Using Postman

1. Import the collection (create one from the API documentation)
2. Set up environment variables:
   - `baseUrl`: `http://localhost:5000/api`
   - `token`: (after login)
3. Test all endpoints

## 📝 Project Structure Details

```
TODODODO/
├── src/
│   ├── books/                      # Book library module
│   │   ├── models/                 # Domain entities
│   │   │   ├── Book.model.ts       # Book entity with business logic
│   │   │   └── User.model.ts       # User entity
│   │   ├── interfaces/             # Contracts
│   │   │   ├── IRepository.ts      # Repository interface
│   │   │   └── IService.ts         # Service interface
│   │   ├── repositories/           # Data access layer
│   │   │   ├── Book.repository.ts  # Book data access
│   │   │   └── User.repository.ts  # User data access
│   │   ├── services/               # Business logic layer
│   │   │   ├── Book.service.ts     # Book business logic
│   │   │   └── Auth.service.ts     # Auth business logic
│   │   ├── controllers/            # HTTP handlers
│   │   │   ├── Book.controller.ts  # Book request handlers
│   │   │   └── Auth.controller.ts  # Auth request handlers
│   │   ├── routes/                 # Route definitions
│   │   │   ├── Book.routes.ts      # Book routes
│   │   │   └── Auth.routes.ts      # Auth routes
│   │   ├── middleware/             # Custom middleware
│   │   │   ├── ErrorHandler.ts     # Global error handler
│   │   │   ├── AuthMiddleware.ts   # Authentication
│   │   │   └── ValidationMiddleware.ts # Input validation
│   │   ├── utils/                  # Utilities
│   │   │   └── CustomErrors.ts     # Custom error classes
│   │   └── BookApp.ts              # Main application class
│   ├── schema/                     # Todo module (existing)
│   └── app.ts                      # Old app entry point
├── bookServer.ts                   # Book API server entry
├── server.ts                       # Original server
├── package.json
├── tsconfig.json
└── README.md                       # This file
```

## 🎓 Learning Objectives Demonstrated

This project demonstrates:

1. ✅ **OOP Principles**
   - Encapsulation
   - Inheritance
   - Polymorphism
   - Abstraction

2. ✅ **SOLID Principles**
   - Single Responsibility
   - Open/Closed
   - Liskov Substitution
   - Interface Segregation
   - Dependency Inversion

3. ✅ **Design Patterns**
   - Repository Pattern
   - Service Layer Pattern
   - Dependency Injection
   - Factory Pattern (Error classes)
   - Middleware Pattern

4. ✅ **Clean Code**
   - Meaningful names
   - Small functions
   - Comments where needed
   - Error handling
   - Consistent formatting

5. ✅ **RESTful API Design**
   - Resource-based URLs
   - HTTP methods
   - Status codes
   - JSON responses

## 🚧 Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Real JWT implementation
- [ ] Password hashing with bcrypt
- [ ] Rate limiting
- [ ] Caching (Redis)
- [ ] File upload for book covers
- [ ] Email notifications
- [ ] Book reservations
- [ ] User reviews and ratings
- [ ] Wishlist functionality
- [ ] Advanced analytics
- [ ] Unit and integration tests
- [ ] API documentation with Swagger
- [ ] Docker containerization
- [ ] CI/CD pipeline

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👨‍💻 Author

Your Name - Full Stack Developer

## 🙏 Acknowledgments

- Built with Node.js, Express, and TypeScript
- Inspired by clean architecture principles
- Following OOP best practices

---

**Happy Coding!** 🚀📚
