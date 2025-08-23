import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';
import cartRoutes from './cart.routes';
import productRoutes from './product.routes';
import orderRoutes from './order.routes';
import addressRoutes from './address.routes';
import customerRoutes from './customer.routes';
import { requireAuth } from '../middleware/requireAuth';

const router = Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);

router.use('/cart', requireAuth, cartRoutes);
router.use('/orders', requireAuth, orderRoutes);
router.use('/addresses', requireAuth, addressRoutes);
router.use('/customers', requireAuth, customerRoutes);

export default router;
