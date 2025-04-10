import { Request, Response } from 'express';
import {
  validateUserLogin,
  generateTokenPair,
  registerUser
} from '../services/auth.service';
import jwt from 'jsonwebtoken';
import { UserRole } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error('JWT_SECRET fehlt in der .env-Datei.');

export const loginHandler = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-Mail und Passwort sind erforderlich.' });
  }

  try {
    const user = await validateUserLogin(email, password);
    const { accessToken, refreshToken } = generateTokenPair(user);

    res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      .json({
        accessToken,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};

export const registerHandler = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Alle Felder sind Pflicht.' });
  }

  try {
    const newUser = await registerUser({
      email,
      password,
      firstName,
      lastName
    });

    res.status(201).json({
      message: 'Registrierung erfolgreich.',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const refreshHandler = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ error: 'Kein Refresh Token vorhanden' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      role: UserRole;
    };

    const { accessToken } = generateTokenPair({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    });

    res.json({ accessToken });
  } catch (err: any) {
    res.status(401).json({ error: 'Refresh Token ungültig oder abgelaufen' });
  }
};
