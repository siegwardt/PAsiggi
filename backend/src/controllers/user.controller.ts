import { Request, Response } from 'express';
import * as userService from '../services/user.service';

// GET /users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    console.error('Fehler beim Abrufen aller User:', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
};

// GET /users/:id
export const getUserById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Ungültige ID' });

  try {
    const user = await userService.getUserById(id);
    if (!user) return res.status(404).json({ error: 'User nicht gefunden' });
    res.status(200).json(user);
  } catch (err) {
    console.error(`Fehler bei getUserById(${id}):`, err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
};

// GET /users/search?name=Max
export const searchUsersByName = async (req: Request, res: Response) => {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Name fehlt in Query' });

  try {
    const users = await userService.searchUsersByName(String(name));
    res.status(200).json(users);
  } catch (err) {
    console.error('Fehler bei Namenssuche:', err);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
};

// POST /users
export const createUser = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, role } = req.body;

  if (!email || !password || !firstName || !lastName || !role) {
    return res.status(400).json({ error: 'Fehlende Felder im Request' });
  }

  try {
    const newUser = await userService.createUser({ email, password, firstName, lastName, role });
    res.status(201).json(newUser);
  } catch (err: any) {
    console.error('Fehler beim Erstellen des Users:', err);
    res.status(400).json({ error: 'Fehler beim Erstellen', details: err.message });
  }
};

// PUT /users/:id
export const updateUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Ungültige ID' });

  try {
    const user = await userService.updateUser(id, req.body);
    res.status(200).json(user);
  } catch (err) {
    console.error('Fehler beim Aktualisieren des Users:', err);
    res.status(404).json({ error: 'User nicht gefunden oder Update fehlgeschlagen' });
  }
};

// DELETE /users/:id
export const deleteUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  try {
    const deleted = await userService.deleteUser(id);
    res.status(200).json({
      message: `User mit ID ${id} erfolgreich gelöscht.`,
      deletedUser: deleted
    });
  } catch (err) {
    console.error('Fehler beim Löschen:', err);
    res.status(404).json({ error: 'User nicht gefunden' });
  }
};
