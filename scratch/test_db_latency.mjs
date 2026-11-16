import dotenv from 'dotenv';
dotenv.config();
import { neon } from '@neondatabase/serverless';

async function test() {
  const sql = neon(process.env.DATABASE_URL);
  console.log('Testing Neon connection to:', process.env.DATABASE_URL.split('@')[1]);
  
  for (let i = 1; i <= 3; i++) {
    const start = Date.now();
    const res = await sql.query('SELECT 1 as ping');
    const elapsed = Date.now() - start;
    console.log(`Query ${i} took ${elapsed}ms:`, res);
  }
}

test().catch(console.error);

