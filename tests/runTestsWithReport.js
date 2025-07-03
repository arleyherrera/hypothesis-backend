const { execSync } = require('child_process');
const TestReportGenerator = require('./generateTestReport');

const reporter = new TestReportGenerator();

console.log('🧪 Ejecutando pruebas con reporte detallado...\n');

try {
  // Ejecutar tests y capturar salida
  const output = execSync('npm run test:detailed', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  
  console.log(output);
  
  // Generar reportes
  reporter.generateHTMLReport();
  reporter.generateJSONReport();
  
  console.log('\n✅ Pruebas completadas y reportes generados');
} catch (error) {
  console.error('❌ Error en las pruebas:', error.message);
}