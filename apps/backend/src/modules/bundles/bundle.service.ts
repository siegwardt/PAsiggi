import { prisma } from "../../utils/prisma";

export async function getAllBundles() {
  return prisma.bundle.findMany({
    include: {
      items: { include: { product: true } },
      images: true,
    },
  });
}

export async function getBundleById(id: number) {
  return prisma.bundle.findUnique({
    where: { id },
    include: {
      items: { include: { product: true } },
      images: true,
    },
  });
}

export async function createBundle(data: any) {
  return prisma.bundle.create({ data });
}

export async function updateBundle(id: number, data: any) {
  return prisma.bundle.update({ where: { id }, data });
}

export async function deleteBundle(id: number) {
  return prisma.bundle.delete({ where: { id } });
}
