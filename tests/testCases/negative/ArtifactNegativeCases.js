// tests/testCases/negative/ArtifactNegativeCases.js
const TestCase = require('../../framework/TestCase');

// Caso 1: Fase inválida
const generateArtifactsInvalidPhase = new TestCase({
  id: 'TC-ART-NEG-001',
  name: 'Generar artefactos con fase inválida',
  description: 'Intenta generar artefactos con una fase que no existe',
  type: 'negative',
  priority: 'high',
  endpoint: '/api/artifacts/:hypothesisId/generate/fase-invalida',
  input: {
    hypothesisId: 1,
    phase: 'fase-invalida'
  },
  expectedOutput: {
    status: 400,
    body: {
      message: 'Fase no válida'
    }
  }
});

// Caso 2: Hipótesis no existe
const generateArtifactsNonExistentHypothesis = new TestCase({
  id: 'TC-ART-NEG-002',
  name: 'Generar artefactos para hipótesis inexistente',
  description: 'Intenta generar artefactos para una hipótesis que no existe',
  type: 'negative',
  priority: 'high',
  endpoint: '/api/artifacts/99999/generate/construir',
  input: {
    hypothesisId: 99999,
    phase: 'construir'
  },
  expectedOutput: {
    status: 404,
    body: {
      message: 'Hipótesis no encontrada'
    }
  }
});

// Caso 3: Usuario no autorizado
const generateArtifactsUnauthorized = new TestCase({
  id: 'TC-ART-NEG-003',
  name: 'Generar artefactos sin autorización',
  description: 'Intenta generar artefactos para hipótesis de otro usuario',
  type: 'negative',
  priority: 'high',
  endpoint: '/api/artifacts/:hypothesisId/generate/construir',
  input: {
    hypothesisId: 2, // Hipótesis de otro usuario
    phase: 'construir'
  },
  expectedOutput: {
    status: 404, // O 403 dependiendo de tu implementación
    body: {
      message: 'Hipótesis no encontrada'
    }
  }
});

// Caso 4: Sin API Key para IA
const generateArtifactsAINoApiKey = new TestCase({
  id: 'TC-ART-NEG-004',
  name: 'Generar con IA sin API Key configurada',
  description: 'Intenta generar artefactos con IA cuando no hay API Key',
  type: 'negative',
  priority: 'medium',
  endpoint: '/api/artifacts/:hypothesisId/generate-ai/construir',
  input: {
    hypothesisId: 1,
    phase: 'construir',
    noApiKey: true // Flag para simular falta de API Key
  },
  expectedOutput: {
    status: 201, // Usa plantillas de respaldo
    body: {
      message: expect => expect.includes('respaldo'),
      note: 'Plantillas generadas porque el servicio de IA no está disponible.'
    }
  }
});

module.exports = {
  generateArtifactsInvalidPhase,
  generateArtifactsNonExistentHypothesis,
  generateArtifactsUnauthorized,
  generateArtifactsAINoApiKey
};