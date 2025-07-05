const TestScenario = require('../../framework/TestScenario');

const hypothesisLifecycle = new TestScenario({
  id: 'SCN-002',
  name: 'Hypothesis Lifecycle',
  description: 'Ciclo completo de una hipótesis',
  businessValue: 'Valida el proceso Lean Startup completo',
  
  flow: [
    'Crear hipótesis',
    'Generar artefactos Construir',
    'Generar artefactos Medir',
    'Generar artefactos Aprender',
    'Evaluar para pivotar o iterar'
  ]
});

module.exports = hypothesisLifecycle;