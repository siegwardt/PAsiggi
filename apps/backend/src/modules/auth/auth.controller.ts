import type { Request, Response } from "express";
import jwt, { type SignOptions, type Secret, type Algorithm } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../../utils/prisma";

const secretEnv = process.env.JWT_SECRET;
if (!secretEnv) throw new Error("JWT_SECRET is not set");
const JWT_SECRET: Secret = secretEnv;

const JWT_ISS = process.env.JWT_ISS;
const JWT_AUD = process.env.JWT_AUD;
const SALT_ROUNDS = Number(10);
const DUMMY_HASH = bcrypt.hashSync("invalid", SALT_ROUNDS);

const registerSchema = z.object({
  email: z.string().email().max(254),
  username: z.string().min(3).max(32),
  password: z.string().min(8).max(128),
});

const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(128),
});

const attempts = new Map<string, { count: number; until?: number }>();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;

function signOptions(): SignOptions {
  const opts: SignOptions = { expiresIn: "7d", algorithm: "HS256" as Algorithm };
  if (JWT_ISS) opts.issuer = JWT_ISS;
  if (JWT_AUD) opts.audience = JWT_AUD;
  return opts;
}
const SIGN_OPTS = signOptions();

function key(req: Request) {
  return req.ip || "unknown";
}

function throttled(req: Request) {
  const k = key(req);
  const entry = attempts.get(k);
  const now = Date.now();
  return !!(entry?.until && entry.until > now);
}

function fail(req: Request) {
  const k = key(req);
  const now = Date.now();
  const entry = attempts.get(k) ?? { count: 0 };
  const next = entry.count + 1;
  const updated: { count: number; until?: number } = { count: next };
  if (next >= MAX_ATTEMPTS) updated.until = now + WINDOW_MS;
  attempts.set(k, updated);
}

function ok(req: Request) {
  attempts.delete(key(req));
}

function norm(v: string) {
  return v.trim().toLowerCase();
}

function issueJwt(userId: string, roleName: string) {
  return jwt.sign({ sub: userId, role: roleName }, JWT_SECRET, SIGN_OPTS);
}

function safeUser(u: { id: string; email: string; username: string; role: { name: string } }) {
  return { id: u.id, email: u.email, username: u.username, role: u.role.name };
}

export async function register(req: Request, res: Response) {
  try {
    const parsed = registerSchema.safeParse(req.body ?? {});
    if (!parsed.success) return res.status(400).json({ error: "Ungültige Eingaben" });

    const email = norm(parsed.data.email);
    const username = parsed.data.username.trim();

    const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
    if (exists) return res.status(409).json({ error: "Benutzer existiert bereits" });

    const hashed = await bcrypt.hash(parsed.data.password, SALT_ROUNDS);

    const created = await prisma.user.create({
      data: {
        email,
        username,
        password: hashed,
        role: {
          connectOrCreate: { where: { name: "user" }, create: { name: "user" } },
        },
      },
      select: { id: true, email: true, username: true, role: { select: { name: true } } },
    });

    const token = issueJwt(String(created.id), created.role.name);
    res.set("Cache-Control", "no-store");
    return res.status(201).json({ token, user: safeUser(created) });
  } catch {
    return res.status(500).json({ error: "Interner Fehler" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    if (throttled(req)) return res.status(429).json({ error: "Zu viele Versuche. Bitte später erneut versuchen." });

    const parsed = loginSchema.safeParse(req.body ?? {});
    if (!parsed.success) return res.status(400).json({ error: "Ungültige Eingaben" });

    const email = norm(parsed.data.email);
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, username: true, password: true, role: { select: { name: true } } },
    });

    if (!user) {
      await bcrypt.compare(parsed.data.password, DUMMY_HASH);
      fail(req);
      return res.status(401).json({ error: "Ungültige Zugangsdaten" });
    }

    const match = await bcrypt.compare(parsed.data.password, user.password);
    if (!match) {
      fail(req);
      return res.status(401).json({ error: "Ungültige Zugangsdaten" });
    }

    ok(req);
    const token = issueJwt(String(user.id), user.role.name);
    res.set("Cache-Control", "no-store");
    return res.json({ token, user: safeUser(user) });
  } catch {
    return res.status(500).json({ error: "Interner Fehler" });
  }
}

export async function me(req: Request, res: Response) {
  try {
    const userId = (req as any)?.user?.id ?? (req as any)?.userId;
    if (!userId) return res.status(401).json({ error: "Nicht eingeloggt" });

    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
      select: { id: true, email: true, username: true, role: { select: { name: true } } },
    });

    if (!user) return res.status(404).json({ error: "Benutzer nicht gefunden" });
    return res.json({ user: safeUser(user) });
  } catch {
    return res.status(500).json({ error: "Interner Fehler" });
  }
}
