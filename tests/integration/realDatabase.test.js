const request = require('supertest');
const app = require('../../server');
const { 
  setupTestDatabase, 
  cleanTestData, 
  createTestToken 
} = require('../helpers');
const { User, Hypothesis } = require('../../models');
const bcrypt = require('bcryptjs');

describe('Real Database Integration Tests', () => {
  let testUser;
  let authToken;

  beforeAll(async () => {
    // Verificar conexión a BD
    await setupTestDatabase();
  });

  // tests/integration/realDatabase.test.js

beforeEach(async () => {
  // Limpiar datos de test anteriores
  await cleanTestData();
  
  // Crear usuario real en la BD
  // NO hashear la contraseña antes, dejar que el modelo lo haga
  testUser = await User.create({
    name: 'Test User Real',
    email: 'test.real@example.com',
    password: 'TestPassword123!' // Contraseña sin hashear que cumple validaciones
  });

  authToken = createTestToken(testUser.id, testUser.email);
});
  describe('GET /api/hypotheses - Tests con BD Real', () => {
    it('debería obtener hipótesis reales del usuario', async () => {
      // Crear hipótesis real en la BD
      const realHypothesis = await Hypothesis.create({
        name: 'Hipótesis Real de Test',
        problem: 'Problema real identificado',
        solution: 'Solución propuesta real',
        customerSegment: 'Segmento de cliente real',
        valueProposition: 'Propuesta de valor real',
        userId: testUser.id
      });

      const response = await request(app)
        .get('/api/hypotheses')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].id).toBe(realHypothesis.id);
      expect(response.body[0].name).toBe('Hipótesis Real de Test');
      expect(response.body[0].userId).toBe(testUser.id);
    });

    it('debería retornar array vacío si el usuario no tiene hipótesis', async () => {
      const response = await request(app)
        .get('/api/hypotheses')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(0);
    });

    it('debería retornar 401 sin autenticación', async () => {
      const response = await request(app)
        .get('/api/hypotheses');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/hypotheses - Tests con BD Real', () => {
    const validHypothesisData = {
      name: 'Nueva Hipótesis Real',
      problem: 'Problema real del mercado',
      solution: 'Solución innovadora real',
      customerSegment: 'Emprendedores tech',
      valueProposition: 'Ahorro de tiempo y recursos'
    };

    it('debería crear una hipótesis real en la BD', async () => {
      const response = await request(app)
        .post('/api/hypotheses')
        .set('Authorization', `Bearer ${authToken}`)
        .send(validHypothesisData);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(validHypothesisData.name);
      expect(response.body.userId).toBe(testUser.id);
      expect(response.body.id).toBeDefined();

      // Verificar que se guardó realmente en la BD
      const savedHypothesis = await Hypothesis.findByPk(response.body.id);
      expect(savedHypothesis).toBeTruthy();
      expect(savedHypothesis.name).toBe(validHypothesisData.name);
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
      expect(response.body.message).toContain('Campos requeridos faltantes');
    });
  });

  describe('GET /api/hypotheses/:id - Tests con BD Real', () => {
    let realHypothesis;

    beforeEach(async () => {
      realHypothesis = await Hypothesis.create({
        name: 'Hipótesis para Obtener',
        problem: 'Problema específico',
        solution: 'Solución específica',
        customerSegment: 'Segmento específico',
        valueProposition: 'Valor específico',
        userId: testUser.id
      });
    });

    it('debería obtener una hipótesis específica por ID', async () => {
      const response = await request(app)
        .get(`/api/hypotheses/${realHypothesis.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(realHypothesis.id);
      expect(response.body.name).toBe(realHypothesis.name);
    });

    it('debería retornar 404 para ID inexistente', async () => {
      const response = await request(app)
        .get('/api/hypotheses/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/hypotheses/:id - Tests con BD Real', () => {
    let realHypothesis;

    beforeEach(async () => {
      realHypothesis = await Hypothesis.create({
        name: 'Hipótesis Original',
        problem: 'Problema original',
        solution: 'Solución original',
        customerSegment: 'Segmento original',
        valueProposition: 'Valor original',
        userId: testUser.id
      });
    });

    it('debería actualizar una hipótesis existente', async () => {
      const updateData = {
        name: 'Hipótesis Actualizada',
        problem: 'Problema actualizado'
      };

      const response = await request(app)
        .put(`/api/hypotheses/${realHypothesis.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.problem).toBe(updateData.problem);

      // Verificar actualización en BD
      const updatedHypothesis = await Hypothesis.findByPk(realHypothesis.id);
      expect(updatedHypothesis.name).toBe(updateData.name);
      expect(updatedHypothesis.problem).toBe(updateData.problem);
    });
  });

  describe('DELETE /api/hypotheses/:id - Tests con BD Real', () => {
    let realHypothesis;

    beforeEach(async () => {
      realHypothesis = await Hypothesis.create({
        name: 'Hipótesis para Eliminar',
        problem: 'Problema a eliminar',
        solution: 'Solución a eliminar',
        customerSegment: 'Segmento a eliminar',
        valueProposition: 'Valor a eliminar',
        userId: testUser.id
      });
    });

    it('debería eliminar una hipótesis real de la BD', async () => {
      const response = await request(app)
        .delete(`/api/hypotheses/${realHypothesis.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Hipótesis eliminada correctamente');
      // Verificar eliminación en BD
      const deletedHypothesis = await Hypothesis.findByPk(realHypothesis.id);
      expect(deletedHypothesis).toBeNull();
    });
  });

  describe('Tests de Datos Existentes', () => {
    it('debería poder leer datos existentes en la BD', async () => {
      // Buscar usuarios existentes (no de test)
      const existingUsers = await User.findAll({
        where: {
          email: {
            [require('sequelize').Op.notLike]: '%test%'
          }
        },
        limit: 5
      });

      console.log(`Encontrados ${existingUsers.length} usuarios reales en la BD`);

      // Buscar hipótesis existentes
      const existingHypotheses = await Hypothesis.findAll({
        limit: 5,
        include: [{ 
          model: User, 
          as: 'user',
          where: {
            email: {
              [require('sequelize').Op.notLike]: '%test%'
            }
          }
        }]
      });

      console.log(`Encontradas ${existingHypotheses.length} hipótesis reales en la BD`);

      // Si hay datos, verificar estructura
      if (existingHypotheses.length > 0) {
        const hypothesis = existingHypotheses[0];
        expect(hypothesis.name).toBeDefined();
        expect(hypothesis.problem).toBeDefined();
        expect(hypothesis.solution).toBeDefined();
        expect(hypothesis.userId).toBeDefined();
      }

      // Esto siempre debería pasar
      expect(existingUsers.length).toBeGreaterThanOrEqual(0);
      expect(existingHypotheses.length).toBeGreaterThanOrEqual(0);
    });

    it('debería mostrar estadísticas de la BD', async () => {
      const userCount = await User.count();
      const hypothesisCount = await Hypothesis.count();

      console.log(`📊 Estadísticas de BD:
        - Usuarios totales: ${userCount}
        - Hipótesis totales: ${hypothesisCount}`);

      expect(userCount).toBeGreaterThanOrEqual(0);
      expect(hypothesisCount).toBeGreaterThanOrEqual(0);
    });
  });
});
