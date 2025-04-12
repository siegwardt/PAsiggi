import { Router } from 'express';
import { getCustomerProfileHandler } from '../controllers/customer.controller';

const router = Router();

router.get('/:id', getCustomerProfileHandler);

export default router;
