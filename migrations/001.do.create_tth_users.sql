CREATE TABLE tth_users (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    user_name TEXT NOT NULL,
    password text NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL,
    date_modified TIMESTAMPTZ
);
