const { 
  handleError, 
  validateRequiredFields, 
  validatePhase, 
  logOperation 
} = require('../../helpers/controllerUtils');

describe('ControllerUtils', () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Clear all mocks
    jest.clearAllMocks();
    
    // Mock console.error and console.log
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('handleError', () => {
    it('debería manejar errores con mensaje personalizado', () => {
      const error = new Error('Test error');
      const customMessage = 'Custom error message';

      handleError(res, error, customMessage);

      expect(console.error).toHaveBeenCalledWith(customMessage, error);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: customMessage,
        error: error.message,
        success: false,
        stack: undefined
      });
    });

    it('debería usar mensaje por defecto si no se proporciona', () => {
      const error = new Error('Test error');

      handleError(res, error);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Error en la operación',
        error: error.message,
        success: false,
        stack: undefined
      });
    });

    it('debería usar código de estado personalizado', () => {
      const error = new Error('Test error');

      handleError(res, error, 'Custom message', 404);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('debería incluir stack trace en desarrollo', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Test error');

      handleError(res, error);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Error en la operación',
        error: error.message,
        success: false,
        stack: error.stack
      });

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('validateRequiredFields', () => {
    it('debería validar campos requeridos correctamente', () => {
      const data = {
        name: 'Test',
        email: 'test@example.com',
        age: 25
      };
      const fields = ['name', 'email'];

      const result = validateRequiredFields(data, fields);

      expect(result).toEqual({
        isValid: true,
        missingFields: []
      });
    });

    it('debería detectar campos faltantes', () => {
      const data = {
        name: 'Test'
      };
      const fields = ['name', 'email', 'age'];

      const result = validateRequiredFields(data, fields);

      expect(result).toEqual({
        isValid: false,
        missingFields: ['email', 'age']
      });
    });

    it('debería manejar data nulo o undefined', () => {
      const result1 = validateRequiredFields(null, ['field']);
      const result2 = validateRequiredFields(undefined, ['field']);

      expect(result1).toEqual({
        isValid: false,
        missingFields: ['Invalid data object']
      });
      expect(result2).toEqual({
        isValid: false,
        missingFields: ['Invalid data object']
      });
    });

    it('debería manejar campos inválidos', () => {
      const data = { name: 'Test' };
      const result = validateRequiredFields(data, null);

      expect(result).toEqual({
        isValid: false,
        missingFields: ['Invalid fields array']
      });
    });

    it('debería considerar campos vacíos como faltantes', () => {
      const data = {
        name: '',
        email: 'test@example.com',
        age: null
      };
      const fields = ['name', 'email', 'age'];

      const result = validateRequiredFields(data, fields);

      expect(result).toEqual({
        isValid: false,
        missingFields: ['name', 'age']
      });
    });
  });

  describe('validatePhase', () => {
    it('debería validar fases válidas', () => {
      const validPhases = ['construir', 'medir', 'aprender', 'pivotar', 'iterar'];
      
      validPhases.forEach(phase => {
        expect(validatePhase(phase)).toBe(true);
      });
    });

    it('debería rechazar fases inválidas', () => {
      const invalidPhases = ['invalid', 'test', '', null, undefined];
      
      invalidPhases.forEach(phase => {
        expect(validatePhase(phase)).toBe(false);
      });
    });
  });

  describe('logOperation', () => {
    it('debería registrar operaciones correctamente', () => {
      const operation = 'Test Operation';
      const details = { userId: 1, action: 'create' };

      logOperation(operation, details);

      expect(console.log).toHaveBeenCalledWith(
        `${operation}: ${JSON.stringify(details)}`
      );
    });

    it('debería manejar detalles complejos', () => {
      const operation = 'Complex Operation';
      const details = {
        user: { id: 1, name: 'Test' },
        data: [1, 2, 3],
        timestamp: new Date()
      };

      logOperation(operation, details);

      expect(console.log).toHaveBeenCalledWith(
        `${operation}: ${JSON.stringify(details)}`
      );
    });
  });
});
