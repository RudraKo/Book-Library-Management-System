import { BookApp } from './src/books/BookApp';

/**
 * Main Server Entry Point
 * Initializes and starts the Book Library Management System
 */

// Get port from environment variable or use default
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

// Create and start the application
const app = new BookApp(PORT);
app.start();

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    process.exit(0);
});
