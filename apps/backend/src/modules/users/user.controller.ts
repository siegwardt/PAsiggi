import type { Request, Response } from "express";
import * as userService from "./user.service";
import { asyncHandler } from "../../utils/asyncHandler";

export const getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(users);
});

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (e: any) {
    if (e?.code === "P2002") return res.status(409).json({ error: "E-Mail oder Benutzername bereits vergeben" });
    throw e;
  }
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (e: any) {
    if (e?.code === "P2025") return res.status(404).json({ error: "User not found" });
    if (e?.code === "P2002") return res.status(409).json({ error: "E-Mail oder Benutzername bereits vergeben" });
    throw e;
  }
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(204).end();
  } catch (e: any) {
    if (e?.code === "P2025") return res.status(404).json({ error: "User not found" });
    throw e;
  }
});
