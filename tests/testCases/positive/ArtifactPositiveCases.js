// tests/testCases/positive/ArtifactPositiveCases.js
const TestCase = require('../../framework/TestCase');

// Caso 1: Generar artefactos para fase CONSTRUIR
const generateArtifactsBuildPhase = new TestCase({
  id: 'TC-ART-POS-001',
  name: 'Generar artefactos para fase Construir',
  description: 'Genera los 6 artefactos de la fase construir para una hipótesis válida',
  type: 'positive',
  priority: 'high',
  endpoint: '/api/artifacts/:hypothesisId/generate/construir',
  input: {
    hypothesisId: 1,
    phase: 'construir'
  },
  expectedOutput: {
    status: 201,
    body: {
      message: '6 artefactos generados para construir',
      artifacts: [
        {
          name: 'MVP Personalizado',
          phase: 'construir',
          description: 'Plan detallado para construir tu producto mínimo viable.'
        },
        {
          name: 'Mapa de Empatía Personalizado',
          phase: 'construir',
          description: 'Análisis profundo de tu segmento de clientes.'
        },
        {
          name: 'Backlog de Funcionalidades',
          phase: 'construir',
          description: 'Priorización de características críticas para tu MVP.'
        },
        {
          name: 'Experimentos de Validación',
          phase: 'construir',
          description: 'Diseño de experimentos para validar tus supuestos clave.'
        },
        {
          name: 'Plan de Recursos',
          phase: 'construir',
          description: 'Estrategia para optimizar los recursos necesarios.'
        },
        {
          name: 'Estrategia de Early Adopters',
          phase: 'construir',
          description: 'Plan para conseguir tus primeros usuarios.'
        }
      ]
    }
  }
});

// Caso 2: Generar artefactos para fase MEDIR
const generateArtifactsMeasurePhase = new TestCase({
  id: 'TC-ART-POS-002',
  name: 'Generar artefactos para fase Medir',
  description: 'Genera los 6 artefactos de la fase medir',
  type: 'positive',
  priority: 'high',
  endpoint: '/api/artifacts/:hypothesisId/generate/medir',
  input: {
    hypothesisId: 1,
    phase: 'medir'
  },
  expectedOutput: {
    status: 201,
    body: {
      message: '6 artefactos generados para medir',
      artifacts: 'array'
    }
  }
});

// Caso 3: Generar artefactos con IA
const generateArtifactsWithAI = new TestCase({
  id: 'TC-ART-POS-003',
  name: 'Generar artefactos con IA para fase Aprender',
  description: 'Genera artefactos usando inteligencia artificial',
  type: 'positive',
  priority: 'high',
  endpoint: '/api/artifacts/:hypothesisId/generate-ai/aprender',
  input: {
    hypothesisId: 1,
    phase: 'aprender'
  },
  expectedOutput: {
    status: 201,
    body: {
      message: expect => expect.includes('artefactos generados'),
      artifacts: 'array',
      coherenceAnalysis: {
        score: 'number'
      }
    }
  }
});

// Caso 4: Todas las fases secuencialmente
const generateArtifactsAllPhases = new TestCase({
  id: 'TC-ART-POS-004',
  name: 'Generar artefactos para todas las fases',
  description: 'Genera artefactos para las 5 fases del ciclo Lean Startup',
  type: 'positive',
  priority: 'high',
  phases: ['construir', 'medir', 'aprender', 'pivotar', 'iterar'],
  expectedArtifactsPerPhase: 6
});

module.exports = {
  generateArtifactsBuildPhase,
  generateArtifactsMeasurePhase,
  generateArtifactsWithAI,
  generateArtifactsAllPhases
};