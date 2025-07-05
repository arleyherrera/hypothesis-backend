const TestFunction = require('../../framework/TestFunction');
const TestCase = require('../../framework/TestCase');

const loginFunction = new TestFunction({
  id: 'FN-AUTH-002',
  name: 'login',
  module: 'auth'
});

// Crear casos de prueba directamente aquí
const loginSuccessCase = new TestCase({
  id: 'TC-LOGIN-001',
  name: 'Login exitoso',
  type: 'positive',
  priority: 'high',
  input: {
    email: 'test@example.com',
    password: 'TestPass123!'
  },
  expectedOutput: {
    status: 200,
    body: {
      token: 'string',
      email: 'test@example.com'
    }
  }
});

const loginInvalidCase = new TestCase({
  id: 'TC-LOGIN-002',
  name: 'Login con credenciales inválidas',
  type: 'negative',
  priority: 'high',
  input: {
    email: 'test@example.com',
    password: 'WrongPassword!'
  },
  expectedOutput: {
    status: 401,
    body: {
      message: 'Credenciales inválidas'
    }
  }
});

// Agregar casos de prueba
loginFunction.addTestCase(loginSuccessCase);
loginFunction.addTestCase(loginInvalidCase);

module.exports = loginFunction;