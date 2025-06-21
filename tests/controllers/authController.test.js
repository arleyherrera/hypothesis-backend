// tests/controllers/authController.test.js
const authController = require('../../controllers/authController');
const { User } = require('../../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock de los modelos
jest.mock('../../models', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
  }
}));

// Mock de bcrypt
jest.mock('bcryptjs');

// Mock de jwt
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    // Setup request and response mocks
    req = {
      body: {},
      user: { id: 1 }
    };
    
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('register', () => {
    const validUserData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Test123!'
    };

    it('debería registrar un nuevo usuario exitosamente', async () => {
      // Mock que no existe usuario previo
      User.findOne.mockResolvedValue(null);
      
      // Mock de creación exitosa
      const mockUser = {
        id: 1,
        ...validUserData,
        password: 'hashedPassword'
      };
      User.create.mockResolvedValue(mockUser);
      
      // Mock de generación de token
      jwt.sign.mockReturnValue('fake-token');

      req.body = validUserData;
      await authController.register(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: validUserData.email.toLowerCase() }
      });
      expect(User.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        token: 'fake-token'
      });
    });

    it('debería rechazar si el email ya existe', async () => {
      User.findOne.mockResolvedValue({ id: 1, email: 'test@example.com' });

      req.body = validUserData;
      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Ya existe una cuenta con este correo electrónico',
        field: 'email'
      });
      expect(User.create).not.toHaveBeenCalled();
    });

    it('debería manejar errores de validación de Sequelize', async () => {
      User.findOne.mockResolvedValue(null);
      
      const validationError = new Error('Validation error');
      validationError.name = 'SequelizeValidationError';
      validationError.errors = [{
        path: 'email',
        message: 'Email inválido'
      }];
      
      User.create.mockRejectedValue(validationError);

      req.body = validUserData;
      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error de validación en los datos',
        errors: [{
          field: 'email',
          message: 'Email inválido'
        }]
      });
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'Test123!'
    };

    it('debería autenticar usuario con credenciales válidas', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-token');

      req.body = loginData;
      await authController.login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: loginData.email.toLowerCase().trim() }
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.password);
      expect(res.json).toHaveBeenCalledWith({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        token: 'fake-token'
      });
    });

    it('debería rechazar credenciales inválidas', async () => {
      User.findOne.mockResolvedValue(null);

      req.body = loginData;
      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Correo electrónico o contraseña incorrectos',
        field: 'email'
      });
    });
  });

  describe('getMe', () => {
    it('debería retornar información del usuario autenticado', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        createdAt: new Date()
      };

      User.findByPk.mockResolvedValue(mockUser);

      await authController.getMe(req, res);

      expect(User.findByPk).toHaveBeenCalledWith(1, {
        attributes: ['id', 'name', 'email', 'createdAt']
      });
      expect(res.json).toHaveBeenCalledWith({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt
      });
    });
  });
});