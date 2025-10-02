import { prisma } from "../../utils/prisma";
import type { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = Number(process.env.BCRYPT_COST ?? 10);

export const userSelect = {
  id: true,
  email: true,
  username: true,
  role: { select: { name: true } },
  createdAt: true,
  updatedAt: true,
} as const;

export async function getAllUsers() {
  return prisma.user.findMany({ select: userSelect, orderBy: { createdAt: "desc" } });
}

export async function createUser(input: {
  email: string;
  username: string;
  password: string;
  roleName?: string;
}) {
  const email = input.email.trim().toLowerCase();
  const username = input.username.trim();
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const roleName = input.roleName ?? "user";

  return prisma.user.create({
    data: {
      email,
      username,
      password: passwordHash,
      role: { connectOrCreate: { where: { name: roleName }, create: { name: roleName } } },
    },
    select: userSelect,
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id }, select: userSelect });
}

export async function updateUser(
  id: string,
  data: { email?: string; username?: string; password?: string; roleName?: string }
) {
  const updateData: Prisma.UserUpdateInput = {};
  if (data.email) updateData.email = data.email.trim().toLowerCase();
  if (data.username) updateData.username = data.username.trim();
  if (data.password) updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
  if (data.roleName) {
    updateData.role = { connectOrCreate: { where: { name: data.roleName }, create: { name: data.roleName } } };
  }

  return prisma.user.update({ where: { id }, data: updateData, select: userSelect });
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } });
}
