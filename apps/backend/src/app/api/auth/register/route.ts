import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword, isValidEmail, isValidUsername } from '@/lib/auth'
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/api-helpers'
import type { RegisterRequest, AuthResponse } from '@/types/auth'

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Neuen Benutzer registrieren
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             email: "user@example.com"
 *             username: "testuser"
 *             password: "password123"
 *             roleId: "optional-role-id"
 *     responses:
 *       201:
 *         description: Benutzer erfolgreich erstellt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Ungültige Eingabedaten
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Benutzer existiert bereits
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export async function POST(request: NextRequest) {
  try {
    const body: RegisterRequest = await request.json()
    const { email, username, password, roleId } = body

    // Validierung
    if (!email || !username || !password) {
      return createErrorResponse('Email, Username und Passwort sind erforderlich', 400)
    }

    if (!isValidEmail(email)) {
      return createErrorResponse('Ungültige Email-Adresse', 400)
    }

    if (!isValidUsername(username)) {
      return createErrorResponse('Username muss 3-20 Zeichen lang sein und darf nur Buchstaben, Zahlen und Unterstriche enthalten', 400)
    }

    if (password.length < 6) {
      return createErrorResponse('Passwort muss mindestens 6 Zeichen lang sein', 400)
    }

    // Prüfen ob User bereits existiert
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { username: username.toLowerCase() }
        ]
      }
    })

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return createErrorResponse('Ein Benutzer mit dieser Email existiert bereits', 409)
      }
      if (existingUser.username === username.toLowerCase()) {
        return createErrorResponse('Dieser Username ist bereits vergeben', 409)
      }
    }

    // Standard-Role finden oder erstellen
    let defaultRole = await prisma.role.findUnique({
      where: { name: 'user' }
    })

    if (!defaultRole) {
      defaultRole = await prisma.role.create({
        data: { name: 'user' }
      })
    }

    // Passwort hashen und User erstellen
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        username: username.toLowerCase(),
        password: hashedPassword,
        roleId: roleId || defaultRole.id
      },
      include: {
        role: true
      }
    })

    const response: AuthResponse = {
      message: 'Benutzer erfolgreich erstellt',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        roleId: user.roleId,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }

    return createSuccessResponse(response, 201)
  } catch (error) {
    return handleApiError(error, 'Fehler beim Erstellen des Benutzers')
  }
}