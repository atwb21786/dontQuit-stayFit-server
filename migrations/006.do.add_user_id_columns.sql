ALTER TABLE goals
    ADD COLUMN
        user_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1;

ALTER TABLE goals 
    ALTER COLUMN
        user_id DROP DEFAULT;
        
ALTER TABLE weigh_in
    ADD COLUMN
        user_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1;

ALTER TABLE weigh_in
    ALTER COLUMN
        user_id DROP DEFAULT;

ALTER TABLE fitness
    ADD COLUMN
        user_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1;

ALTER TABLE fitness
    ALTER COLUMN
        user_id DROP DEFAULT;

ALTER TABLE feedback
    ADD COLUMN
        user_id INTEGER REFERENCES users(id) NOT NULL DEFAULT 1;

ALTER TABLE feedback
    ALTER COLUMN
        user_id DROP DEFAULT;