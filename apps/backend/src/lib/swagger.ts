import swaggerJSDoc from 'swagger-jsdoc'

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'User Management API',
    version: '1.0.0',
    description: 'API für User Management mit Authentication',
    contact: {
      name: 'API Support',
      email: 'support@example.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:5000/api',
      description: 'Development Server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string', format: 'email' },
          username: { type: 'string' },
          roleId: { type: 'string' },
          role: { $ref: '#/components/schemas/Role' },
          addresses: {
            type: 'array',
            items: { $ref: '#/components/schemas/Address' }
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Role: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' }
        }
      },
      Address: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          label: { type: 'string', nullable: true },
          street: { type: 'string' },
          postalCode: { type: 'string' },
          city: { type: 'string' },
          country: { type: 'string' },
          addition: { type: 'string', nullable: true },
          userId: { type: 'string' },
          types: {
            type: 'array',
            items: { $ref: '#/components/schemas/AddressType' }
          }
        }
      },
      AddressType: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['email', 'username', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          username: { type: 'string', minLength: 3, maxLength: 20 },
          password: { type: 'string', minLength: 6 },
          roleId: { type: 'string' }
        }
      },
      AuthResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          token: { type: 'string' },
          user: { $ref: '#/components/schemas/User' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  }
}

const options = {
  definition: swaggerDefinition,
  apis: ['./src/app/api/**/*.ts'], // Pfad zu deinen API Routes
}

export const swaggerSpec = swaggerJSDoc(options)
