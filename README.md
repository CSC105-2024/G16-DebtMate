# DebtMate Developer Guide

## Main Branch Documentation

This document provides comprehensive technical details for developers working with the DebtMate main branch codebase.

## Codebase Overview

DebtMate is a web application designed for tracking shared expenses and debts between friends. The main branch implements a simple in-memory data store without any database dependencies for ease of development.

## Project Architecture

### Tech Stack

| Layer             | Technologies                              |
|-------------------|-------------------------------------------|
| **Frontend**      | React 19, Tailwind CSS, Vite              |
| **Backend**       | Hono.js, Node.js                          |
| **Data Storage**  | In-memory JavaScript objects              |
| **Authentication**| JWT with bcrypt                           |

### Core Design Principles

- **Simplicity**: In-memory data storage enables easy setup and development
- **Modern React**: Leverages React 19 features and hooks for efficient UI development
- **Component-Based UI**: Implements reusable UI components with Tailwind styling

## Development Setup

### Prerequisites

1. **Node.js** (v16+) and **npm** (v7+)

### Quick Start

1. Clone the repository
   ```bash
   git clone https://github.com/CSC105-2024/G16-DebtMate.git
   cd G16-DebtMate
   ```

2. Start development servers (frontend and backend concurrently) while installing all packages and dependencies:
   ```bash
   npm run dev:all
   ```

## Codebase Structure

### Frontend Structure (`/src`)

- `/Component`: Reusable UI components
- `/pages`: Page-level components
- `/context`: React context providers
- `App.jsx`: Main application component and routing

### Backend Structure (`/backend/src`)

- `/models`: Data access layer with in-memory storage
- `/routes`: API route definitions
- `/controllers`: Business logic for API endpoints
- `/middleware`: Request processing functions
- `/utils`: Shared utility functions
- `/config`: Configuration modules
- `server.ts`: Application entry point

## Key Development Workflows

### Running the Application

- `npm run dev`: Starts the frontend Vite server
- `npm run server`: Starts the backend Hono server
- `npm run dev:all`: Sets up and starts both servers concurrently

### Authentication

The authentication system implements:
- JWT for secure token-based authentication
- bcrypt for password hashing
- HTTP-only cookies for secure token storage

### Form Handling

The frontend utilizes:
- react-hook-form for form state management
- zod for schema validation

### Styling

The project implements Tailwind CSS for styling with:
- Custom components built on Tailwind primitives
- Responsive design patterns
- Iconography from Lucide React and Iconify

### Available Scripts (Run from root)

- `npm run build`: Build the frontend for production
- `npm run lint`: Run ESLint to check code quality
- `npm run preview`: Preview the built frontend
- `npm run setup`: Install all dependencies
- `npm run server`: Start Hono server

---

# ⚠️ **WARNING** ⚠️

**The features described below are only available in the Docker/PostgreSQL branch and are still in testing. They are NOT ready for release and should not be used in production environments. The main branch does not include these features. Please proceed with caution and only use for testing and development purposes.**

# DebtMate (PostgreSQL Version)

## 🚀 Overview

DebtMate enables users to:

- 💰 Track debts and expenses between individuals
- 👥 Create and manage groups for shared expenses
- ✅ Maintain clear records of financial obligations without complications

## 🛠 Getting Started

### 📌 Prerequisites

Before beginning development, ensure you have the following installed:

