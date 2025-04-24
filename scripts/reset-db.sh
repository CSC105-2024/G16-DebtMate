#!/bin/bash

# This script resets the database to its initial state
# It's useful during development when you need to start fresh

echo "⚠️  WARNING: This will delete ALL data in the database!"
echo "Are you sure you want to proceed? (y/n)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
  echo "Resetting database..."
  docker exec -it debtmate-postgres psql -U postgres -d debtmate -c "SELECT reset_database();"
  echo "Database has been reset!"
else
  echo "Operation cancelled."
fi