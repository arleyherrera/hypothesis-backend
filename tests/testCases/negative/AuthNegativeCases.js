const TestCase = require('../../framework/TestCase');
const request = require('supertest');
const app = require('../../../server');

class AuthNegativeTestCase extends TestCase {
  async runTest(context) {
    const response = await request(app)
      .post(this.endpoint)
      .send(this.input);
    
    return {
      status: response.status,
      body: response.body
    };
  }

  async validate(actualOutput) {
    return actualOutput.status === this.expectedOutput.status &&
           actualOutput.body.message === this.expectedOutput.body.message;
  }
}

const emailDuplicateCase = new AuthNegativeTestCase({
  id: 'TC-AUTH-NEG-001',
  name: 'Registro con email duplicado',
  description: 'No se puede registrar con email existente',
  type: 'negative',
  priority: 'high',
  endpoint: '/api/auth/register',
  preconditions: [{
    description: 'Email ya debe existir',
    verify: async (context) => context.existingUser !== null
  }],
  input: {
    name: 'Otro Usuario',
    email: 'existing@example.com',
    password: 'ValidPass123!'
  },
  expectedOutput: {
    status: 400,
    body: {
      message: 'Ya existe una cuenta con este correo electrónico',
      field: 'email'
    }
  }
});

const weakPasswordCase = new AuthNegativeTestCase({
  id: 'TC-AUTH-NEG-002',
  name: 'Registro con contraseña débil',
  description: 'Contraseña debe cumplir requisitos de seguridad',
  type: 'negative',
  priority: 'medium',
  endpoint: '/api/auth/register',
  input: {
    name: 'Test User',
    email: 'test@example.com',
    password: 'weak'
  },
  expectedOutput: {
    status: 400,
    body: {
      message: 'Error de validación'
    }
  }
});

const wrongCredentialsCase = new AuthNegativeTestCase({
  id: 'TC-AUTH-NEG-003',
  name: 'Login con credenciales incorrectas',
  description: 'Login falla con contraseña incorrecta',
  type: 'negative',
  priority: 'high',
  endpoint: '/api/auth/login',
  input: {
    email: 'test@example.com',
    password: 'WrongPassword123!'
  },
  expectedOutput: {
    status: 401,
    body: {
      message: 'Correo electrónico o contraseña incorrectos'
    }
  }
});

module.exports = {
  emailDuplicateCase,
  weakPasswordCase,
  wrongCredentialsCase
};