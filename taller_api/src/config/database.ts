import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let poolConfig: PoolConfig;

if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  poolConfig = {
    host: url.hostname,
    port: parseInt(url.port || '5432'),
    database: url.pathname.slice(1),
    user: url.username,
    password: url.password,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: { rejectUnauthorized: false },
    family: 4,
  };
} else {
  poolConfig = {
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
  };
}

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de conexiones:', err);
});

export default pool;
