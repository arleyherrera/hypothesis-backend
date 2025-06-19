module.exports = {
  // Entorno de testing
  testEnvironment: 'node',
  // Patrón para encontrar archivos de test
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js',
    '**/__tests__/**/*.js'
  ],
  
  // Archivos a ignorar
  testPathIgnorePatterns: [
    '/node_modules/',
    '/migrations/',
    '/coverage/'
  ],
  
  // Configuración de coverage
  collectCoverage: false,
  collectCoverageFrom: [
    'controllers/**/*.js',
    'services/**/*.js',
    'middleware/**/*.js',
    'helpers/**/*.js',
    'models/**/*.js',
    '!models/index.js', // Excluir el index de models
    '!**/node_modules/**',
    '!**/migrations/**'
  ],
  
  // Umbral de cobertura
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Setup para tests
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Variables de entorno para testing
  testTimeout: 10000,
  
  // Limpiar mocks automáticamente
  clearMocks: true,
  restoreMocks: true
};
