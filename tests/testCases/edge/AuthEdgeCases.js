const TestCase = require('../../framework/TestCase');

const sqlInjectionCase = new TestCase({
  id: 'TC-AUTH-EDGE-001',
  name: 'SQL Injection attempt',
  type: 'edge',
  priority: 'high',
  input: {
    email: "admin' OR '1'='1",
    password: "password"
  },
  expectedOutput: {
    status: 400,
    body: {
      message: 'Entrada inválida'
    }
  }
});

module.exports = {
  sqlInjectionCase
};