import prisma from '../prisma';
import { getProductAvailability } from './product.service';
import { OrderStatus, UserRole } from '@prisma/client';

interface OrderItemInput {
  productId: number;
  quantity: number;
}

interface CreateOrderInput {
  userId: number;
  startDate: Date;
  endDate: Date;
  items: OrderItemInput[];
  eventAddressId?: number;
  eventAddress?: {
    label: string;
    street: string;
    zip: string;
    city: string;
    country: string;
  };
}

export const createOrder = async ({
  userId,
  eventAddressId,
  eventAddress,
  startDate,
  endDate,
  items
}: CreateOrderInput) => {
  if (!items || items.length === 0) {
    throw new Error('Keine Produkte angegeben');
  }

  const rentalDays = Math.max(
    1,
    Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  const productIds = items.map(item => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } }
  });

  const productMap = new Map(products.map(p => [p.id, p]));
  let totalPrice = 0;

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) throw new Error(`Produkt mit ID ${item.productId} nicht gefunden`);

    const availability = await getProductAvailability(item.productId);
    if (item.quantity > availability.available) {
      throw new Error(`Nur noch ${availability.available} Stück verfügbar für ${product.name}`);
    }

    totalPrice += product.pricePerDay * item.quantity * rentalDays;
  }

  let addressId = eventAddressId;
  if (!addressId && eventAddress) {
    const created = await prisma.address.create({ data: eventAddress });
    addressId = created.id;
  }

  if (!addressId) {
    throw new Error('Keine gültige Event-Adresse angegeben');
  }

  return prisma.order.create({
    data: {
      customerProfileId: userId,
      eventAddressId: addressId,
      startDate,
      endDate,
      totalPrice,
      status: OrderStatus.offen,
      items: {
        create: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      }
    }
  });
};

export const updateOrder = async (
  orderId: number,
  userRole: UserRole,
  data: Partial<{
    startDate: Date;
    endDate: Date;
    eventAddressId: number;
    status: OrderStatus;
  }>
) => {
  if (userRole !== UserRole.admin && userRole !== UserRole.owner) {
    throw new Error('Nicht berechtigt, Bestellung zu bearbeiten');
  }
  const existing = await prisma.order.findUnique({ where: { id: orderId } });
  if (!existing) throw new Error('Bestellung nicht gefunden');

  return prisma.order.update({
    where: { id: orderId },
    data: {
      ...data,
      status: data.status
    }
  });
};

export const getOrderById = async (id: number) => {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: { product: true }
      },
      eventAddress: true,
      customerProfile: true
    }
  });
};

export const getOrdersByCustomer = async (customerProfileId: number) => {
  return prisma.order.findMany({
    where: { customerProfileId },
    include: {
      items: {
        include: { product: true }
      },
      eventAddress: true
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const deleteOrder = async (orderId: number) => {
  const existing = await prisma.order.findUnique({ where: { id: orderId } });
  if (!existing) throw new Error('Bestellung nicht gefunden');

  if (existing.status !== OrderStatus.offen) {
    throw new Error('Nur offene Bestellungen können gelöscht werden');
  }

  return prisma.order.delete({ where: { id: orderId } });
};
