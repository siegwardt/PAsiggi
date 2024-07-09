
import { Pool } from 'pg';

const pool = new Pool({
  user: 'siggi',
  host: 'farmmx.ddns.net',
  database: 'PAsiggi',
  password: 'A#&DjmS?JMp@aRHQA$@r@E3mABxXjiee@Tm&4LBj',
  port: 5432,
});

export default pool;
