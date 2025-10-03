import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken, isValidEmail } from '@/lib/auth'
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/api-helpers'
import type { LoginRequest, AuthResponse } from '@/types/auth'

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Benutzer anmelden
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "user@example.com"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: Login erfolgreich
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Ungültige Anmeldedaten
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    // Validierung
    if (!email || !password) {
      return createErrorResponse('Email/Username und Passwort sind erforderlich', 400)
    }

    // User finden (Email oder Username)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: email.toLowerCase() }
        ]
      },
      include: {
        role: true,
        addresses: {
          include: {
            types: true
          }
        }
      }
    })

    if (!user) {
      return createErrorResponse('Ungültige Anmeldedaten', 401)
    }

    // Passwort prüfen
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return createErrorResponse('Ungültige Anmeldedaten', 401)
    }

    // Token generieren
    const token = generateToken(user.id)

    const response: AuthResponse = {
      message: 'Login erfolgreich',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        roleId: user.roleId,
        role: user.role,
        addresses: user.addresses,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }

    return createSuccessResponse(response)
  } catch (error) {
    return handleApiError(error, 'Fehler beim Login')
  }
}