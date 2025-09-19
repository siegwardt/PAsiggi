import { Request, Response } from "express";
import * as service from "./product.service";

export async function getAllProducts(req: Request, res: Response) {
  const products = await service.getAllProducts();
  res.json(products);
}

export async function getProductById(req: Request, res: Response) {
  const product = await service.getProductById(Number(req.params.id));
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
}

export async function createProduct(req: Request, res: Response) {
  const product = await service.createProduct(req.body);
  res.status(201).json(product);
}

export async function updateProduct(req: Request, res: Response) {
  const product = await service.updateProduct(Number(req.params.id), req.body);
  res.json(product);
}

export async function deleteProduct(req: Request, res: Response) {
  await service.deleteProduct(Number(req.params.id));
  res.status(204).end();
}
