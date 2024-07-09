// src/controllers/cartController.ts

import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { CartItem } from '../models/CartItem';
import { Product } from '../models/Product';

// GET: Warenkorb eines bestimmten Benutzers abrufen
export const getCartByCustomerId = async (req: Request, res: Response) => {
  const { customerId } = req.params;

  try {
    const cartRepository = getRepository(CartItem);
    const cartItems = await cartRepository.find({ where: { customerId }, relations: ['product'] });
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// POST: Produkt zum Warenkorb eines Benutzers hinzufügen
export const addToCart = async (req: Request, res: Response) => {
  const { productId, quantity, customerId } = req.body;

  try {
    const productRepository = getRepository(Product);
    const product = await productRepository.findOne(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cartRepository = getRepository(CartItem);
    const existingCartItem = await cartRepository.findOne({ where: { product, customerId } });

    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      await cartRepository.save(existingCartItem);
    } else {
      const newCartItem = cartRepository.create({
        product,
        quantity,
        customerId,
      });
      await cartRepository.save(newCartItem);
    }

    res.json({ message: 'Product added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// DELETE: Produkt aus dem Warenkorb eines Benutzers entfernen
export const removeFromCart = async (req: Request, res: Response) => {
  const { productId, customerId } = req.body;

  try {
    const cartRepository = getRepository(CartItem);
    const cartItem = await cartRepository.findOne({ where: { productId, customerId } });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    await cartRepository.remove(cartItem);
    res.json({ message: 'Product removed from cart' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
