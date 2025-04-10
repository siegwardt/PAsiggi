import prisma from '../prisma';
import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { UserRole, User } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET!;
const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '7d';

if (!JWT_SECRET) throw new Error('JWT_SECRET fehlt in .env');

const jwtOptions: SignOptions = {
  expiresIn: ACCESS_TOKEN_EXPIRY,
};

export const validateUserLogin = async (email: string, password: string): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error('Benutzer nicht gefunden');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error('Falsches Passwort');

  return user;
};

interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const registerUser = async ({
  email,
  password,
  firstName,
  lastName,
}: RegisterInput): Promise<User> => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error('Benutzer existiert bereits');

  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: UserRole.user,
    },
  });
};

export const generateTokenPair = (user: { id: number; email: string; role: UserRole }) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET!, jwtOptions);
  const refreshToken = jwt.sign(payload, JWT_SECRET!, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};
