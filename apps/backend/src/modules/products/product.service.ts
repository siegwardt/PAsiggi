import { prisma } from "../../utils/prisma";

export async function getAllProducts() {
  return prisma.product.findMany({ include: { category: true } });
}

export async function getProductById(id: number) {
  return prisma.product.findUnique({ where: { id }, include: { category: true } });
}

export async function createProduct(data: any) {
  return prisma.product.create({ data });
}

export async function updateProduct(id: number, data: any) {
  return prisma.product.update({ where: { id }, data });
}

export async function deleteProduct(id: number) {
  return prisma.product.delete({ where: { id } });
}
