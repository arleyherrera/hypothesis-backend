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
    console.log(`\nEjecutando función: ${this.name} (${this.module})`);
    console.log(`Casos de prueba: ${this.testCases.length}`);
    
    const results = {
      functionName: this.name,
      module: this.module,
      totalCases: this.testCases.length,
      passed: 0,
      failed: 0,
      cases: []
    };

    for (const testCase of this.testCases) {
      console.log(`  - Ejecutando: ${testCase.name}`);
      const result = await testCase.execute(context);
      
      if (result.passed) {
        results.passed++;
        console.log(`    ✅ Pasó`);
      } else {
        results.failed++;
        console.log(`    ❌ Falló`);
      }
      
      results.cases.push({
        testCase: testCase,
        result: result
      });
    }

    results.successRate = results.totalCases > 0 
      ? ((results.passed / results.totalCases) * 100).toFixed(2) + '%'
      : '0%';
      
    console.log(`  Tasa de éxito: ${results.successRate}`);
    
    return results;
  }
}

module.exports = TestFunction;