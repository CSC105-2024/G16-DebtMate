# DebtMate Developer Guide

## Overview

**DebtMate** is a web application designed for tracking shared expenses and debts among friends. The application allows users to create groups, add members, split bills, and manage expenses seamlessly.

---

## Tech Stack

| Layer          | Technologies                 |
| -------------- | ---------------------------- |
| Frontend       | React 19, Tailwind CSS, Vite |
| Backend        | Hono.js, Node.js, TypeScript |
| Database       | SQLite with Prisma ORM       |
| Authentication | JWT with bcrypt              |

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm (v7+)

---

### Setting Up the Project

1. **Clone the repository**

   ```bash
   git clone https://github.com/CSC105-2024/G16-DebtMate.git
   cd G16-DebtMate
   ```

2. **Install dependencies**

   ```bash
   npm run setup
   ```

3. **Configure the backend environment**

   ```bash
   cd backend
   cp .env.example .env
   cd ..
   ```

4. **Default `.env` configuration**

   ```env
    # JWT Configuration
    JWT_SECRET="aec0d8"
    JWT_EXPIRES_IN=7d
    
    # Prisma Database Configuration
    DATABASE_URL="file:../dev.db"
    
    PORT=3000
   ```

5. **Initialize and seed the database (from backend folder)**

   ```bash
   npm run db:setup
   ```

   > This seeds the initial data using:
   >
   > ```json
   > "db:setup": "tsx prisma/setup.ts"
   > ```

6. **Start both frontend and backend concurrently**
    > In Root:
   ```bash
   npm run dev:all
   ```

---

## Running in Development Mode

- Frontend only:

  ```bash
  npm run dev
  # Access at http://localhost:5173
  ```

- Backend only:

  ```bash
  npm run server
  # Access at http://localhost:3000
  ```

- Both:

  ```bash
  npm run dev:all
  ```

---

## Project Structure

### Frontend (`/src`)

- `/components`: Reusable UI components
- `/pages`: Page components (e.g., `GroupList`, `CreateGroup`, `SplitBill`)
- `/context`: React context providers
- `App.jsx`: Main application with routing

### Backend (`/src`)

- `/models`: Data models (user, group, item)
- `/routes`: API endpoints (auth, search, group)
- `/controllers`: Business logic
- `/middleware`: Request processing (auth, CORS)
- `/utils`: Helper functions
- `/config`: Configuration files
- `server.ts`: Application entry point

---

## API Endpoints Documentation (Grouped by CRUD)

### 🟢 **CREATE (POST)**

| Endpoint                        | Description                       | Auth Required |
| ------------------------------- | --------------------------------- | ------------- |
| `/auth/register`                | Register a new user               | No            |
| `/auth/login`                   | Authenticate user and return JWT  | No            |
| `/auth/logout`                  | Logout and clear auth cookie      | No            |
| `/api/users/friends`            | Add a new friend                  | Yes           |
| `/api/groups`                   | Create a new group                | Yes           |
| `/api/groups/:id/members`       | Add a member to a group           | Yes           |
| `/api/groups/:groupId/items`    | Add a new expense item to a group | Yes           |
| `/api/groups/:groupId/payments` | Record a new payment              | Yes           |

---

### 🔵 **READ (GET)**

| Endpoint                        | Description                     | Auth Required |
| ------------------------------- | ------------------------------- | ------------- |
| `/api/me`                       | Check if user is authenticated  | Yes           |
| `/api/users/me`                 | Get current user's profile      | Yes           |
| `/api/users/:userId/friends`    | Get a user's friends list       | Yes           |
| `/api/users/friends/search`     | Search users to add as friends  | Yes           |
| `/api/groups/:id`               | Get group details               | Yes           |
| `/api/users/:userId/groups`     | Get all groups for a user       | Yes           |
| `/api/users/me/groups`          | Get groups for the current user | Yes           |
| `/api/items/:id`                | Get item details                | Yes           |
| `/api/groups/:groupId/items`    | Get all items in a group        | Yes           |
| `/api/groups/:groupId/payments` | Get all payments in a group     | Yes           |

---

### 🟡 **UPDATE (PUT)**

| Endpoint                               | Description            | Auth Required |
| -------------------------------------- | ---------------------- | ------------- |
| `/api/groups/:id`                      | Update group info      | Yes           |
| `/api/items/:id`                       | Update an expense item | Yes           |
| `/api/groups/:id/members/:userId/paid` | Mark a member as paid  | Yes           |

---

### 🔴 **DELETE (DELETE)**

| Endpoint                          | Description                  | Auth Required |
| --------------------------------- | ---------------------------- | ------------- |
| `/api/items/:id`                  | Delete an expense item       | Yes           |
| `/api/groups/:id/members/:userId` | Remove a member from a group | Yes           |

---

## How Authentication Works

- Uses JWT stored in HTTP-only cookie
- `/api/*` endpoints are protected by `authMiddleware`
- Tokens expire in 7 days by default

---

## API Request/Response Flow

1. Client sends request
2. Middleware checks token (if protected)
3. Controller runs the logic
4. Response returned with status + data

---

## Status Codes

- `200` – Success
- `201` – Resource created
- `400` – Bad request
- `401` – Unauthorized
- `403` – Forbidden
- `404` – Not found
- `500` – Server error

---

## Content Types

- All endpoints use JSON
- `Content-Type: application/json`

---

## Key Features

- **User Authentication**: JWT-based auth with secure token storage
- **Friend Management**: Add friends and manage relationships
- **Group Creation**: Create groups and add members
- **Expense Tracking**: Add items/expenses to groups
- **Bill Splitting**: Split bills among group members
- **Responsive Design**: Works on both desktop and mobile devices

---

## Development Workflow

### Authentication

- JWT is used for secure authentication
- Tokens are stored in HTTP-only cookies
- Passwords are hashed using bcrypt
- Auth middleware protects private routes

### Database

- Uses SQLite (file-based) via Prisma ORM
- Prisma handles schema and migrations
- Scripts for database operations:

  - `npm run db:setup`: Migrate and seed database
  - `npm run db:reset`: Reset database and re-apply migrations

---

## API Routes

- `/auth`: User login and signup
- `/users`: User management and profile operations
- `/search`: Friend search
- `/groups`: Group and expense management

---

## Available Scripts

| Script             | Description                                             |
| ------------------ | ------------------------------------------------------- |
| `npm run dev`      | Start frontend development server                       |
| `npm run server`   | Start backend server                                    |
| `npm run dev:all`  | Start both frontend and backend                         |
| `npm run build`    | Build frontend for production                           |
| `npm run lint`     | Check code quality using ESLint                         |
| `npm run preview`  | Preview built frontend                                  |
| `npm run setup`    | Install all dependencies                                |
| `npm run db:setup` | Run migrations and seed database                        |
| `npm run db:reset` | Reset database and re-apply migrations (⚠️ destructive) |

---

## Coding Standards

### Frontend

- Use functional components with React hooks
- Use **PascalCase** for component names (e.g., `FriendCard.jsx`)
- Style with Tailwind CSS
- Document component props for reusability

### Backend

- Follow TypeScript best practices
- Document functions using JSDoc
- Use `async/await` for async code
- Keep controllers focused on business logic
- Delegate data access to models

### General

- Run `npm run lint` before submitting PRs
- Follow consistent error-handling patterns
- Use descriptive variable and function names

---

## Accessing the Application

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000](http://localhost:3000)

---

## Contributing

See `CONTRIBUTING.md` for contribution guidelines and code of conduct.

---

## License

MIT – Free to use and modify.
