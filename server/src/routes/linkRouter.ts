import { Router } from 'express';
import {
  getCurrentUserLinks,
  createLink,
  updateLink,
  deleteLink,
  getLinksByUsername,
  incrementClick,
} from '../controllers/linkController.js';
import { authenticateUser } from '../middleware/authMiddleware.js';
import {
  validateLinkInput,
  validateIdParam,
} from '../middleware/validationMiddleware.js';

const router = Router();

router.get('/', authenticateUser, getCurrentUserLinks);
router.post('/create-link', authenticateUser, validateLinkInput, createLink);
router.put(
  '/:id',
  authenticateUser,
  validateIdParam,
  validateLinkInput,
  updateLink
);
router.delete('/:id', authenticateUser, validateIdParam, deleteLink);
router.get('/user/:username', getLinksByUsername);
router.patch('/:id/click', validateIdParam, incrementClick);

export default router;
