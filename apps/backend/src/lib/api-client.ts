import type { LoginRequest, RegisterRequest, AuthResponse, UserWithoutPassword } from '@/types/auth'

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'API Request failed')
    }

    return response.json()
  }

  // Auth Methods
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })

    if (response.token && typeof window !== 'undefined') {
      this.token = response.token
      localStorage.setItem('auth_token', response.token)
    }

    return response
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async getCurrentUser(): Promise<{ user: UserWithoutPassword }> {
    return this.request<{ user: UserWithoutPassword }>('/auth/me')
  }

  async getUsers(page: number = 1, limit: number = 10): Promise<{
    users: UserWithoutPassword[]
    total: number
  }> {
    return this.request<{
      users: UserWithoutPassword[]
      total: number
    }>(`/users?page=${page}&limit=${limit}`)
  }

  logout(): void {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  setToken(token: string): void {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  getToken(): string | null {
    return this.token
  }
}

export const apiClient = new ApiClient()