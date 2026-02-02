# Quick Reference Card

## 🚀 Start Server
```bash
npm run dev:books
```
Server: `http://localhost:5000`

---

## 🔐 Authentication

### Login (Admin)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@library.com","password":"admin123"}'
```

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@test.com","password":"pass123"}'
```

---

## 📚 Books - Read Operations

### Get All Books
```bash
curl http://localhost:5000/api/books
```

### Search Books
```bash
curl "http://localhost:5000/api/books/search?q=gatsby"
```

### Filter + Sort + Paginate
```bash
curl "http://localhost:5000/api/books?genre=Fiction&minPrice=10&sortBy=price&page=1&limit=5"
```

### Get Statistics
```bash
curl http://localhost:5000/api/books/stats
```

---

## 📚 Books - Write Operations (Admin)

### Create Book
```bash
curl -X POST http://localhost:5000/api/books \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Clean Code",
    "author":"Robert Martin",
    "isbn":"978-0132350884",
    "price":35.99,
    "stockQuantity":20,
    "genre":"Technology"
  }'
```

### Update Book
```bash
curl -X PUT http://localhost:5000/api/books/BOOK_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price":29.99}'
```

### Delete Book
```bash
curl -X DELETE http://localhost:5000/api/books/BOOK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Common Query Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `page` | Page number | `page=2` |
| `limit` | Items per page | `limit=20` |
| `sortBy` | Field to sort | `sortBy=price` |
| `sortOrder` | asc or desc | `sortOrder=desc` |
| `search` | Search query | `search=fiction` |
| `genre` | Filter by genre | `genre=Fiction` |
| `minPrice` | Min price | `minPrice=10` |
| `maxPrice` | Max price | `maxPrice=50` |
| `availableOnly` | Only available | `availableOnly=true` |

---

## 📋 Default Test Data

### Users
- **Admin**: admin@library.com / admin123
- **User**: user@library.com / user123

### Books
1. The Great Gatsby
2. To Kill a Mockingbird
3. 1984
4. Pride and Prejudice
5. The Catcher in the Rye

---

## 🎨 Response Format

### Success
```json
{
  "success": true,
  "data": {...}
}
```

### Error
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

### Paginated
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

---

## 🛠️ Useful Commands

### Pretty Print JSON (requires jq)
```bash
curl http://localhost:5000/api/books | jq
```

### Save Token
```bash
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@library.com","password":"admin123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)
```

### Use Saved Token
```bash
curl http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📖 Documentation URLs

- API Docs: http://localhost:5000/api/docs
- Health Check: http://localhost:5000/health
- Root: http://localhost:5000/

---

## 🔧 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

---

## 📂 Project Structure

```
src/books/
├── models/         # Entities
├── repositories/   # Data access
├── services/       # Business logic
├── controllers/    # HTTP handlers
├── routes/         # API routes
├── middleware/     # Auth, validation, errors
└── utils/          # Helpers
```

---

## 💡 Tips

1. Always include `Authorization: Bearer TOKEN` for protected routes
2. Admin endpoints require admin role
3. Use pagination for large datasets
4. Combine filters for precise queries
5. Check `/api/docs` for full endpoint list

---

**For detailed documentation, see:**
- `README.md` - Full documentation
- `API_TESTING.md` - Testing guide
- `OOP_ARCHITECTURE.md` - Architecture details
