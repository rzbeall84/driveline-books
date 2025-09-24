import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gohvvdrztkgdyynpjklz.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvaHZ2ZHJ6dGtnZHl5bnBqa2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3NDk4MjMsImV4cCI6MjA3NDMyNTgyM30.lBbNXi0ylFGgEibrySRMT1Yq8E9x0DoLvSya2epsGqM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
