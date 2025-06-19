// ===== middleware/errorHandler.js - COMPLETAMENTE ACTUALIZADO =====
const { AppError } = require('../utils/errors');
const config = require('../config');

/**
 * Middleware global de manejo de errores
 */
const errorHandler = (err, req, res, next) => {
  // Si la respuesta ya fue enviada
  if (res.headersSent) {
    return next(err);
  }

  // Log del error
  const errorLog = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.user?.id || 'anonymous',
    error: {
      name: err.name,
      message: err.message,
      statusCode: err.statusCode,
      stack: config.isDevelopment() ? err.stack : undefined
    }
  };
  
  console.error('Error Handler:', errorLog);

  // Si es un error operacional conocido
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.toJSON()
    });
  }

  // Errores de Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        name: 'ValidationError',
        message: 'Error de validación en base de datos',
        statusCode: 400,
        fields: err.errors.map(e => ({
          field: e.path,
          message: e.message,
          value: config.isDevelopment() ? e.value : undefined
        }))
      }
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      success: false,
      error: {
        name: 'ConflictError',
        message: 'El registro ya existe',
        statusCode: 409,
        fields: err.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      }
    });
  }

  // Error de parsing JSON
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: {
        name: 'ValidationError',
        message: 'JSON inválido en el cuerpo de la solicitud',
        statusCode: 400
      }
    });
  }

  // Error genérico
  const statusCode = err.statusCode || 500;
  const message = config.isProduction() 
    ? 'Error interno del servidor' 
    : err.message || 'Error desconocido';

  res.status(statusCode).json({
    success: false,
    error: {
      name: 'InternalServerError',
      message: message,
      statusCode: statusCode,
      ...(config.isDevelopment() && { 
        originalError: err.message,
        stack: err.stack 
      })
    }
  });
};

module.exports = errorHandler;