CREATE TABLE weigh_in (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    measurement decimal(4, 1) NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL
);

