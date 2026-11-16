import dotenv from 'dotenv';
dotenv.config();
import { neon } from '@neondatabase/serverless';

async function checkRows() {
  const sql = neon(process.env.DATABASE_URL);
  const tables = ['app_settings', 'products', 'packages', 'coaches', 'students'];
  
  for (const t of tables) {
    try {
      const rows = await sql.query(`SELECT id, pg_column_size(data) as bytes FROM ${t} LIMIT 5;`);
      console.log(`Table ${t}:`, rows);
    } catch (e) {
      console.log(`Table ${t} error:`, e.message);
    }
  }
}

checkRows().catch(console.error);
