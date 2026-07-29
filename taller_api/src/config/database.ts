import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'taller_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'taller123',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  family: 4,
});

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de conexiones:', err);
});

export default pool;
