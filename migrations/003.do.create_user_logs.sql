CREATE TABLE user_logs (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    user_hours INTEGER NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    goal_id INTEGER
        REFERENCES user_goals(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER
        REFERENCES tth_users(id) ON DELETE CASCADE NOT NULL
)