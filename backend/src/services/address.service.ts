import prisma from '../prisma';

export const createAddress = async ({
  label,
  street,
  zip,
  city,
  country
}: {
  label: string;
  street: string;
  zip: string;
  city: string;
  country: string;
}) => {
  return prisma.address.create({
    data: {
      label,
      street,
      zip,
      city,
      country
    }
  });
};

export const updateAddress = async (
  id: number,
  data: {
    label?: string;
    street?: string;
    zip?: string;
    city?: string;
    country?: string;
  }
) => {
  return prisma.address.update({
    where: { id },
    data
  });
};

export const deleteAddress = async (id: number) => {
  return prisma.address.delete({
    where: { id }
  });
};
