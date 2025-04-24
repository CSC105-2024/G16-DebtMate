-- Database initialization settings

-- Set application name to help identify environment
-- This will be used to determine whether to load seed data
SELECT CASE 
    WHEN current_database() = 'postgres' THEN 'postgres_seed_production'
    ELSE 'postgres_seed_development'
END AS app_name \gset

SET application_name TO :'app_name';

-- Create stored procedures that make it easier to manage the database
CREATE OR REPLACE FUNCTION truncate_tables(username IN VARCHAR) RETURNS void AS $$
DECLARE
    statements CURSOR FOR
        SELECT tablename FROM pg_tables
        WHERE tableowner = username AND schemaname = 'public';
BEGIN
    FOR stmt IN statements LOOP
        EXECUTE 'TRUNCATE TABLE ' || quote_ident(stmt.tablename) || ' CASCADE;';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to reset the database (for development purposes)
CREATE OR REPLACE FUNCTION reset_database() RETURNS void AS $$
BEGIN
    PERFORM truncate_tables('postgres');
END;
$$ LANGUAGE plpgsql;