// controllers/userController.js
const { User } = require('../models');
const { handleError, logOperation } = require('../helpers/controllerUtils');
const bcrypt = require('bcryptjs');

/**
 * Obtener perfil del usuario actual
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'createdAt', 'updatedAt']
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    logOperation('Perfil consultado', { userId: user.id, email: user.email });

    res.status(200).json({
      message: 'Perfil obtenido exitosamente',
      user
    });
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    handleError(res, error, 'Error al obtener el perfil');
  }
};

/**
 * Actualizar perfil del usuario
 * Permite actualizar: name, email, y opcionalmente password
 */
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;

    logOperation('Solicitud de actualización de perfil', {
      userId: req.user.id,
      fieldsToUpdate: { name: !!name, email: !!email, password: !!newPassword }
    });

    // Buscar usuario
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Preparar datos a actualizar
    const updates = {};

    // Actualizar nombre si se proporciona
    if (name && name !== user.name) {
      updates.name = name.trim();
    }

    // Actualizar email si se proporciona y es diferente
    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      // Verificar que el nuevo email no esté en uso
      const emailExists = await User.findOne({
        where: { email: email.toLowerCase() }
      });

      if (emailExists && emailExists.id !== user.id) {
        return res.status(400).json({
          message: 'Este correo electrónico ya está en uso',
          field: 'email'
        });
      }

      updates.email = email.toLowerCase().trim();
    }

    // Actualizar contraseña si se proporciona
    if (newPassword) {
      // Verificar que se proporcionó la contraseña actual
      if (!currentPassword) {
        return res.status(400).json({
          message: 'Debe proporcionar su contraseña actual para cambiarla',
          field: 'currentPassword'
        });
      }

      // Verificar contraseña actual
      const isPasswordValid = await user.matchPassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({
          message: 'La contraseña actual es incorrecta',
          field: 'currentPassword'
        });
      }

      // Verificar que la nueva contraseña sea diferente
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({
          message: 'La nueva contraseña debe ser diferente a la actual',
          field: 'newPassword'
        });
      }

      updates.password = newPassword;
    }

    // Verificar que haya algo para actualizar
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        message: 'No se proporcionaron cambios para actualizar'
      });
    }

    // Actualizar usuario
    await user.update(updates);

    logOperation('Perfil actualizado exitosamente', {
      userId: user.id,
      email: user.email,
      updatedFields: Object.keys(updates)
    });

    // Retornar datos actualizados (sin password)
    const updatedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    res.status(200).json({
      message: 'Perfil actualizado exitosamente',
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error);

    // Errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({
        message: 'Error de validación',
        errors
      });
    }

    // Error de email único
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'Este correo electrónico ya está en uso',
        field: 'email'
      });
    }

    handleError(res, error, 'Error al actualizar el perfil');
  }
};

/**
 * Eliminar cuenta de usuario
 */
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: 'Debe proporcionar su contraseña para eliminar su cuenta',
        field: 'password'
      });
    }

    // Buscar usuario
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar contraseña
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Contraseña incorrecta',
        field: 'password'
      });
    }

    logOperation('Usuario eliminado', {
      userId: user.id,
      email: user.email
    });

    // Eliminar usuario (CASCADE eliminará sus hipótesis automáticamente)
    await user.destroy();

    res.status(200).json({
      message: 'Cuenta eliminada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al eliminar cuenta:', error);
    handleError(res, error, 'Error al eliminar la cuenta');
  }
};
