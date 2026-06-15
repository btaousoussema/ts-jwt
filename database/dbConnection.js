// db.js
const { Pool } = require('pg');

// Initialize the pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER || 'ouss',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'Web',
  max: 20,
  idleTimeoutMillis: 30000,  
  connectionTimeoutMillis: 2000,
});

// Handle unexpected errors on idle clients
pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
  process.exit(-1);
});

module.exports = {
  // Use this for standard single queries (automatically checks out and releases clients)
  query: (text, params) => pool.query(text, params),
  
  // Use this only when managing manual transactions
  getClient: () => pool.connect()
};
