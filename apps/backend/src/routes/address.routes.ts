import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { createAddressHandler, updateAddressHandler, getAllAddressesHandler, getAddressByIdHandler, deleteAddressHandler } from '../controllers/address.controller';

const router = Router();

router.post('/', createAddressHandler);
router.get('/', getAllAddressesHandler);
router.put('/:id', updateAddressHandler);
router.get('/:id', getAddressByIdHandler);
router.delete('/:id', deleteAddressHandler);

export default router;
