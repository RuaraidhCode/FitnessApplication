CREATE TABLE register_user (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(50) UNIQUE NOT NULL,
  hashed_password VARCHAR(100) NOT NULL
);


CREATE TABLE users (
  user_id INTEGER REFERENCES register_user(user_id),
  username VARCHAR(50) NOT NULL,
  pass_word VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  age INT,
  gender VARCHAR(10),
  height VARCHAR(20),
  weight VARCHAR(20),
  picture BYTEA
);



CREATE OR REPLACE FUNCTION update_users_table()
RETURNS TRIGGER AS
$$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO users (user_id, username, pass_word, email)
    VALUES (NEW.user_id, NEW.username, NEW.hashed_password, NEW.email);
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;


CREATE TRIGGER update_users_trigger
AFTER INSERT ON register_user
FOR EACH ROW
EXECUTE FUNCTION update_users_table();


CREATE TABLE workout_history (
  workout_history_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES register_user(user_id),
  workout_date DATE NOT NULL,
  duration VARCHAR(20)
);

CREATE TABLE workout_history_details (
  workout_history_id INT REFERENCES workout_history(workout_history_id),
  exercise_name VARCHAR(100) NOT NULL,
  sets_and_reps JSONB
);











CREATE TABLE goals (
goal_id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES register_user(user_id),
goal_category VARCHAR(50),
goal_description VARCHAR(100) NOT NULL,
goals_start_date DATE,
goals_target_date DATE,
goal_status VARCHAR(20) CHECK (goal_status IN ('In Progress', 'Completed'))
); 


CREATE TABLE exercises (
  exercise_id SERIAL PRIMARY KEY,
  exercise_name VARCHAR(50) NOT NULL,
  body_part VARCHAR(50) NOT NULL,
  equipment VARCHAR(50) NOT NULL
);



COPY exercises (exercise_name, body_part, equipment)
FROM '/Users/ruaraidhmaclennan/Desktop/react_native_jobs/exercise_data.cvs.txt'
DELIMITER ','
CSV HEADER;


CREATE TABLE competition (
comp_id SERIAL PRIMARY KEY,
comp_name VARCHAR(50) NOT NULL UNIQUE,
comp_category VARCHAR(20) NOT NULL,
comp_type VARCHAR(20) NOT NULL,
comp_duration VARCHAR(20) NOT NULL,
comp_start_date VARCHAR(20) NOT NULL,
comp_end_date VARCHAR(20) NOT NULL,
team_one_id INTEGER,
team_two_id INTEGER,
team_one_name VARCHAR(50),
team_two_name VARCHAR(50),
team_one_colour VARCHAR(50),
team_two_colour VARCHAR(50)
);


CREATE TABLE team (
    team_id SERIAL PRIMARY KEY,
    comp_id INTEGER REFERENCES competition(comp_id),
    team_name VARCHAR(50) NOT NULL,
    team_colour VARCHAR(20) NOT NULL
);

CREATE TABLE weekly_progress (
  comp_id INTEGER REFERENCES competition(comp_id),
  user_id INTEGER REFERENCES register_user(user_id),
  comp_name VARCHAR(50) REFERENCES competition(comp_name),
  team_id INTEGER REFERENCES team(team_id),
  weight NUMERIC NOT NULL,
  weight_changes NUMERIC[],
  week_number INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0
);


CREATE OR REPLACE FUNCTION set_comp_name()
RETURNS TRIGGER AS $$
BEGIN
    SELECT comp_name INTO NEW.comp_name FROM competition WHERE comp_id = NEW.comp_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_comp_name_trigger
BEFORE INSERT ON weekly_progress
FOR EACH ROW
EXECUTE FUNCTION set_comp_name();



CREATE TABLE leaderboard AS
SELECT
	wp.comp_id,
    wp.user_id,
    wp.comp_name,
    ru.username,
    wp.weight,
    wp.weight_changes,
    wp.week_number,
    wp.points,
    c.comp_end_date,
    c.comp_start_date 
FROM
    weekly_progress wp
JOIN
    register_user ru ON wp.user_id = ru.user_id
JOIN
    competition c ON wp.comp_id = c.comp_id;
    
