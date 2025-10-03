import { NextResponse } from 'next/server'
import type { ApiError } from '@/types/auth'

export function createErrorResponse(
  message: string, 
  status: number = 500
): NextResponse<ApiError> {
  return NextResponse.json({ error: message }, { status })
}

export function createSuccessResponse<T>(
  data: T, 
  status: number = 200
): NextResponse<T> {
  return NextResponse.json(data, { status })
}

export async function handleApiError(
  error: unknown,
  defaultMessage: string = 'Ein unerwarteter Fehler ist aufgetreten'
): Promise<NextResponse<ApiError>> {
  console.error('API Error:', error)
  
  if (error instanceof Error) {
    return createErrorResponse(error.message, 500)
  }
  
  return createErrorResponse(defaultMessage, 500)
}
