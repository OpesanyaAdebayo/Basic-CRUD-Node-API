import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request } from 'express';

import {
  validateAuthDetails,
  validateChangePassword,
  validateEmail,
  validatePassword,
  validateUserToken
} from './controllers/auth/middleware';

import {
  changePassword,
  login,
  resetPassword,
  resetPasswordWithLink,
  setPasswordAfterReset,
  signup
} from './controllers/auth/routes';

const app: express.Express = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req: Request, _) => {
  console.log(req.body);
});
app.post('/v1/login', validateAuthDetails, validatePassword, login);
app.post('/v1/signup', validateAuthDetails, signup);
app.post('/v1/resetpassword', validateEmail, resetPassword);
app.post('/v1/resetpasswordwithlink', resetPasswordWithLink);

app.use(validateUserToken);
app.post('/v1/changepassword', validateChangePassword, changePassword);
app.post('/v1/setPasswordAfterReset', setPasswordAfterReset);

export default app;
