const TestExecutor = require('../framework/TestExecutor');
const completeUserJourney = require('../scenarios/userJourney/CompleteUserJourney');
const hypothesisLifecycle = require('../scenarios/hypothesisLifecycle/HypothesisLifecycle');
const aiGenerationScenario = require('../scenarios/aiGeneration/AIGenerationScenario');

async function runTests() {
  const executor = new TestExecutor({
    parallel: false, // Ejecutar secuencialmente por defecto
    maxWorkers: 4,
    timeout: 30000,
    retries: 1,
    reportFormat: ['html', 'json', 'junit', 'markdown'],
    outputDir: './test-results'
  });

  // Agregar escenarios
  executor.addScenario(completeUserJourney);
  executor.addScenario(hypothesisLifecycle);
  executor.addScenario(aiGenerationScenario);

  // Opciones de ejecución desde línea de comandos
  const options = {
    scenarioNames: process.argv.includes('--scenario') 
      ? [process.argv[process.argv.indexOf('--scenario') + 1]]
      : undefined,
    
    functionNames: process.argv.includes('--function')
      ? [process.argv[process.argv.indexOf('--function') + 1]]
      : undefined,
    
    tags: process.argv.includes('--tags')
      ? process.argv[process.argv.indexOf('--tags') + 1].split(',')
      : undefined,
    
    priority: process.argv.includes('--priority')
      ? process.argv[process.argv.indexOf('--priority') + 1]
      : undefined
  };

  try {
    const results = await executor.execute(options);
    
    console.log('\n📊 Resumen de Ejecución:');
    console.log(`   Total de casos: ${results.summary.totalCases}`);
    console.log(`   Exitosos: ${results.summary.passed} ✅`);
    console.log(`   Fallidos: ${results.summary.failed} ❌`);
    console.log(`   Tasa de éxito: ${results.summary.successRate}`);
    console.log(`   Duración: ${(results.duration / 1000).toFixed(2)}s`);
    
    process.exit(results.summary.failed > 0 ? 1 : 0);
    
  } catch (error) {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runTests();
}

module.exports = runTests;