import { Request, Response } from "express";
import * as userService from "./user.service";

export async function getAllUsers(req: Request, res: Response) {
  const users = await userService.getAllUsers();
  res.json(users);
}

export async function createUser(req: Request, res: Response) {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
}

export async function getUserById(req: Request, res: Response) {
  const user = await userService.getUserById(Number(req.params.id));
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
}

export async function updateUser(req: Request, res: Response) {
  const user = await userService.updateUser(Number(req.params.id), req.body);
  res.json(user);
}

export async function deleteUser(req: Request, res: Response) {
  await userService.deleteUser(Number(req.params.id));
  res.status(204).end();
}
