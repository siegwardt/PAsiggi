import prisma from '../prisma';

export const getCustomerProfile = async (id: number) => {
  return prisma.customerProfile.findUnique({
    where: { id },
    include: {
      address: true,
      orders: {
        orderBy: { createdAt: 'desc' },
        include: {
          eventAddress: true,
          items: {
            include: {
              product: {
                select: { name: true }
              }
            }
          }
        }
      }
    }
  });
};
