const TestFunction = require('./TestFunction');

class TestScenario {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.businessValue = config.businessValue;
    this.preconditions = config.preconditions || [];
    this.flow = config.flow || [];
    this.functions = [];
    this.globalSetup = config.globalSetup || null;
    this.globalTeardown = config.globalTeardown || null;
    this.context = {};
  }

  addFunction(testFunction) {
    if (!(testFunction instanceof TestFunction)) {
      throw new Error('Debe ser una instancia de TestFunction');
    }
    this.functions.push(testFunction);
  }

  async execute(options = {}) {
    const results = {
      scenarioId: this.id,
      scenarioName: this.name,
      startTime: new Date().toISOString(),
      totalFunctions: this.functions.length,
      totalCases: 0,
      passed: 0,
      failed: 0,
      functions: [],
      executionTime: 0
    };

    const startTime = Date.now();

    try {
      if (this.globalSetup) {
        await this.globalSetup(this.context);
      }

      for (const func of this.functions) {
        const funcResult = await func.execute(this.context);
        
        results.totalCases += funcResult.totalCases;
        results.passed += funcResult.passed;
        results.failed += funcResult.failed;
        
        results.functions.push(funcResult);
      }

    } finally {
      if (this.globalTeardown) {
        await this.globalTeardown(this.context);
      }
    }

    results.executionTime = Date.now() - startTime;
    results.endTime = new Date().toISOString();
    results.successRate = (results.passed / results.totalCases * 100).toFixed(2) + '%';

    return results;
  }
}

module.exports = TestScenario;