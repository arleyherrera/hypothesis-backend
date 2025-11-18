// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { User } = require('../models');
const { handleError, validateRequiredFields, logOperation } = require('../helpers/controllerUtils');
const { sendPasswordResetEmail, sendPasswordChangedEmail } = require('../services/emailService');

const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'fallback_secret_key_for_development',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30d'
};

const generateToken = (id) => jwt.sign({ id }, JWT_CONFIG.SECRET, { expiresIn: JWT_CONFIG.EXPIRES_IN });

const createUserResponse = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  token: generateToken(user.id)
});

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    logOperation('Registro', { email });
    
    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ where: { email: email.toLowerCase() } });
    if (userExists) {
      return res.status(400).json({ 
        message: 'Ya existe una cuenta con este correo electrónico',
        field: 'email'
      });
    }
    
    // Limpiar datos antes de guardar
    const cleanedData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password // La contraseña se hashea en el modelo
    };
    
    // Crear usuario
    const user = await User.create(cleanedData);
    
    // Log exitoso
    logOperation('Usuario registrado exitosamente', { 
      userId: user.id, 
      email: user.email 
    });
    
    res.status(201).json(createUserResponse(user));
  } catch (error) {
    // Manejar errores específicos de Sequelize
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        message: 'Error de validación en los datos',
        errors: validationErrors
      });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'El correo electrónico ya está registrado',
        field: 'email'
      });
    }
    
    handleError(res, error, 'Error al registrar usuario');
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    logOperation('Login', { email });
    
    // Buscar usuario (case insensitive)
    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase().trim() 
      } 
    });
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Correo electrónico o contraseña incorrectos',
        field: 'email'
      });
    }
    
    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        message: 'Correo electrónico o contraseña incorrectos',
        field: 'password'
      });
    }
    
    // Log exitoso
    logOperation('Login exitoso', { userId: user.id, email: user.email });
    
    res.json(createUserResponse(user));
  } catch (error) {
    handleError(res, error, 'Error al iniciar sesión');
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    });
  } catch (error) {
    handleError(res, error, 'Error al obtener información del usuario');
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    logOperation('Forgot Password', { email });

    // Validar que el email esté presente
    if (!email) {
      return res.status(400).json({
        message: 'El correo electrónico es requerido',
        field: 'email'
      });
    }

    // Buscar usuario por email
    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() }
    });

    // Por seguridad, siempre devolver el mismo mensaje
    // incluso si el usuario no existe
    const successMessage = 'Si existe una cuenta con este correo, recibirás instrucciones para restablecer tu contraseña';

    if (!user) {
      logOperation('Forgot Password - Usuario no encontrado', { email });
      return res.status(200).json({ message: successMessage });
    }

    // Generar token de reseteo (criptográficamente seguro)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash del token antes de guardarlo en la base de datos
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Guardar token hasheado y fecha de expiración (1 hora)
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora
    await user.save({ validate: false }); // No validar password al guardar

    // Enviar email con el token original (no hasheado)
    try {
      await sendPasswordResetEmail(user.email, resetToken, user.name);
      logOperation('Email de reseteo enviado', { userId: user.id, email: user.email });
    } catch (emailError) {
      console.error('Error al enviar email:', emailError);
      // Limpiar token si el email falló
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save({ validate: false });

      return res.status(500).json({
        message: 'No se pudo enviar el correo de recuperación. Por favor, inténtalo más tarde.'
      });
    }

    res.status(200).json({ message: successMessage });
  } catch (error) {
    handleError(res, error, 'Error al procesar solicitud de reseteo de contraseña');
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    logOperation('Reset Password', { token: token.substring(0, 10) + '...' });

    // Validar que la contraseña esté presente
    if (!password) {
      return res.status(400).json({
        message: 'La nueva contraseña es requerida',
        field: 'password'
      });
    }

    // Hash del token recibido
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Buscar usuario con token válido y no expirado
    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
      }
    });

    if (!user) {
      return res.status(400).json({
        message: 'Token de reseteo inválido o expirado'
      });
    }

    // Verificar si el token expiró
    if (user.resetPasswordExpires < new Date()) {
      // Limpiar token expirado
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await user.save({ validate: false });

      return res.status(400).json({
        message: 'El token de reseteo ha expirado. Por favor, solicita uno nuevo.'
      });
    }

    // Actualizar contraseña
    user.password = password; // Se hasheará automáticamente en el hook beforeUpdate
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save(); // Validar la nueva contraseña

    // Enviar email de confirmación
    try {
      await sendPasswordChangedEmail(user.email, user.name);
    } catch (emailError) {
      console.error('Error al enviar email de confirmación:', emailError);
      // No fallar si el email de confirmación falla
    }

    logOperation('Contraseña restablecida exitosamente', { userId: user.id });

    res.status(200).json({
      message: 'Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión.'
    });
  } catch (error) {
    // Manejar errores de validación de Sequelize
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));

      return res.status(400).json({
        message: 'Error de validación en la nueva contraseña',
        errors: validationErrors
      });
    }

    handleError(res, error, 'Error al restablecer contraseña');
  }
};