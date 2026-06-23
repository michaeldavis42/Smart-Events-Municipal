const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartEvents Municipal API',
      version: '1.0.0',
      description: 'API para gestión de eventos municipales, usuarios, reseñas, feed social y proveedores.',
      contact: { name: 'SmartEvents Team', email: 'contacto@smartevents.cl' }
    },
    servers: [{ url: 'http://localhost:3000', description: 'Desarrollo' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object', nullable: true }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['user', 'organizer', 'admin'] }
          }
        },
        Event: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            description: { type: 'string' },
            date: { type: 'string', format: 'date' },
            location: { type: 'string' },
            category: { type: 'string' },
            participants: { type: 'integer' },
            slots: { type: 'integer' },
            image: { type: 'string' }
          }
        },
        Review: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            event_id: { type: 'integer' },
            user_id: { type: 'integer' },
            user_name: { type: 'string' },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            comment: { type: 'string' }
          }
        },
        SocialPost: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            user_id: { type: 'integer' },
            user_name: { type: 'string' },
            content: { type: 'string' },
            image: { type: 'string', nullable: true },
            like_count: { type: 'integer' },
            comment_count: { type: 'integer' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

module.exports = swaggerJsdoc(options);
