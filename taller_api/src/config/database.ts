import { Pool, PoolConfig } from 'pg';
import dns from 'dns';
import dotenv from 'dotenv';

dotenv.config();

function ipv4Lookup(hostname: string, callback: (err: Error | null, address?: string) => void) {
  dns.resolve4(hostname, (err, addresses) => {
    if (err) {
      callback(err);
    } else if (addresses.length > 0) {
      callback(null, addresses[0]);
    } else {
      callback(new Error('No IPv4 addresses found'));
    }
  });
}

let pool: Pool;

if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);
  const config: PoolConfig = {
    host: url.hostname,
    port: parseInt(url.port || '5432'),
    database: url.pathname.slice(1),
    user: url.username,
    password: url.password,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: { rejectUnauthorized: false },
    lookup: ipv4Lookup as any,
  };
  pool = new Pool(config);
} else {
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'taller_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'taller123',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  });
}

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de conexiones:', err);
});

export default pool;
