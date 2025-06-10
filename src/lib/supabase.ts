import { createClient } from '@supabase/supabase-js';
import { Capacitor } from '@capacitor/core';

// Get Supabase URL and key from window object or use fallbacks
const supabaseUrl = (window as any).SUPABASE_URL || 'https://oejvwzhgwgdmbdsdahpk.supabase.co';
const supabaseAnonKey = (window as any).SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lanZ3emhnd2dkbWJkc2RhaHBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMjcyMzEsImV4cCI6MjA2NDkwMzIzMX0.enMKceuBIlZJ_EmftRuAG1AeBsGaBMrRTqInLZHrORI';

// Debug logs
console.log('Supabase Configuration:', {
  url: supabaseUrl,
  key: supabaseAnonKey ? `***${supabaseAnonKey.slice(-4)}` : 'Not found',
  source: (window as any).SUPABASE_URL ? 'window' : 'fallback'
});

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = '❌ Missing Supabase URL or Anon Key';
  console.error(errorMsg);
  throw new Error(errorMsg);
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: !Capacitor.isNativePlatform(),
  },
});

// Test the connection
(async () => {
  try {
    const { data, error } = await supabase
      .from('test_table')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('❌ Supabase connection test failed:', error);
    } else {
      console.log('✅ Supabase connection successful');
    }
  } catch (error) {
    console.error('❌ Error testing Supabase connection:', error);
  }
})();