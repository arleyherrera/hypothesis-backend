const TestFunction = require('../../framework/TestFunction');
const TestCase = require('../../framework/TestCase');

const registerFunction = new TestFunction({
  id: 'FN-AUTH-001',
  name: 'register',
  module: 'auth'
});

// Crear casos de prueba directamente
const registerSuccessCase = new TestCase({
  id: 'TC-REG-001',
  name: 'Registro exitoso',
  type: 'positive',
  priority: 'high',
  input: {
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPass123!'
  },
  expectedOutput: {
    status: 201,
    body: {
      id: 'number',
      name: 'Test User',
      email: 'test@example.com',
      token: 'string'
    }
  }
});

const registerDuplicateCase = new TestCase({
  id: 'TC-REG-002',
  name: 'Registro con email duplicado',
  type: 'negative',
  priority: 'high',
  input: {
    name: 'Another User',
    email: 'test@example.com',
    password: 'TestPass123!'
  },
  expectedOutput: {
    status: 400,
    body: {
      message: 'Email ya registrado'
    }
  }
});

registerFunction.addTestCase(registerSuccessCase);
registerFunction.addTestCase(registerDuplicateCase);

module.exports = registerFunction;