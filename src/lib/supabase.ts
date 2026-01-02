import { createClient } from '@supabase/supabase-js';

// Hardcoded Supabase credentials for direct deployment
const supabaseUrl = 'https://wyppwghdbwiiujgglqdf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5cHB3Z2hkYndpaXVqZ2dscWRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NTAxOTksImV4cCI6MjA4MjQyNjE5OX0.uKYC-ZAIjeQYwK1hijvz0CatTQJo3Zy2zz8L0QJWhZw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});
