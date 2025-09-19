import { prisma } from '../../utils/prisma'

export async function getAllUsers() {
  return prisma.user.findMany({ include: { addresses: true } });
}

export async function createUser(data: any) {
  return prisma.user.create({ data });
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({ where: { id }, include: { addresses: true } });
}

export async function updateUser(id: number, data: any) {
  return prisma.user.update({ where: { id }, data });
}

export async function deleteUser(id: number) {
  return prisma.user.delete({ where: { id } });
}
