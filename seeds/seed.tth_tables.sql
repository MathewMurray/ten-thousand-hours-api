BEGIN;

TRUNCATE
    user_logs,
    user_goals,
    tth_users
    RESTART IDENTITY CASCADE;

INSERT INTO tth_users (user_name,full_name,password)
VALUES
('admin','Admin user','YWRtaW46MTI2MjUx'),
('testuser','Test User','$2a$10$FFFr2BfMG/4bovwGg/9J.OGhrUyCjiFCzQDAFPS2bmxXaUnJKrmNK'
);

INSERT INTO user_goals (title,target,user_id)
VALUES 
('Build this capstone',80,1),
('learn react',10000,2),
('learn french',7200,2);

INSERT INTO user_logs (
    text,
    goal_id,
    user_hours,
    user_id
)
VALUES(
    'started ground work for api',1,8,1
),
(
    'started french class',3,3,2
),
(
    'completed react module via thinkful',2,120,2
);

COMMIT;