import { Request, Response } from 'express'; 
import * as cartService from '../services/cart.service';
import { AuthRequest } from '../types/common';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await cartService.getCart(req.user!.id);
    res.json(cart);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const addItem = async (req: AuthRequest, res: Response) => {
  const { productId, quantity } = req.body;
  try {
    const item = await cartService.addToCart(req.user!.id, productId, quantity);
    res.status(201).json(item);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const removeItem = async (req: AuthRequest, res: Response) => {
  try {
    await cartService.removeItemFromCart(+req.params.itemId, req.user!.id);
    res.status(204).send();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    await cartService.clearCart(req.user!.id);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateItemQuantity = async (req: AuthRequest, res: Response) => {
  const { quantity } = req.body;
  try {
    const updated = await cartService.updateCartItemQuantity(req.user!.id, +req.params.itemId, quantity);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const checkout = async (req: AuthRequest, res: Response) => {
  try {
    const order = await cartService.checkoutCart(req.user!.id, req.body.eventAddressId);
    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
