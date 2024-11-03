import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://cyuvcdoqwynahyuvgagd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5dXZjZG9xd3luYWh5dXZnYWdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM0NjQxMTQsImV4cCI6MjAzOTA0MDExNH0.KeYvJQALGwK8LSLf0JZ6S3Hq8fb-1H1gENIhI85CcyM';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default supabase;