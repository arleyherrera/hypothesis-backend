// tests/execution/runners/DetailedConsoleRunner.js
const TestExecutor = require('../../framework/TestExecutor');
const completeUserJourney = require('../../scenarios/userJourney/CompleteUserJourney');
const hypothesisLifecycle = require('../../scenarios/hypothesisLifecycle/HypothesisLifecycle');
const aiGenerationScenario = require('../../scenarios/aiGeneration/AIGenerationScenario');
const colors = require('../../utils/colors');

// Colores para la consola (funciona en Windows CMD)
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgGreen: '\x1b[42m',
  bgRed: '\x1b[41m',
  bgYellow: '\x1b[43m'
};

class DetailedConsoleExecutor extends TestExecutor {
  constructor(config) {
    super(config);
    this.detailedMode = true;
  }

  printHeader() {
    console.log('\n' + '='.repeat(80));
    console.log(COLORS.bright + COLORS.cyan + '                    EJECUCIÓN DETALLADA DE PRUEBAS' + COLORS.reset);
    console.log('='.repeat(80));
    console.log(`Fecha: ${new Date().toLocaleString('es-ES')}`);
    console.log(`Sistema: Lean Startup Assistant v1.0.0`);
    console.log('='.repeat(80) + '\n');
  }

  printScenarioHeader(scenario, index) {
    console.log('\n' + COLORS.bgYellow + COLORS.white + ` ESCENARIO ${index + 1} ` + COLORS.reset);
    console.log(COLORS.yellow + '━'.repeat(80) + COLORS.reset);
    console.log(`${COLORS.bright}Nombre:${COLORS.reset} ${scenario.name}`);
    console.log(`${COLORS.bright}ID:${COLORS.reset} ${scenario.id}`);
    console.log(`${COLORS.bright}Descripción:${COLORS.reset} ${scenario.description}`);
    console.log(COLORS.yellow + '━'.repeat(80) + COLORS.reset + '\n');
  }

  printFunctionHeader(func, funcIndex) {
    console.log('\n  ' + COLORS.cyan + '▶ FUNCIÓN ' + (funcIndex + 1) + COLORS.reset);
    console.log('  ' + '─'.repeat(76));
    console.log(`  ${COLORS.bright}Nombre:${COLORS.reset} ${func.name}`);
    console.log(`  ${COLORS.bright}Módulo:${COLORS.reset} ${func.module}`);
    console.log(`  ${COLORS.bright}ID:${COLORS.reset} ${func.id}`);
    console.log(`  ${COLORS.bright}Casos de prueba:${COLORS.reset} ${func.testCases.length}`);
    console.log('  ' + '─'.repeat(76));
  }

  printTestCaseDetails(testCase, caseIndex, result) {
    console.log('\n    ' + COLORS.blue + `[CASO ${caseIndex + 1}]` + COLORS.reset + ` ${testCase.name}`);
    console.log('    ' + '·'.repeat(72));
    
    // Información del caso
    console.log(`    ${COLORS.bright}ID:${COLORS.reset} ${testCase.id}`);
    console.log(`    ${COLORS.bright}Tipo:${COLORS.reset} ${testCase.type} | ${COLORS.bright}Prioridad:${COLORS.reset} ${testCase.priority}`);
    console.log(`    ${COLORS.bright}Descripción:${COLORS.reset} ${testCase.description || 'N/A'}`);
    
    // DATOS DE ENTRADA
    console.log('\n    ' + COLORS.bright + '📥 DATOS DE ENTRADA:' + COLORS.reset);
    console.log('    ' + JSON.stringify(testCase.input, null, 2).split('\n').join('\n    '));
    
    // SALIDA ESPERADA
    console.log('\n    ' + COLORS.bright + '📤 SALIDA ESPERADA:' + COLORS.reset);
    console.log('    ' + JSON.stringify(testCase.expectedOutput, null, 2).split('\n').join('\n    '));
    
    // SALIDA REAL
    console.log('\n    ' + COLORS.bright + '📊 SALIDA REAL:' + COLORS.reset);
    console.log('    ' + JSON.stringify(result.actualOutput, null, 2).split('\n').join('\n    '));
    
    // RESULTADO
    const status = result.passed 
      ? COLORS.bgGreen + COLORS.white + ' PASÓ ' + COLORS.reset 
      : COLORS.bgRed + COLORS.white + ' FALLÓ ' + COLORS.reset;
    
    console.log('\n    ' + COLORS.bright + 'RESULTADO:' + COLORS.reset + ' ' + status);
    console.log(`    ${COLORS.bright}Tiempo de ejecución:${COLORS.reset} ${result.executionTime}ms`);
    
    if (!result.passed && result.error) {
      console.log(`    ${COLORS.red}Error: ${result.error}${COLORS.reset}`);
    }
    
    console.log('    ' + '·'.repeat(72));
  }

