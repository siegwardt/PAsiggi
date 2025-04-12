import { Request, Response } from 'express';
import { getCustomerProfile } from '../services/customer.service';

export const getCustomerProfileHandler = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Ungültige ID' });
  }

  try {
    const profile = await getCustomerProfile(id);

    if (!profile) {
      return res.status(404).json({ error: 'Kunde nicht gefunden' });
    }

    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
