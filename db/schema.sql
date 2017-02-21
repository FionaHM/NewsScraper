CREATE database burgers_db;

use burgers_db;

CREATE table burgers (
id int auto_increment not null,
burger_name VARCHAR(32) not null,
devoured BOOLEAN DEFAULT FALSE,
date_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP not null,
-- createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
PRIMARY KEY(id));

select * from burgers;