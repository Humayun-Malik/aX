import { Pool } from 'pg';

// PostgreSQL configuration
const pool = new Pool({
  user: 'your_postgres_user',
  host: 'localhost',
  database: 'arenax',
  password: '2562',
  port: 5432,
});

// Export query function
export const query = (text, params) => pool.query(text, params);
