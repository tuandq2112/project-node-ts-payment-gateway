import { DB_DATABASE, DB_HOST, DB_PASS, DB_PORT, DB_USER } from '@config';

export const dbConnection = {
  url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: DB_USER,
    pass: DB_PASS,
  },
};

export const dbConnectedSuccess = () => {
  console.log('Connecting');
};
