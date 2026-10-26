import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.resolve(__dirname, 'db.json');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('[Migration] Error: DATABASE_URL is not defined in environment.');
  process.exit(1);
}

const sql = neon(databaseUrl);

const TABLES = [
  'users',
  'products',
  'packages',
  'coaches',
  'students',
  'student_schedules',
  'transactions',
  'locations',
  'coach_attendances'
];

export async function runMigration() {
  console.log('[Migration] Starting Neon PostgreSQL migration...');

  // 1. Create Tables
  for (const table of TABLES) {
    console.log(`[Migration] Creating table ${table} if not exists...`);
    await sql.query(`
      CREATE TABLE IF NOT EXISTS ${table} (
        id TEXT PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
  }

  // 2. Create Indexes
  console.log('[Migration] Creating performance indexes...');
  await sql.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users ((data->>'email'));`);
  await sql.query(`CREATE INDEX IF NOT EXISTS idx_packages_product ON packages ((data->>'productId'));`);
  await sql.query(`CREATE INDEX IF NOT EXISTS idx_students_user ON students ((data->>'userId'));`);
  await sql.query(`CREATE INDEX IF NOT EXISTS idx_schedules_student ON student_schedules ((data->>'studentId'));`);
  await sql.query(`CREATE INDEX IF NOT EXISTS idx_transactions_student ON transactions ((data->>'studentId'));`);

  // 3. Seed data from db.json if exists
  if (fs.existsSync(DB_FILE)) {
    const rawData = fs.readFileSync(DB_FILE, 'utf-8');
    const db = JSON.parse(rawData);

    const mapping = [
      { key: 'users', table: 'users' },
      { key: 'products', table: 'products' },
      { key: 'packages', table: 'packages' },
      { key: 'coaches', table: 'coaches' },
      { key: 'students', table: 'students' },
      { key: 'studentSchedules', table: 'student_schedules' },
      { key: 'transactions', table: 'transactions' },
      { key: 'locations', table: 'locations' }
    ];

    for (const item of mapping) {
      const records = db[item.key] || [];
      console.log(`[Migration] Seeding ${records.length} records into ${item.table}...`);
      for (const rec of records) {
        if (!rec.id) continue;
        await sql.query(
          `INSERT INTO ${item.table} (id, data, updated_at)
           VALUES ($1, $2, NOW())
           ON CONFLICT (id) DO UPDATE SET data = $2, updated_at = NOW();`,
          [rec.id, JSON.stringify(rec)]
        );
      }
    }
  }

  console.log('[Migration] Verifying table counts in Neon:');
  for (const table of TABLES) {
    const res = await sql.query(`SELECT COUNT(*) as cnt FROM ${table};`);
    console.log(`  - ${table}: ${res[0].cnt} records`);
  }

  console.log('[Migration] Neon PostgreSQL migration completed successfully! 🎉');
}

// Allow direct execution
if (process.argv[1] && process.argv[1].endsWith('migrate.js')) {
  runMigration().catch(err => {
    console.error('[Migration] Failed:', err);
    process.exit(1);
  });
}
