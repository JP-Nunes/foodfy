-- Creating database and tables
CREATE DATABASE foodfy;

CREATE TABLE "users" (
   "id" SERIAL PRIMARY KEY,
   "name" TEXT NOT NULL,
   "email" TEXT UNIQUE NOT NULL,
   "password" TEXT NOT NULL,
   "reset_token" TEXT,
   "reset_token_expires" TEXT,
   "is_admin" BOOLEAN DEFAULT false,
   "created_at" TIMESTAMP DEFAULT(now()),
   "updated_at" TIMESTAMP DEFAULT(now())
);

CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "chef_id" int NOT NULL,
  "user_id" int NOT NULL,
  "title" text NOT NULL,
  "ingredients" text[] NOT NULL,
  "preparation" text[] NOT NULL,
  "information" text,
  "created_at" timestamp DEFAULT (now()),
  "updated_at" timestamp DEFAULT (now())
);

CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "file_id" int,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE files (
	"id" SERIAL PRIMARY KEY,
   "name" text,
   "path" text NOT NULL
)

CREATE TABLE recipe_files (
   "id" SERIAL PRIMARY KEY,
   "recipe_id" int NOT NULL,
   "file_id" int NOT NULL
)

--Creating recipe_files relations

ALTER TABLE "recipe_files"
ADD CONSTRAINT recipe_files_recipe_id_fkey
FOREIGN KEY ("recipe_id") 
REFERENCES "recipes" ("id")
ON DELETE CASCADE;

ALTER TABLE "recipe_files"
ADD CONSTRAINT recipe_files_file_id_fkey
FOREIGN KEY ("file_id") 
REFERENCES "files" ("id")
ON DELETE CASCADE;

--Creating recipes and chef relation

ALTER TABLE "recipes"
ADD CONSTRAINT recipes_chef_id_fkey
FOREIGN KEY ("chef_id") 
REFERENCES "chefs" ("id")
ON DELETE CASCADE;

--Creating recipes and user relation

ALTER TABLE "recipes"
ADD CONSTRAINT recipes_chef_id_fkey
FOREIGN KEY ("user_id") 
REFERENCES "users" ("id")
ON DELETE CASCADE;

--Creating chefs and files relation

ALTER TABLE "chefs"
ADD CONSTRAINT chefs_file_id_fkey
FOREIGN KEY ("file_id") 
REFERENCES "files" ("id");

-- Creating Procedure and Trigger to auto update users' and recipes' date

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Creating connect-pg-simple session

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" 
ADD CONSTRAINT "session_pkey" 
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- To delete tables and restart id sequence

DELETE FROM chefs;
DELETE FROM files;
DELETE FROM recipe_files;
DELETE FROM recipes;
DELETE FROM users;

ALTER SEQUENCE chefs_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;
ALTER SEQUENCE recipe_files_id_seq RESTART WITH 1;
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;

--To drop table

DROP DATABASE IF EXISTS foodfy;