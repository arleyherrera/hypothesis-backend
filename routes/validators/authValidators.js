// routes/validators/authValidators.js
const { body } = require('express-validator');

const registerValidation = [
 body('email')
    .trim()
    .notEmpty().withMessage('El correo electrónico es requerido')
    .isEmail().withMessage('Debe ser un correo electrónico válido')
    .normalizeEmail() // Normaliza el email (lowercase, remove dots in gmail, etc.)
    .isLength({ max: 100 }).withMessage('El correo no puede exceder 100 caracteres')
    .custom((value) => {
      // Validar formato estricto - solo permitir caracteres seguros
      const strictEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!strictEmailRegex.test(value)) {
        throw new Error('Formato de correo inválido. Use solo letras, números, puntos (.), guiones (-) y guiones bajos (_)');
      }
      
      const localPart = value.split('@')[0];
      const domainPart = value.split('@')[1];
      
      // Verificar caracteres no permitidos en la parte local
      const forbiddenChars = /[()<>&\[\]\\,;:\s"'`!#$%^*+={}|~?]/;
      if (forbiddenChars.test(localPart)) {
        throw new Error('El correo contiene caracteres no permitidos como paréntesis, signos o espacios');
      }
      
      // Verificar que no empiece o termine con caracteres especiales
      if (/^[._-]|[._-]$/.test(localPart)) {
        throw new Error('El correo no puede empezar o terminar con punto, guión o guión bajo');
      }
      
      // Verificar puntos consecutivos
      if (localPart.includes('..')) {
        throw new Error('El correo no puede contener puntos consecutivos');
      }
      
      // Verificar longitud de la parte local
      if (localPart.length > 64) {
        throw new Error('La parte del correo antes del @ es demasiado larga');
      }
      
      // Verificar que el dominio no tenga caracteres raros
      if (!/^[a-zA-Z0-9.-]+$/.test(domainPart)) {
        throw new Error('El dominio del correo contiene caracteres inválidos');
      }
      
      return true;
    })
    .custom((value) => {
      // Detectar emails temporales comunes
      const tempEmailDomains = [
        'tempmail.com', 'throwaway.email', '10minutemail.com',
        'guerrillamail.com', 'mailinator.com', 'temp-mail.org'
      ];
      
      const domain = value.split('@')[1].toLowerCase();
      if (tempEmailDomains.includes(domain)) {
        throw new Error('No se permiten correos temporales');
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