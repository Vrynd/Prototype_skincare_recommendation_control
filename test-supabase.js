import fs from 'fs';
import path from 'path';

// Manual env loader
const envPath = path.resolve(process.cwd(), '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
    env[key] = value;
  }
});

const url = env.VITE_SUPABASE_URL || 'https://dedqbqjsyykcfsqwpyag.supabase.co';
const apiKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

async function run() {
  const endpoint = `${url}/rest/v1/`;
  try {
    const res = await fetch(endpoint, {
      headers: {
        'apikey': apiKey,
        'Authorization': `Bearer ${apiKey}`
      }
    });
    if (!res.ok) {
      console.log(`Failed with status ${res.status}`);
      return;
    }
    const schema = await res.json();
    console.log('Available paths/tables:', Object.keys(schema.paths));
    console.log('Definitions:', Object.keys(schema.definitions || {}));
  } catch (err) {
    console.log('Failed:', err.message);
  }
}

run();
