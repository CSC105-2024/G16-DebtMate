# DebtMate Backend

## Database Modes

This backend supports two database modes:

- **memory**: In-memory database for development (no PostgreSQL needed)
- **postgres**: PostgreSQL database for production and testing

## Quick Start

### Development Mode (No Docker Required)

For quick development without Docker:

```bash
# In root directory
npm run dev:memory
```

This runs the app with an in-memory database that doesn't require any setup.

### PostgreSQL Mode (With Docker)

For development with real PostgreSQL:

```bash
# In root directory
npm run dev:postgres
```

This:

1. Starts a PostgreSQL container using Docker
2. Runs the app connected to PostgreSQL
3. Persists data between restarts

## Configuration

Database mode is controlled by the `DB_MODE` environment variable in `.env`:

```
DB_MODE=memory  # Options: memory, postgres
```

## Docker Commands

```bash
# Start Docker containers in background
npm run docker:up

# Stop Docker containers
npm run docker:down

# View Docker logs
npm run docker:logs

# Rebuild database (CAUTION: Deletes all data)
npm run docker:rebuild

# Connect to PostgreSQL CLI
npm run docker:postgres
```

## Database Structure

The PostgreSQL database is initialized with:

- users - User accounts
- friends - Friend relationships
- groups - Group information
- group_members - Members of groups

Additional tables can be added by editing the initialization script at:
`database/init/01-schema.sql`
