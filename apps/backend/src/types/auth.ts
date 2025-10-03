export interface User {
  id: string
  email: string
  username: string
  password: string
  roleId: string
  role?: Role
  addresses?: Address[]
  createdAt: Date
  updatedAt: Date
}

export interface UserWithoutPassword {
  id: string
  email: string
  username: string
  roleId: string
  role?: Role
  addresses?: Address[]
  createdAt: Date
  updatedAt: Date
}

export interface Role {
  id: string
  name: string
}

export interface Address {
  id: string
  label: string | null  // <- null statt undefined
  street: string
  postalCode: string
  city: string
  country: string
  addition: string | null  // <- null statt undefined
  userId: string
  types?: AddressType[]
}

export interface AddressType {
  id: string
  name: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  username: string
  password: string
  roleId?: string
}

export interface AuthResponse {
  message: string
  token?: string
  user?: UserWithoutPassword
}

export interface ApiError {
  error: string
}

export interface JWTPayload {
  userId: string
  iat?: number
  exp?: number
}