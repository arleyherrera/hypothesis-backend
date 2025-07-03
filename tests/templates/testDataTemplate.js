// tests/templates/testDataTemplate.js

/**
 * Estructura estándar para datos de prueba
 */
const createTestCase = (name, input, expectedOutput, description = '') => ({
  name,
  description,
  input,
  expectedOutput,
  timestamp: new Date().toISOString()
});

/**
 * Estructura para documentar escenarios de prueba
 */
const createTestScenario = (feature, scenarios) => ({
  feature,
  createdAt: new Date().toISOString(),
  scenarios: scenarios.map((s, index) => ({
    id: index + 1,
    ...s
  }))
});

module.exports = { createTestCase, createTestScenario };