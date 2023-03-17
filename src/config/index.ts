import { config } from 'dotenv';
import { readFileSync } from 'fs';
import path from 'path';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
const AbsolutePath = `../../files/private/keystone`;
const PUBLIC_KEY = readFileSync(path.resolve(__dirname, `${AbsolutePath}/publicKey.txt`));
const PRIVATE_KEY = readFileSync(path.resolve(__dirname, `${AbsolutePath}/privateKey.txt`));

export const KEY_PAIR = { PUBLIC_KEY, PRIVATE_KEY };
export const {
  NODE_ENV,
  PORT,
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
  DB_USER,
  DB_PASS,
  DURATION,
  CREDENTIALS,
  EMAIL_USER,
  EMAIL_PASSWORD,
  FRONT_END_URL,
  TWO_FACTOR_AUTHENTICATION_APP_NAME,
  CURRENCY,
  NETWORK_ID,
  TRANSACTION_URL,
  OPERATOR_PRIVATE_KEY,
  RPC_URL,
  FACTORY_ADDRESS,
} = process.env;
export const ABSOLUTE_PATH = './files/public/';