  printFunctionSummary(funcResult) {
    console.log('\n  ' + COLORS.bright + '📊 RESUMEN DE FUNCIÓN:' + COLORS.reset);
    console.log(`  Total casos: ${funcResult.totalCases}`);
    console.log(`  ${COLORS.green}Exitosos: ${funcResult.passed}${COLORS.reset}`);
    console.log(`  ${COLORS.red}Fallidos: ${funcResult.failed}${COLORS.reset}`);
    console.log(`  Tasa de éxito: ${funcResult.successRate}`);
    console.log('  ' + '─'.repeat(76) + '\n');
  }

  printScenarioSummary(scenarioResult) {
    console.log('\n' + COLORS.bgYellow + COLORS.white + ' RESUMEN DEL ESCENARIO ' + COLORS.reset);
    console.log(COLORS.yellow + '━'.repeat(80) + COLORS.reset);
    console.log(`Total funciones: ${scenarioResult.totalFunctions}`);
    console.log(`Total casos: ${scenarioResult.totalCases}`);
    console.log(`${COLORS.green}Casos exitosos: ${scenarioResult.passed}${COLORS.reset}`);
    console.log(`${COLORS.red}Casos fallidos: ${scenarioResult.failed}${COLORS.reset}`);
    console.log(`${COLORS.bright}Tasa de éxito: ${scenarioResult.successRate}${COLORS.reset}`);
    console.log(`Tiempo total: ${(scenarioResult.executionTime / 1000).toFixed(2)}s`);
    console.log(COLORS.yellow + '━'.repeat(80) + COLORS.reset);
  }

  printFinalSummary(results) {
    console.log('\n\n' + '='.repeat(80));
    console.log(COLORS.bright + COLORS.cyan + '                    RESUMEN FINAL DE EJECUCIÓN' + COLORS.reset);
    console.log('='.repeat(80));
    
    console.log('\n📊 MÉTRICAS GLOBALES:\n');
    
    const table = [
      ['Métrica', 'Valor'],
      ['─'.repeat(30), '─'.repeat(30)],
      ['Total de Escenarios', results.summary.totalScenarios],
      ['Total de Funciones', results.summary.totalFunctions || 'N/A'],
      ['Total de Casos de Prueba', results.summary.totalCases],
      ['Casos Exitosos', COLORS.green + results.summary.passed + COLORS.reset],
      ['Casos Fallidos', COLORS.red + results.summary.failed + COLORS.reset],
      ['Tasa de Éxito Global', results.summary.successRate],
      ['Tiempo Total de Ejecución', ((new Date(results.endTime) - new Date(results.startTime)) / 1000).toFixed(2) + 's'],
      ['ID de Ejecución', results.executionId]
    ];
    
    table.forEach(row => {
      console.log(`${row[0].padEnd(30)} | ${row[1]}`);
    });
    
    console.log('\n' + '='.repeat(80));
    
    // Estado final
    if (results.summary.failed === 0) {
      console.log(COLORS.bgGreen + COLORS.white + ' ✅ TODAS LAS PRUEBAS PASARON EXITOSAMENTE ' + COLORS.reset);
    } else {
      console.log(COLORS.bgRed + COLORS.white + ` ❌ ${results.summary.failed} PRUEBAS FALLARON ` + COLORS.reset);
    }
    
    console.log('='.repeat(80) + '\n');
  }

