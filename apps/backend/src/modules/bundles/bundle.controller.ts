import { Request, Response } from "express";
import * as service from "./bundle.service";

export async function getAllBundles(req: Request, res: Response) {
  const bundles = await service.getAllBundles();
  res.json(bundles);
}

export async function getBundleById(req: Request, res: Response) {
  const bundle = await service.getBundleById(Number(req.params.id));
  if (!bundle) return res.status(404).json({ error: "Bundle not found" });
  res.json(bundle);
}

export async function createBundle(req: Request, res: Response) {
  const bundle = await service.createBundle(req.body);
  res.status(201).json(bundle);
}

export async function updateBundle(req: Request, res: Response) {
  const bundle = await service.updateBundle(Number(req.params.id), req.body);
  res.json(bundle);
}

export async function deleteBundle(req: Request, res: Response) {
  await service.deleteBundle(Number(req.params.id));
  res.status(204).end();
}
