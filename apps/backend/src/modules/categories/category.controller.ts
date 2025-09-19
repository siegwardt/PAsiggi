import { Request, Response } from "express";
import * as service from "./category.service";

export async function getAllCategories(req: Request, res: Response) {
  const categories = await service.getAllCategories();
  res.json(categories);
}

export async function getCategoryById(req: Request, res: Response) {
  const category = await service.getCategoryById(Number(req.params.id));
  if (!category) return res.status(404).json({ error: "Category not found" });
  res.json(category);
}

export async function createCategory(req: Request, res: Response) {
  const category = await service.createCategory(req.body);
  res.status(201).json(category);
}

export async function updateCategory(req: Request, res: Response) {
  const category = await service.updateCategory(Number(req.params.id), req.body);
  res.json(category);
}

export async function deleteCategory(req: Request, res: Response) {
  await service.deleteCategory(Number(req.params.id));
  res.status(204).end();
}
