import { Request, Response } from 'express';
import { User } from '../../models/User';
import {
  generateEmailForPasswordReset,
  generateNoEmailForPasswordReset,
  sendEmail
} from '../email/helpers';

import { redisAsync } from '../../config/redis';
import { NODEMAILER_USER } from '../../util/secrets';
import { generateRandomString, hashPasswordPromise,  } from '../auth/helpers';
import { IMailDetails } from '../email/helpers';
import { createToken } from './helpers';

export const login = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const token = await createToken(email);
    return res.json({ success: true, data: token });
  } catch (error) {
    return res.status(500).json({
      error: 'There was an error signing in. Please try again.',
      success: false
    });
  }
};

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: req.body.email }).exec();
    if (existingUser) {
      return res
        .status(401)
        .json({
          error: 'account with that email already exists.',
          success: false,
        });
    }
    const user = new User({
      email,
      password
    });
    await user.save();
    const token = await createToken(email);
    return res.json({ success: true, data: token });
  } catch (error) {
    return res.status(500).json({
      error: 'There was an error signing up. Please try again.',
      success: false
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ email: req.userEmail }).exec();
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: 'Invalid email/password combination.' });
    }

    const passwordMatch = await user.comparePassword(oldPassword);

    if (!passwordMatch) {
      return res.status(401).json({
        error: 'You entered an incorrect password.',
        success: false
      });
    }
    user.password = newPassword;
    await user.save();

    return res.json({
      message: 'Password updated successfully.',
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      error: 'There was an error. Please try again.',
      success: false
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      const emailForUserNotFound = generateNoEmailForPasswordReset();
      const mailOptions: IMailDetails = {
        from: NODEMAILER_USER,
        html: emailForUserNotFound,
        subject: 'Password Reset - Stock Watch',
        to: email,
      };
      await sendEmail(mailOptions);
      return res.json({
        message: 'Verification email has been sent.',
        success: true,
      });
    }
   // generate token
    const randomToken = generateRandomString();
    const hashedToken = await hashPasswordPromise(randomToken, 12);
    await redisAsync.hmset([randomToken, 'token', hashedToken, 'email', email, ]);
    await redisAsync.expire(randomToken, 3600);
    const passwordResetLink  = `https://stock-system-frontend.herokuapp.com/auth/resetpassword/${randomToken}`;
    const emailToUser = generateEmailForPasswordReset(passwordResetLink);
    const emailOptions = {
      from: NODEMAILER_USER,
        html: emailToUser,
        subject: 'Password Reset - Stock Watch',
        to: email,
    };
    await sendEmail(emailOptions);
    return res.json({
      message: 'Verification email has been sent.',
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'There was an error. Please try again.',
      success: false
    });
  }
};

export const resetPasswordWithLink = async (req: Request, res: Response) => {
 const { randomToken } = req.body;
 const { token, email } = await redisAsync.hmgetall(randomToken);
 if (!token || !email) {
   return res.status(401).json({
     error: 'Invalid token supplied.',
     success: false,
   });
 }
 const authToken = await createToken(email);
 return res.json({
    data: {
      authToken,
      email,
    },
    success: true,
  });
};

export const setPasswordAfterReset = async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email }).exec();
  if (!user) {
    return res.status(401).json({
      error: 'user not found.',
      success: false,
    });
  }
  user.password = newPassword;
  await user.save();
  return res.json({
    message: 'password updated successfully',
    success: true,
  });
};
