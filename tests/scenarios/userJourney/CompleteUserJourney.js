const TestScenario = require('../../framework/TestScenario');
const registerFunction = require('../../functions/auth/RegisterFunction');
const loginFunction = require('../../functions/auth/LoginFunction');
const createHypothesisFunction = require('../../functions/hypothesis/CreateHypothesisFunction');

const completeUserJourney = new TestScenario({
  id: 'SCN-001',
  name: 'Complete User Journey',
  description: 'Flujo completo desde registro hasta creación de hipótesis',
  businessValue: 'Valida el flujo principal de usuario nuevo',
  
  preconditions: [
    'Base de datos limpia',
    'Servicios disponibles'
  ],
  
  flow: [
    'Usuario se registra',
    'Usuario hace login',
    'Usuario crea hipótesis',
    'Usuario genera artefactos'
  ],
  
  globalSetup: async (context) => {
    console.log('🔧 Preparando escenario User Journey...');
    context.testData = {
      users: [],
      hypotheses: []
    };
  },
  
  globalTeardown: async (context) => {
    console.log('🧹 Limpiando datos del escenario...');
    // Limpiar todos los datos creados
  }
});

completeUserJourney.addFunction(registerFunction);
completeUserJourney.addFunction(loginFunction);
completeUserJourney.addFunction(createHypothesisFunction);

module.exports = completeUserJourney;