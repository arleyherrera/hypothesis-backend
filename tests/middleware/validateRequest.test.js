// tests/middleware/validateRequest.test.js
const validateRequest = require('../../middleware/validateRequest');
const { validationResult } = require('express-validator');

jest.mock('express-validator');

describe('ValidateRequest Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('debería continuar si no hay errores de validación', () => {
    validationResult.mockReturnValue({
      isEmpty: () => true,
      array: () => []
    });

    validateRequest(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('debería retornar 400 con errores de validación', () => {
    const mockErrors = [
      { path: 'email', msg: 'Email inválido', value: 'bad-email' },
      { path: 'password', msg: 'Contraseña muy corta', value: '123' }
    ];

    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => mockErrors
    });

    process.env.NODE_ENV = 'development';
    
    validateRequest(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Error de validación',
      errors: [
        { field: 'email', message: 'Email inválido', value: 'bad-email' },
        { field: 'password', message: 'Contraseña muy corta', value: '123' }
      ],
      summary: 'Email inválido. Contraseña muy corta'
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('debería ocultar valores en producción', () => {
    const mockErrors = [
      { path: 'password', msg: 'Contraseña incorrecta', value: 'secret123' }
    ];

    validationResult.mockReturnValue({
      isEmpty: () => false,
      array: () => mockErrors
    });

    process.env.NODE_ENV = 'production';
    
    validateRequest(req, res, next);

    expect(res.json).toHaveBeenCalledWith({
      message: 'Error de validación',
      errors: [
        { field: 'password', message: 'Contraseña incorrecta', value: undefined }
      ],
      summary: 'Contraseña incorrecta'
    });
  });
});