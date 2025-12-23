const fetch = require('node-fetch');
const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

// Configuration
const WEB_API_URL = process.env.EXPO_PUBLIC_WEB_API_URL || 'http://cfdeploy.mfexai.com';
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://chupwibtgswztfphqijo.supabase.co';
const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNodXB3aWJ0Z3N3enRmcGhxaWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3Mjk2NzIsImV4cCI6MjA2MzMwNTY3Mn0.Fds9ZxzVMWBJ3M-T8RHQy2Yb3-PAA8mGy4m9lx6a7g8';

console.log('--- Integration Verification ---');
console.log(`Target Web API: ${WEB_API_URL}`);
console.log(`Target Supabase: ${SUPABASE_URL}`);
console.log('-------------------------------');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function ask(question) {
  return new Promise(resolve => rl.question(question, resolve));
}

async function main() {
  try {
    // 1. Connectivity Check
    console.log('\n[1/3] Checking Credentials...');
    const email = await ask('Enter Email: ');
    const password = await ask('Enter Password: ');
    
    // 2. Web API Login
    console.log('\n[2/3] Calling Web API Login...');
    const loginUrl = `${WEB_API_URL}/api/app/login`;
    const start = Date.now();
    
    const res = await fetch(loginUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const duration = Date.now() - start;
    console.log(`Answer received in ${duration}ms. Status: ${res.status}`);
    
    if (!res.ok) {
      const text = await res.text();
      console.error('❌ Login Failed:', text);
      return;
    }

    const data = await res.json();
    if (!data.access_token) {
      console.error('❌ Login success but no access_token returned!', data);
      return;
    }

    console.log('✅ Web API Login Successful!');
    console.log('   Received Token:', data.access_token.substring(0, 20) + '...');
    
    // 3. Supabase Data Access Verification (RLS)
    console.log('\n[3/3] Verifying Data Access (RLS Check)...');
    console.log('ℹ️  Skipping "setSession" because this is a Custom JWT (Better Auth).');
    console.log('   Testing direct database access instead...');

    // Create a client pre-configured with the custom token
    const supabaseWithToken = createClient(SUPABASE_URL, SUPABASE_KEY, {
      db: { schema: 'cfbase' },
      global: {
        headers: {
          Authorization: `Bearer ${data.access_token}`
        }
      }
    });

    // Attempt to read the user's own profile from 'public.user'
    // This tests if the JWT signature is valid AND if the RLS policy is set correctly
    const { data: profile, error: dbError } = await supabaseWithToken
      .from('user')
      .select('id, email, name')
      .eq('email', email) // Assuming email is unique and user can read own row
      .single();

    if (dbError) {
      console.error('❌ Data Access Failed:', dbError.message);
      console.log('⚠️  Potential Causes:');
      console.log('   1. RLS Policy missing on "public.user" table.');
      console.log('   2. Configured SUPABASE_JWT_SECRET does not match.');
      return;
    }

    console.log('✅ RLS Data Access Successful!');
    console.log('   User Profile Found:', profile);
    console.log('\n🎉 CONGRATULATIONS! The Auth Bridge is fully functional.');
    console.log('   (Note: In the App, ignore "User not found" errors from setSession if data loads correctly)');

  } catch (error) {
    console.error('❌ Unexpected Error:', error);
  } finally {
    rl.close();
  }
}

main();
