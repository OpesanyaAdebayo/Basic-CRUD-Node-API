// import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
// import util from 'util';

import { db } from '../config/db';
import { hashPasswordPromise, passwordComparePromise } from '../controllers/auth/helpers';

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  comparePassword: comparePasswordFunction;
}

type comparePasswordFunction = (password: string) => Promise<boolean>;

function comparePassword (this: IUser, password: string) {
  return passwordComparePromise(password, this.password);
}

export const userSchema = new mongoose.Schema({
  email: { type: String },
  password: { type: String }
});

userSchema.pre<IUser>('save', async function (next: mongoose.HookNextFunction) {
  const userDocument = this;
  const user = userDocument.toObject();

  if (!userDocument.isModified('password')) {
    return next();
  }
  try {
    const hash = await hashPasswordPromise(user.password, 12);
    userDocument.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = comparePassword;

export const User = db.model<IUser>('User', userSchema);
