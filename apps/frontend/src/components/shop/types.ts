export type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
  images?: { url: string; alt: string }[];
};


export type CartItem = {
product: Product;
qty: number;
};