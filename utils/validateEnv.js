// ===== utils/validateEnv.js - Validación de variables de entorno =====

/**
 * Lista de variables de entorno requeridas para el funcionamiento de la aplicación
 * Organizada por categorías para mejor legibilidad
 */
const REQUIRED_ENV_VARS = {
  database: [
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_NAME',
    'DB_HOST'
  ],
  auth: [
    'JWT_SECRET'
  ],
  ai: [
    'AI_API_KEY',
    'AI_SERVICE_URL'
  ]
};

/**
 * Variables de entorno opcionales pero recomendadas
 * Se emitirá una advertencia si no están presentes
 */
const RECOMMENDED_ENV_VARS = {
  general: [
    'NODE_ENV',
    'PORT'
  ],
  cors: [
    'FRONTEND_URL'
  ],
  email: [
    'EMAIL_HOST',
    'EMAIL_USER'
  ]
};

/**
 * Validaciones específicas para ciertas variables de entorno
 */
const ENV_VALIDATORS = {
  JWT_SECRET: (value) => {
    if (value.length < 32) {
      return 'JWT_SECRET debe tener al menos 32 caracteres para ser seguro';
    }
    return null;
  },

  NODE_ENV: (value) => {
    const validEnvs = ['development', 'production', 'test'];
    if (!validEnvs.includes(value)) {
      return `NODE_ENV debe ser uno de: ${validEnvs.join(', ')}`;
    }
    return null;
  },

  PORT: (value) => {
    const port = parseInt(value, 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      return 'PORT debe ser un número entre 1 y 65535';
    }
    return null;
  },

  AI_SERVICE_URL: (value) => {
    try {
      new URL(value);
      return null;
    } catch {
      return 'AI_SERVICE_URL debe ser una URL válida';
    }
  }
};

/**
 * Valida que todas las variables de entorno requeridas estén presentes
 * y cumplan con los requisitos específicos
 *
 * @throws {Error} Si falta alguna variable requerida o no cumple validación
 */
function validateEnv() {
  const errors = [];
  const warnings = [];

  // Validar variables requeridas
  Object.entries(REQUIRED_ENV_VARS).forEach(([category, vars]) => {
    vars.forEach(varName => {
      const value = process.env[varName];

      if (!value || value.trim() === '') {
        errors.push(`❌ Variable requerida faltante [${category}]: ${varName}`);
      } else if (ENV_VALIDATORS[varName]) {
        const validationError = ENV_VALIDATORS[varName](value);
        if (validationError) {
          errors.push(`❌ Validación falló para ${varName}: ${validationError}`);
        }
      }
    });
  });

  // Validar variables recomendadas
  Object.entries(RECOMMENDED_ENV_VARS).forEach(([category, vars]) => {
    vars.forEach(varName => {
      const value = process.env[varName];

      if (!value || value.trim() === '') {
        warnings.push(`⚠️  Variable recomendada faltante [${category}]: ${varName}`);
      } else if (ENV_VALIDATORS[varName]) {
        const validationError = ENV_VALIDATORS[varName](value);
        if (validationError) {
          warnings.push(`⚠️  Validación falló para ${varName}: ${validationError}`);
        }
      }
    });
  });

  // Mostrar advertencias
  if (warnings.length > 0) {
    console.warn('\n🔶 ADVERTENCIAS DE CONFIGURACIÓN:');
    warnings.forEach(warning => console.warn(warning));
    console.warn('');
  }

  // Si hay errores críticos, lanzar excepción
  if (errors.length > 0) {
    console.error('\n❌ ERRORES CRÍTICOS DE CONFIGURACIÓN:');
    errors.forEach(error => console.error(error));
    console.error('\n📋 Por favor, verifica tu archivo .env y asegúrate de que todas las variables requeridas estén configuradas.');
    console.error('📄 Puedes usar .env.example como referencia.\n');

    throw new Error('Faltan variables de entorno requeridas. La aplicación no puede iniciar.');
  }

  console.log('✅ Validación de variables de entorno exitosa\n');
}

/**
 * Obtiene información de resumen sobre la configuración del entorno
 * @returns {Object} Resumen de la configuración
 */
function getEnvSummary() {
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    database: {
      host: process.env.DB_HOST,
      name: process.env.DB_NAME,
      user: process.env.DB_USERNAME
    },
    features: {
      aiEnabled: !!process.env.AI_API_KEY,
      chromaDBEnabled: !!process.env.CHROMADB_URL,
      emailEnabled: !!(process.env.EMAIL_HOST || process.env.SENDGRID_API_KEY)
    }
  };
}

module.exports = {
  validateEnv,
  getEnvSummary
};
