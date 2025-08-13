import { Pool } from 'pg';
import { POSTGRES_CONFIG } from '../config';

const pool = new Pool(POSTGRES_CONFIG);

export default pool;
