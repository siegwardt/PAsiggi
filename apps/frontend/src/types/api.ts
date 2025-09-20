export type UserRole = "admin" | "user";

export type Category = {
  id: number;
  slug: string;
  name: string;
};

export type Product = {
  id: number;
  slug?: string | null;
  sku?: string | null;
  name: string;
  description?: string | null;
  priceCents: number;
  stock: number;
  active: boolean;
  imageUrl?: string | null;
  imageFilename?: string | null;
  categoryId?: number | null;
  category?: Category | null;
  createdAt: string;
  updatedAt: string;
};

export type BundleImage = {
  id: number;
  bundleId: number;
  imageFilename: string;
  alt?: string | null;
  sort: number;
};

export type BundleItem = {
  id: number;
  bundleId: number;
  productId: number;
  quantity: number;
  product?: Product;
};

export type Bundle = {
  id: number;
  slug?: string | null;
  name: string;
  description?: string | null;
  active: boolean;
  images: BundleImage[];
  items: BundleItem[];
  createdAt: string;
  updatedAt: string;
};
