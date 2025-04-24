# DebtMate Backend

## Architecture Overview

The DebtMate backend is built with Hono.js and follows a modular architecture:

- **Server**: Entry point that initializes the application (`server.ts`)
- **Models**: Data access layer with abstraction for both database modes (`models/`)
- **Controllers**: Business logic for processing requests (`controllers/`)
- **Routes**: API endpoint definitions (`routes/`)
- **Middleware**: Request processing functionality (`middleware/`)
- **Utils**: Shared utility functions (`utils/`)
- **Config**: Application configuration (`config/`)

## Database Architecture

### Dual Database Implementation

The backend supports two database modes through a unified interface:

- **Memory Mode**: In-memory JavaScript objects for quick development
- **PostgreSQL Mode**: Persistent database for production environments

Both implementations expose the same interface through the `Database` type defined in `db.config.ts`:

```typescript
interface Database {
  query: (text: string, params?: any[]) => Promise<any>;
  connect: () => Promise<any>;
}
```

### Models Layer

All database operations go through model files that automatically switch between implementations based on the `DB_MODE` environment variable. For example, `UserModel` in `user.ts` provides methods for:

- User creation with password hashing
- User authentication
- User search functionality
- Profile management

### Database Schema

When using PostgreSQL mode, the database includes the following tables:

- **users**: User accounts with authentication information
- **friends**: Friend relationships between users
- **groups**: Group information for shared expenses
- **group_members**: Members associated with groups

## Authentication System

Authentication is handled through JWT (JSON Web Tokens):

- **Token Generation**: `jwt.ts` creates tokens on login/signup
- **Token Storage**: HTTP-only cookies for secure client storage
- **Middleware Protection**: `auth.middleware.ts` verifies tokens
- **Routes Protection**: Protected routes require valid authentication

## API Endpoints

The API provides the following primary endpoints:

- `/api/signup`: Create a new user account
- `/api/login`: Authenticate a user and get session token
- `/api/me`: Verify authentication and get current user info
- `/api/search/users`: Search for users to add as friends

## Custom Middleware

- **CORS**: Enables cross-origin requests from the frontend
- **Authentication**: Verifies user identity for protected routes

## Environment Configuration

The backend loads configuration from environment variables in `.env`:

- **Database Settings**: Control database connection parameters
- **JWT Settings**: Configure token generation and validation
- **Mode Selection**: Switch between memory and PostgreSQL modes

## Development Workflow

When developing the backend:

1. **Models** define all database operations with dual implementations.
2. **Controllers** implement business logic using the models.
3. **Routes** connect HTTP endpoints to controllers.
4. **Server** ties everything together and applies middleware.

This layered architecture makes it easy to extend functionality while maintaining separation of concerns.
