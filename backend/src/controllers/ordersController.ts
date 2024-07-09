// src/controllers/ordersController.ts

import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Order } from '../models/Order';
import { Product } from '../models/Product';

// POST: Bestellung für einen Benutzer aufgeben
export const placeOrder = async (req: Request, res: Response) => {
  const { productId, quantity, customerId, customerName, customerEmail } = req.body;

  try {
    const productRepository = getRepository(Product);
    const product = await productRepository.findOne(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const total = quantity * product.price;

    const orderRepository = getRepository(Order);
    const newOrder = orderRepository.create({
      product,
      quantity,
      total,
      customerId,
      customerName,
      customerEmail,
    });
    await orderRepository.save(newOrder);

    res.json({ message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET: Bestellungen eines bestimmten Benutzers abrufen
export const getOrdersByCustomerId = async (req: Request, res: Response) => {
  const { customerId } = req.params;

  try {
    const orderRepository = getRepository(Order);
    const orders = await orderRepository.find({ where: { customerId } });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
