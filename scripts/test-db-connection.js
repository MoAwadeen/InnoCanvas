const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('Testing connection to:', supabaseUrl);

    // Try to select from profiles table (should exist if schema was applied)
    const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

    if (error) {
        console.error('Connection failed or table missing:', error.message);
        if (error.code === '42P01') {
            console.error('HINT: The "profiles" table does not exist. You might not have run the schema script yet.');
        }
    } else {
        console.log('Connection successful! Profiles table exists.');
    }
}

testConnection();
