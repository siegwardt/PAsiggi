import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  searchUsersByName
} from '../controllers/user.controller';
import { requireAuth } from '../middleware/requireAuth';
import { requireRole } from '../middleware/requireRole';

const router = Router();

router.get('/', getAllUsers);
router.get('/search', requireAuth, searchUsersByName);
router.get('/:id', requireAuth, getUserById);
router.post('/', createUser);
router.put('/:id', requireAuth, updateUser);
router.delete('/:id', requireAuth, requireRole('admin', 'owner'), deleteUser);

export default router;
