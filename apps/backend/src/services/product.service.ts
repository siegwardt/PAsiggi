import prisma from '../prisma';

export const getProductAvailability = async (productId: number) => {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error('Produkt nicht gefunden');

  const confirmed = await prisma.orderItem.aggregate({
    _sum: { quantity: true },
    where: {
      productId,
      order: { status: 'bestaetigt' }
    }
  });

  const reserved = await prisma.orderItem.aggregate({
    _sum: { quantity: true },
    where: {
      productId,
      order: { status: 'offen' }
    }
  });

  const confirmedQty = confirmed._sum.quantity ?? 0;
  const reservedQty = reserved._sum.quantity ?? 0;

  return {
    productId,
    stock: product.stock,
    confirmed: confirmedQty,
    reserved: reservedQty,
    available: product.stock - confirmedQty - reservedQty
  };
};
