CREATE DATABASE IF NOT EXISTS lenguas;
USE lenguas;

DROP TABLE IF EXISTS usuario;

CREATE TABLE usuario (
	id INT not null unique PRIMARY KEY,
    lang ENUM("EN", "ES", "AR") not null
);