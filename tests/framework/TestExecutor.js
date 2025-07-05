const fs = require('fs').promises;
const path = require('path');

class TestExecutor {
  constructor(config = {}) {
    this.scenarios = [];
    this.config = {
      outputDir: config.outputDir || './test-results',
      reportFormat: config.reportFormat || ['html', 'json', 'markdown'],
      ...config
    };
  }

  addScenario(scenario) {
    this.scenarios.push(scenario);
  }

  async execute(options = {}) {
    console.log('🚀 Iniciando ejecución de pruebas...\n');
    
    const executionId = Date.now();
    const results = {
      executionId,
      startTime: new Date().toISOString(),
      scenarios: [],
      summary: {}
    };

    for (const scenario of this.scenarios) {
      console.log(`\n📋 Ejecutando escenario: ${scenario.name}`);
      const scenarioResult = await scenario.execute(options);
      results.scenarios.push(scenarioResult);
    }

    results.endTime = new Date().toISOString();
    results.summary = this.calculateSummary(results.scenarios);

    await this.saveResults(executionId, results);
    await this.generateReports(executionId, results);

    return results;
  }

  calculateSummary(scenarioResults) {
    const summary = {
      totalScenarios: scenarioResults.length,
      totalFunctions: 0,
      totalCases: 0,
      passed: 0,
      failed: 0
    };
    
    scenarioResults.forEach(sr => {
      summary.totalFunctions += sr.totalFunctions;
      summary.totalCases += sr.totalCases;
      summary.passed += sr.passed;
      summary.failed += sr.failed;
    });
    
    summary.successRate = summary.totalCases > 0 
      ? (summary.passed / summary.totalCases * 100).toFixed(2) + '%'
      : '0%';
    
    return summary;
  }

  async saveResults(executionId, results) {
    const outputDir = path.join(this.config.outputDir, executionId.toString());
    await fs.mkdir(outputDir, { recursive: true });
    
    const filePath = path.join(outputDir, 'results.json');
    await fs.writeFile(filePath, JSON.stringify(results, null, 2));
  }

  async generateReports(executionId, results) {
    // Implementación de generadores de reportes
    const outputDir = path.join(this.config.outputDir, executionId.toString());
    
    if (this.config.reportFormat.includes('html')) {
      await this.generateHTMLReport(outputDir, results);
    }
    
    if (this.config.reportFormat.includes('markdown')) {
      await this.generateMarkdownReport(outputDir, results);
    }
  }

  async generateHTMLReport(outputDir, results) {
    // Implementación del reporte HTML
    const html = `<!DOCTYPE html>
<html>
<head>
    <title>Test Report - ${results.executionId}</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .summary { background: #f0f0f0; padding: 15px; border-radius: 5px; }
        .scenario { margin: 20px 0; border: 1px solid #ddd; padding: 15px; }
        .passed { color: green; }
        .failed { color: red; }
    </style>
</head>
<body>
    <h1>Test Execution Report</h1>
    <div class="summary">
        <h2>Summary</h2>
        <p>Total Scenarios: ${results.summary.totalScenarios}</p>
        <p>Total Test Cases: ${results.summary.totalCases}</p>
        <p>Passed: <span class="passed">${results.summary.passed}</span></p>
        <p>Failed: <span class="failed">${results.summary.failed}</span></p>
        <p>Success Rate: ${results.summary.successRate}</p>
    </div>
    ${results.scenarios.map(s => `
        <div class="scenario">
            <h2>${s.scenarioName}</h2>
            <p>Success Rate: ${s.successRate}</p>
        </div>
    `).join('')}
</body>
</html>`;

    await fs.writeFile(path.join(outputDir, 'report.html'), html);
  }

  async generateMarkdownReport(outputDir, results) {
    let md = `# Test Execution Report\n\n`;
    md += `**Execution ID:** ${results.executionId}\n`;
    md += `**Date:** ${results.startTime}\n\n`;
    md += `## Summary\n`;
    md += `- Total Scenarios: ${results.summary.totalScenarios}\n`;
    md += `- Total Cases: ${results.summary.totalCases}\n`;
    md += `- Passed: ${results.summary.passed}\n`;
    md += `- Failed: ${results.summary.failed}\n`;
    md += `- Success Rate: ${results.summary.successRate}\n`;

    await fs.writeFile(path.join(outputDir, 'report.md'), md);
  }
}

module.exports = TestExecutor;