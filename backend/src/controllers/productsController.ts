// src/controllers/productsController.ts

import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { Product } from '../models/Product';

// GET: Alle Produkte abrufen
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const productRepository = getRepository(Product);
    const products = await productRepository.find();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
