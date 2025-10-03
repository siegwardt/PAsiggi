import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/api-helpers'

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Aktuelle Benutzerdaten abrufen
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Benutzerdaten erfolgreich abgerufen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Nicht authentifiziert
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Benutzer nicht gefunden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    
    if (!token) {
      return createErrorResponse('Kein Authentifizierungs-Token vorhanden', 401)
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return createErrorResponse('Ungültiger oder abgelaufener Token', 401)
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        roleId: true,
        role: true,
        addresses: {
          include: {
            types: true
          }
        },
        createdAt: true,
        updatedAt: true
      }
    })

    if (!user) {
      return createErrorResponse('Benutzer nicht gefunden', 404)
    }

    return createSuccessResponse({ user })
  } catch (error) {
    return handleApiError(error, 'Fehler beim Abrufen der Benutzerdaten')
  }
}