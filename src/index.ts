import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';

import {
  validateAuthDetails,
  validateChangePassword,
  validateEmail,
  validatePassword,
  validatePasswordReset,
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

app.use(cors({
  origin: 'http://localhost:3000'
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/v1/login', validateAuthDetails, validatePassword, login);
app.post('/v1/signup', validateAuthDetails, signup);
app.post('/v1/resetpassword', validateEmail, resetPassword);
app.post('/v1/resetpasswordwithlink', resetPasswordWithLink);

app.use(validateUserToken);
app.post('/v1/changepassword', validateChangePassword, changePassword);
app.post('/v1/setpasswordafterreset', validatePasswordReset, setPasswordAfterReset);

export default app;
