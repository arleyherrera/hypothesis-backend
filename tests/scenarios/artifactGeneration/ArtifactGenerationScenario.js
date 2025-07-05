// tests/scenarios/artifactGeneration/ArtifactGenerationScenario.js
const TestScenario = require('../../framework/TestScenario');
const generateArtifactsFunction = require('../../functions/artifacts/GenerateArtifactsFunction');

const artifactGenerationScenario = new TestScenario({
  id: 'SCN-004',
  name: 'Artifact Generation Lifecycle',
  description: 'Ciclo completo de generación de artefactos para todas las fases',
  businessValue: 'Valida la generación correcta de artefactos en cada fase del proceso Lean Startup',
  
  preconditions: [
    'Usuario autenticado',
    'Hipótesis creada',
    'Base de datos disponible'
  ],
  
  flow: [
    '1. Generar artefactos fase Construir',
    '2. Generar artefactos fase Medir',
    '3. Generar artefactos fase Aprender',
    '4. Verificar coherencia entre fases',
    '5. Generar artefactos fase Pivotar',
    '6. Generar artefactos fase Iterar'
  ],
  
  globalSetup: async (context) => {
    console.log('🔧 Preparando escenario de generación de artefactos...');
    context.artifactCounts = {
      construir: 0,
      medir: 0,
      aprender: 0,
      pivotar: 0,
      iterar: 0
    };
  },
  
  globalTeardown: async (context) => {
    console.log('🧹 Limpiando escenario de artefactos...');
    console.log(`   Total artefactos generados: ${Object.values(context.artifactCounts).reduce((a, b) => a + b, 0)}`);
  }
});

// Agregar la función de generación
artifactGenerationScenario.addFunction(generateArtifactsFunction);

module.exports = artifactGenerationScenario;