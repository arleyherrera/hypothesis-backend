const TestCase = require('../../framework/TestCase');
const request = require('supertest');
const app = require('../../../server');

class LoginTestCase extends TestCase {
  async runTest(context) {
    const response = await request(app)
      .post('/api/auth/login')
      .send(this.input);
    
    return {
      status: response.status,
      body: response.body,
      headers: response.headers
    };
  }

  async validate(actualOutput) {
    // Validación personalizada para login
    if (this.expectedOutput.status !== actualOutput.status) {
      return false;
    }
    
    if (this.expectedOutput.body) {
      // Para casos exitosos, verificar estructura
      if (this.expectedOutput.status === 200) {
        return actualOutput.body.token && 
               actualOutput.body.email === this.input.email;
      }
      
      // Para errores, verificar mensaje
      return actualOutput.body.message === this.expectedOutput.body.message;
    }
    
    return true;
  }
}

// Definir casos de prueba
const loginTestCases = [
  new LoginTestCase({
    id: 'AUTH-LOGIN-001',
    name: 'Login exitoso con credenciales válidas',
    description: 'Usuario registrado puede hacer login con email y contraseña correctos',
    priority: 'high',
    tags: ['auth', 'login', 'positive'],
    preconditions: [
      {
        description: 'Usuario test@example.com debe existir',
        verify: async (context) => {
          // Verificar que el usuario existe en la BD
          return true; // Simplificado
        }
      }
    ],
    input: {
      email: 'test@example.com',
      password: 'TestPassword123!'
    },
    expectedOutput: {
      status: 200,
      body: {
        token: expect.any(String),
        email: 'test@example.com'
      }
    }
  }),
  
  new LoginTestCase({
    id: 'AUTH-LOGIN-002',
    name: 'Login fallido - Email no registrado',
    description: 'Intento de login con email no existente debe ser rechazado',
    priority: 'high',
    tags: ['auth', 'login', 'negative'],
    input: {
      email: 'noexiste@example.com',
      password: 'SomePassword123!'
    },
    expectedOutput: {
      status: 401,
      body: {
        message: 'Correo electrónico o contraseña incorrectos',
        field: 'email'
      }
    }
  }),
  
  new LoginTestCase({
    id: 'AUTH-LOGIN-003',
    name: 'Login fallido - Contraseña incorrecta',
    description: 'Login con contraseña incorrecta debe fallar',
    priority: 'high',
    tags: ['auth', 'login', 'negative'],
    input: {
      email: 'test@example.com',
      password: 'WrongPassword123!'
    },
    expectedOutput: {
      status: 401,
      body: {
        message: 'Correo electrónico o contraseña incorrectos',
        field: 'password'
      }
    }
  }),
  
  new LoginTestCase({
    id: 'AUTH-LOGIN-004',
    name: 'Login con email en mayúsculas',
    description: 'Email debe ser case-insensitive',
    priority: 'medium',
    tags: ['auth', 'login', 'edge'],
    input: {
      email: 'TEST@EXAMPLE.COM',
      password: 'TestPassword123!'
    },
    expectedOutput: {
      status: 200,
      body: {
        email: 'test@example.com' // Debe normalizarse
      }
    }
  }),
  
  new LoginTestCase({
    id: 'AUTH-LOGIN-005',
    name: 'Login sin campos requeridos',
    description: 'Request sin email o password debe fallar',
    priority: 'medium',
    tags: ['auth', 'login', 'negative', 'validation'],
    input: {
      email: ''
    },
    expectedOutput: {
      status: 400,
      body: {
        message: 'Error de validación'
      }
    }
  }),
  
  new LoginTestCase({
    id: 'AUTH-LOGIN-006',
    name: 'Login con SQL injection attempt',
    description: 'Intento de SQL injection debe ser manejado de forma segura',
    priority: 'high',
    tags: ['auth', 'login', 'security'],
    input: {
      email: "admin' OR '1'='1",
      password: "' OR '1'='1"
    },
    expectedOutput: {
      status: 400,
      body: {
        message: expect.stringContaining('válido')
      }
    }
  })
];

module.exports = { LoginTestCase, loginTestCases };