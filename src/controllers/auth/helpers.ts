import bcrypt from 'bcrypt';
import cryptoRandomString from 'crypto-random-string';
import util from 'util';

import jsonwebtoken, { Secret } from 'jsonwebtoken';
import { TOKEN_SECRET } from '../../util/secrets';

const secret: Secret = TOKEN_SECRET!;

export const verifyToken = (token: string) => {
  return new Promise((resolve, reject) => {
    jsonwebtoken.verify(token, secret, (err: Error, decoded) => {
      if (err) {
        return reject(err);
      }
      return resolve(decoded);
    });
  });
};

export const createToken =  (email: string) => {
  return jsonwebtoken.sign({ email }, secret, { expiresIn: '1h' });
};

export const generateRandomString = () => {
  const randomString = cryptoRandomString({ length: 35, type: 'hex' });
  return randomString;
};

export const passwordComparePromise = util.promisify(bcrypt.compare);
export const hashPasswordPromise = util.promisify(bcrypt.hash);
