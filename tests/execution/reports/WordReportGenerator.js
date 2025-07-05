// tests/execution/reports/WordReportGenerator.js
const fs = require('fs').promises;
const path = require('path');

class WordReportGenerator {
  async generateCompleteReport() {
    // Buscar la última ejecución
    const testResultsDir = './test-results';
    const executions = await fs.readdir(testResultsDir);
    const latestExecution = executions.sort().pop();
    
    if (!latestExecution) {
      console.error('No hay resultados de pruebas');
      return;
    }
    
    const resultsPath = path.join(testResultsDir, latestExecution, 'results.json');
    const results = JSON.parse(await fs.readFile(resultsPath, 'utf8'));
    
    // Generar el documento HTML para Word
    const htmlContent = await this.generateWordDocument(results);
    
    // Guardar el archivo
    const outputPath = path.join(testResultsDir, latestExecution, 'informe-pruebas-completo.html');
    await fs.writeFile(outputPath, htmlContent);
    
    console.log(`\n✅ Documento generado: ${outputPath}`);
    console.log('📄 Puedes abrir este archivo con Microsoft Word');
    
    return outputPath;
  }
  
  async generateWordDocument(results) {
    const fechaActual = new Date().toLocaleString('es-ES');
    
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Informe de Pruebas - Lean Startup Assistant</title>
    <style>
        @page {
            size: A4;
            margin: 2.5cm;
        }
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 21cm;
            margin: 0 auto;
        }
        .portada {
            text-align: center;
            page-break-after: always;
            padding-top: 10cm;
        }
        .portada h1 {
            font-size: 36pt;
            margin-bottom: 2cm;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            page-break-before: always;
        }
        h1:first-child {
            page-break-before: avoid;
        }
        h2 {
            color: #34495e;
            margin-top: 30px;
        }
        h3 {
            color: #7f8c8d;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #3498db;
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .passed {
            color: #27ae60;
            font-weight: bold;
        }
        .failed {
            color: #e74c3c;
            font-weight: bold;
        }
        .metric-box {
            background: #ecf0f1;
            padding: 20px;
            margin: 20px 0;
            border-radius: 8px;
            display: inline-block;
            margin-right: 20px;
        }
        .metric-value {
            font-size: 24pt;
            font-weight: bold;
            color: #2c3e50;
        }
        .toc {
            page-break-after: always;
        }
        .toc ul {
            list-style: none;
            padding-left: 0;
        }
        .toc li {
            margin: 10px 0;
            padding: 5px;
            border-bottom: 1px dotted #ccc;
        }
        .test-case {
            background: #f8f9fa;
            padding: 15px;
            margin: 15px 0;
            border-left: 4px solid #3498db;
            border-radius: 4px;
        }
        .test-case.positive {
            border-left-color: #27ae60;
        }
        .test-case.negative {
            border-left-color: #e74c3c;
        }
        code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        pre {
            background: #f4f4f4;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            border: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <!-- PORTADA -->
    <div class="portada">
        <h1>INFORME DE PRUEBAS DE SOFTWARE</h1>
        <h2>Lean Startup Assistant</h2>
        <p style="font-size: 18pt; margin-top: 3cm;">
            Fecha: ${fechaActual}<br>
            Versión: 1.0.0
        </p>
    </div>
    
    <!-- TABLA DE CONTENIDOS -->
    <div class="toc">
        <h1>Tabla de Contenidos</h1>
        <ul>
            <li>1. Resumen Ejecutivo</li>
            <li>2. Escenarios de Prueba</li>
            <li>3. Funciones Probadas</li>
            <li>4. Casos de Prueba Detallados</li>
            <li>5. Resultados de Ejecución</li>
            <li>6. Conclusiones y Recomendaciones</li>
        </ul>
    </div>
    
    <!-- 1. RESUMEN EJECUTIVO -->
    <h1>1. Resumen Ejecutivo</h1>
    
    <h2>1.1 Objetivo</h2>
    <p>Este documento presenta los resultados de las pruebas realizadas al sistema Lean Startup Assistant, 
    una aplicación diseñada para ayudar a emprendedores a validar sus hipótesis de negocio siguiendo 
    la metodología Lean Startup.</p>
    
    <h2>1.2 Alcance</h2>
    <p>Las pruebas cubren los siguientes módulos principales:</p>
    <ul>
        <li>Autenticación de usuarios (registro y login)</li>
        <li>Gestión de hipótesis</li>
        <li>Generación de artefactos con IA</li>
    </ul>
    
    <h2>1.3 Métricas Generales</h2>
    <div>
        <div class="metric-box">
            <div class="metric-value">${results.summary.totalScenarios}</div>
            <div>Escenarios</div>
        </div>
        <div class="metric-box">
            <div class="metric-value">${results.summary.totalCases}</div>
            <div>Casos de Prueba</div>
        </div>
        <div class="metric-box">
            <div class="metric-value passed">${results.summary.passed}</div>
            <div>Exitosos</div>
        </div>
        <div class="metric-box">
            <div class="metric-value failed">${results.summary.failed}</div>
            <div>Fallidos</div>
        </div>
        <div class="metric-box">
            <div class="metric-value">${results.summary.successRate}</div>
            <div>Tasa de Éxito</div>
        </div>
    </div>
    
    <!-- 2. ESCENARIOS DE PRUEBA -->
    <h1>2. Escenarios de Prueba</h1>
    
    ${this.generateScenariosSection(results.scenarios)}
    
    <!-- 3. FUNCIONES PROBADAS -->
    <h1>3. Funciones Probadas</h1>
    
    ${this.generateFunctionsSection(results.scenarios)}
    
    <!-- 4. CASOS DE PRUEBA DETALLADOS -->
    <h1>4. Casos de Prueba Detallados</h1>
    
    ${this.generateTestCasesSection(results.scenarios)}
    
    <!-- 5. RESULTADOS DE EJECUCIÓN -->
    <h1>5. Resultados de Ejecución</h1>
    
    <h2>5.1 Resumen de Ejecución</h2>
    <table>
        <tr>
            <th>Métrica</th>
            <th>Valor</th>
        </tr>
        <tr>
            <td>ID de Ejecución</td>
            <td>${results.executionId}</td>
        </tr>
        <tr>
            <td>Fecha de Inicio</td>
            <td>${new Date(results.startTime).toLocaleString('es-ES')}</td>
        </tr>
        <tr>
            <td>Fecha de Fin</td>
            <td>${new Date(results.endTime).toLocaleString('es-ES')}</td>
        </tr>
        <tr>
            <td>Duración Total</td>
            <td>${((new Date(results.endTime) - new Date(results.startTime)) / 1000).toFixed(2)} segundos</td>
        </tr>
    </table>
    
    <h2>5.2 Resultados por Escenario</h2>
    ${this.generateExecutionResults(results.scenarios)}
    
    <!-- 6. CONCLUSIONES -->
    <h1>6. Conclusiones y Recomendaciones</h1>
    
    <h2>6.1 Conclusiones</h2>
    ${this.generateConclusions(results)}
    
    <h2>6.2 Recomendaciones</h2>
    <ul>
        <li>Mantener la cobertura de pruebas por encima del 80%</li>
        <li>Implementar pruebas de carga para los endpoints de IA</li>
        <li>Agregar pruebas de integración end-to-end</li>
        <li>Monitorear el rendimiento en producción</li>
        <li>Establecer alertas para tasa de éxito menor al 95%</li>
    </ul>
    
    <h2>6.3 Próximos Pasos</h2>
    <ol>
        <li>Revisar y corregir cualquier caso de prueba fallido</li>
        <li>Expandir la cobertura de pruebas a módulos no cubiertos</li>
        <li>Implementar pruebas automatizadas en el pipeline CI/CD</li>
        <li>Establecer métricas de calidad continuas</li>
    </ol>
</body>
</html>`;
  }
  
  generateScenariosSection(scenarios) {
    let html = '';
    
    scenarios.forEach((scenario, index) => {
      html += `
      <h2>2.${index + 1} ${scenario.scenarioName}</h2>
      <table>
        <tr>
            <th>Propiedad</th>
            <th>Valor</th>
        </tr>
        <tr>
            <td>Funciones Ejecutadas</td>
            <td>${scenario.totalFunctions}</td>
        </tr>
        <tr>
            <td>Casos de Prueba</td>
            <td>${scenario.totalCases}</td>
        </tr>
        <tr>
            <td>Exitosos</td>
            <td class="passed">${scenario.passed}</td>
        </tr>
        <tr>
            <td>Fallidos</td>
            <td class="failed">${scenario.failed}</td>
        </tr>
        <tr>
            <td>Tasa de Éxito</td>
            <td>${scenario.successRate}</td>
        </tr>
      </table>`;
    });
    
    return html;
  }
  
  generateFunctionsSection(scenarios) {
    let html = '';
    let functionIndex = 1;
    
    scenarios.forEach(scenario => {
      if (scenario.functions) {
        scenario.functions.forEach(func => {
          html += `
          <h2>3.${functionIndex} Función: ${func.functionName}</h2>
          <p><strong>Módulo:</strong> ${func.module}</p>
          <p><strong>Casos de prueba:</strong> ${func.totalCases}</p>
          <p><strong>Tasa de éxito:</strong> ${func.successRate}</p>`;
          functionIndex++;
        });
      }
    });
    
    return html;
  }
  
  generateTestCasesSection(scenarios) {
    let html = '';
    let caseIndex = 1;
    
    scenarios.forEach(scenario => {
      if (scenario.functions) {
        scenario.functions.forEach(func => {
          func.cases.forEach(testCase => {
            const tc = testCase.testCase;
            const result = testCase.result;
            
            html += `
            <div class="test-case ${tc.type}">
                <h3>4.${caseIndex} ${tc.name}</h3>
                <p><strong>ID:</strong> ${tc.id}</p>
                <p><strong>Tipo:</strong> ${tc.type}</p>
                <p><strong>Prioridad:</strong> ${tc.priority}</p>
                <p><strong>Estado:</strong> <span class="${result.passed ? 'passed' : 'failed'}">${result.passed ? 'PASÓ' : 'FALLÓ'}</span></p>
                
                <h4>Entrada:</h4>
                <pre>${JSON.stringify(tc.input, null, 2)}</pre>
                
                <h4>Salida Esperada:</h4>
                <pre>${JSON.stringify(tc.expectedOutput, null, 2)}</pre>
                
                <h4>Salida Real:</h4>
                <pre>${JSON.stringify(result.actualOutput, null, 2)}</pre>
                
                <p><strong>Tiempo de ejecución:</strong> ${result.executionTime}ms</p>
            </div>`;
            caseIndex++;
          });
        });
      }
    });
    
    return html;
  }
  
  generateExecutionResults(scenarios) {
    let html = '<table><tr><th>Escenario</th><th>Duración</th><th>Resultado</th></tr>';
    
    scenarios.forEach(scenario => {
      html += `
      <tr>
        <td>${scenario.scenarioName}</td>
        <td>${(scenario.executionTime / 1000).toFixed(2)}s</td>
        <td class="${scenario.failed === 0 ? 'passed' : 'failed'}">
          ${scenario.failed === 0 ? '✅ EXITOSO' : '❌ CON FALLOS'}
        </td>
      </tr>`;
    });
    
    html += '</table>';
    return html;
  }
  
  generateConclusions(results) {
    const successRate = parseFloat(results.summary.successRate);
    
    if (successRate === 100) {
      return `
      <p>Las pruebas ejecutadas muestran un <strong>100% de éxito</strong>, lo que indica que 
      todas las funcionalidades probadas están operando correctamente según las especificaciones.</p>
      <p>El sistema demuestra estabilidad en los módulos críticos de autenticación y gestión de hipótesis.</p>`;
    } else if (successRate >= 80) {
      return `
      <p>Con una tasa de éxito del <strong>${successRate}%</strong>, el sistema muestra un buen nivel 
      de funcionalidad, aunque se identificaron algunos casos que requieren atención.</p>`;
    } else {
      return `
      <p>La tasa de éxito del <strong>${successRate}%</strong> indica que existen problemas significativos 
      que deben ser abordados antes del despliegue a producción.</p>`;
    }
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const generator = new WordReportGenerator();
  generator.generateCompleteReport().catch(console.error);
}

module.exports = WordReportGenerator;