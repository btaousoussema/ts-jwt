/*CREATE DATABASE Web;*/

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS contact;
/*
CREATE USER ouss WITH PASSWORD 'password';


GRANT ALL PRIVILEGES ON DATABASE Web TO ouss;

GRANT ALL ON SCHEMA public TO ouss;


GRANT SELECT, INSERT, UPDATE ON users TO ouss;

GRANT SELECT, INSERT, UPDATE ON contact TO ouss;*/

CREATE TABLE users (id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY, email text, password text);

CREATE TABLE contact (id int PRIMARY KEY GENERATED ALWAYS AS IDENTITY, first_name text, last_name text);

Insert into contact (first_name, last_name) values ('ouss', 'bou');