// tests/functions/artifacts/GenerateArtifactsFunction.js
const TestFunction = require('../../framework/TestFunction');
const TestCase = require('../../framework/TestCase');
const request = require('supertest');
const app = require('../../../server');

// Importar casos de prueba
const { 
  generateArtifactsBuildPhase,
  generateArtifactsMeasurePhase,
  generateArtifactsWithAI
} = require('../../testCases/positive/ArtifactPositiveCases');

const {
  generateArtifactsInvalidPhase,
  generateArtifactsNonExistentHypothesis
} = require('../../testCases/negative/ArtifactNegativeCases');

const {
  regenerateArtifacts
} = require('../../testCases/edge/ArtifactEdgeCases');

// Extender TestCase para manejar las peticiones HTTP
class ArtifactTestCase extends TestCase {
  async runTest(context) {
    // Construir la URL con parámetros
    let url = this.endpoint;
    if (this.input.hypothesisId) {
      url = url.replace(':hypothesisId', this.input.hypothesisId);
    }
    
    // Hacer la petición
    const response = await request(app)
      .post(url)
      .set('Authorization', `Bearer ${context.authToken}`)
      .send({});
    
    return {
      status: response.status,
      body: response.body,
      headers: response.headers
    };
  }
  
  async validate(actualOutput) {
    // Validación personalizada
    if (actualOutput.status !== this.expectedOutput.status) {
      return false;
    }
    
    // Validar estructura del body
    if (this.expectedOutput.body) {
      if (this.expectedOutput.body.artifacts === 'array') {
        return Array.isArray(actualOutput.body.artifacts) && 
               actualOutput.body.artifacts.length > 0;
      }
      
      // Validación más específica si es necesario
      if (this.expectedOutput.body.artifacts && Array.isArray(this.expectedOutput.body.artifacts)) {
        return actualOutput.body.artifacts.length === this.expectedOutput.body.artifacts.length;
      }
    }
    
    return true;
  }
}

// Crear la función de prueba
const generateArtifactsFunction = new TestFunction({
  id: 'FN-ART-001',
  name: 'generateArtifacts',
  module: 'artifacts',
  endpoint: 'POST /api/artifacts/:hypothesisId/generate/:phase',
  description: 'Función para generar artefactos por fase',
  
  setup: async (context) => {
    console.log('    Preparando pruebas de generación de artefactos...');
    
    // Crear hipótesis de prueba
    const { Hypothesis, User } = require('../../../models');
    
    // Crear usuario si no existe
    if (!context.testUser) {
      context.testUser = await User.create({
        name: 'Test User Artifacts',
        email: 'test.artifacts@example.com',
        password: 'TestPass123!'
      });
    }
    
    // Login para obtener token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: context.testUser.email,
        password: 'TestPass123!'
      });
    
    context.authToken = loginResponse.body.token;
    
    // Crear hipótesis de prueba
    context.testHypothesis = await Hypothesis.create({
      name: 'Hipótesis para Artefactos',
      problem: 'Los emprendedores pierden tiempo validando ideas manualmente sin metodología clara',
      solution: 'Plataforma automatizada de validación con IA',
      customerSegment: 'Emprendedores tech early-stage',
      valueProposition: 'Valida tu idea 10x más rápido con IA',
      userId: context.testUser.id
    });
    
    // Actualizar IDs en los casos de prueba
    generateArtifactsBuildPhase.input.hypothesisId = context.testHypothesis.id;
    generateArtifactsMeasurePhase.input.hypothesisId = context.testHypothesis.id;
    generateArtifactsWithAI.input.hypothesisId = context.testHypothesis.id;
  },
  
  teardown: async (context) => {
    console.log('    Limpiando datos de prueba de artefactos...');
    
    const { Hypothesis, Artifact, User } = require('../../../models');
    
    // Limpiar artefactos
    if (context.testHypothesis) {
      await Artifact.destroy({
        where: { hypothesisId: context.testHypothesis.id }
      });
      
      // Limpiar hipótesis
      await Hypothesis.destroy({
        where: { id: context.testHypothesis.id }
      });
    }
    
    // Limpiar usuario
    if (context.testUser) {
      await User.destroy({
        where: { id: context.testUser.id }
      });
    }
  }
});

// Convertir casos importados a ArtifactTestCase
const buildPhaseCase = Object.assign(
  new ArtifactTestCase(generateArtifactsBuildPhase),
  generateArtifactsBuildPhase
);

const measurePhaseCase = Object.assign(
  new ArtifactTestCase(generateArtifactsMeasurePhase),
  generateArtifactsMeasurePhase
);

const invalidPhaseCase = Object.assign(
  new ArtifactTestCase(generateArtifactsInvalidPhase),
  generateArtifactsInvalidPhase
);

// Agregar casos a la función
generateArtifactsFunction.addTestCase(buildPhaseCase);
generateArtifactsFunction.addTestCase(measurePhaseCase);
generateArtifactsFunction.addTestCase(invalidPhaseCase);

module.exports = generateArtifactsFunction;