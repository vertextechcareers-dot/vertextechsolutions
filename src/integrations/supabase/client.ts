import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://aqlejfzgabllyeaeczca.supabase.co";
export const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbGVqZnpnYWJsbHllYWVjemNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyMDU0NzMsImV4cCI6MjA5Nzc4MTQ3M30.LKMSZe1xW1pNJxPWv--11p3nW1qGYkbzi5U0ikVOhvk";

export const supabase = createClient(SUPABASE_URL, supabaseAnonKey);