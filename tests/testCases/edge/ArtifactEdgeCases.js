// tests/testCases/edge/ArtifactEdgeCases.js
const TestCase = require('../../framework/TestCase');

// Caso 1: Regenerar artefactos (sobrescribir)
const regenerateArtifacts = new TestCase({
  id: 'TC-ART-EDGE-001',
  name: 'Regenerar artefactos existentes',
  description: 'Genera artefactos para una fase que ya tiene artefactos',
  type: 'edge',
  priority: 'medium',
  endpoint: '/api/artifacts/:hypothesisId/generate/construir',
  preconditions: [
    {
      description: 'Ya existen artefactos para esta fase',
      verify: async (context) => context.existingArtifacts === true
    }
  ],
  input: {
    hypothesisId: 1,
    phase: 'construir'
  },
  expectedOutput: {
    status: 201,
    body: {
      message: '6 artefactos generados para construir',
      note: 'Artefactos anteriores fueron eliminados'
    }
  }
});

// Caso 2: Generar con hipótesis muy larga
const generateWithLongHypothesis = new TestCase({
  id: 'TC-ART-EDGE-002',
  name: 'Generar artefactos con hipótesis de contenido extenso',
  description: 'Prueba la generación con una hipótesis que tiene textos muy largos',
  type: 'edge',
  priority: 'low',
  input: {
    hypothesisId: 'hypothesis-with-long-content',
    phase: 'construir',
    hypothesisData: {
      problem: 'A'.repeat(1000), // Problema de 1000 caracteres
      solution: 'B'.repeat(500),
      customerSegment: 'C'.repeat(500),
      valueProposition: 'D'.repeat(500)
    }
  },
  expectedOutput: {
    status: 201,
    body: {
      artifacts: expect => expect.length === 6
    }
  }
});

// Caso 3: Generar múltiples fases concurrentemente
const generateConcurrent = new TestCase({
  id: 'TC-ART-EDGE-003',
  name: 'Generación concurrente de múltiples fases',
  description: 'Genera artefactos para múltiples fases al mismo tiempo',
  type: 'edge',
  priority: 'medium',
  concurrent: true,
  requests: [
    { hypothesisId: 1, phase: 'construir' },
    { hypothesisId: 1, phase: 'medir' },
    { hypothesisId: 1, phase: 'aprender' }
  ],
  expectedOutput: {
    allSuccessful: true,
    totalArtifacts: 18 // 6 por cada fase
  }
});

module.exports = {
  regenerateArtifacts,
  generateWithLongHypothesis,
  generateConcurrent
};