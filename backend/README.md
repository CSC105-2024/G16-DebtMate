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

---

## Database Architecture

### Dual Database Implementation

DebtMate supports two database modes through a unified interface:

| Mode                | Description                                        |
| ------------------- | -------------------------------------------------- |
| **Memory Mode**     | In-memory JavaScript objects for quick development |
| **PostgreSQL Mode** | Persistent database for production environments    |

Both implementations expose the same interface through the `Database` type defined in `db.config.ts`:

```typescript
interface Database {
  query: (text: string, params?: any[]) => Promise<any>;
  connect: () => Promise<any>;
}
```

---

## Models Layer

Each model file contains dual implementations (in-memory and PostgreSQL) and selects the appropriate one based on the `DB_MODE` environment variable. This encapsulation allows the rest of the application to interact with a consistent interface regardless of the storage mode.

For example, `UserModel` in `user.ts` provides methods for:

- User creation with password hashing
- User authentication
- User search functionality
- Profile management

The implementation looks like this:

```typescript
// Define both implementations
const pgUserModel = {
  /* PostgreSQL-specific implementations */
};
const memoryUserModel = {
  /* In-memory implementations */
};
const commonUserModel = {
  /* Shared functionality */
};

// Export the appropriate implementation based on DB_MODE
const UserModel =
  DB_MODE === "postgres"
    ? { ...pgUserModel, ...commonUserModel }
    : { ...memoryUserModel, ...commonUserModel };
```

---

## Database Schema

When using PostgreSQL mode, the database includes the following tables:

| Table             | Description                                          |
| ----------------- | ---------------------------------------------------- |
| **users**         | Stores user accounts with authentication information |
| **friends**       | Manages friend relationships between users           |
| **groups**        | Stores group information for shared expenses         |
| **group_members** | Tracks members associated with groups                |

---

## Authentication System

DebtMate uses **JWT (JSON Web Tokens)** for authentication:

- **Token Generation**: `jwt.ts` creates tokens on login/signup
- **Token Storage**: HTTP-only cookies for secure client storage
- **Middleware Protection**: `auth.middleware.ts` verifies tokens
- **Routes Protection**: Protected routes require valid authentication

---

## API Endpoints

The API provides the following primary endpoints:

| Endpoint            | Description                                     |
| ------------------- | ----------------------------------------------- |
| `/api/signup`       | Create a new user account                       |
| `/api/login`        | Authenticate a user and get session token       |
| `/api/me`           | Verify authentication and get current user info |
| `/api/search/users` | Search for users to add as friends              |

---

## Custom Middleware

DebtMate includes middleware for request processing:

- **CORS**: Enables cross-origin requests from the frontend
- **Authentication**: Verifies user identity for protected routes

---

## Environment Configuration

The backend loads configuration from environment variables stored in `.env`:

```bash
# Database Configuration
DB_USER=admin
DB_PASSWORD=admin
DB_HOST=localhost
DB_PORT=5433
DB_NAME=debtmate
DB_MODE=memory  # Options: memory, postgres

# JWT Configuration
JWT_SECRET=21541661356
JWT_EXPIRES_IN=7d
```

### Production Recommendations:

- **Change** `JWT_SECRET` to a strong random string
- **Set** `DB_MODE=postgres` for persistent data
- **Update** database credentials as needed

---

## Development Workflow

DebtMate follows a structured development workflow:

1. **Models** define all database operations with dual implementations.
2. **Controllers** implement business logic using the models.
3. **Routes** connect HTTP endpoints to controllers.
4. **Server** ties everything together and applies middleware.

This layered architecture ensures modularity and scalability while keeping concerns separated.
