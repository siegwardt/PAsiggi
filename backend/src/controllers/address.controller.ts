import { Request, Response } from 'express';
import { createAddress, updateAddress, deleteAddress } from '../services/address.service';
import prisma from '../prisma';

export const getAllAddressesHandler = async (_req: Request, res: Response) => {
  const addresses = await prisma.address.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(addresses);
};

export const getAddressByIdHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Ungültige ID' });

  const address = await prisma.address.findUnique({ where: { id } });
  if (!address) return res.status(404).json({ error: 'Adresse nicht gefunden' });

  res.json(address);
};

export const createAddressHandler = async (req: Request, res: Response) => {
  const { label, street, zip, city, country } = req.body;

  if (!label || !street || !zip || !city || !country) {
    return res.status(400).json({ error: 'Alle Felder sind Pflicht' });
  }

  try {
    const address = await createAddress({ label, street, zip, city, country });
    res.status(201).json(address);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAddressHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const data = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Ungültige ID' });
  }

  try {
    const updated = await updateAddress(id, data);
    res.json(updated);
  } catch (err: any) {
    res.status(404).json({ error: 'Adresse nicht gefunden' });
  }
};

export const deleteAddressHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Ungültige ID' });
  }

  try {
    await deleteAddress(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(404).json({ error: 'Adresse nicht gefunden' });
  }
};
