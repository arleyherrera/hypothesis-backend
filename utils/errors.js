// ===== utils/errors.js - Clases de error personalizadas =====

/**
 * Clase base para errores operacionales de la aplicación
 * Los errores operacionales son aquellos que esperamos y podemos manejar
 * (validación, autenticación, recursos no encontrados, etc.)
 */
class AppError extends Error {
  /**
   * @param {string} message - Mensaje de error
   * @param {number} statusCode - Código HTTP de estado
   * @param {string} name - Nombre del error (opcional)
   * @param {Object} metadata - Metadata adicional del error (opcional)
   */
  constructor(message, statusCode = 500, name = 'AppError', metadata = {}) {
    super(message);

    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = true; // Marca este error como operacional (esperado)
    this.metadata = metadata;
    this.timestamp = new Date().toISOString();

    // Captura el stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convierte el error a formato JSON para respuestas API
   * @returns {Object} Representación JSON del error
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      ...(Object.keys(this.metadata).length > 0 && { metadata: this.metadata })
    };
  }
}

/**
 * Error de validación - 400 Bad Request
 * Usado cuando los datos de entrada no cumplen con los requisitos
 */
class ValidationError extends AppError {
  constructor(message, fields = []) {
    super(message, 400, 'ValidationError', { fields });
  }
}

/**
 * Error de autenticación - 401 Unauthorized
 * Usado cuando las credenciales son inválidas o no se proporcionan
 */
class AuthenticationError extends AppError {
  constructor(message = 'No autorizado. Credenciales inválidas o faltantes') {
    super(message, 401, 'AuthenticationError');
  }
}

/**
 * Error de autorización - 403 Forbidden
 * Usado cuando el usuario está autenticado pero no tiene permisos
 */
class AuthorizationError extends AppError {
  constructor(message = 'Prohibido. No tienes permisos para acceder a este recurso') {
    super(message, 403, 'AuthorizationError');
  }
}

/**
 * Error de recurso no encontrado - 404 Not Found
 * Usado cuando el recurso solicitado no existe
 */
class NotFoundError extends AppError {
  constructor(resource = 'Recurso', identifier = '') {
    const message = identifier
      ? `${resource} con identificador '${identifier}' no encontrado`
      : `${resource} no encontrado`;
    super(message, 404, 'NotFoundError', { resource, identifier });
  }
}

/**
 * Error de conflicto - 409 Conflict
 * Usado cuando hay conflicto con el estado actual (ej: registro duplicado)
 */
class ConflictError extends AppError {
  constructor(message = 'El recurso ya existe') {
    super(message, 409, 'ConflictError');
  }
}

/**
 * Error de límite de tasa - 429 Too Many Requests
 * Usado cuando se excede el límite de solicitudes
 */
class RateLimitError extends AppError {
  constructor(message = 'Demasiadas solicitudes. Por favor, intenta más tarde', retryAfter = null) {
    super(message, 429, 'RateLimitError', { retryAfter });
  }
}

/**
 * Error interno del servidor - 500 Internal Server Error
 * Usado para errores inesperados del servidor
 */
class InternalServerError extends AppError {
  constructor(message = 'Error interno del servidor') {
    super(message, 500, 'InternalServerError');
  }
}

/**
 * Error de servicio no disponible - 503 Service Unavailable
 * Usado cuando un servicio externo no está disponible (BD, API externa, etc.)
 */
class ServiceUnavailableError extends AppError {
  constructor(service = 'Servicio', message = null) {
    const errorMessage = message || `${service} no disponible temporalmente`;
    super(errorMessage, 503, 'ServiceUnavailableError', { service });
  }
}

/**
 * Error de integración con servicio externo
 * Usado cuando falla la comunicación con APIs externas (OpenAI, ChromaDB, etc.)
 */
class ExternalServiceError extends AppError {
  constructor(service, originalError, statusCode = 502) {
    const message = `Error al comunicarse con ${service}: ${originalError.message}`;
    super(message, statusCode, 'ExternalServiceError', {
      service,
      originalMessage: originalError.message
    });
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  InternalServerError,
  ServiceUnavailableError,
  ExternalServiceError
};
