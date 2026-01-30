import { createClient } from '@supabase/supabase-js';

// Hardcoded fallbacks to prevent crash if Vercel env vars are not yet configured
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xxapfhpfaczgoadwcfot.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4YXBmaHBmYWN6Z29hZHdjZm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NDQ4NzksImV4cCI6MjA4NTAyMDg3OX0.fat4bT2Iu8sRt1JH4FbajN9yhUtHeY3l8rxgtIUl8MQ';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase configuration error');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
