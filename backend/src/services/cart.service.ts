import prisma from '../prisma';
import { getProductAvailability } from './product.service';
import { OrderStatus } from '@prisma/client';

export const getCart = async (customerProfileId: number) =>
  prisma.cart.findUnique({
    where: { customerProfileId },
    include: {
      items: {
        include: { product: true },
      },
    },
  });

export const addToCart = async (customerProfileId: number, productId: number, quantity: number) => {
  const [availability, cart] = await Promise.all([
    getProductAvailability(productId),
    prisma.cart.upsert({
      where: { customerProfileId },
      update: {},
      create: { customerProfileId },
    }),
  ]);

  if (quantity > availability.available) {
    throw new Error(`Nur ${availability.available} Stück verfügbar.`);
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: { increment: quantity },
      },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
};

export const removeItemFromCart = async (itemId: number, customerProfileId: number) => {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!item || item.cart.customerProfileId !== customerProfileId) {
    throw new Error('Kein Zugriff auf diesen Warenkorbeintrag.');
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
};

export const clearCart = async (customerProfileId: number) => {
  const cart = await prisma.cart.findUnique({ where: { customerProfileId } });
  if (!cart) return;

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
};

export const updateCartItemQuantity = async (customerProfileId: number, itemId: number, newQuantity: number) => {
  if (newQuantity <= 0) throw new Error('Menge muss größer als 0 sein.');

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!item || item.cart.customerProfileId !== customerProfileId) {
    throw new Error('Kein Zugriff auf diesen Warenkorbeintrag.');
  }

  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: newQuantity },
  });
};

export const checkoutCart = async (customerProfileId: number, eventAddressId: number) => {
  const cart = await prisma.cart.findUnique({
    where: { customerProfileId },
    include: { items: true },
  });

  if (!cart || cart.items.length === 0) throw new Error('Warenkorb ist leer.');

  let totalPrice = 0;
  for (const item of cart.items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    if (product) totalPrice += product.pricePerDay * item.quantity;
  }

  const order = await prisma.order.create({
    data: {
      customerProfileId,
      eventAddressId,
      totalPrice,
      status: OrderStatus.offen,
      startDate: new Date(),
      endDate: new Date(),
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    },
  });

  await clearCart(customerProfileId);
  return order;
};
