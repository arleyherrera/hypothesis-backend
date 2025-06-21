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
    name: 'Artifact',
    findAll: jest.fn(),
    destroy: jest.fn()
  }
}));

// Mock de helpers
jest.mock('../../helpers/controllerUtils', () => ({
  handleError: jest.fn(),
  validateRequiredFields: jest.fn((data, fields) => {
    // Validación simple para el mock
    const missingFields = [];
    if (!Array.isArray(fields)) {
      return { isValid: false, missingFields: ['Invalid fields array'] };
    }
    
    fields.forEach(field => {
      if (!data || !data[field] || data[field].toString().trim() === '') {
        missingFields.push(field);
      }
    });
    
    return {
      isValid: missingFields.length === 0,
      missingFields: missingFields
    };
  }),
  validatePhase: jest.fn(phase => {
    const validPhases = ['construir', 'medir', 'aprender', 'pivotar', 'iterar'];
    return validPhases.includes(phase);
  }),
  logOperation: jest.fn()
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
        problem: 'Test problem that needs to be solved',
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
      problem: 'Este es un problema complejo que necesita una solución innovadora urgente', // Más de 20 caracteres
      solution: 'Solución de prueba detallada',
      customerSegment: 'Segmento de prueba específico',
      valueProposition: 'Propuesta de valor de prueba única'
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
      expect(response.body.userId).toBe(testUserId);
    });

    it('debería retornar 401 sin autenticación', async () => {
      const response = await request(app)
        .post('/api/hypotheses')
        .send(validHypothesis);

      expect(response.status).toBe(401);
    });

    it('debería validar campos requeridos', async () => {
      const invalidData = {
        name: 'Solo nombre'
        // Faltan campos requeridos
      };

      const response = await request(app)
        .post('/api/hypotheses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Campos requeridos faltantes');
    });

    it('debería validar longitud mínima del problema', async () => {
      const invalidData = {
        ...validHypothesis,
        problem: 'Problema corto' // Menos de 20 caracteres
      };

      const response = await request(app)
        .post('/api/hypotheses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('El problema debe tener al menos 20 caracteres');
    });
  });
});

// Limpiar después de todos los tests
afterAll(async () => {
  // Cerrar cualquier conexión pendiente
  await new Promise(resolve => setTimeout(resolve, 500));
});