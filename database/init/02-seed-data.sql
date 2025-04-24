-- Seed data for development environments
-- This will only run if the DB_MODE environment variable is set to 'development'

-- Check if we're in development mode before inserting seed data
DO $$
BEGIN
    -- Don't insert seed data in production
    IF (SELECT current_setting('application_name', TRUE)) = 'postgres_seed_production' THEN
        RAISE NOTICE 'Skipping seed data in production mode';
        RETURN;
    END IF;

    -- Otherwise insert development seed data
    
    -- Insert test users (password is 'password' for all users)
    -- The passwords are pre-hashed bcrypt strings for 'password'
    INSERT INTO users (name, username, email, password)
    VALUES
        ('Test User', 'testuser', 'test@example.com', '$2b$10$xVrYCvrVRnTWP8mBSgvCEOBLU65Mxg.ZtNz7GZx7m4xPZoxsKQgJy'),
        ('John Doe', 'johndoe', 'john@example.com', '$2b$10$xVrYCvrVRnTWP8mBSgvCEOBLU65Mxg.ZtNz7GZx7m4xPZoxsKQgJy'),
        ('Jane Smith', 'janesmith', 'jane@example.com', '$2b$10$xVrYCvrVRnTWP8mBSgvCEOBLU65Mxg.ZtNz7GZx7m4xPZoxsKQgJy'),
        ('Bob Johnson', 'bobjohnson', 'bob@example.com', '$2b$10$xVrYCvrVRnTWP8mBSgvCEOBLU65Mxg.ZtNz7GZx7m4xPZoxsKQgJy'),
        ('Alice Brown', 'alicebrown', 'alice@example.com', '$2b$10$xVrYCvrVRnTWP8mBSgvCEOBLU65Mxg.ZtNz7GZx7m4xPZoxsKQgJy')
    ON CONFLICT (username) DO NOTHING;

    -- Create friend relationships
    INSERT INTO friends (user_id, friend_id, status)
    SELECT 1, 2, 'accepted' WHERE NOT EXISTS (SELECT 1 FROM friends WHERE user_id = 1 AND friend_id = 2);
    
    INSERT INTO friends (user_id, friend_id, status)
    SELECT 2, 1, 'accepted' WHERE NOT EXISTS (SELECT 1 FROM friends WHERE user_id = 2 AND friend_id = 1);
    
    INSERT INTO friends (user_id, friend_id, status)
    SELECT 1, 3, 'accepted' WHERE NOT EXISTS (SELECT 1 FROM friends WHERE user_id = 1 AND friend_id = 3);
    
    INSERT INTO friends (user_id, friend_id, status)
    SELECT 3, 1, 'accepted' WHERE NOT EXISTS (SELECT 1 FROM friends WHERE user_id = 3 AND friend_id = 1);
    
    INSERT INTO friends (user_id, friend_id, status)
    SELECT 1, 4, 'pending' WHERE NOT EXISTS (SELECT 1 FROM friends WHERE user_id = 1 AND friend_id = 4);
    
    -- Create a group
    INSERT INTO groups (name, description, created_by)
    SELECT 'Roommates', 'Expenses for the apartment', 1
    WHERE NOT EXISTS (SELECT 1 FROM groups WHERE name = 'Roommates' AND created_by = 1);
    
    -- Add members to the group
    INSERT INTO group_members (group_id, user_id, role)
    SELECT g.id, 1, 'admin' 
    FROM groups g 
    WHERE g.name = 'Roommates' AND g.created_by = 1
    AND NOT EXISTS (SELECT 1 FROM group_members WHERE group_id = g.id AND user_id = 1);
    
    INSERT INTO group_members (group_id, user_id, role)
    SELECT g.id, 2, 'member' 
    FROM groups g 
    WHERE g.name = 'Roommates' AND g.created_by = 1
    AND NOT EXISTS (SELECT 1 FROM group_members WHERE group_id = g.id AND user_id = 2);
    
    INSERT INTO group_members (group_id, user_id, role)
    SELECT g.id, 3, 'member' 
    FROM groups g 
    WHERE g.name = 'Roommates' AND g.created_by = 1
    AND NOT EXISTS (SELECT 1 FROM group_members WHERE group_id = g.id AND user_id = 3);
    
    -- Create an expense
    INSERT INTO expenses (title, amount, description, created_by, group_id)
    SELECT 'Groceries', 85.50, 'Weekly grocery shopping', 1, g.id
    FROM groups g
    WHERE g.name = 'Roommates' AND g.created_by = 1
    AND NOT EXISTS (
        SELECT 1 FROM expenses 
        WHERE title = 'Groceries' AND created_by = 1 AND group_id = g.id
    );
    
    -- Add expense participants
    INSERT INTO expense_participants (expense_id, user_id, share_amount, is_payer, status)
    SELECT e.id, 1, 30.00, TRUE, 'paid'
    FROM expenses e
    JOIN groups g ON e.group_id = g.id
    WHERE e.title = 'Groceries' AND g.name = 'Roommates'
    AND NOT EXISTS (
        SELECT 1 FROM expense_participants
        WHERE expense_id = e.id AND user_id = 1
    );
    
    INSERT INTO expense_participants (expense_id, user_id, share_amount, is_payer, status)
    SELECT e.id, 2, 27.75, FALSE, 'pending'
    FROM expenses e
    JOIN groups g ON e.group_id = g.id
    WHERE e.title = 'Groceries' AND g.name = 'Roommates'
    AND NOT EXISTS (
        SELECT 1 FROM expense_participants
        WHERE expense_id = e.id AND user_id = 2
    );
    
    INSERT INTO expense_participants (expense_id, user_id, share_amount, is_payer, status)
    SELECT e.id, 3, 27.75, FALSE, 'pending'
    FROM expenses e
    JOIN groups g ON e.group_id = g.id
    WHERE e.title = 'Groceries' AND g.name = 'Roommates'
    AND NOT EXISTS (
        SELECT 1 FROM expense_participants
        WHERE expense_id = e.id AND user_id = 3
    );

    RAISE NOTICE 'Development seed data has been inserted';
END;
$$;