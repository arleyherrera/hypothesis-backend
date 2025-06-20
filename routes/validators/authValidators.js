// routes/validators/authValidators.js
const { body } = require('express-validator');

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']+$/).withMessage('El nombre solo puede contener letras, espacios, guiones y apóstrofes')
    .custom((value) => {
      // Verificar que no haya espacios múltiples
      if (/\s{2,}/.test(value)) {
        throw new Error('El nombre no puede contener espacios múltiples');
      }
      // Verificar que no empiece o termine con espacios
      if (value !== value.trim()) {
        throw new Error('El nombre no puede empezar o terminar con espacios');
      }
      // Verificar que tenga al menos 2 caracteres alfabéticos
      const letterCount = (value.match(/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g) || []).length;
      if (letterCount < 2) {
        throw new Error('El nombre debe contener al menos 2 letras');
      }
      return true;
    }),
  
  body('email')
    .trim()
    .notEmpty().withMessage('El correo electrónico es requerido')
    .isEmail().withMessage('Debe ser un correo electrónico válido')
    .normalizeEmail() // Normaliza el email (lowercase, remove dots in gmail, etc.)
    .isLength({ max: 100 }).withMessage('El correo no puede exceder 100 caracteres')
    .custom((value) => {
      // Verificar caracteres permitidos en el email
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(value)) {
        throw new Error('El correo contiene caracteres no permitidos');
      }
      // Verificar que no tenga caracteres especiales peligrosos
      const dangerousChars = /[()<>\[\]\\,;:\s@"]/;
      const localPart = value.split('@')[0];
      if (dangerousChars.test(localPart)) {
        throw new Error('El correo contiene caracteres no permitidos antes del @');
      }
      return true;
    }),
    
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 8, max: 50 }).withMessage('La contraseña debe tener entre 8 y 50 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/).withMessage('La contraseña debe contener al menos: una minúscula, una mayúscula, un número y un carácter especial (!@#$%^&*)')
    .custom((value) => {
      // Verificar que no contenga espacios
      if (/\s/.test(value)) {
        throw new Error('La contraseña no puede contener espacios');
      }
      // Verificar que no sea una contraseña común
      const commonPasswords = ['password', '12345678', 'qwerty', 'abc123', 'password123'];
      if (commonPasswords.some(common => value.toLowerCase().includes(common))) {
        throw new Error('La contraseña es muy común, por favor use una más segura');
      }
      return true;
    })
];

const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('El correo electrónico es requerido')
    .isEmail().withMessage('Correo electrónico inválido')
    .normalizeEmail()
    .custom((value) => {
      // Aplicar las mismas validaciones que en registro para consistencia
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      if (!emailRegex.test(value)) {
        throw new Error('El correo contiene caracteres no permitidos');
      }
      return true;
    }),
    
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .custom((value) => {
      if (/\s/.test(value)) {
        throw new Error('La contraseña no puede contener espacios');
      }
      return true;
    })
];

module.exports = {
  registerValidation,
  loginValidation
};