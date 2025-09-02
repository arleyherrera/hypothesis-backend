// tests/validation/runAllValidations.js
const { runCoherenceValidation } = require('./coherenceValidation');
const { runAuthenticationValidation } = require('./authenticationValidation');
const { runArtifactGenerationValidation } = require('./artifactGenerationValidation');
const fs = require('fs').promises;
const path = require('path');

async function runAllValidations() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║         VALIDACIÓN COMPLETA DE MÉTRICAS DEL PROYECTO            ║
║                   Lean Startup Assistant                         ║
╚══════════════════════════════════════════════════════════════════╝

Fecha: ${new Date().toLocaleString('es-ES')}
`);

  const results = {
    timestamp: new Date().toISOString(),
    objectives: {}
  };

  try {
    // Objetivo 1: Coherencia Semántica
    console.log('\n\n📌 OBJETIVO 1: COHERENCIA SEMÁNTICA\n');
    console.log('─'.repeat(80));
    results.objectives.coherence = await runCoherenceValidation();
    
    // Esperar un poco entre validaciones
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Objetivo 2: Autenticación
    console.log('\n\n📌 OBJETIVO 2: AUTENTICACIÓN JWT\n');
    console.log('─'.repeat(80));
    results.objectives.authentication = await runAuthenticationValidation();
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Objetivo 3: Generación de Artefactos
    console.log('\n\n📌 OBJETIVO 3: GENERACIÓN DE ARTEFACTOS\n');
    console.log('─'.repeat(80));
    results.objectives.artifactGeneration = await runArtifactGenerationValidation();
    
    // Generar reporte final
    await generateFinalReport(results);
    
  } catch (error) {
    console.error('\n❌ Error durante la validación:', error);
    process.exit(1);
  }
}

async function generateFinalReport(results) {
  console.log('\n\n' + '='.repeat(80));
  console.log('📊 RESUMEN EJECUTIVO DE VALIDACIÓN');
  console.log('='.repeat(80));
  
  const summary = {
    objective1: {
      name: 'Coherencia Semántica',
      target: '≥ 90%',
      achieved: results.objectives.coherence.coherencePercentage.toFixed(2) + '%',
      status: results.objectives.coherence.meetsObjective ? '✅ CUMPLIDO' : '❌ NO CUMPLIDO'
    },
    objective2: {
      name: 'Autenticación JWT',
      targets: {
        authRate: {
          name: 'Tasa de autenticación',
          target: '≥ 98%',
          achieved: results.objectives.authentication.successRate.toFixed(2) + '%',
          status: results.objectives.authentication.meetsAuthObjective ? '✅' : '❌'
        },
        sessions: {
          name: 'Sesiones autenticadas',
          target: '≥ 100',
          achieved: results.objectives.authentication.uniqueSessions,
          status: results.objectives.authentication.meetsSessionObjective ? '✅' : '❌'
        }
      },
      status: results.objectives.authentication.meetsAuthObjective && 
               results.objectives.authentication.meetsSessionObjective ? '✅ CUMPLIDO' : '❌ NO CUMPLIDO'
    },
    objective3: {
      name: 'Generación de Artefactos',
      target: '≥ 95%',
      achieved: results.objectives.artifactGeneration.successRate.toFixed(2) + '%',
      status: results.objectives.artifactGeneration.meetsObjective ? '✅ CUMPLIDO' : '❌ NO CUMPLIDO'
    }
  };
  
  // Imprimir resumen
  console.log('\n📋 Objetivo 1: ' + summary.objective1.name);
  console.log(`   Meta: ${summary.objective1.target}`);
  console.log(`   Logrado: ${summary.objective1.achieved}`);
  console.log(`   Estado: ${summary.objective1.status}`);
  
  console.log('\n📋 Objetivo 2: ' + summary.objective2.name);
  console.log(`   - ${summary.objective2.targets.authRate.name}`);
  console.log(`     Meta: ${summary.objective2.targets.authRate.target}`);
  console.log(`     Logrado: ${summary.objective2.targets.authRate.achieved}`);
  console.log(`     Estado: ${summary.objective2.targets.authRate.status}`);
  console.log(`   - ${summary.objective2.targets.sessions.name}`);
  console.log(`     Meta: ${summary.objective2.targets.sessions.target}`);
  console.log(`     Logrado: ${summary.objective2.targets.sessions.achieved}`);
  console.log(`     Estado: ${summary.objective2.targets.sessions.status}`);
  console.log(`   Estado General: ${summary.objective2.status}`);
  
  console.log('\n📋 Objetivo 3: ' + summary.objective3.name);
  console.log(`   Meta: ${summary.objective3.target}`);
  console.log(`   Logrado: ${summary.objective3.achieved}`);
  console.log(`   Estado: ${summary.objective3.status}`);
  
  // Estado general
  const allObjectivesMet = 
    results.objectives.coherence.meetsObjective &&
    results.objectives.authentication.meetsAuthObjective &&
    results.objectives.authentication.meetsSessionObjective &&
    results.objectives.artifactGeneration.meetsObjective;
  
  console.log('\n' + '='.repeat(80));
  console.log('🎯 ESTADO GENERAL DEL PROYECTO: ' + (allObjectivesMet ? '✅ TODOS LOS OBJETIVOS CUMPLIDOS' : '❌ OBJETIVOS PENDIENTES'));
  console.log('='.repeat(80));
  
  // Guardar reporte
  const reportPath = path.join(__dirname, `validation-report-${Date.now()}.json`);
  await fs.writeFile(reportPath, JSON.stringify({
    ...results,
    summary
  }, null, 2));
  
  console.log(`\n📄 Reporte completo guardado en: ${reportPath}`);
  
  // Generar reporte HTML
  await generateHTMLReport(results, summary);
}

async function generateHTMLReport(results, summary) {
  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reporte de Validación - Lean Startup Assistant</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 40px;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        .objective {
            margin: 20px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 5px solid #3498db;
        }
        .success {
            color: #27ae60;
            font-weight: bold;
        }
        .failure {
            color: #e74c3c;
            font-weight: bold;
        }
        .metric {
            display: inline-block;
            margin: 10px 20px;
        }
        .summary-box {
            background: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #3498db;
            color: white;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Reporte de Validación de Métricas</h1>
        <p>Fecha: ${new Date().toLocaleString('es-ES')}</p>
        
        <div class="summary-box">
            <h2>Estado General: ${summary.objective1.status === '✅ CUMPLIDO' && 
                                 summary.objective2.status === '✅ CUMPLIDO' && 
                                 summary.objective3.status === '✅ CUMPLIDO' 
                                 ? '<span class="success">✅ TODOS LOS OBJETIVOS CUMPLIDOS</span>' 
                                 : '<span class="failure">❌ OBJETIVOS PENDIENTES</span>'}</h2>
        </div>
        
        <div class="objective">
            <h2>Objetivo 1: Coherencia Semántica</h2>
            <div class="metric">
                <strong>Meta:</strong> ≥ 90%<br>
                <strong>Logrado:</strong> ${summary.objective1.achieved}<br>
                <strong>Estado:</strong> ${summary.objective1.status}
            </div>
            <table>
                <tr>
                    <th>Métrica</th>
                    <th>Valor</th>
                </tr>
                <tr>
                    <td>Total de artefactos analizados</td>
                    <td>${results.objectives.coherence.totalArtifacts}</td>
                </tr>
                <tr>
                    <td>Artefactos coherentes</td>
                    <td>${results.objectives.coherence.coherentArtifacts}</td>
                </tr>
                <tr>
                    <td>Artefactos incoherentes</td>
                    <td>${results.objectives.coherence.incoherentArtifacts}</td>
                </tr>
            </table>
        </div>
        
        <div class="objective">
            <h2>Objetivo 2: Autenticación JWT</h2>
            <table>
                <tr>
                    <th>Métrica</th>
                    <th>Meta</th>
                    <th>Logrado</th>
                    <th>Estado</th>
                </tr>
                <tr>
                    <td>Tasa de autenticación exitosa</td>
                    <td>≥ 98%</td>
                    <td>${summary.objective2.targets.authRate.achieved}</td>
                    <td>${summary.objective2.targets.authRate.status}</td>
                </tr>
                <tr>
                    <td>Sesiones autenticadas</td>
                    <td>≥ 100</td>
                    <td>${summary.objective2.targets.sessions.achieved}</td>
                    <td>${summary.objective2.targets.sessions.status}</td>
                </tr>
            </table>
        </div>
        
        <div class="objective">
            <h2>Objetivo 3: Generación de Artefactos</h2>
            <div class="metric">
                <strong>Meta:</strong> ≥ 95%<br>
                <strong>Logrado:</strong> ${summary.objective3.achieved}<br>
                <strong>Estado:</strong> ${summary.objective3.status}
            </div>
            <table>
                <tr>
                    <th>Fase</th>
                    <th>Exitosas</th>
                    <th>Fallidas</th>
                    <th>Tasa de Éxito</th>
                </tr>
                ${Object.entries(results.objectives.artifactGeneration.generationsByPhase)
                  .map(([phase, data]) => {
                    const total = data.success + data.failed;
                    const rate = total > 0 ? ((data.success / total) * 100).toFixed(2) : 0;
                    return `
                    <tr>
                        <td>${phase}</td>
                        <td>${data.success}</td>
                        <td>${data.failed}</td>
                        <td>${rate}%</td>
                    </tr>`;
                  }).join('')}
            </table>
        </div>
    </div>
</body>
</html>`;

  const htmlPath = path.join(__dirname, `validation-report-${Date.now()}.html`);
  await fs.writeFile(htmlPath, html);
  console.log(`📄 Reporte HTML guardado en: ${htmlPath}`);
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runAllValidations();
}

module.exports = { runAllValidations };