import App from '@/app';
import UserRoute from '@/routes/user.route';
import validateEnv from '@utils/validateEnv';
import UploadRoute from './routes/upload.route';

validateEnv();

const app = new App([new UserRoute(), new UploadRoute()]);

app.listen();
