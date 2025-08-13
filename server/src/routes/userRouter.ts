import { Router } from 'express';
import {
  checkAuth,
  getPublicProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import { validateProfileUpdate } from '../middleware/validationMiddleware.js';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const router = Router();

router.get('/me', authenticateUser, (req: Request, res: Response) => {
  if (!req.user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ msg: 'Not authenticated' });
  }
  return res.status(StatusCodes.OK).json(req.user);
});

router.get('/', authenticateUser, checkAuth);
router.get('/profile', authenticateUser, checkAuth);
// Public route for viewing user profiles
router.get('/profile/:username', getPublicProfile);
// Update user profile (bio, displayName, profilePicture)
router.patch(
  '/profile',
  authenticateUser,
  validateProfileUpdate,
  updateUserProfile
);

export default router;
