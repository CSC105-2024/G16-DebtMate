# ⚠️ WARNING ⚠️

**The features described below are only available in the Docker/PostgreSQL branch and are still in testing. They are NOT ready for release and should not be used in production environments. The main branch does not include these features. Please proceed with caution and only use for testing and development purposes.**

# DebtMate 💸

## 🚀 What's This?

DebtMate helps you:

- 💰 Track who owes what
- 👥 Create groups
- ✅ Keep tabs without the drama

## 🛠 Getting Started

### 📌 Prerequisites

Before starting, make sure you have the following installed:

1. **Node.js & npm** - [Download here](https://nodejs.org/)
2. **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
   - Required for PostgreSQL mode (optional for memory mode)
   - Make sure Docker service is running before using PostgreSQL mode

---

## 📂 Database Modes

DebtMate supports two database modes:

| Mode                | Description                                                      |
| ------------------- | ---------------------------------------------------------------- |
| **Memory Mode**     | In-memory database for quick development (no Docker required)    |
| **PostgreSQL Mode** | Persistent database for full-featured development and production |

#### 🏗 Choosing a Mode

Set the database mode in `/backend/.env`:

```bash
DB_MODE=memory # Options: memory, postgres
```

The mode is also controlled by which startup script you use (see below).

---

## 🚀 Quick Start Options

### 🔹 Memory Mode (No Docker Required)

For quick development without setting up PostgreSQL:

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
# Edit .env to set DB_MODE=postgres if you want (optional - script handles it)
cd ..

# Start with PostgreSQL database
npm run dev:postgres
```

---

## ⚙️ What's Happening Under the Hood?

### 🛑 Memory Mode (`npm run dev:memory`)

- Uses an in-memory database that resets when the server restarts
- No PostgreSQL or Docker required
- Faster startup, simpler configuration
- **Data is lost when the server restarts**

### ✅ PostgreSQL Mode (`npm run dev:postgres`)

- Starts a PostgreSQL container in Docker (port 5433)
- Sets up database with:
  - **Username:** `admin`
  - **Password:** `admin`
- Runs database initialization scripts from `init`
- **Data persists between restarts**
- Starts **React frontend** (Vite) at [`http://localhost:5173`](http://localhost:5173)
- Starts **Hono backend** at [`http://localhost:3000`](http://localhost:3000)

---

## 🔨 Manual Setup

If you prefer more control over the setup process:

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

## ⚙️ Environment Setup

The backend needs environment variables to work. These are stored in `.env`:

```bash
# Make sure you've created the .env file
cd backend
cp .env.example .env
```

#### 🔑 Default values in `.env.example`:

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

**Production Recommendations:**

- 🔐 Change the `JWT_SECRET` to a strong random string
- 🔄 Set `DB_MODE=postgres` for persistent data
- 🔎 Update database credentials as needed

---

## 🐳 Docker Commands

Docker manages the PostgreSQL database (only needed for PostgreSQL mode):

```bash
# Start Docker containers
npm run docker:up

# Stop Docker containers
npm run docker:down

# Rebuild database (WILL DELETE ALL DATA!)
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

## 🌐 Accessing the App

When everything is running:

| Service                                 | URL                                              |
| --------------------------------------- | ------------------------------------------------ |
| **Frontend**                            | [`http://localhost:5173`](http://localhost:5173) |
| **Backend API**                         | [`http://localhost:3000`](http://localhost:3000) |
| **PostgreSQL (if using postgres mode)** | `localhost:5433`                                 |

**Database Credentials:**

- **User**: `admin`
- **Password**: `admin`

---

## 🏗 Tech Stack

| Component          | Tech Used                                 |
| ------------------ | ----------------------------------------- |
| **Frontend**       | React 19, Tailwind, Vite                  |
| **Backend**        | Hono (Express-like), PostgreSQL/In-memory |
| **Infrastructure** | Docker, Docker Compose                    |
| **Tooling**        | ESLint, Concurrently, Cross-env           |

---

## 📦 Database Info

DebtMate supports two database implementations:

### 🛑 In-Memory Database:

✔ Simple JavaScript objects that reset on server restart  
✔ No setup required, great for quick development  
❌ **Data is lost when the server restarts**

### ✅ PostgreSQL Database:

✔ Persistent data storage  
✔ User accounts and authentication  
✔ Groups and members  
✔ Expenses and debts tracking  
✔ Transaction history

The PostgreSQL database is automatically initialized when using Docker through SQL scripts in the `init` folder.

If you need to connect directly:

```bash
# Connect to PostgreSQL when using Docker
npm run docker:postgres

# Or use your favorite PostgreSQL client:
# Host: localhost
# Port: 5433
# User: admin
# Password: admin
# Database: debtmate
```

---

## 📂 Folder Structure

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

## ✅ Todo List

- [x] Replace in-memory user store with PostgreSQL database
- [x] Add Docker setup for easy development
- [x] Add JWT auth
- [x] Support both in-memory and PostgreSQL modes
- [ ] Implement group creation
- [ ] Add expense features

---

## 🤝 Contributing

Just make it work ¯\\\_(ツ)\_/¯

---

## 📜 License

MIT - Do whatever
