# DebtMate 💸

## what's this?

DebtMate helps you:

- Track who owes what
- Create groups
- Keep tabs without the drama

## getting started

### prerequisites

Before starting, make sure you have the following installed:

1. **Node.js & npm** - [Download here](https://nodejs.org/)
2. **Docker Desktop** - [Download here](https://www.docker.com/products/docker-desktop/)
   - Required for running PostgreSQL database
   - Make sure Docker service is running before you start

### one-command setup (easiest way)

Just want to get up and running? After installing the prerequisites:

```bash
# clone it
git clone https://github.com/CSC105-2024/G16-DebtMate.git
cd G16-DebtMate

# copy example environment file manually (one-time setup)
cd backend
cp .env.example .env
cd ..

# run everything with just one command
npm start
```

The `npm start` command:

1. Starts Docker container with PostgreSQL
2. Installs all dependencies (frontend + backend)
3. Launches both frontend and backend concurrently

### what's happening under the hood

When using `npm start`, DebtMate:

- Launches PostgreSQL in Docker at localhost:5432
- Sets up database with username `postgres` and password `debtmate`
- Runs database initialization scripts
- Starts React frontend (Vite) at http://localhost:5173
- Starts Hono backend at http://localhost:3000

### manual setup (if you prefer more control)

```bash
# clone it
git clone https://github.com/CSC105-2024/G16-DebtMate.git
cd G16-DebtMate

# set up environment file
cd backend
cp .env.example .env
cd ..

# install dependencies for frontend and backend
npm run setup

# start the database with Docker
npm run docker:up

# in two separate terminals:
npm run dev      # frontend (terminal 1)
npm run server   # backend (terminal 2)
```

### environment setup

The backend needs environment variables to work. These are stored in `/backend/.env`:

```bash
# Make sure you've created the .env file
cd backend
cp .env.example .env
```

The default values in `.env.example` are:

```
DB_USER=postgres
DB_PASSWORD=debtmate
DB_HOST=localhost
DB_PORT=5432
DB_NAME=debtmate
JWT_SECRET=21541661356
JWT_EXPIRES_IN=7d
```

For development, these defaults work fine. For production:

- Change the `JWT_SECRET` to a strong random string
- Update database credentials as needed

### docker commands

Docker manages the PostgreSQL database. Here are useful commands:

```bash
# Start Docker containers
npm run docker:up

# Stop Docker containers
npm run docker:down

# Rebuild database (WILL DELETE ALL DATA!)
npm run docker:rebuild

# Just restart the database
npm run docker:restart

# View Docker logs
npm run docker:logs
```

## accessing the app

When everything is running:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432 (username: `postgres`, password: `debtmate`)

## tech stack

- **frontend**: react 19, tailwind, vite
- **backend**: hono (express-like), PostgreSQL
- **infrastructure**: Docker, Docker Compose
- **tooling**: eslint, concurrently

## database info

We're using PostgreSQL for data persistence:

- User accounts and authentication
- Groups and members
- Expenses and debts tracking
- Transaction history

The database is automatically initialized when using Docker through SQL scripts in the `database/init` folder.

If you need to connect directly:

```bash
# Connect to PostgreSQL when using Docker
docker exec -it debtmate-postgres psql -U postgres -d debtmate

# Or use your favorite PostgreSQL client:
# Host: localhost
# Port: 5432
# User: postgres
# Password: debtmate
# Database: debtmate
```

## folder structure

```
/
├── src/                  # frontend code
│   ├── Component/        # reusable components
│   ├── pages/            # page components
│   └── App.jsx           # main app component
│
├── backend/              # backend api
│   ├── src/
│   │   ├── models/       # data models
│   │   ├── routes/       # api routes
│   │   ├── controllers/  # business logic
│   │   ├── middleware/   # request middleware
│   │   ├── utils/        # utility functions
│   │   ├── config/       # configuration files
│   │   └── server.ts     # entry point
│   ├── .env              # backend config (must be created)
│   └── .env.example      # example environment variables
│
├── database/             # database setup
│   └── init/             # initialization SQL scripts
│
├── package.json          # project dependencies and scripts
└── docker-compose.yml    # docker configuration
```

## todo list

- [x] replace in-memory user store with PostgreSQL database
- [x] add Docker setup for easy development
- [x] add JWT auth
- [ ] implement group creation
- [ ] add expense features

## contributing

just make it work ¯\_(ツ)\_/¯

## license

mit, do whatever
