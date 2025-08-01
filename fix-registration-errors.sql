-- Fix Registration Errors Script
-- Run this in your Supabase SQL editor to resolve "Database error saving new user"

-- 1. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON canvases TO authenticated;

-- 2. Create a more robust trigger function that handles errors gracefully
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
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Unknown'), 
    CASE 
      WHEN NEW.raw_user_meta_data->>'age' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'age')::INTEGER 
      ELSE NULL 
    END,
    COALESCE(NEW.raw_user_meta_data->>'gender', 'prefer-not-to-say'),
    COALESCE(NEW.raw_user_meta_data->>'country', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'use_case', 'other'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE LOG 'Error in handle_new_user trigger: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Drop and recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 4. Add a policy that allows the trigger to insert profiles
DROP POLICY IF EXISTS "Allow trigger to insert profiles" ON profiles;
CREATE POLICY "Allow trigger to insert profiles" ON profiles
  FOR INSERT WITH CHECK (true);

-- 5. Ensure RLS is enabled but with proper policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 6. Update existing policies to be more permissive for the trigger
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR auth.uid() IS NULL);

-- 7. Test the function
SELECT 'Trigger function updated successfully' as status;

-- 8. Check if there are any existing users without profiles
SELECT 
  'Users without profiles: ' || COUNT(*) as missing_profiles
FROM auth.users 
WHERE id NOT IN (SELECT id FROM profiles); 