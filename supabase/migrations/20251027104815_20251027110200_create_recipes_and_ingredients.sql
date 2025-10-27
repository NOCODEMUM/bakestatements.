/*
  # Create Recipes and Ingredients Tables

  1. New Tables
    - `recipes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `description` (text)
      - `yield_quantity` (decimal)
      - `yield_unit` (text)
      - `instructions` (text)
      - `prep_time_minutes` (integer)
      - `bake_time_minutes` (integer)
      - `total_cost` (decimal) - calculated from ingredients
      - `cost_per_unit` (decimal) - calculated
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `ingredients`
      - `id` (uuid, primary key)
      - `recipe_id` (uuid, references recipes)
      - `name` (text)
      - `quantity` (decimal)
      - `unit` (text)
      - `cost` (decimal)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to manage their own recipes
    - Add policies ensuring ingredients can only be accessed through owned recipes

  3. Important Notes
    - Ingredients cascade delete with recipes
    - Cost calculations should be done in application layer
    - RLS policies ensure users can only access their own recipe data
*/

CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  yield_quantity decimal(10,2),
  yield_unit text,
  instructions text,
  prep_time_minutes integer DEFAULT 0,
  bake_time_minutes integer DEFAULT 0,
  total_cost decimal(10,2) DEFAULT 0,
  cost_per_unit decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name text NOT NULL,
  quantity decimal(10,3) NOT NULL,
  unit text NOT NULL,
  cost decimal(10,2) DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own recipes"
  ON recipes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recipes"
  ON recipes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes"
  ON recipes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes"
  ON recipes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view own ingredients"
  ON ingredients FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = ingredients.recipe_id
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own ingredients"
  ON ingredients FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = ingredients.recipe_id
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own ingredients"
  ON ingredients FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = ingredients.recipe_id
      AND recipes.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = ingredients.recipe_id
      AND recipes.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own ingredients"
  ON ingredients FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM recipes
      WHERE recipes.id = ingredients.recipe_id
      AND recipes.user_id = auth.uid()
    )
  );

CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ingredients_updated_at BEFORE UPDATE ON ingredients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_ingredients_recipe_id ON ingredients(recipe_id);
