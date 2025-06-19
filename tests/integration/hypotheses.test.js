const request = require('supertest');
const app = require('../../server');
const { createTestToken } = require('../helpers');

// Mock de los modelos para tests de integración
jest.mock('../../models', () => ({
  sequelize: {
    authenticate: jest.fn().mockResolvedValue(true),
    sync: jest.fn().mockResolvedValue(true),
    close: jest.fn().mockResolvedValue(true)
  },
  User: {
    findByPk: jest.fn()
  },
  Hypothesis: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  Artifact: {
    name: 'Artifact'
  }
}));

describe('Hypothesis Routes Integration', () => {
  let authToken;
  const testUserId = 1;

  beforeEach(() => {
    authToken = createTestToken(testUserId, 'test@example.com');
    jest.clearAllMocks();
    
    // Mock del middleware de auth
    const { User } = require('../../models');
    User.findByPk.mockResolvedValue({
      id: testUserId,
      email: 'test@example.com',
      name: 'Test User'
    });
  });

  describe('GET /api/hypotheses', () => {
    it('debería obtener hipótesis del usuario autenticado', async () => {
      const { Hypothesis, Artifact } = require('../../models');
      const mockHypotheses = [{
        id: 1,
        name: 'Test Hypothesis',
        problem: 'Test problem',
        solution: 'Test solution',
        customerSegment: 'Test segment',
        valueProposition: 'Test value prop',
        userId: testUserId
      }];
      
      Hypothesis.findAll.mockResolvedValue(mockHypotheses);

      const response = await request(app)
        .get('/api/hypotheses')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Test Hypothesis');
    });

    it('debería retornar 401 sin token de autorización', async () => {
      const response = await request(app)
        .get('/api/hypotheses');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/hypotheses', () => {
    const validHypothesis = {
      name: 'Nueva Hipótesis',
      problem: 'Problema de prueba',
      solution: 'Solución de prueba',
      customerSegment: 'Segmento de prueba',
      valueProposition: 'Propuesta de valor de prueba'
    };

    it('debería crear una nueva hipótesis', async () => {
      const { Hypothesis } = require('../../models');
      const mockHypothesis = {
        id: 1,
        ...validHypothesis,
        userId: testUserId
      };
      
      Hypothesis.create.mockResolvedValue(mockHypothesis);

      const response = await request(app)
        .post('/api/hypotheses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validHypothesis);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(validHypothesis.name);
    });

    it('debería retornar 401 sin autenticación', async () => {
      const response = await request(app)
        .post('/api/hypotheses')
        .send(validHypothesis);

      expect(response.status).toBe(401);
    });
  });
});
