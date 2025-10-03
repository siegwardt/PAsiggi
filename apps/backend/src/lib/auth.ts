import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { JWTPayload } from '@/types/auth'

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET ist nicht definiert in den Environment Variables')
}

export async function hashPassword(password: string): Promise<string> {
  if (!password || password.length < 6) {
    throw new Error('Passwort muss mindestens 6 Zeichen lang sein')
  }
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(
  password: string, 
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hashedPassword)
  } catch (error) {
    console.error('Fehler beim Passwort-Vergleich:', error)
    return false
  }
}

export function generateToken(userId: string): string {
  const payload: JWTPayload = { userId }
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: '7d',
    issuer: 'mein-app',
    audience: 'mein-app-users'
  })
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'mein-app',
      audience: 'mein-app-users'
    }) as JWTPayload
    
    return decoded
  } catch (error) {
    console.error('Token-Verifikation fehlgeschlagen:', error)
    return null
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidUsername(username: string): boolean {
  // Username: 3-20 Zeichen, nur Buchstaben, Zahlen und Unterstriche
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
  return usernameRegex.test(username)
}