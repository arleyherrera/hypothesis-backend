const TestCase = require('../../framework/TestCase');

const registerSuccessCase = new TestCase({
  id: 'TC-AUTH-POS-001',
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
      id: 'number', // En lugar de expect.any(Number)
      name: 'Test User',
      email: 'test@example.com',
      token: 'string' // En lugar de expect.any(String)
    }
  }
});

const loginSuccessCase = new TestCase({
  id: 'TC-AUTH-POS-002',
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

module.exports = {
  registerSuccessCase,
  loginSuccessCase
};