import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { prisma } from "../../utils/prisma";
import type { AppJwtPayload } from "../../types/common";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const TOKEN_TTL = "1d";
const SALT_ROUNDS = 10;

// Utility: build the JWT and return a safe user object
function issueTokenAndUser(user: { id: number; email: string; role: "admin" | "user" }) {
  const payload: AppJwtPayload = { id: user.id, email: user.email, role: user.role };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_TTL });
  return { token, user };
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body ?? {};
    if (!email || !password) {
      return res.status(400).json({ error: "Email und Passwort sind erforderlich" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Ungültige Zugangsdaten" });
    }

    // Compare hashed password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ error: "Ungültige Zugangsdaten" });
    }

    const { token, user: safeUser } = issueTokenAndUser({
      id: user.id,
      email: user.email,
      role: user.role as "admin" | "user",
    });

    // Do NOT send password back
    return res.json({ token, user: safeUser });
  } catch (err: any) {
    if (process.env.NODE_ENV !== "production") console.error("[auth.login]", err);
    return res.status(500).json({ error: "Interner Fehler" });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastName } = req.body ?? {};
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: "Alle Felder sind erforderlich" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Benutzer existiert bereits" });
    }

    // Hash password before storing
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName,
        lastName,
        role: "user", // default
      },
      select: { id: true, email: true, role: true }, // never return password
    });

    // Option A: auto-login after register
    const { token, user: safeUser } = issueTokenAndUser(user);
    return res.status(201).json({ token, user: safeUser });

    // Option B: if you prefer no auto-login:
    // return res.status(201).json({ message: "Benutzer erstellt" });
  } catch (err: any) {
    if (process.env.NODE_ENV !== "production") console.error("[auth.register]", err);
    return res.status(500).json({ error: "Interner Fehler" });
  }
}

export async function me(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: "Nicht eingeloggt" });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        addresses: true,
      },
    });

    if (!user) return res.status(404).json({ error: "Benutzer nicht gefunden" });
    return res.json(user);
  } catch (err: any) {
    if (process.env.NODE_ENV !== "production") console.error("[auth.me]", err);
    return res.status(500).json({ error: "Interner Fehler" });
  }
}
