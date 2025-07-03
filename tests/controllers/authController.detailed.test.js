const authController = require('../../controllers/authController');
const { User } = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createTestCase, createTestScenario } = require('../templates/testDataTemplate');

// Mocks
jest.mock('../../models');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController - Pruebas Detalladas con Entrada/Salida', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {}, user: { id: 1 } };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('REGISTRO DE USUARIOS', () => {
    const registrationScenarios = createTestScenario('User Registration', [
      createTestCase(
        'Registro exitoso con datos válidos',
        {
          body: {
            name: 'María García López',
            email: 'maria.garcia@example.com',
            password: 'SecurePass123!'
          }
        },
        {
          status: 201,
          response: {
            id: 1,
            name: 'María García López',
            email: 'maria.garcia@example.com',
            token: 'fake-jwt-token'
          }
        },
        'Usuario nuevo se registra correctamente con todos los campos válidos'
      ),
      
      createTestCase(
        'Error: Email ya existe',
        {
          body: {
            name: 'Juan Pérez',
            email: 'maria.garcia@example.com',
            password: 'AnotherPass123!'
          }
        },
        {
          status: 400,
          response: {
            message: 'Ya existe una cuenta con este correo electrónico',
            field: 'email'
          }
        },
        'Intento de registro con email existente debe ser rechazado'
      ),
      
      createTestCase(
        'Error: Email con formato inválido',
        {
          body: {
            name: 'Test User',
            email: 'invalid-email',
            password: 'ValidPass123!'
          }
        },
        {
          status: 400,
          response: {
            message: 'Error de validación en los datos',
            errors: [{
              field: 'email',
              message: 'Email inválido'
            }]
          }
        },
        'Email sin @ debe ser rechazado'
      ),
      
      createTestCase(
        'Error: Contraseña sin mayúsculas',
        {
          body: {
            name: 'Test User',
            email: 'test@example.com',
            password: 'nouppercasepass123!'
          }
        },
        {
          status: 400,
          response: {
            message: 'Error de validación en los datos',
            errors: [{
              field: 'password',
              message: 'La contraseña debe contener al menos una letra mayúscula'
            }]
          }
        },
        'Contraseña debe cumplir requisitos de complejidad'
      ),
      
      createTestCase(
        'Error: Nombre con caracteres especiales no permitidos',
        {
          body: {
            name: 'Test@User#123',
            email: 'test@example.com',
            password: 'ValidPass123!'
          }
        },
        {
          status: 400,
          response: {
            message: 'Error de validación en los datos',
            errors: [{
              field: 'name',
              message: 'El nombre solo puede contener letras, espacios, guiones y apóstrofes'
            }]
          }
        },
        'Nombre con @ # y números debe ser rechazado'
      )
    ]);

    // Ejecutar cada escenario
    registrationScenarios.scenarios.forEach(scenario => {
      it(`${scenario.name}`, async () => {
        console.log('\n📥 ENTRADA:', JSON.stringify(scenario.input, null, 2));
        
        // Configurar mocks según el escenario
        if (scenario.name.includes('exitoso')) {
          User.findOne.mockResolvedValue(null);
          User.create.mockResolvedValue({
            id: 1,
            ...scenario.input.body,
            password: 'hashed'
          });
          jwt.sign.mockReturnValue('fake-jwt-token');
        } else if (scenario.name.includes('Email ya existe')) {
          User.findOne.mockResolvedValue({ id: 1 });
        } else {
          User.findOne.mockResolvedValue(null);
          const error = new Error('Validation error');
          error.name = 'SequelizeValidationError';
          error.errors = scenario.expectedOutput.response.errors.map(e => ({
            path: e.field,
            message: e.message
          }));
          User.create.mockRejectedValue(error);
        }

        // Ejecutar
        req.body = scenario.input.body;
        await authController.register(req, res);

        // Verificar salida
        console.log('📤 SALIDA ESPERADA:', JSON.stringify(scenario.expectedOutput, null, 2));
        
        if (scenario.expectedOutput.status !== 201) {
          expect(res.status).toHaveBeenCalledWith(scenario.expectedOutput.status);
        }
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining(scenario.expectedOutput.response)
        );
      });
    });
  });

  describe('LOGIN DE USUARIOS', () => {
    const loginScenarios = createTestScenario('User Login', [
      createTestCase(
        'Login exitoso',
        {
          body: {
            email: 'maria.garcia@example.com',
            password: 'SecurePass123!'
          }
        },
        {
          status: 200,
          response: {
            id: 1,
            name: 'María García López',
            email: 'maria.garcia@example.com',
            token: 'fake-jwt-token'
          }
        },
        'Usuario existente puede hacer login con credenciales correctas'
      ),
      
      createTestCase(
        'Error: Email no registrado',
        {
          body: {
            email: 'noexiste@example.com',
            password: 'SomePass123!'
          }
        },
        {
          status: 401,
          response: {
            message: 'Correo electrónico o contraseña incorrectos',
            field: 'email'
          }
        },
        'Email no registrado debe ser rechazado'
      ),
      
      createTestCase(
        'Error: Contraseña incorrecta',
        {
          body: {
            email: 'maria.garcia@example.com',
            password: 'WrongPassword123!'
          }
        },
        {
          status: 401,
          response: {
            message: 'Correo electrónico o contraseña incorrectos',
            field: 'password'
          }
        },
        'Contraseña incorrecta debe ser rechazada'
      )
    ]);

    loginScenarios.scenarios.forEach(scenario => {
      it(`${scenario.name}`, async () => {
        console.log('\n📥 ENTRADA:', JSON.stringify(scenario.input, null, 2));
        
        // Configurar mocks
        if (scenario.name.includes('exitoso')) {
          const mockUser = {
            id: 1,
            name: 'María García López',
            email: scenario.input.body.email,
            password: 'hashedPassword'
          };
          User.findOne.mockResolvedValue(mockUser);
          bcrypt.compare.mockResolvedValue(true);
          jwt.sign.mockReturnValue('fake-jwt-token');
        } else if (scenario.name.includes('Email no registrado')) {
          User.findOne.mockResolvedValue(null);
        } else if (scenario.name.includes('Contraseña incorrecta')) {
          User.findOne.mockResolvedValue({ 
            id: 1, 
            password: 'hashedPassword' 
          });
          bcrypt.compare.mockResolvedValue(false);
        }

        // Ejecutar
        req.body = scenario.input.body;
        await authController.login(req, res);

        // Verificar
        console.log('📤 SALIDA ESPERADA:', JSON.stringify(scenario.expectedOutput, null, 2));
        expect(res.status).toHaveBeenCalledWith(scenario.expectedOutput.status);
        expect(res.json).toHaveBeenCalledWith(scenario.expectedOutput.response);
      });
    });
  });
});