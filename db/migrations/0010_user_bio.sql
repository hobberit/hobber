-- Adds an optional free-form bio users can set on their Profile screen.

alter table users
  add column bio text;
