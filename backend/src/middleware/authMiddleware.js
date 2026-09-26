import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { AppError } from './errorMiddleware.js';

export const protect = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new AppError('Not authorized, token missing', 401);
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError('Not authorized, user not found', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(
      error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError'
        ? new AppError('Not authorized, invalid token', 401)
        : error
    );
  }
};

export const adminOnly = (req, _res, next) => {
  if (req.user?.role !== 'admin') {
    return next(new AppError('Admin access required', 403));
  }
  next();
};
