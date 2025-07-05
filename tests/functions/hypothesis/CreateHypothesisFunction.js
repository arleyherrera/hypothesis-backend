const TestFunction = require('../../framework/TestFunction');
const TestCase = require('../../framework/TestCase');

const createHypothesisFunction = new TestFunction({
  id: 'FN-HYP-001',
  name: 'createHypothesis',
  module: 'hypothesis'
});

const validHypothesisCase = new TestCase({
  id: 'TC-HYP-001',
  name: 'Crear hipótesis válida',
  type: 'positive',
  priority: 'high',
  input: {
    problem: 'Problema de prueba con más de 20 caracteres para cumplir validación',
    name: 'Test Hypothesis',
    solution: 'Test solution',
    customerSegment: 'Test segment',
    valueProposition: 'Test value proposition'
  },
  expectedOutput: {
    status: 201,
    body: {
      id: 'number',
      problem: 'string',
      name: 'Test Hypothesis'
    }
  }
});

const shortProblemCase = new TestCase({
  id: 'TC-HYP-002',
  name: 'Hipótesis con problema muy corto',
  type: 'negative',
  priority: 'medium',
  input: {
    problem: 'Problema corto',
    name: 'Test Hypothesis',
    solution: 'Test solution',
    customerSegment: 'Test segment',
    valueProposition: 'Test value'
  },
  expectedOutput: {
    status: 400,
    body: {
      message: 'El problema debe tener al menos 20 caracteres'
    }
  }
});

createHypothesisFunction.addTestCase(validHypothesisCase);
createHypothesisFunction.addTestCase(shortProblemCase);

module.exports = createHypothesisFunction;