1. **Node.js & npm** - [Download here](https://nodejs.org/)
2. **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
   - Required for PostgreSQL mode (optional for memory mode)
   - Ensure Docker service is running before using PostgreSQL mode

---

## 📂 Database Modes

DebtMate supports two distinct database modes:

| Mode                | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| **Memory Mode**     | In-memory database for quick development (no Docker required)    |
| **PostgreSQL Mode** | Persistent database for full-featured development and production |

#### 🏗 Configuring Database Mode

Set the database mode in `/backend/.env`:

```bash
DB_MODE=memory # Options: memory, postgres
```

The mode is also controlled by which startup script you execute (see below).

---

## 🚀 Quick Start Options

### 🔹 Memory Mode (No Docker Required)

For rapid development without PostgreSQL configuration:

```bash
# Clone the repository
git clone https://github.com/CSC105-2024/G16-DebtMate.git
cd G16-DebtMate

# Copy example environment file
cd backend
cp .env.example .env  # DB_MODE=memory is default
cd ..

# Start the app with in-memory database
npm run dev:memory
```

### 🔹 PostgreSQL Mode (With Docker)

For development with persistent data storage:

```bash
# Clone the repository
git clone https://github.com/CSC105-2024/G16-DebtMate.git
cd G16-DebtMate

# Copy example environment file
cd backend
cp .env.example .env
# Edit .env to set DB_MODE=postgres if desired (optional - script handles it)
cd ..

# Start with PostgreSQL database
npm run dev:postgres
```

---

## ⚙️ Technical Implementation Details

### 🛑 Memory Mode (`npm run dev:memory`)

- Implements an in-memory database that resets when the server restarts
- No PostgreSQL or Docker requirements
- Provides faster startup and simpler configuration
- **Data is lost when the server restarts**

### ✅ PostgreSQL Mode (`npm run dev:postgres`)

- Launches a PostgreSQL container in Docker (port 5433)
- Configures database with:
  - **Username:** `admin`
  - **Password:** `admin`
- Executes database initialization scripts from `init`
- **Data persists between server restarts**
- Launches **React frontend** (Vite) at [`http://localhost:5173`](http://localhost:5173)
- Launches **Hono backend** at [`http://localhost:3000`](http://localhost:3000)

---

## 🔨 Manual Setup

For developers preferring granular control over the setup process:

```bash
# Clone the repository
git clone https://github.com/CSC105-2024/G16-DebtMate.git
cd G16-DebtMate

# Set up environment file
cd backend
cp .env.example .env
# Edit .env to set DB_MODE=memory or DB_MODE=postgres
cd ..

# Install dependencies for frontend and backend
npm run setup

# For PostgreSQL Mode only:
npm run docker:up  # Start PostgreSQL container

# In two separate terminals:
npm run dev      # Frontend (terminal 1)
npm run server   # Backend (terminal 2)
```

---

## ⚙️ Environment Configuration

The backend requires environment variables for proper operation. These are stored in `.env`:

```bash
# Create the .env file
cd backend
cp .env.example .env
```

#### 🔑 Default Configuration Values in `.env.example`:

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

**Production Security Recommendations:**

- 🔐 Replace the `JWT_SECRET` with a strong, unique random string
- 🔄 Configure `DB_MODE=postgres` for persistent data storage
- 🔎 Update database credentials according to security requirements

---

## 🐳 Docker Command Reference

Docker manages the PostgreSQL database (required only for PostgreSQL mode):

```bash
# Start Docker containers
npm run docker:up

# Stop Docker containers
npm run docker:down

# Rebuild database (CAUTION: WILL DELETE ALL DATA!)
npm run docker:rebuild

# Complete reset (removes all volumes, images, and containers)
npm run docker:reset

# View Docker logs
npm run docker:logs

# Connect to PostgreSQL CLI
npm run docker:postgres

# List database tables
npm run docker:list-tables

# List all users in the database
npm run docker:list-users
```

---

## 🌐 Application Access

When all services are running:

| Service                                 | URL                                              |
| --------------------------------------- | ------------------------------------------------ |
| **Frontend**                            | [`http://localhost:5173`](http://localhost:5173) |
| **Backend API**                         | [`http://localhost:3000`](http://localhost:3000) |
| **PostgreSQL (if using postgres mode)** | `localhost:5433`                                 |

**PostgreSQL Database Connection Details:**

- **User**: `admin`
- **Password**: `admin`

---

## 🏗 Technical Stack Specifications

| Component          | Technologies                              |
| ------------------ | ----------------------------------------- |
| **Frontend**       | React 19, Tailwind, Vite                  |
| **Backend**        | Hono (Express-like), PostgreSQL/In-memory |
| **Infrastructure** | Docker, Docker Compose                    |
| **Tooling**        | ESLint, Concurrently, Cross-env           |

---

## 📦 Database Implementation Details

DebtMate supports two database implementations:

### 🛑 In-Memory Database:

✔ Implements simple JavaScript objects that reset on server restart  
✔ Requires no setup, ideal for rapid development  
❌ **Data persistence is not maintained when the server restarts**

### ✅ PostgreSQL Database:

✔ Provides persistent data storage  
✔ Supports user accounts and authentication  
✔ Enables groups and members management  
✔ Facilitates expenses and debts tracking  
✔ Maintains comprehensive transaction history

The PostgreSQL database is automatically initialized when using Docker through SQL scripts in the `init` folder.

For direct database access:

```bash
# Connect to PostgreSQL when using Docker
npm run docker:postgres

# Alternative: Use your preferred PostgreSQL client with:
# Host: localhost
# Port: 5433
# User: admin
# Password: admin
# Database: debtmate
```

---

## 📂 Project Directory Structure

```bash
/
├── src/                  # Frontend code
│   ├── Component/        # Reusable components
│   ├── pages/            # Page components
│   └── App.jsx           # Main app component
│
├── backend/              # Backend API
│   ├── src/
│   │   ├── models/       # Data models
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Business logic
│   │   ├── middleware/   # Request middleware
│   │   ├── utils/        # Utility functions
│   │   ├── config/       # Configuration files
│   │   └── server.ts     # Entry point
│   ├── .env              # Backend config (must be created)
│   └── .env.example      # Example environment variables
│
├── database/             # Database setup
│   └── init/             # Initialization SQL scripts
│
├── package.json          # Project dependencies and scripts
└── docker-compose.yml    # Docker configuration
```

---

## ✅ Development Roadmap

- [x] Replace in-memory user store with PostgreSQL database
- [x] Add Docker setup for easy development
- [x] Add JWT authentication
- [x] Support both in-memory and PostgreSQL modes
- [ ] Implement group creation functionality
- [ ] Add comprehensive expense tracking features

---

## 🤝 Contributing

Contributions welcome - just make it work! ¯\\\_(ツ)\_/¯

---

## 📜 License

MIT - Free to use and modify
