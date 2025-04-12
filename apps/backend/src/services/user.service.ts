import { UserRole } from '@prisma/client';
import prisma from '../prisma';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const getAllUsers = async () => {
  return await prisma.user.findMany({
    orderBy: { id: 'asc' },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      active: true,
      createdAt: true
    }
  });
};

export const getUserById = async (id: number) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      active: true,
      createdAt: true
    }
  });
};

export const searchUsersByName = async (name: string) => {
  return await prisma.user.findMany({
    where: {
      OR: [
        { firstName: { contains: name, mode: 'insensitive' } },
        { lastName: { contains: name, mode: 'insensitive' } }
      ]
    }
  });
};

export const createUser = async (data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}) => {
  if (!Object.values(UserRole).includes(data.role as UserRole)) {
    throw new Error(`Ungültige Rolle: ${data.role}`);
  }

  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

  return await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role as UserRole
    },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true
    }
  });
};

export const updateUser = async (
  id: number,
  data: {
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    active?: boolean;
    password?: string;
  }
) => {
  let updateData = { ...data } as any;

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  }

  return await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      active: true
    }
  });
};

export const deleteUser = async (id: number) => {
  return await prisma.user.delete({
    where: { id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true
    }
  });
};
