import { Request, Response } from 'express';
import {
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderById,
  getOrdersByCustomer
} from '../services/order.service';
import { AuthRequest } from '../types/common';
import { UserRole } from '@prisma/client';

export const createOrderHandler = async (req: Request, res: Response) => {
  const {
    customerProfileId,
    eventAddressId,
    eventAddress,
    startDate,
    endDate,
    items
  } = req.body;

  if (!customerProfileId || !startDate || !endDate || !items) {
    return res.status(400).json({ error: 'Pflichtfelder fehlen.' });
  }

  try {
    const order = await createOrder({
      userId: customerProfileId,
      eventAddressId,
      eventAddress,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      items
    });

    res.status(201).json(order);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrderHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Ungültige ID' });

  const order = await getOrderById(id);
  if (!order) return res.status(404).json({ error: 'Bestellung nicht gefunden' });

  res.json(order);
};

export const getOrdersHandler = async (req: Request, res: Response) => {
  const customerId = parseInt(req.query.customerProfileId as string);
  if (isNaN(customerId)) {
    return res.status(400).json({ error: 'customerProfileId ist erforderlich' });
  }

  try {
    const orders = await getOrdersByCustomer(customerId);
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateOrderHandler = async (req: AuthRequest, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Ungültige ID' });

  const userRole = req.user?.role as UserRole;

  try {
    const updated = await updateOrder(id, userRole, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
};

export const deleteOrderHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Ungültige ID' });

  try {
    await deleteOrder(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
