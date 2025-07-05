// tests/fix-functions.js
const fs = require('fs');

// LoginFunction.js corregido
const loginFunction = `
const TestFunction = require('../../framework/TestFunction');
const TestCase = require('../../framework/TestCase');

const loginFunction = new TestFunction({
  id: 'FN-AUTH-002',
  name: 'login',
  module: 'auth'
});

// Crear casos de prueba directamente aquí
const loginSuccessCase = new TestCase({
  id: 'TC-LOGIN-001',
  name: 'Login exitoso',
  type: 'positive',
  priority: 'high',
  input: {
    email: 'test@example.com',
    password: 'TestPass123!'
  },
  expectedOutput: {
    status: 200,
    body: {
      token: 'string',
      email: 'test@example.com'
    }
  }
});

const loginInvalidCase = new TestCase({
  id: 'TC-LOGIN-002',
  name: 'Login con credenciales inválidas',
  type: 'negative',
  priority: 'high',
  input: {
    email: 'test@example.com',
    password: 'WrongPassword!'
  },
  expectedOutput: {
    status: 401,
    body: {
      message: 'Credenciales inválidas'
    }
  }
});

// Agregar casos de prueba
loginFunction.addTestCase(loginSuccessCase);
loginFunction.addTestCase(loginInvalidCase);

module.exports = loginFunction;
`;

// RegisterFunction.js corregido
const registerFunction = `
const TestFunction = require('../../framework/TestFunction');
const TestCase = require('../../framework/TestCase');

const registerFunction = new TestFunction({
  id: 'FN-AUTH-001',
  name: 'register',
  module: 'auth'
});

// Crear casos de prueba directamente
const registerSuccessCase = new TestCase({
  id: 'TC-REG-001',
  name: 'Registro exitoso',
  type: 'positive',
  priority: 'high',
  input: {
    name: 'Test User',
    email: 'test@example.com',
    password: 'TestPass123!'
  },
  expectedOutput: {
    status: 201,
    body: {
      id: 'number',
      name: 'Test User',
      email: 'test@example.com',
      token: 'string'
    }
  }
});

const registerDuplicateCase = new TestCase({
  id: 'TC-REG-002',
  name: 'Registro con email duplicado',
  type: 'negative',
  priority: 'high',
  input: {
    name: 'Another User',
    email: 'test@example.com',
    password: 'TestPass123!'
  },
  expectedOutput: {
    status: 400,
    body: {
      message: 'Email ya registrado'
    }
  }
});

registerFunction.addTestCase(registerSuccessCase);
registerFunction.addTestCase(registerDuplicateCase);

module.exports = registerFunction;
`;

// CreateHypothesisFunction.js corregido
const createHypothesisFunction = `
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
`;

// TestFunction.js mejorado para mejor debugging
const testFunctionImproved = `
const TestCase = require('./TestCase');

class TestFunction {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.module = config.module;
    this.testCases = [];
  }

  addTestCase(testCase) {
    // Verificación mejorada con mejor mensaje de error
    if (!testCase || !(testCase instanceof TestCase)) {
      console.error('Error: Se intentó agregar algo que no es un TestCase');
      console.error('Tipo recibido:', typeof testCase);
      console.error('Valor:', testCase);
      throw new Error('Debe ser una instancia de TestCase');
    }
    this.testCases.push(testCase);
  }

  async execute(context = {}) {
    console.log(\`\\nEjecutando función: \${this.name} (\${this.module})\`);
    console.log(\`Casos de prueba: \${this.testCases.length}\`);
    
    const results = {
      functionName: this.name,
      module: this.module,
      totalCases: this.testCases.length,
      passed: 0,
      failed: 0,
      cases: []
    };

    for (const testCase of this.testCases) {
      console.log(\`  - Ejecutando: \${testCase.name}\`);
      const result = await testCase.execute(context);
      
      if (result.passed) {
        results.passed++;
        console.log(\`    ✅ Pasó\`);
      } else {
        results.failed++;
        console.log(\`    ❌ Falló\`);
      }
      
      results.cases.push({
        testCase: testCase,
        result: result
      });
    }

    results.successRate = results.totalCases > 0 
      ? ((results.passed / results.totalCases) * 100).toFixed(2) + '%'
      : '0%';
      
    console.log(\`  Tasa de éxito: \${results.successRate}\`);
    
    return results;
  }
}

module.exports = TestFunction;
`;

// Escribir los archivos corregidos
console.log('🔧 Arreglando archivos de funciones...\n');

// Crear las carpetas si no existen
const dirs = [
  'tests/functions/auth',
  'tests/functions/hypothesis'
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Creado directorio: ${dir}`);
  }
});

// Escribir archivos
fs.writeFileSync('tests/functions/auth/LoginFunction.js', loginFunction.trim());
console.log('✅ Arreglado: tests/functions/auth/LoginFunction.js');

fs.writeFileSync('tests/functions/auth/RegisterFunction.js', registerFunction.trim());
console.log('✅ Arreglado: tests/functions/auth/RegisterFunction.js');

fs.writeFileSync('tests/functions/hypothesis/CreateHypothesisFunction.js', createHypothesisFunction.trim());
console.log('✅ Arreglado: tests/functions/hypothesis/CreateHypothesisFunction.js');

fs.writeFileSync('tests/framework/TestFunction.js', testFunctionImproved.trim());
console.log('✅ Mejorado: tests/framework/TestFunction.js');

console.log('\n✅ Funciones arregladas!');
console.log('\nAhora ejecuta: npm run test:all');