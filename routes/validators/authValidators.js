const { body } = require('express-validator');

const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']+$/)
    .withMessage('Nombre inválido'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .isLength({ max: 100 }),
    
  body('password')
    .isLength({ min: 8, max: 50 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/)
    .withMessage('Contraseña no cumple requisitos de seguridad')
];

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

module.exports = {
  registerValidation,
  loginValidation
};