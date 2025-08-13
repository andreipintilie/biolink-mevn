import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import {
  body,
  param,
  validationResult,
  ValidationChain,
} from 'express-validator';
import User from '../models/userModel.js';

const validate = (validateValues: ValidationChain[]) => {
  return [
    ...validateValues,
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ errors: errors.array() });
      }
      next();
    },
  ];
};

export const validateRegisterInput = validate([
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 6, max: 30 })
    .withMessage('Username must be between 6 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .custom(async (username) => {
      const user = await User.findOne({ username });

      if (user) {
        throw new Error('Username already exists');
      }
    }),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail()
    .custom(async (email) => {
      const user = await User.findOne({ email });

      if (user) {
        throw new Error('Email already exists');
      }
    }),
]);

export const validateLoginInput = validate([
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .isLength({
      min: 6,
    })
    .withMessage('Password must be at least 6 characters'),
]);

export const validateLinkInput = validate([
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters')

    .escape(),

  body('url')
    .trim()
    .notEmpty()
    .withMessage('URL is required')
    .isURL()
    .withMessage('Invalid URL format'),
]);

export const validateProfileUpdate = validate([
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters')
    .trim()
    .escape(),
]);

export const validateIdParam = validate([
  param('id').isMongoId().withMessage('Invalid ID format'),
]);
