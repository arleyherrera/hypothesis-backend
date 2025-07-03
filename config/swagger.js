// config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Lean Startup Assistant API',
      version: '1.0.0',
      description: 'API para gestión de hipótesis siguiendo la metodología Lean Startup',
      contact: {
        name: 'API Support',
        email: 'support@leanstartup.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://hypothesis-backend-production.up.railway.app/api'
          : 'http://localhost:5000/api',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Error message'
            },
            error: {
              type: 'string',
              description: 'Error details'
            }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'User ID'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Hypothesis: {
          type: 'object',
          required: ['problem', 'name', 'solution', 'customerSegment', 'valueProposition'],
          properties: {
            id: {
              type: 'integer',
              description: 'Hypothesis ID'
            },
            problem: {
              type: 'string',
              description: 'Problem to solve (min 20 chars)',
              minLength: 20
            },
            name: {
              type: 'string',
              description: 'Hypothesis name'
            },
            solution: {
              type: 'string',
              description: 'Proposed solution'
            },
            customerSegment: {
              type: 'string',
              description: 'Target customer segment'
            },
            valueProposition: {
              type: 'string',
              description: 'Value proposition'
            },
            userId: {
              type: 'integer',
              description: 'Owner user ID'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            artifacts: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Artifact'
              }
            }
          }
        },
        Artifact: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            name: {
              type: 'string'
            },
            phase: {
              type: 'string',
              enum: ['construir', 'medir', 'aprender', 'pivotar', 'iterar']
            },
            description: {
              type: 'string'
            },
            content: {
              type: 'string'
            },
            hypothesisId: {
              type: 'integer'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './routes/swagger/*.js'] // Archivos donde están las anotaciones
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;