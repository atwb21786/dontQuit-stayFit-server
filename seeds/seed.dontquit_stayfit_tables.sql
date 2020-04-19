BEGIN;

TRUNCATE
    goals,
    weigh_in,
    fitness,
    feedback,
    users
    RESTART IDENTITY CASCADE;

INSERT INTO goals (content, date_created)
VALUES
    ('To lose 10 pounds in 2 weeks', now()),
    ('To run an 8 minute mile', now() );

INSERT INTO weigh_in (measurement, date_created)
VALUES
    (163.8, now()),
    (150.0, now()),
    (180.0, now());

INSERT INTO fitness (content, date_created)
VALUES
    ('Ran 3.5 miles in 40 minutes, did 3 sets of 25 pushups at each mile marker', now()),
    ('Gym workout: 4 sets of Chest, 4 sets of Triceps, 4 sets 25 pushups, 15 minute bike cooldown', now()),
    ('30 minutes with Bowflex Kettle Bell', now());

INSERT INTO feedback (content, date_created)
VALUES 
    ('Worked out each morning for an hour for past 2 weeks, have lost 10 pounds since!', now()),
    ('Have been unable to reach my fitness goals set last week.  Will look to meet those goals this week and remain accountable', now()),
    ('Have gained weight despite workout consistency. Must restrict carbohyrates in meals going forward', now());


INSERT INTO users (user_name, password)
VALUES
    ('ABC', '$2a$10$DYOaMz1kaOTdsYwiXcEdyersvoPyT4G55tcFQ.72JtOz8SDs6yIRS');

COMMIT; 