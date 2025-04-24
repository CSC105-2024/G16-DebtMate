# DebtMate Database

## Overview

DebtMate uses PostgreSQL for data storage. The database is automatically initialized when you start the Docker container.

## Database Schema

The schema includes the following tables:

- `users` - User accounts
- `friends` - Friend relationships
- `groups` - Group information
- `group_members` - Members of groups
- `expenses` - Expense records
- `expense_participants` - Who is involved in each expense

## Development vs Production

The database can run in two modes:

- **Development**: Includes seed data for testing (default)
- **Production**: No seed data, clean database

The mode is controlled by the `DB_MODE` environment variable in `.env`:

```
DB_MODE=development  # or 'production'
```

## Seed Data

In development mode, the database is pre-populated with:

- 5 test users (with password 'password')
- Some friend relationships
- A sample group called 'Roommates'
- A sample expense

You can use these accounts for testing:

- testuser@example.com
- john@example.com
- jane@example.com
- bob@example.com
- alice@example.com

Password for all: `password`

## Resetting the Database

If you need to reset the database to its initial state during development:

```bash
# Using the script
./scripts/reset-db.sh

# OR directly with Docker
docker exec -it debtmate-postgres psql -U postgres -d debtmate -c "SELECT reset_database();"
```

## Adding New Tables

To add new tables to the schema:

1. Edit the file `database/init/01-schema.sql`
2. Add your CREATE TABLE statements
3. Run `npm run docker:rebuild` to apply changes

## Database Connection Information

- **Host**: localhost
- **Port**: 5432
- **Username**: postgres
- **Password**: postgres (or what's in your .env file)
- **Database**: debtmate

You can connect using psql or any PostgreSQL client:

```bash
npm run docker:postgres
```
