import App from '@/app';
import UserRoute from '@/routes/user.route';
import ExchangeRateRoute from '@/routes/exchangerate.route';
import validateEnv from '@utils/validateEnv';
import UploadRoute from './routes/upload.route';
import ApiKeyRoute from './routes/apikey.route';

validateEnv();

const app = new App([new UserRoute(), new UploadRoute(), new ExchangeRateRoute(), new ApiKeyRoute()]);

app.listen();