  async execute() {
    this.printHeader();
    
    const results = {
      executionId: Date.now(),
      startTime: new Date().toISOString(),
      scenarios: [],
      summary: {}
    };

    for (let i = 0; i < this.scenarios.length; i++) {
      const scenario = this.scenarios[i];
      this.printScenarioHeader(scenario, i);
      
      // Ejecutar el escenario con detalles
      const scenarioResult = await this.executeScenarioDetailed(scenario);
      results.scenarios.push(scenarioResult);
      
      this.printScenarioSummary(scenarioResult);
    }

    results.endTime = new Date().toISOString();
    results.summary = this.calculateSummary(results.scenarios);
    
    this.printFinalSummary(results);
    
    // Guardar resultados
    await this.saveResults(results.executionId, results);
    
    return results;
  }

  async executeScenarioDetailed(scenario) {
    const result = {
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      startTime: new Date().toISOString(),
      totalFunctions: scenario.functions.length,
      totalCases: 0,
      passed: 0,
      failed: 0,
      functions: []
    };

    const startTime = Date.now();

    // Ejecutar setup global si existe
    if (scenario.globalSetup) {
      console.log(`\n  ${COLORS.cyan}Ejecutando setup del escenario...${COLORS.reset}`);
      await scenario.globalSetup(scenario.context);
    }

    // Ejecutar cada función
    for (let funcIndex = 0; funcIndex < scenario.functions.length; funcIndex++) {
      const func = scenario.functions[funcIndex];
      this.printFunctionHeader(func, funcIndex);
      
      // Ejecutar casos de prueba de la función
      const funcResult = await this.executeFunctionDetailed(func, scenario.context);
      
      result.totalCases += funcResult.totalCases;
      result.passed += funcResult.passed;
      result.failed += funcResult.failed;
      result.functions.push(funcResult);
      
      this.printFunctionSummary(funcResult);
    }

    // Ejecutar teardown global si existe
    if (scenario.globalTeardown) {
      console.log(`\n  ${COLORS.cyan}Ejecutando limpieza del escenario...${COLORS.reset}`);
      await scenario.globalTeardown(scenario.context);
    }

    result.executionTime = Date.now() - startTime;
    result.endTime = new Date().toISOString();
    result.successRate = result.totalCases > 0 
      ? ((result.passed / result.totalCases) * 100).toFixed(2) + '%'
      : '0%';

    return result;
  }

  async executeFunctionDetailed(func, context) {
    const result = {
      functionId: func.id,
      functionName: func.name,
      module: func.module,
      totalCases: func.testCases.length,
      passed: 0,
      failed: 0,
      cases: []
    };

    const startTime = Date.now();

    // Ejecutar setup de función si existe
    if (func.setup) {
      console.log(`\n    ${COLORS.cyan}Ejecutando setup de función...${COLORS.reset}`);
      await func.setup(context);
    }

    // Ejecutar cada caso de prueba
    for (let caseIndex = 0; caseIndex < func.testCases.length; caseIndex++) {
      const testCase = func.testCases[caseIndex];
      const caseResult = await testCase.execute(context);
      
      this.printTestCaseDetails(testCase, caseIndex, caseResult);
      
      if (caseResult.passed) {
        result.passed++;
      } else {
        result.failed++;
      }
      
      result.cases.push({
        testCase: testCase,
        result: caseResult
      });
    }

    // Ejecutar teardown de función si existe
    if (func.teardown) {
      console.log(`\n    ${COLORS.cyan}Ejecutando limpieza de función...${COLORS.reset}`);
      await func.teardown(context);
    }

    result.executionTime = Date.now() - startTime;
    result.successRate = result.totalCases > 0 
      ? ((result.passed / result.totalCases) * 100).toFixed(2) + '%'
      : '0%';

    return result;
  }
}

// Función principal
async function runDetailedTests() {
  const executor = new DetailedConsoleExecutor({
    outputDir: './test-results'
  });

  // Agregar todos los escenarios
  executor.addScenario(completeUserJourney);
  executor.addScenario(hypothesisLifecycle);
  executor.addScenario(aiGenerationScenario);

  try {
    const results = await executor.execute();
    
    // Guardar log detallado
    const fs = require('fs').promises;
    const logPath = `./test-results/${results.executionId}/detailed-console.log`;
    await fs.writeFile(logPath, `Log detallado guardado en: ${new Date().toISOString()}`);
    
    console.log(`\n📄 Log guardado en: ${logPath}`);
    
  } catch (error) {
    console.error(COLORS.red + '\n❌ ERROR FATAL:' + COLORS.reset, error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runDetailedTests();
}

module.exports = DetailedConsoleExecutor;