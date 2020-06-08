-- Creating database and tables
CREATE DATABASE foodfy;

CREATE TABLE "recipes" (
  "id" SERIAL PRIMARY KEY,
  "chef_id" int NOT NULL,
  "image" text NOT NULL,
  "title" text NOT NULL,
  "ingredients" text[] NOT NULL,
  "preparation" text[] NOT NULL,
  "information" text,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "chefs" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,""
  "image" text NOT NULL,
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
REFERENCES "recipes" ("id");

ALTER TABLE "recipe_files"
ADD CONSTRAINT recipe_files_file_id_fkey
FOREIGN KEY ("file_id") 
REFERENCES "files" ("id")
ON DELETE CASCADE;

-- Joining tables

SELECT * FROM chefs
LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
ORDER BY chefs.id

-- To delete tables and restart id sequence

DELETE FROM chefs;
DELETE FROM files;
DELETE FROM recipe_files;
DELETE FROM recipes;

ALTER SEQUENCE chefs_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;
ALTER SEQUENCE recipe_files_id_seq RESTART WITH 1;
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;