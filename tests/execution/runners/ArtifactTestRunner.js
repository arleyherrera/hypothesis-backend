// tests/execution/runners/ArtifactTestRunner.js
const DetailedConsoleExecutor = require('./DetailedConsoleRunner');
const artifactGenerationScenario = require('../../scenarios/artifactGeneration/ArtifactGenerationScenario');

async function runArtifactTests() {
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║           PRUEBAS DE GENERACIÓN DE ARTEFACTOS                    ║
║                  Lean Startup Assistant                          ║
╚══════════════════════════════════════════════════════════════════╝
`);

  const executor = new DetailedConsoleExecutor({
    outputDir: './test-results/artifacts'
  });

  // Solo ejecutar el escenario de artefactos
  executor.addScenario(artifactGenerationScenario);

  try {
    const results = await executor.execute();
    
    // Mostrar resumen específico de artefactos
    console.log('\n📊 RESUMEN DE ARTEFACTOS:\n');
    
    results.scenarios.forEach(scenario => {
      scenario.functions.forEach(func => {
        func.cases.forEach(testCase => {
          const testName = testCase.testCase.name;
          const result = testCase.result;
          
          if (result.passed) {
            // Verificar que existe body y artifacts
            if (result.actualOutput && 
                result.actualOutput.body && 
                result.actualOutput.body.artifacts) {
              
              const artifacts = result.actualOutput.body.artifacts;
              
              // Verificar que artifacts es un array
              if (Array.isArray(artifacts)) {
                console.log(`✅ ${testName}: ${artifacts.length} artefactos generados`);
                
                // Mostrar lista de artefactos
                artifacts.forEach((artifact, index) => {
                  if (artifact && artifact.name) {
                    console.log(`   ${index + 1}. ${artifact.name}`);
                  } else {
                    console.log(`   ${index + 1}. [Artefacto sin nombre]`);
                  }
                });
              } else {
                // Si artifacts no es un array pero el test pasó
                console.log(`✅ ${testName}: Respuesta exitosa (formato diferente)`);
                console.log(`   Tipo de respuesta: ${typeof artifacts}`);
                
                // Si es un string que dice 'array', es un caso especial
                if (artifacts === 'array') {
                  console.log(`   (Se esperaba un array en la validación)`);
                } else {
                  console.log(`   Contenido: ${JSON.stringify(artifacts).substring(0, 100)}...`);
                }
              }
            } else {
              // Test pasó pero sin artifacts en el body
              console.log(`✅ ${testName}: Test exitoso`);
              if (result.actualOutput && result.actualOutput.body) {
                console.log(`   Respuesta: ${result.actualOutput.body.message || 'Sin mensaje'}`);
              }
            }
          } else {
            // Test falló
            console.log(`❌ ${testName}: Test fallido`);
            if (result.error) {
              console.log(`   Error: ${result.error}`);
            }
            if (result.actualOutput && result.actualOutput.body && result.actualOutput.body.message) {
              console.log(`   Mensaje: ${result.actualOutput.body.message}`);
            }
          }
          
          console.log(''); // Línea en blanco entre tests
        });
      });
    });
    
    // Resumen final
    console.log('\n📈 ESTADÍSTICAS FINALES:');
    console.log('─'.repeat(50));
    
    let totalArtifacts = 0;
    let totalTests = 0;
    let passedTests = 0;
    
    results.scenarios.forEach(scenario => {
      scenario.functions.forEach(func => {
        totalTests += func.cases.length;
        
        func.cases.forEach(testCase => {
          if (testCase.result.passed) {
            passedTests++;
            
            // Contar artefactos si existen
            if (testCase.result.actualOutput?.body?.artifacts && 
                Array.isArray(testCase.result.actualOutput.body.artifacts)) {
              totalArtifacts += testCase.result.actualOutput.body.artifacts.length;
            }
          }
        });
      });
    });
    
    console.log(`Total de tests ejecutados: ${totalTests}`);
    console.log(`Tests exitosos: ${passedTests}`);
    console.log(`Tests fallidos: ${totalTests - passedTests}`);
    console.log(`Total de artefactos generados: ${totalArtifacts}`);
    console.log(`Tasa de éxito: ${((passedTests / totalTests) * 100).toFixed(2)}%`);
    console.log('─'.repeat(50));
    
    return results;
    
  } catch (error) {
    console.error('\n❌ Error en pruebas de artefactos:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runArtifactTests();
}

module.exports = runArtifactTests;