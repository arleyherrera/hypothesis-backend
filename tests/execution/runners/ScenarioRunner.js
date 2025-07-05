const TestExecutor = require('../../framework/TestExecutor');

async function runScenario(scenarioName) {
  const scenarios = {
    'user-journey': require('../../scenarios/userJourney/CompleteUserJourney'),
    'hypothesis-lifecycle': require('../../scenarios/hypothesisLifecycle/HypothesisLifecycle'),
    'ai-generation': require('../../scenarios/aiGeneration/AIGenerationScenario')
  };

  const scenario = scenarios[scenarioName];
  if (!scenario) {
    console.error('Escenario no encontrado:', scenarioName);
    process.exit(1);
  }

  const executor = new TestExecutor();
  executor.addScenario(scenario);
  
  const results = await executor.execute();
  console.log('Resultados:', results.summary);
}

if (require.main === module) {
  const scenarioName = process.argv[2];
  runScenario(scenarioName);
}