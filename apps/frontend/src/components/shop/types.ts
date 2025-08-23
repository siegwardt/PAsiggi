export type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
};


export type CartItem = {
product: Product;
qty: number;
};