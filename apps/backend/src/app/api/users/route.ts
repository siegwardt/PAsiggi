import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/api-helpers'
import type { UserWithoutPassword } from '@/types/auth'

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Alle Benutzer abrufen
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Seitennummer für Pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Anzahl Benutzer pro Seite
 *     responses:
 *       200:
 *         description: Liste der Benutzer
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 total:
 *                   type: integer
 *       401:
 *         description: Nicht authentifiziert
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

interface UsersResponse {
  users: UserWithoutPassword[]
  total: number
}

export async function GET(request: NextRequest) {
  try {
    // Token aus Header extrahieren
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    
    if (!token) {
      return createErrorResponse('Kein Authentifizierungs-Token vorhanden', 401)
    }

    // Token verifizieren
    const decoded = verifyToken(token)
    if (!decoded) {
      return createErrorResponse('Ungültiger oder abgelaufener Token', 401)
    }

    // Query Parameter für Pagination
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Alle User abfragen (ohne Passwörter)
    const [users, total] = await Promise.all([
      prisma.user.findMany({
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
        },
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.user.count()
    ])

    const response: UsersResponse = {
      users,
      total
    }

    return createSuccessResponse(response)
  } catch (error) {
    return handleApiError(error, 'Fehler beim Abrufen der Benutzer')
  }
}