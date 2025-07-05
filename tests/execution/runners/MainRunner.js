const TestExecutor = require('../../framework/TestExecutor');
const completeUserJourney = require('../../scenarios/userJourney/CompleteUserJourney');
const hypothesisLifecycle = require('../../scenarios/hypothesisLifecycle/HypothesisLifecycle');
const aiGenerationScenario = require('../../scenarios/aiGeneration/AIGenerationScenario');

async function runAllTests() {
  const executor = new TestExecutor({
    outputDir: './test-results',
    reportFormat: ['html', 'json', 'markdown']
  });

  // Agregar todos los escenarios
  executor.addScenario(completeUserJourney);
  executor.addScenario(hypothesisLifecycle);
  executor.addScenario(aiGenerationScenario);

  // Ejecutar
  const results = await executor.execute();
  
  console.log('\n📊 Resumen de Ejecución:');
  console.log(`   Total Escenarios: ${results.summary.totalScenarios}`);
  console.log(`   Total Casos: ${results.summary.totalCases}`);
  console.log(`   Exitosos: ${results.summary.passed}`);
  console.log(`   Fallidos: ${results.summary.failed}`);
  console.log(`   Tasa de éxito: ${results.summary.successRate}`);
}

if (require.main === module) {
  runAllTests();
}

module.exports = runAllTests;