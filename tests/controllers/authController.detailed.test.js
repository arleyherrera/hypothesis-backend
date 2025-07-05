// tests/controllers/authController.debug.test.js
// Test para encontrar exactamente dónde falla el login

describe('AuthController - Debug Intensivo', () => {
  let authController, User, bcrypt, jwt, controllerUtils;

  beforeEach(() => {
    // Limpiar módulos para empezar fresh
    jest.resetModules();
    jest.clearAllMocks();
  });

  it('PASO 1: Verificar que todos los mocks están bien', async () => {
    // Configurar mocks explícitamente
    jest.doMock('../../models', () => ({
      User: {
        findOne: jest.fn()
      }
    }));

    jest.doMock('bcryptjs', () => ({
      compare: jest.fn()
    }));

    jest.doMock('jsonwebtoken', () => ({
      sign: jest.fn()
    }));

    jest.doMock('../../helpers/controllerUtils', () => ({
      handleError: jest.fn(),
      validateRequiredFields: jest.fn(),
      logOperation: jest.fn()
    }));

    // Importar después de configurar mocks
    authController = require('../../controllers/authController');
    const { User } = require('../../models');
    const bcrypt = require('bcryptjs');
    const jwt = require('jsonwebtoken');
    const { logOperation } = require('../../helpers/controllerUtils');

    console.log('🔍 VERIFICANDO MOCKS:');
    console.log('- authController.login existe:', typeof authController.login);
    console.log('- User.findOne es mock:', jest.isMockFunction(User.findOne));
    console.log('- bcrypt.compare es mock:', jest.isMockFunction(bcrypt.compare));
    console.log('- jwt.sign es mock:', jest.isMockFunction(jwt.sign));
    console.log('- logOperation es mock:', jest.isMockFunction(logOperation));

    expect(authController.login).toBeDefined();
    expect(jest.isMockFunction(User.findOne)).toBe(true);
    expect(jest.isMockFunction(bcrypt.compare)).toBe(true);
    expect(jest.isMockFunction(jwt.sign)).toBe(true);
    expect(jest.isMockFunction(logOperation)).toBe(true);
  });

  it('PASO 2: Test login con logging detallado', async () => {
    // Configurar mocks con spy para ver qué se llama
    const mockLogOperation = jest.fn();
    const mockHandleError = jest.fn();
    const mockUserFindOne = jest.fn();
    const mockBcryptCompare = jest.fn();
    const mockJwtSign = jest.fn();

    jest.doMock('../../models', () => ({
      User: {
        findOne: mockUserFindOne
      }
    }));

    jest.doMock('bcryptjs', () => ({
      compare: mockBcryptCompare
    }));

    jest.doMock('jsonwebtoken', () => ({
      sign: mockJwtSign
    }));

    jest.doMock('../../helpers/controllerUtils', () => ({
      handleError: mockHandleError,
      validateRequiredFields: jest.fn(),
      logOperation: mockLogOperation
    }));

    // Configurar valores de retorno para login exitoso
    const mockUser = {
      id: 1,
      name: 'María García López',
      email: 'maria.garcia@example.com',
      password: 'hashedPassword'
    };

    mockUserFindOne.mockResolvedValue(mockUser);
    mockBcryptCompare.mockResolvedValue(true);
    mockJwtSign.mockReturnValue('fake-jwt-token');

    // Importar el controlador
    authController = require('../../controllers/authController');

    const req = {
      body: {
        email: 'maria.garcia@example.com',
        password: 'SecurePass123!'
      }
    };

    const res = {
      json: jest.fn(),
      status: jest.fn(() => res)
    };

    console.log('\n🚀 EJECUTANDO LOGIN CON MOCKS CONFIGURADOS...');
    
    try {
      await authController.login(req, res);
      console.log('✅ Login ejecutado sin throw');
    } catch (error) {
      console.error('❌ Error en login:', error);
      console.error('Stack:', error.stack);
    }

    console.log('\n📊 RESULTADOS POST-EJECUCIÓN:');
    console.log('- logOperation calls:', mockLogOperation.mock.calls.length);
    console.log('- User.findOne calls:', mockUserFindOne.mock.calls.length);
    console.log('- bcrypt.compare calls:', mockBcryptCompare.mock.calls.length);
    console.log('- jwt.sign calls:', mockJwtSign.mock.calls.length);
    console.log('- handleError calls:', mockHandleError.mock.calls.length);
    console.log('- res.status calls:', res.status.mock.calls.length);
    console.log('- res.json calls:', res.json.mock.calls.length);

    if (mockLogOperation.mock.calls.length > 0) {
      console.log('- logOperation llamado con:', mockLogOperation.mock.calls);
    }

    if (mockUserFindOne.mock.calls.length > 0) {
      console.log('- User.findOne llamado con:', mockUserFindOne.mock.calls[0]);
    }

    if (mockBcryptCompare.mock.calls.length > 0) {
      console.log('- bcrypt.compare llamado con:', mockBcryptCompare.mock.calls[0]);
    }

    if (mockJwtSign.mock.calls.length > 0) {
      console.log('- jwt.sign llamado con:', mockJwtSign.mock.calls[0]);
    }

    if (mockHandleError.mock.calls.length > 0) {
      console.log('🚨 handleError fue llamado con:');
      console.log('  - res:', typeof mockHandleError.mock.calls[0][0]);
      console.log('  - error:', mockHandleError.mock.calls[0][1]);
      console.log('  - message:', mockHandleError.mock.calls[0][2]);
    }

    if (res.status.mock.calls.length > 0) {
      console.log('✅ res.status llamado con:', res.status.mock.calls[0]);
    } else {
      console.log('❌ res.status NUNCA fue llamado');
    }

    if (res.json.mock.calls.length > 0) {
      console.log('✅ res.json llamado con:', res.json.mock.calls[0]);
    } else {
      console.log('❌ res.json NUNCA fue llamado');
    }

    // Verificar si llegó al final exitoso
    console.log('\n🔍 ANÁLISIS:');
    console.log('¿Llamó a User.findOne?', mockUserFindOne.mock.calls.length > 0);
    console.log('¿Encontró usuario?', mockUserFindOne.mock.calls.length > 0 ? 'Sí' : 'No');
    console.log('¿Comparó contraseña?', mockBcryptCompare.mock.calls.length > 0);
    console.log('¿Contraseña correcta?', mockBcryptCompare.mock.calls.length > 0 ? 'Sí' : 'No');
    console.log('¿Generó token?', mockJwtSign.mock.calls.length > 0);
    console.log('¿Hubo error?', mockHandleError.mock.calls.length > 0);
    console.log('¿Respondió con éxito?', res.status.mock.calls.length > 0 && res.status.mock.calls[0][0] === 200);

    // Esta expectativa debería pasar si todo va bien
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('PASO 3: Verificar función createUserResponse', async () => {
    // El problema podría estar en la función createUserResponse
    jest.doMock('../../helpers/controllerUtils', () => ({
      handleError: jest.fn(),
      validateRequiredFields: jest.fn(),
      logOperation: jest.fn()
    }));

    jest.doMock('jsonwebtoken', () => ({
      sign: jest.fn(() => 'test-token')
    }));

    // Importar solo lo que necesitamos
    const jwt = require('jsonwebtoken');

    // Simular la función createUserResponse directamente
    const createUserResponse = (user) => {
      try {
        const token = jwt.sign({ id: user.id }, 'test-secret', { expiresIn: '30d' });
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          token: token
        };
      } catch (error) {
        console.error('❌ Error en createUserResponse:', error);
        throw error;
      }
    };

    const testUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com'
    };

    console.log('🔍 Probando createUserResponse...');
    
    try {
      const result = createUserResponse(testUser);
      console.log('✅ createUserResponse funcionó:', result);
      expect(result).toHaveProperty('token');
    } catch (error) {
      console.error('❌ createUserResponse falló:', error);
      throw error;
    }
  });

  it('PASO 4: Test con implementación inline del login', async () => {
    // Probar con una versión simplificada del login inline
    jest.doMock('../../helpers/controllerUtils', () => ({
      handleError: jest.fn(),
      logOperation: jest.fn()
    }));

    const simpleLogin = async (req, res) => {
      try {
        console.log('🔍 Inicio simple login');
        const { email, password } = req.body;
        
        // Simular User.findOne
        const user = { id: 1, name: 'Test', email, password: 'hashed' };
        console.log('🔍 Usuario simulado:', user);
        
        if (!user) {
          console.log('🔍 Usuario no encontrado');
          return res.status(401).json({ message: 'User not found' });
        }
        
        // Simular bcrypt.compare
        const passwordMatch = true;
        console.log('🔍 Password match:', passwordMatch);
        
        if (!passwordMatch) {
          console.log('🔍 Password incorrecto');
          return res.status(401).json({ message: 'Wrong password' });
        }
        
        // Simular token
        const token = 'simple-token';
        console.log('🔍 Token generado:', token);
        
        const response = {
          id: user.id,
          name: user.name,
          email: user.email,
          token: token
        };
        
        console.log('🔍 Enviando respuesta 200:', response);
        return res.status(200).json(response);
        
      } catch (error) {
        console.error('🔍 Error en simple login:', error);
        return res.status(500).json({ message: 'Error' });
      }
    };

    const req = {
      body: {
        email: 'test@example.com',
        password: 'TestPass123!'
      }
    };

    const res = {
      json: jest.fn(),
      status: jest.fn(() => res)
    };

    console.log('🚀 Ejecutando login simplificado...');
    await simpleLogin(req, res);

    console.log('📊 Resultados simple login:');
    console.log('- res.status calls:', res.status.mock.calls.length);
    console.log('- res.json calls:', res.json.mock.calls.length);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});