// middleware/sanitize.js
const validator = require('validator');

/**
 * Sanitiza los inputs para prevenir XSS y otros ataques
 */
const sanitizeInputs = (req, res, next) => {
  // Función recursiva para sanitizar objetos
  const sanitizeObject = (obj) => {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'string') {
          // Remover tags HTML y scripts
          obj[key] = validator.escape(obj[key]);
          // Remover caracteres de control
          obj[key] = obj[key].replace(/[\x00-\x1F\x7F]/g, '');
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        }
      }
    }
  };

  // Sanitizar body, query y params
  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
};

/**
 * Sanitización específica para campos de autenticación
 */
const sanitizeAuth = (req, res, next) => {
  if (req.body.email) {
    // Normalizar email
    req.body.email = validator.normalizeEmail(req.body.email, {
      all_lowercase: true,
      gmail_remove_dots: true,
      gmail_remove_subaddress: true,
      outlookdotcom_remove_subaddress: true,
      yahoo_remove_subaddress: true,
      icloud_remove_subaddress: true
    });
  }

  if (req.body.name) {
    // Limpiar nombre
    req.body.name = req.body.name
      .trim()
      .replace(/\s+/g, ' ') // Reemplazar múltiples espacios por uno solo
      .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']/g, ''); // Solo permitir caracteres válidos
  }

  // NO sanitizar la contraseña para no alterar su valor
  
  next();
};

module.exports = {
  sanitizeInputs,
  sanitizeAuth
};