const { validationResult } = require('express-validator');
const { registerValidation, loginValidation } = require('../../../routes/validators/authValidators');
const { createTestCase, createTestScenario } = require('../../templates/testDataTemplate');

// Helper para ejecutar validaciones
const runValidation = async (validations, body) => {
  const req = {
    body
  };
  
  // Ejecutar todas las validaciones
  for (const validation of validations) {
    await validation.run(req);
  }
  
  // Obtener resultados
  return validationResult(req);
};

describe('Auth Validators - Pruebas con Entrada/Salida', () => {
  describe('VALIDACIÓN DE REGISTRO', () => {
    const registerScenarios = createTestScenario('Register Validation', [
      createTestCase(
        'Datos válidos de registro',
        {
          body: {
            name: 'María García López',
            email: 'maria.garcia@example.com',
            password: 'SecurePass123!'
          }
        },
        {
          isValid: true,
          errors: []
        },
        'Todos los campos cumplen los requisitos'
      ),

      createTestCase(
        'Email con caracteres peligrosos',
        {
          body: {
            name: 'Test User',
            email: 'test<script>@example.com',
            password: 'ValidPass123!'
          }
        },
        {
          isValid: false,
          errors: [
            {
              field: 'email',
              message: expect.stringContaining('caracteres no permitidos')
            }
          ]
        },
        'Debe rechazar emails con caracteres de inyección'
      ),

      createTestCase(
        'Email temporal bloqueado',
        {
          body: {
            name: 'Test User',
            email: 'test@tempmail.com',
            password: 'ValidPass123!'
          }
        },
        {
          isValid: false,
          errors: [
            {
              field: 'email',
              message: 'No se permiten correos temporales'
            }
          ]
        },
        'Debe bloquear dominios de email temporal'
      ),

      createTestCase(
        'Nombre con caracteres especiales válidos',
        {
          body: {
            name: "Jean-Pierre O'Connor",
            email: 'jean@example.com',
            password: 'ValidPass123!'
          }
        },
        {
          isValid: true,
          errors: []
        },
        'Debe aceptar guiones y apóstrofes en nombres'
      ),

      createTestCase(
        'Nombre con números',
        {
          body: {
            name: 'User123',
            email: 'test@example.com',
            password: 'ValidPass123!'
          }
        },
        {
          isValid: false,
          errors: [
            {
              field: 'name',
              message: expect.stringContaining('solo puede contener letras')
            }
          ]
        },
        'Debe rechazar nombres con números'
      ),

      createTestCase(
        'Contraseña sin mayúsculas',
        {
          body: {
            name: 'Test User',
            email: 'test@example.com',
            password: 'nouppercasepass123!'
          }
        },
        {
          isValid: false,
          errors: [
            {
              field: 'password',
              message: expect.stringContaining('una mayúscula')
            }
          ]
        },
        'Debe validar requisitos de contraseña'
      ),

      createTestCase(
        'Email con formato complejo válido',
        {
          body: {
            name: 'Test User',
            email: 'test.user+tag@sub.example.co.uk',
            password: 'ValidPass123!'
          }
        },
        {
          isValid: true,
          errors: []
        },
        'Debe aceptar emails con subdominios y tags'
      ),

      createTestCase(
        'Múltiples errores simultáneos',
        {
          body: {
            name: 'A',  // Muy corto
            email: 'notanemail',  // Formato inválido
            password: 'short'  // No cumple requisitos
          }
        },
        {
          isValid: false,
          errors: [
            {
              field: 'name',
              message: expect.stringContaining('entre 2 y 50 caracteres')
            },
            {
              field: 'email',
              message: expect.stringContaining('correo electrónico válido')
            },
            {
              field: 'password',
              message: expect.stringContaining('entre 8 y 50 caracteres')
            }
          ]
        },
        'Debe reportar todos los errores encontrados'
      )
    ]);

    registerScenarios.scenarios.forEach(scenario => {
      it(`${scenario.name}`, async () => {
        console.log('\n📥 ENTRADA:', JSON.stringify(scenario.input, null, 2));
        
        const result = await runValidation(registerValidation, scenario.input.body);
        const errors = result.array();
        
        console.log('📤 SALIDA ESPERADA:', JSON.stringify(scenario.expectedOutput, null, 2));
        console.log('📤 SALIDA REAL:', JSON.stringify({
          isValid: errors.length === 0,
          errors: errors.map(e => ({ field: e.path, message: e.msg }))
        }, null, 2));
        
        expect(result.isEmpty()).toBe(scenario.expectedOutput.isValid);
        
        if (!scenario.expectedOutput.isValid) {
          expect(errors).toHaveLength(scenario.expectedOutput.errors.length);
          
          scenario.expectedOutput.errors.forEach((expectedError, index) => {
            expect(errors[index].path).toBe(expectedError.field);
            expect(errors[index].msg).toEqual(expectedError.message);
          });
        }
      });
    });
  });

  describe('VALIDACIÓN DE LOGIN', () => {
    const loginScenarios = createTestScenario('Login Validation', [
      createTestCase(
        'Credenciales válidas',
        {
          body: {
            email: 'user@example.com',
            password: 'MyPassword123!'
          }
        },
        {
          isValid: true,
          errors: []
        },
        'Login con datos correctos'
      ),

      createTestCase(
        'Email vacío',
        {
          body: {
            email: '',
            password: 'ValidPassword123!'
          }
        },
        {
          isValid: false,
          errors: [
            {
              field: 'email',
              message: 'El correo electrónico es requerido'
            }
          ]
        },
        'Debe requerir email'
      ),

      createTestCase(
        'Contraseña con espacios',
        {
          body: {
            email: 'user@example.com',
            password: 'Password With Spaces'
          }
        },
        {
          isValid: false,
          errors: [
            {
              field: 'password',
              message: 'La contraseña no puede contener espacios'
            }
          ]
        },
        'Debe rechazar contraseñas con espacios'
      )
    ]);

    loginScenarios.scenarios.forEach(scenario => {
      it(`${scenario.name}`, async () => {
        console.log('\n📥 ENTRADA:', JSON.stringify(scenario.input, null, 2));
        
        const result = await runValidation(loginValidation, scenario.input.body);
        const errors = result.array();
        
        console.log('📤 SALIDA:', JSON.stringify({
          isValid: errors.length === 0,
          errors: errors.map(e => ({ field: e.path, message: e.msg }))
        }, null, 2));
        
        expect(result.isEmpty()).toBe(scenario.expectedOutput.isValid);
      });
    });
  });
});