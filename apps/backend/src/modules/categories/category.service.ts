import { prisma } from "../../utils/prisma";

export async function getAllCategories() {
  return prisma.category.findMany({ include: { products: true } });
}

export async function getCategoryById(id: number) {
  return prisma.category.findUnique({ where: { id }, include: { products: true } });
}

export async function createCategory(data: any) {
  return prisma.category.create({ data });
}

export async function updateCategory(id: number, data: any) {
  return prisma.category.update({ where: { id }, data });
}

export async function deleteCategory(id: number) {
  return prisma.category.delete({ where: { id } });
}