CREATE OR REPLACE FUNCTION update_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if team_id is null in the weekly_progress table
    IF NEW.team_id IS NULL THEN
        -- Update the leaderboard entry based on the user_id and comp_id
        UPDATE leaderboard
        SET
            comp_name = NEW.comp_name,
            username = (SELECT username FROM register_user WHERE user_id = NEW.user_id),
            weight = NEW.weight,
            weight_changes = COALESCE(leaderboard.weight_changes, ARRAY[]::NUMERIC[]) || NEW.weight,
            week_number = NEW.week_number,
            points = NEW.points,
            comp_end_date = (SELECT comp_end_date FROM competition WHERE comp_id = NEW.comp_id), -- Include comp_end_date in the SET clause
            comp_start_date = (SELECT comp_start_date FROM competition WHERE comp_id = NEW.comp_id) -- Include comp_end_date in the SET clause
            
        WHERE
            comp_id = NEW.comp_id AND
            user_id = NEW.user_id;

        -- If no rows were updated, insert a new row
        IF NOT FOUND THEN
            INSERT INTO leaderboard (comp_id, user_id, comp_name, username, weight, weight_changes, week_number, points, comp_end_date, comp_start_date)
            VALUES (
                NEW.comp_id,
                NEW.user_id,
                NEW.comp_name,
                (SELECT username FROM register_user WHERE user_id = NEW.user_id),
                NEW.weight,
                ARRAY[NEW.weight],
                NEW.week_number,
                NEW.points,
                (SELECT comp_end_date FROM competition WHERE comp_id = NEW.comp_id),
                (SELECT comp_start_date FROM competition WHERE comp_id = NEW.comp_id)

            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



-- Trigger for AFTER INSERT and AFTER UPDATE events
CREATE TRIGGER weekly_progress_insert_trigger
AFTER INSERT OR UPDATE ON weekly_progress
FOR EACH ROW
EXECUTE FUNCTION update_leaderboard();


CREATE TABLE team_table AS
SELECT
    wp.comp_id,
    wp.user_id,
    wp.comp_name,
    ru.username,
    wp.weight,
    wp.weight_changes,
    wp.week_number,
    wp.points,
    t.team_id,
    t.team_name,
    t.team_colour,
    c.comp_end_date,
    c.comp_start_date -- Include comp_end_date in the SELECT clause
FROM
    weekly_progress wp
JOIN
    register_user ru ON wp.user_id = ru.user_id
JOIN
    team t ON wp.team_id = t.team_id
JOIN
    competition c ON wp.comp_id = c.comp_id; -- Join with the competition table



CREATE OR REPLACE FUNCTION update_team_table()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the competition associated with comp_id is of type 'Team'
    IF EXISTS (
        SELECT 1
        FROM competition
        WHERE comp_id = NEW.comp_id AND comp_type = 'Team'
    ) THEN
        -- Update the team_table entry based on the user_id, comp_id, and team_id
        UPDATE team_table
        SET
            comp_name = NEW.comp_name,
            username = (SELECT username FROM register_user WHERE user_id = NEW.user_id),
            weight = NEW.weight,
            weight_changes = COALESCE(team_table.weight_changes, ARRAY[]::NUMERIC[]) || NEW.weight,
            week_number = NEW.week_number,
            points = NEW.points,
            team_id = NEW.team_id,
            team_name = (SELECT team_name FROM team WHERE team_id = NEW.team_id),
            team_colour = (SELECT team_colour FROM team WHERE team_id = NEW.team_id),
            comp_end_date = (SELECT comp_end_date FROM competition WHERE comp_id = NEW.comp_id), -- Include comp_end_date in the SET clause
            comp_start_date = (SELECT comp_start_date FROM competition WHERE comp_id = NEW.comp_id) -- Include comp_end_date in the SET clause
        WHERE
            comp_id = NEW.comp_id AND
            user_id = NEW.user_id AND
            team_id = NEW.team_id;

        -- If no rows were updated, insert a new row
        IF NOT FOUND THEN
            INSERT INTO team_table (comp_id, user_id, comp_name, username, weight, weight_changes, week_number, points, team_id, team_name, team_colour, comp_end_date, comp_start_date)
            VALUES (
                NEW.comp_id,
                NEW.user_id,
                NEW.comp_name,
                (SELECT username FROM register_user WHERE user_id = NEW.user_id),
                NEW.weight,
                ARRAY[NEW.weight],
                NEW.week_number,
                NEW.points,
                NEW.team_id,
                (SELECT team_name FROM team WHERE team_id = NEW.team_id),
                (SELECT team_colour FROM team WHERE team_id = NEW.team_id),
                (SELECT comp_end_date FROM competition WHERE comp_id = NEW.comp_id),
                (SELECT comp_end_date FROM competition WHERE comp_id = NEW.comp_id)
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



-- Trigger for AFTER INSERT and AFTER UPDATE events on weekly_progress
CREATE TRIGGER weekly_progress_update_team_table_trigger
AFTER INSERT OR UPDATE ON weekly_progress
FOR EACH ROW
EXECUTE FUNCTION update_team_table();



CREATE TABLE solo_final_standings (
  comp_id INTEGER,
  user_id INTEGER ,
  comp_name VARCHAR(50),
  username VARCHAR(50),
  weight NUMERIC,
  weight_changes NUMERIC[],
  week_number INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  comp_end_date VARCHAR(20) NOT NULL,
  comp_start_date VARCHAR(20) NOT NULL
);

CREATE TABLE team_final_standings (
  comp_id INTEGER,
  user_id INTEGER ,
  comp_name VARCHAR(50),
  username VARCHAR(50),
  weight NUMERIC,
  weight_changes NUMERIC[],
  week_number INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  team_id INTEGER,
  team_name VARCHAR(50),
  team_colour VARCHAR(50),
  comp_end_date VARCHAR(20) NOT NULL,
  comp_start_date VARCHAR(20) NOT NULL
);


CREATE TABLE achievements (
    achievement_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    rank VARCHAR(20) NOT NULL
);

INSERT INTO achievements (title, description, rank) VALUES
    ('First Workout', 'Complete a single workout.', 'Bronze'),
    ('Goal Setter', 'Set your first goal.', 'Bronze'),
    ('Competitor', 'Enter your first competition.', 'Bronze'),
    ('Consistency', 'Log a workout 4 weeks in a row.', 'Silver'),
    ('Podium Finish', 'Finish a solo competition in the top 3.', 'Silver'),
    ('Hard Worker', 'Enter a workout 5 times in a week.', 'Silver'),
    ('Winner Winner', 'Finish first place in a solo competition.', 'Gold'),
    ('Goal Achiever', 'Reach a goal you have set.', 'Gold'),
    ('Unstoppable', 'Log a workout 6 months in a row', 'Gold');
    
    
CREATE TABLE user_achievements (
    user_achievement_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES register_user(user_id),
    achievement_id INTEGER REFERENCES achievements(achievement_id),
    achieved_at TIMESTAMP DEFAULT NOW()
);



    
    
-- Create a new table called 'user_achievement_details'
CREATE TABLE user_achievement_details AS
SELECT
    ua.user_id,
    ru.username,
    ua.achievement_id,
    a.title,
    a.description,
    a.rank,
    ua.achieved_at
FROM
    user_achievements ua
JOIN
    register_user ru ON ua.user_id = ru.user_id
JOIN
    achievements a ON ua.achievement_id = a.achievement_id;
    
    
    
    -- Create a trigger that updates user_achievement_details on INSERT into user_achievements
CREATE OR REPLACE FUNCTION update_user_achievement_details()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_achievement_details (user_id, username, achievement_id, title, description, rank, achieved_at)
    SELECT
        NEW.user_id,
        (SELECT username FROM register_user WHERE user_id = NEW.user_id),
        NEW.achievement_id,
        (SELECT title FROM achievements WHERE achievement_id = NEW.achievement_id),
        (SELECT description FROM achievements WHERE achievement_id = NEW.achievement_id),
        (SELECT rank FROM achievements WHERE achievement_id = NEW.achievement_id),
        NEW.achieved_at;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger that fires after an INSERT on user_achievements
CREATE TRIGGER user_achievement_insert_trigger
AFTER INSERT ON user_achievements
FOR EACH ROW
EXECUTE FUNCTION update_user_achievement_details();



