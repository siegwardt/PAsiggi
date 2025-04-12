import { Request, Response } from 'express';
import prisma from '../prisma';

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, category, pricePerDay, stock, imageUrl } = req.body;

  if (!name || !pricePerDay || !stock || !category) {
    return res.status(400).json({
      error: 'Name, Preis pro Tag, Kategorie und Lagerbestand sind Pflichtfelder.'
    });
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        description,
        category,
        pricePerDay,
        stock,
        imageUrl
      }
    });

    res.status(201).json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Ungültige Produkt-ID' });
  }

  try {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ error: 'Produkt nicht gefunden' });
    }

    res.json(product);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Ungültige Produkt-ID' });
  }

  try {
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (err: any) {
    res.status(404).json({ error: 'Produkt nicht gefunden oder bereits gelöscht' });
  }
};

export const getAvailability = async (req: Request, res: Response) => {
  const productId = parseInt(req.params.id);

  if (isNaN(productId)) {
    return res.status(400).json({ error: 'Ungültige Produkt-ID' });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        stock: true,
        orderItems: {
          where: {
            order: { status: 'bestaetigt' }
          },
          select: { quantity: true }
        },
        cartItems: {
          select: { quantity: true }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: 'Produkt nicht gefunden' });
    }

    const confirmed = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const reserved = product.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const available = product.stock - confirmed - reserved;

    res.status(200).json({
      stock: product.stock,
      confirmed,
      reserved,
      available
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
