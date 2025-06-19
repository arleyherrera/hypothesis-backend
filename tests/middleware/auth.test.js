const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const { createTestToken, createTestUser } = require('../helpers');

// Mock de los modelos
jest.mock('../../models', () => ({
  User: {
    findByPk: jest.fn()
  }
}));

// Mock de jsonwebtoken
jest.mock('jsonwebtoken');

const authMiddleware = require('../../middleware/auth');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      user: null
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('autenticación principal', () => {
    it('debería verificar un token válido correctamente', async () => {
      const testUser = createTestUser();
      const token = 'valid-token';
      
      req.headers.authorization = `Bearer ${token}`;
      
      jwt.verify.mockReturnValue({ id: testUser.id, email: testUser.email });
      User.findByPk.mockResolvedValue(testUser);

      await authMiddleware(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(User.findByPk).toHaveBeenCalledWith(testUser.id);
      expect(req.user).toEqual(testUser);
      expect(next).toHaveBeenCalled();
    });

    it('debería rechazar solicitud sin token', async () => {
      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No está autorizado para acceder a este recurso'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debería rechazar token inválido', async () => {
      req.headers.authorization = 'Bearer invalid-token';
      jwt.verify.mockReturnValue(null);

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Token inválido'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debería rechazar si el usuario no existe', async () => {
      const token = 'valid-token';
      req.headers.authorization = `Bearer ${token}`;
      
      jwt.verify.mockReturnValue({ id: 999, email: 'test@example.com' });
      User.findByPk.mockResolvedValue(null);

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'El usuario ya no existe'
      });
      expect(next).not.toHaveBeenCalled();
    });    it('debería manejar errores de base de datos', async () => {
      const token = 'valid-token';
      req.headers.authorization = `Bearer ${token}`;
      
      jwt.verify.mockReturnValue({ id: 1, email: 'test@example.com' });
      User.findByPk.mockResolvedValue(null); // Usuario no encontrado simula error

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'El usuario ya no existe'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('debería manejar header de autorización sin Bearer', async () => {
      req.headers.authorization = 'invalid-format-token';

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No está autorizado para acceder a este recurso'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
