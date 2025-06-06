const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function runMigrations() {
  console.log('🔄 Iniciando migraciones de base de datos...');
  
  try {
    // Ejecutar migraciones
    const { stdout, stderr } = await execPromise('npx sequelize-cli db:migrate');
    
    if (stdout) {
      console.log('✅ Migraciones ejecutadas exitosamente:');
      console.log(stdout);
    }
    
    if (stderr) {
      console.error('⚠️  Advertencias durante la migración:');
      console.error(stderr);
    }
    
    console.log('✅ Proceso de migración completado');
  } catch (error) {
    console.error('❌ Error durante las migraciones:');
    console.error(error.message);
    
    // En producción, queremos que el deploy falle si las migraciones fallan
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}

// Ejecutar solo si es llamado directamente
if (require.main === module) {
  runMigrations();
}

module.exports = runMigrations;