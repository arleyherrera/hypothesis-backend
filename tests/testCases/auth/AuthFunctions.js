const TestFunction = require('../../framework/TestFunction');
const { loginTestCases } = require('../../testCases/auth/LoginTestCases');
const { registerTestCases } = require('../../testCases/auth/RegisterTestCases');
const { User } = require('../../../models');
const bcrypt = require('bcryptjs');

// Función: Login
const loginFunction = new TestFunction({
  name: 'login',
  module: 'auth',
  function: 'authController.login',
  description: 'Valida el proceso de autenticación de usuarios',
  
  setup: async (context) => {
    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash('TestPassword123!', 10);
    context.testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword
    });
  },
  
  teardown: async (context) => {
    // Limpiar usuario de prueba
    if (context.testUser) {
      await User.destroy({
        where: { id: context.testUser.id }
      });
    }
  }
});

// Agregar casos de prueba
loginTestCases.forEach(tc => loginFunction.addTestCase(tc));

// Función: Register
const registerFunction = new TestFunction({
  name: 'register',
  module: 'auth',
  function: 'authController.register',
  description: 'Valida el proceso de registro de nuevos usuarios',
  
  teardown: async (context) => {
    // Limpiar usuarios creados durante las pruebas
    await User.destroy({
      where: {
        email: {
          [Op.like]: '%test%'
        }
      }
    });
  }
});

// Función: Token Validation
const tokenValidationFunction = new TestFunction({
  name: 'tokenValidation',
  module: 'auth',
  function: 'authMiddleware',
  description: 'Valida el middleware de autenticación JWT'
});

module.exports = {
  loginFunction,
  registerFunction,
  tokenValidationFunction
};