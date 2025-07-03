// tests/generateTestReport.js
const fs = require('fs');
const path = require('path');

class TestReportGenerator {
  constructor() {
    this.results = [];
  }

  addTestResult(feature, testName, input, expectedOutput, actualOutput, passed) {
    this.results.push({
      feature,
      testName,
      input,
      expectedOutput,
      actualOutput,
      passed,
      timestamp: new Date().toISOString()
    });
  }

  generateHTMLReport() {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Reporte de Pruebas - Lean Startup Assistant</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .test-case { 
            border: 1px solid #ddd; 
            margin: 10px 0; 
            padding: 15px; 
            border-radius: 5px;
        }
        .passed { background-color: #d4edda; border-color: #c3e6cb; }
        .failed { background-color: #f8d7da; border-color: #f5c6cb; }
        .data-section { 
            background: #f8f9fa; 
            padding: 10px; 
            margin: 10px 0; 
            border-radius: 3px;
            font-family: monospace;
            white-space: pre-wrap;
        }
        h1 { color: #333; }
        h2 { color: #666; }
        .summary { 
            background: #e9ecef; 
            padding: 15px; 
            border-radius: 5px; 
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <h1>Reporte de Pruebas Unitarias</h1>
    <div class="summary">
        <h2>Resumen</h2>
        <p>Total de pruebas: ${this.results.length}</p>
        <p>Exitosas: ${this.results.filter(r => r.passed).length}</p>
        <p>Fallidas: ${this.results.filter(r => !r.passed).length}</p>
        <p>Fecha: ${new Date().toLocaleString()}</p>
    </div>
    
    ${this.results.map(result => `
        <div class="test-case ${result.passed ? 'passed' : 'failed'}">
            <h3>${result.feature} - ${result.testName}</h3>
            <p>Estado: ${result.passed ? '✅ PASÓ' : '❌ FALLÓ'}</p>
            
            <h4>Entrada:</h4>
            <div class="data-section">${JSON.stringify(result.input, null, 2)}</div>
            
            <h4>Salida Esperada:</h4>
            <div class="data-section">${JSON.stringify(result.expectedOutput, null, 2)}</div>
            
            ${!result.passed ? `
            <h4>Salida Real:</h4>
            <div class="data-section">${JSON.stringify(result.actualOutput, null, 2)}</div>
            ` : ''}
        </div>
    `).join('')}
</body>
</html>
    `;

    const reportPath = path.join(__dirname, `test-report-${Date.now()}.html`);
    fs.writeFileSync(reportPath, html);
    console.log(`📊 Reporte generado: ${reportPath}`);
    return reportPath;
  }

  generateJSONReport() {
    const reportPath = path.join(__dirname, `test-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    return reportPath;
  }
}

module.exports = TestReportGenerator;