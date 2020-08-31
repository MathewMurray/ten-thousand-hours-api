CREATE TABLE user_goals (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    target INTEGER,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    date_modified TIMESTAMPTZ,
    user_id INTEGER
        REFERENCES tth_users(id) ON DELETE CASCADE NOT NULL

);
