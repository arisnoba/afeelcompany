// src/lib/db.ts
// @vercel/postgres auto-detects POSTGRES_URL environment variable.
// All DB queries in this project use the sql tagged template literal directly.
export { sql } from '@vercel/postgres'
