import App from '@/app';
import AuthRoute from '@routes/auth.route';
import UsersRoute from '@routes/users.route';
import validateEnv from '@utils/validateEnv';
import UploadRoute from './routes/upload.route';

validateEnv();

const app = new App([
  //new IndexRoute(),
  new UsersRoute(),
  new AuthRoute(),
  new UploadRoute(),
]);

app.listen();
