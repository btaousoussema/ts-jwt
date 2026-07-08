import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'ouss',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'Web',
  max: 20,
  idleTimeoutMillis: 30000,  
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

export const query = (text:string, params: any[]) => pool.query(text, params); 

export const getClient = () => pool.connect();
