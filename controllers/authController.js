// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { handleError, validateRequiredFields, logOperation } = require('../helpers/controllerUtils');

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