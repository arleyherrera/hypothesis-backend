// scripts/run-metrics-validation.js

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const fs = require('fs');
const path = require('path');

async function runMetricsValidation() {
  console.log('🎯 VALIDACIÓN DE MÉTRICAS DEL SISTEMA\n');
  console.log('=' .repeat(50));
  
  const metricsTests = [
    {
      objetivo: 1,
      nombre: 'Sistema de Evaluación Semántica',
      archivo: 'tests/metrics/objetivo1-semantic-evaluation.test.js',
      metricas: [
        '0 errores críticos en logs del sistema',
        'Todas las pruebas de integración ejecutadas exitosamente'
      ]
    },
    {
      objetivo: 3,
      nombre: 'Motor de Generación IA',
      archivo: 'tests/metrics/objetivo3-ai-generation.test.js',
      metricas: [
        '6 artefactos generados correctamente por cada hipótesis',
        'API respondiendo correctamente a 10 solicitudes concurrentes'
      ]
    },
    {
      objetivo: 4,
      nombre: 'Arquitectura sin errores críticos',
      archivo: 'tests/metrics/objetivo4-architecture.test.js',
      metricas: [
        'Funcionalidad sin errores críticos'
      ]
    }
  ];

  const resultados = [];

  for (const test of metricsTests) {
    console.log(`\n📌 OBJETIVO ${test.objetivo}: ${test.nombre}`);
    console.log('-'.repeat(50));
    console.log('Métricas a validar:');
    test.metricas.forEach(m => console.log(`  ✓ ${m}`));
    
    try {
      console.log('\n🔄 Ejecutando pruebas...');
      const { stdout, stderr } = await execPromise(
        `npx jest ${test.archivo} --verbose --no-coverage`
      );
      
      const passed = stdout.includes('PASS');
      const testResults = stdout.match(/Tests:.*(\d+) passed/);
      const testCount = testResults ? testResults[1] : '0';
      
      resultados.push({
        objetivo: test.objetivo,
        nombre: test.nombre,
        estado: passed ? 'CUMPLIDO' : 'NO CUMPLIDO',
        testsEjecutados: testCount,
        metricas: test.metricas
      });
      
      console.log(`\n✅ Estado: ${passed ? 'CUMPLIDO' : 'NO CUMPLIDO'}`);
      console.log(`📊 Tests ejecutados: ${testCount}`);
      
    } catch (error) {
      console.log('\n❌ ERROR en la validación');
      resultados.push({
        objetivo: test.objetivo,
        nombre: test.nombre,
        estado: 'ERROR',
        error: error.message
      });
    }
  }

  // Generar reporte final
  console.log('\n' + '='.repeat(50));
  console.log('📊 REPORTE FINAL DE MÉTRICAS');
  console.log('='.repeat(50));
  
  const tabla = resultados.map(r => ({
    'Objetivo': r.objetivo,
    'Nombre': r.nombre,
    'Estado': r.estado === 'CUMPLIDO' ? '✅ CUMPLIDO' : '❌ ' + r.estado,
    'Tests': r.testsEjecutados || 'N/A'
  }));
  
  console.table(tabla);
  
  // Guardar reporte
  const reporte = {
    fecha: new Date().toISOString(),
    resultados: resultados,
    resumen: {
      totalObjetivos: resultados.length,
      cumplidos: resultados.filter(r => r.estado === 'CUMPLIDO').length,
      noCumplidos: resultados.filter(r => r.estado !== 'CUMPLIDO').length
    }
  };
  
  fs.writeFileSync(
    path.join(__dirname, '../metrics-report.json'),
    JSON.stringify(reporte, null, 2)
  );
  
  const todosCumplidos = resultados.every(r => r.estado === 'CUMPLIDO');
  
  console.log('\n' + (todosCumplidos ? 
    '🎉 ¡TODAS LAS MÉTRICAS CUMPLIDAS!' : 
    '⚠️  Algunas métricas requieren atención'
  ));
  
  process.exit(todosCumplidos ? 0 : 1);
}

// Ejecutar validación
runMetricsValidation().catch(console.error);