import { NextFunction, Request, Response } from 'express';
import joi from 'joi';
import { User } from '../../models/User';
import { verifyToken } from './helpers';

interface IVerifiedToken {
  email?: string;
  iat?: string;
  exp?: string;
}

export const validateUserToken = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.status(403).json({ success: false, error: 'Authorization Token is required.' });
  }
  const { authorization } = req.headers;
  const schema = joi.object()
    .keys({
      authorization: joi.string()
        .regex(/^Bearer [A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/)
        .required()
        .label('authorization [header]')
        // .options({ language: { string: { regex: { base: 'Invalid or no Authorization Token was provided.' } } } }),
    })
    .unknown(true);
  const validation = joi.validate(req.headers, schema);
  if (validation.error) {
    return res.status(403).json({ success: false, error: 'Invalid or no Authorization Token was provided.' });
  }
  try {
    const [, token, ] = authorization!.split('Bearer ');
    const getEmailFromToken: IVerifiedToken = await verifyToken(token);
    req.userEmail = getEmailFromToken.email;
    return next();
  } catch (error) {
    return res.status(403).json({ success: false, error: 'Invalid or no Authorization Token was provided.' });
  }
};

export const validateAuthDetails = async (req: Request, res: Response, next: NextFunction) => {
  const schema = joi.object().keys({
    email: joi
      .string()
      .email()
      .required(),
    password: joi.string().min(6).required()
  });
  const validation = joi.validate(req.body, schema);

  if (validation.error) {
    return res
      .status(400)
      .json({ success: false, error: validation.error.details[0].message });
  }
  return next();
};

export const validatePassword = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return res
      .status(401)
      .json({ success: false, error: 'Invalid email/password combination.' });
    }

    const passwordMatch = await user.comparePassword(password);

    if (!passwordMatch) {
      return res
        .status(401)
        .json({
          error: 'Incorrect email/password combination.',
          success: false,
      });
    }
    return next();
  } catch (err) {
    return res
    .status(500)
    .json({
      error: 'There was an error. Please try again.',
      success: false,
    });
  }
};

export const validateChangePassword = async (req: Request, res: Response, next: NextFunction) => {
  const schema = joi.object().keys({
    newPassword: joi.string().min(6).required(),
    oldPassword: joi.string().min(6).required(),
  });
  const validation = joi.validate(req.body, schema);

  if (validation.error) {
    return res
      .status(400)
      .json({ success: false, error: validation.error.details[0].message });
  }
  return next();
};

export const validateEmail = async (req: Request, res: Response, next: NextFunction) => {
  const schema = joi.object().keys({
    email: joi
      .string()
      .email()
      .required(),
  });
  const validation = joi.validate(req.body, schema);

  if (validation.error) {
    return res
      .status(400)
      .json({ success: false, error: validation.error.details[0].message });
  }
  return next();
};

export const validatePasswordReset = async (req: Request, res: Response, next: NextFunction) => {
  const schema = joi.object().keys({
    email: joi
      .string()
      .email()
      .required(),
    newPassword: joi.string().min(6).required(),
  });
  const validation = joi.validate(req.body, schema);

  if (validation.error) {
    return res
      .status(400)
      .json({ success: false, error: validation.error.details[0].message });
  }
  return next();
};
