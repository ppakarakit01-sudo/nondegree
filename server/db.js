const { Pool, types } = require('pg');

// Return DATE columns as raw 'YYYY-MM-DD' strings instead of JS Date objects —
// pg's default Date conversion is timezone-sensitive and shifts the day depending
// on server locale, which breaks all the delay/deadline math downstream.
types.setTypeParser(1082, (val) => val);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('railway.app')
    ? { rejectUnauthorized: false }
    : false,
});

module.exports = pool;
