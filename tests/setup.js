// Setup global para tests
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno de testing
dotenv.config({ path: path.join(__dirname, '..', '.env.test') });

// Configurar variables de entorno para testing
process.env.NODE_ENV = 'test';

// Verificar que se cargaron las variables correctas
console.log('🔧 Configuración de BD para tests:');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USERNAME:', process.env.DB_USERNAME);
console.log('DB_HOST:', process.env.DB_HOST);

// Configurar timeouts
jest.setTimeout(10000);

// Mock de console en tests para evitar spam (comentado para debugging)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
//   warn: jest.fn(),
//   error: jest.fn(),
// };
