import path from 'path';
import dotenv from 'dotenv';
import { existsSync } from 'fs';

let envPath = path.resolve(process.cwd(), '.env');

if (!existsSync(envPath)) {
  envPath = path.resolve(process.cwd(), '../.env');
}

dotenv.config({ path: envPath });

export const config = {
  port: process.env.PORT || 5200,
  mongoUrl: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV || 'development',
};
