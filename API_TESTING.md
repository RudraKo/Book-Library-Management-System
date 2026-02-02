# API Testing Guide

## Quick Start

1. Start the server:
```bash
npm run dev:books
```

2. The server will start on `http://localhost:5000`

## Test Endpoints with cURL

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Get API Documentation
```bash
curl http://localhost:5000/api/docs
```

### 3. Get All Books (with pagination)
```bash
curl http://localhost:5000/api/books
curl "http://localhost:5000/api/books?page=1&limit=5"
```

### 4. Search Books
```bash
curl "http://localhost:5000/api/books/search?q=gatsby"
curl "http://localhost:5000/api/books/search?q=fiction"
```

### 5. Filter Books
```bash
# Available books only
curl "http://localhost:5000/api/books?availableOnly=true"

# By genre
curl "http://localhost:5000/api/books/genre/Fiction"

# By price range
curl "http://localhost:5000/api/books?minPrice=10&maxPrice=15"

# By year
curl "http://localhost:5000/api/books?minYear=1900&maxYear=2000"
```

### 6. Sort Books
```bash
# Sort by price ascending
curl "http://localhost:5000/api/books?sortBy=price&sortOrder=asc"

# Sort by year descending
curl "http://localhost:5000/api/books?sortBy=publishedYear&sortOrder=desc"
```

### 7. Get Single Book
```bash
# Replace <book_id> with actual ID from list
curl "http://localhost:5000/api/books/<book_id>"
```

### 8. Get Statistics
```bash
curl http://localhost:5000/api/books/stats
```

### 9. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 10. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@library.com",
    "password": "admin123"
  }'
```

**Save the token from the response!**

### 11. Get User Profile (Requires Authentication)
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <your-token>"
```

### 12. Create a Book (Admin Only)
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
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
  }'
```

### 13. Update a Book (Admin Only)
```bash
curl -X PUT "http://localhost:5000/api/books/<book_id>" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin-token>" \
  -d '{
    "price": 29.99,
    "stockQuantity": 30
  }'
```

### 14. Borrow a Book (Requires Authentication)
```bash
curl -X POST "http://localhost:5000/api/books/<book_id>/borrow" \
  -H "Authorization: Bearer <your-token>"
```

### 15. Return a Book (Requires Authentication)
```bash
curl -X POST "http://localhost:5000/api/books/<book_id>/return" \
  -H "Authorization: Bearer <your-token>"
```

### 16. Delete a Book (Admin Only)
```bash
curl -X DELETE "http://localhost:5000/api/books/<book_id>" \
  -H "Authorization: Bearer <admin-token>"
```

## Complex Query Examples

### Combine Multiple Filters
```bash
curl "http://localhost:5000/api/books?genre=Fiction&minPrice=10&maxPrice=20&sortBy=title&sortOrder=asc&page=1&limit=5"
```

### Search with Pagination
```bash
curl "http://localhost:5000/api/books/search?q=great&page=1&limit=10&sortBy=rating&sortOrder=desc"
```

### Available Books with Filters
```bash
curl "http://localhost:5000/api/books?availableOnly=true&minRating=4&sortBy=rating&sortOrder=desc"
```

## Test Flow Example

### Complete User Journey

1. **Register a new user**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "john_doe", "email": "john@example.com", "password": "password123"}'
```

2. **Login to get token**
```bash
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}' | \
  grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo $TOKEN
```

3. **Browse available books**
```bash
curl "http://localhost:5000/api/books?availableOnly=true"
```

4. **Search for a specific book**
```bash
curl "http://localhost:5000/api/books/search?q=gatsby"
```

5. **Get book details**
```bash
BOOK_ID="<get-from-search-results>"
curl "http://localhost:5000/api/books/$BOOK_ID"
```

6. **Borrow the book**
```bash
curl -X POST "http://localhost:5000/api/books/$BOOK_ID/borrow" \
  -H "Authorization: Bearer $TOKEN"
```

7. **Return the book**
```bash
curl -X POST "http://localhost:5000/api/books/$BOOK_ID/return" \
  -H "Authorization: Bearer $TOKEN"
```

### Admin Flow

1. **Login as admin**
```bash
ADMIN_TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@library.com", "password": "admin123"}' | \
  grep -o '"token":"[^"]*' | cut -d'"' -f4)
```

2. **Add new book**
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "title": "The Pragmatic Programmer",
    "author": "Andrew Hunt, David Thomas",
    "isbn": "978-0-13-595705-9",
    "publishedYear": 2019,
    "genre": "Technology",
    "description": "Your journey to mastery",
    "price": 45.99,
    "stockQuantity": 15
  }'
```

3. **Update book**
```bash
NEW_BOOK_ID="<get-from-create-response>"
curl -X PUT "http://localhost:5000/api/books/$NEW_BOOK_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"price": 39.99, "stockQuantity": 20}'
```

4. **View statistics**
```bash
curl http://localhost:5000/api/books/stats
```

## Testing with Postman

1. Import the following as a collection
2. Create environment variables:
   - `baseUrl`: `http://localhost:5000`
   - `token`: (set after login)
   - `adminToken`: (set after admin login)

## Expected Responses

### Success Response
```json
{
  "success": true,
  "data": {...}
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "name": "ValidationError",
    "message": "Title is required",
    "statusCode": 400
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Common HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate ISBN)
- `500 Internal Server Error`: Server error

## Tips

1. **Pretty print JSON responses** (requires `jq`):
```bash
curl http://localhost:5000/api/books | jq
```

2. **Save token to variable**:
```bash
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@library.com", "password": "admin123"}' | \
  jq -r '.data.token')
```

3. **Test error handling**:
```bash
# Missing required fields
curl -X POST http://localhost:5000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{}'

# Invalid credentials
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "wrong@email.com", "password": "wrong"}'
```

## Default Test Data

The application comes pre-loaded with 5 books:
1. The Great Gatsby
2. To Kill a Mockingbird
3. 1984
4. Pride and Prejudice
5. The Catcher in the Rye

And 2 test users:
- Admin: admin@library.com / admin123
- User: user@library.com / user123
