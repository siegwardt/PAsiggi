// src/server.ts

import express from 'express';
import bodyParser from 'body-parser';
import { createConnection, getConnectionOptions } from 'typeorm';
import { Product } from './models/Product';
import { CartItem } from './models/CartItem';
import { Order } from './models/Order';
import { getAllProducts } from './controllers/productsController';
import { getCartByCustomerId, addToCart, removeFromCart } from './controllers/cartController';
import { placeOrder, getOrdersByCustomerId } from './controllers/ordersController';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Verbindung zur Datenbank herstellen und Server starten
async function startServer() {
  try {
    const connectionOptions = await getConnectionOptions();
    await createConnection({ ...connectionOptions, entities: [Product, CartItem, Order] });

    console.log('Connected to database');
    
    // Routen definieren
    app.get('/api/products', getAllProducts);
    app.get('/api/cart/:customerId', getCartByCustomerId);
    app.post('/api/cart/add', addToCart);
    app.delete('/api/cart/remove', removeFromCart);
    app.post('/api/orders/place', placeOrder);
    app.get('/api/orders/:customerId', getOrdersByCustomerId);

    // Server starten
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection error:', error);
  }
}

startServer();
