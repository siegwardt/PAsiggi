import { Router } from 'express';
import { createOrderHandler, getOrderHandler, getOrdersHandler } from '../controllers/order.controller';

const router = Router();

router.post('/', createOrderHandler);
router.get('/', getOrdersHandler);
router.get('/:id', getOrderHandler);

export default router;
