import { Request, Response } from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

export const register = async (req: Request, res: Response) => {
  const isFirstAccount = (await User.countDocuments()) === 0;
  req.body.role = isFirstAccount ? 'admin' : 'user';

  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;

  req.body.createdAt = new Date();
  req.body.updatedAt = new Date();

  await User.create(req.body);
  res.status(StatusCodes.CREATED).json({ msg: 'user created' });
};

export const login = async (req: Request, res: Response) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Invalid credentials' });
  }

  const isMatch = await comparePassword(req.body.password, user.password);
  if (!isMatch) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as Secret,
    { expiresIn: '1d' }
  );

  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(StatusCodes.OK).json({ user });
};

export const logout = (req: Request, res: Response) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(Date.now()),
  });

  res.status(StatusCodes.OK).json({ msg: 'user logged out' });
};
