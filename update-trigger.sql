-- Update the trigger function to handle all profile fields
-- Run this in your Supabase SQL editor

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Create updated function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (
    id, 
    full_name, 
    age,
    gender,
    country,
    use_case,
    avatar_url
  )
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name', 
    (NEW.raw_user_meta_data->>'age')::INTEGER,
    NEW.raw_user_meta_data->>'gender',
    NEW.raw_user_meta_data->>'country',
    NEW.raw_user_meta_data->>'use_case',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- For existing users who don't have profiles, you can run this:
-- INSERT INTO profiles (id, full_name, age, gender, country, use_case, avatar_url)
-- SELECT 
--   id,
--   raw_user_meta_data->>'full_name',
--   (raw_user_meta_data->>'age')::INTEGER,
--   raw_user_meta_data->>'gender',
--   raw_user_meta_data->>'country',
--   raw_user_meta_data->>'use_case',
--   raw_user_meta_data->>'avatar_url'
-- FROM auth.users
-- WHERE id NOT IN (SELECT id FROM profiles); 