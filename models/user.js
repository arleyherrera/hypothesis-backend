// models/user.js
const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'El nombre es requerido'
        },
        notEmpty: {
          msg: 'El nombre no puede estar vacío'
        },
        len: {
          args: [2, 50],
          msg: 'El nombre debe tener entre 2 y 50 caracteres'
        },
        is: {
          args: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\-']+$/,
          msg: 'El nombre solo puede contener letras, espacios, guiones y apóstrofes'
        },
        customValidator(value) {
          // Verificar espacios múltiples
          if (/\s{2,}/.test(value)) {
            throw new Error('El nombre no puede contener espacios múltiples');
          }
          // Verificar que tenga al menos 2 letras
          const letterCount = (value.match(/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/g) || []).length;
          if (letterCount < 2) {
            throw new Error('El nombre debe contener al menos 2 letras');
          }
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'Este correo electrónico ya está registrado'
      },
      validate: {
        notNull: {
          msg: 'El correo electrónico es requerido'
        },
        notEmpty: {
          msg: 'El correo electrónico no puede estar vacío'
        },
        isEmail: {
          msg: 'Debe ser un correo electrónico válido'
        },
        len: {
          args: [1, 100],
          msg: 'El correo no puede exceder 100 caracteres'
        },
        customValidator(value) {
          // Verificar caracteres peligrosos
          const dangerousChars = /[()<>&\[\]\\,;:\s"]/;
          const localPart = value.split('@')[0];
          if (dangerousChars.test(localPart)) {
            throw new Error('El correo contiene caracteres no permitidos');
          }
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'La contraseña es requerida'
        },
        notEmpty: {
          msg: 'La contraseña no puede estar vacía'
        },
        len: {
          args: [8, 50],
          msg: 'La contraseña debe tener entre 8 y 50 caracteres'
        },
        customValidator(value) {
          // Solo validar si es una contraseña sin hashear (durante creación)
          if (value.length < 60) { // Las contraseñas hasheadas son más largas
            // Verificar espacios
            if (/\s/.test(value)) {
              throw new Error('La contraseña no puede contener espacios');
            }
            // Verificar complejidad
            if (!/[a-z]/.test(value)) {
              throw new Error('La contraseña debe contener al menos una letra minúscula');
            }
            if (!/[A-Z]/.test(value)) {
              throw new Error('La contraseña debe contener al menos una letra mayúscula');
            }
            if (!/\d/.test(value)) {
              throw new Error('La contraseña debe contener al menos un número');
            }
            if (!/[!@#$%^&*]/.test(value)) {
              throw new Error('La contraseña debe contener al menos un carácter especial (!@#$%^&*)');
            }
          }
        }
      }
    }
  }, {
    hooks: {
      beforeValidate: async (user) => {
        // Normalizar datos antes de validar
        if (user.name) {
          user.name = user.name.trim().replace(/\s+/g, ' ');
        }
        if (user.email) {
          user.email = user.email.toLowerCase().trim();
        }
      },
      beforeCreate: async (user) => {
        // Hashear contraseña
        user.password = await bcrypt.hash(user.password, 12);
      },
      beforeUpdate: async (user) => {
        // Solo hashear si la contraseña cambió
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 12);
        }
      }
    },
    indexes: [
      {
        unique: true,
        fields: ['email']
      }
    ]
  });

  User.associate = (models) => {
    User.hasMany(models.Hypothesis, { 
      foreignKey: 'userId',
      as: 'hypotheses',
      onDelete: 'CASCADE'
    });
  };

  // Método para comparar contraseñas
  User.prototype.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

  return User;
};