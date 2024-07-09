// src/models/product.ts

export interface Product {
    id: number;
    name: string;
    price: number;
  }
  // src/models/Product.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;
}
