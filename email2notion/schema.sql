DROP TABLE IF EXISTS mailserver;
DROP TABLE IF EXISTS notionaccount;

CREATE TABLE mailserver (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    host TEXT NOT NULL,
    port TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT  NOT NULL
);

CREATE TABLE notionaccount (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    token TEXT NOT NULL
);
