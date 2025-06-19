// Helpers para testing
const jwt = require('jsonwebtoken');
const { sequelize } = require('../models');

/**
 * Crea un token JWT válido para testing
 */
const createTestToken = (userId = 1, email = 'test@example.com') => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

/**
 * Crea un usuario mock para testing
 */
const createTestUser = (overrides = {}) => {
  return {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
};

/**
 * Crea una hipótesis mock para testing
 */
const createTestHypothesis = (overrides = {}) => {
  return {
    id: 1,
    name: 'Test Hypothesis',
    problem: 'Test problem',
    solution: 'Test solution',
    customerSegment: 'Test segment',
    valueProposition: 'Test value prop',
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
};

/**
 * Crea un artifact mock para testing
 */
const createTestArtifact = (overrides = {}) => {
  return {
    id: 1,
    name: 'Test Artifact',
    phase: 'aprender',
    description: 'Test description',
    content: 'Test content',
    hypothesisId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
  };
};

/**
 * Limpia datos de test específicos (no toda la BD)
 */
const cleanTestData = async () => {
  const { User, Hypothesis, Artifact } = require('../models');
  
  try {
    // Eliminar solo datos de test (basado en email de test)
    const testUsers = await User.findAll({
      where: {
        email: {
          [require('sequelize').Op.like]: '%test%'
        }
      }
    });

    for (const user of testUsers) {
      // Primero encontrar todas las hipótesis del usuario
      const userHypotheses = await Hypothesis.findAll({
        where: { userId: user.id },
        attributes: ['id']
      });

      const hypothesisIds = userHypotheses.map(h => h.id);

      // Eliminar artifacts relacionados con las hipótesis del usuario
      if (hypothesisIds.length > 0) {
        await Artifact.destroy({
          where: { 
            hypothesisId: hypothesisIds
          }
        });
      }
      
      // Eliminar hipótesis de test
      await Hypothesis.destroy({
        where: { userId: user.id }
      });
      
      // Eliminar usuario de test
      await user.destroy();
    }
    
    console.log('Datos de test limpiados correctamente');
  } catch (error) {
    console.error('Error al limpiar datos de test:', error);
  }
};

/**
 * Configurar base de datos para tests (verificar conexión)
 */
const setupTestDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a base de datos de test verificada');
    return true;
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw error;
  }
};

/**
 * Cerrar conexión de base de datos
 */
const closeTestDatabase = async () => {
  // En tests reales, no cerramos la conexión para reutilizarla
  console.log('Tests completados - manteniendo conexión de BD');
};

module.exports = {
  createTestToken,
  createTestUser,
  createTestHypothesis,
  createTestArtifact,
  cleanTestData,
  setupTestDatabase,
  closeTestDatabase
};
