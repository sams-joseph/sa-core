CREATE TABLE IF NOT EXISTS users (
  id bigint PRIMARY KEY,
  first_name varchar(255),
  last_name varchar(255),
  email varchar(255),
  password varchar(255),
  remember_token varchar(100),
  is_deleted boolean,
  created_at timestamp with time zone
  updated_at timestamp with time zone
);