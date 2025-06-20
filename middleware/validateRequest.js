// middleware/validateRequest.js
const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    // Formatear errores para mejor legibilidad
    const formattedErrors = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: process.env.NODE_ENV === 'development' ? error.value : undefined
    }));
    
    // Crear un mensaje consolidado
    const errorMessages = formattedErrors.map(e => e.message).join('. ');
    
    return res.status(400).json({ 
      message: 'Error de validación',
      errors: formattedErrors,
      summary: errorMessages
    });
  }
  
  next();
};

module.exports = validateRequest;