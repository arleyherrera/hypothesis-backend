// routes/validators/userValidators.js
const { body } = require('express-validator');

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre no puede estar vacío')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']+$/).withMessage('El nombre solo puede contener letras, espacios, guiones y apóstrofes')
    .custom((value) => {
      if (/\s{2,}/.test(value)) {
        throw new Error('El nombre no puede contener espacios múltiples');
      }
      const letterCount = (value.match(/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g) || []).length;
      if (letterCount < 2) {
        throw new Error('El nombre debe contener al menos 2 letras');
      }
      return true;
    }),

  body('email')
    .optional()
    .trim()
    .notEmpty().withMessage('El correo electrónico no puede estar vacío')
    .isEmail().withMessage('Debe ser un correo electrónico válido')
    .normalizeEmail()
    .isLength({ max: 100 }).withMessage('El correo no puede exceder 100 caracteres')
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).withMessage('Formato de correo inválido'),

  body('currentPassword')
    .optional()
    .trim()
    .notEmpty().withMessage('La contraseña actual es requerida si desea cambiar su contraseña'),

  body('newPassword')
    .optional()
    .trim()
    .notEmpty().withMessage('La nueva contraseña no puede estar vacía')
    .isLength({ min: 8, max: 50 }).withMessage('La nueva contraseña debe tener entre 8 y 50 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/).withMessage(
      'La contraseña debe contener al menos: una minúscula, una mayúscula, un número y un carácter especial (!@#$%^&*)'
    )
    .custom((value) => {
      if (/\s/.test(value)) {
        throw new Error('La contraseña no puede contener espacios');
      }
      const commonPasswords = ['password', '12345678', 'qwerty', 'abc123', 'password123'];
      if (commonPasswords.some(common => value.toLowerCase().includes(common))) {
        throw new Error('La contraseña es muy común, por favor use una más segura');
      }
      return true;
    }),

  // Validación personalizada: si se proporciona newPassword, currentPassword es obligatorio
  body('newPassword').custom((value, { req }) => {
    if (value && !req.body.currentPassword) {
      throw new Error('Debe proporcionar su contraseña actual para cambiar la contraseña');
    }
    return true;
  })
];

const deleteAccountValidation = [
  body('password')
    .trim()
    .notEmpty().withMessage('La contraseña es requerida para eliminar su cuenta')
];

module.exports = {
  updateProfileValidation,
  deleteAccountValidation
};
