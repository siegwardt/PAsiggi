export type Product = {
id: string;
name: string;
price: number; // in EUR
image?: string;
description?: string;
stock?: number; // optional live stock
};


export type CartItem = {
product: Product;
qty: number;
};