const hypothesisController = require('../../controllers/hypothesisController');
const { Hypothesis, Artifact } = require('../../models');
const { createTestUser, createTestHypothesis } = require('../helpers');

// Mock de los modelos
jest.mock('../../models', () => ({
  Hypothesis: {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn()
  },
  Artifact: {
    name: 'Artifact'
  }
}));

// Mock de helper functions
jest.mock('../../helpers/controllerUtils', () => ({
  handleError: jest.fn(),
  validateRequiredFields: jest.fn(),
  logOperation: jest.fn()
}));

// tests/controllers/hypothesisController.test.js

describe('createHypothesis', () => {
  beforeEach(() => {
    req.body = {
      name: 'Nueva Hipótesis',
      problem: 'Este es un problema complejo que necesita solución urgente', // Mínimo 20 caracteres
      solution: 'Solución innovadora propuesta',
      customerSegment: 'Segmento de clientes específico',
      valueProposition: 'Propuesta de valor única'
    };
  });

  it('debería crear una nueva hipótesis', async () => {
    const { validateRequiredFields } = require('../../helpers/controllerUtils');
    
    // Mock correcto de validateRequiredFields
    validateRequiredFields.mockImplementation((data, fields) => ({
      isValid: true,
      missingFields: []
    }));
    
    const mockHypothesis = createTestHypothesis(req.body);
    Hypothesis.create.mockResolvedValue(mockHypothesis);

    await hypothesisController.createHypothesis(req, res);

    expect(validateRequiredFields).toHaveBeenCalledWith(req.body, expect.any(Array));
    expect(Hypothesis.create).toHaveBeenCalledWith({
      userId: req.user.id,
      ...req.body
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockHypothesis);
  });

  it('debería validar campos requeridos', async () => {
    const { validateRequiredFields } = require('../../helpers/controllerUtils');
    
    // Mock que simula campos faltantes
    validateRequiredFields.mockImplementation(() => ({
      isValid: false,
      missingFields: ['problem', 'solution']
    }));

    await hypothesisController.createHypothesis(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Campos requeridos faltantes',
      missingFields: ['problem', 'solution']
    });
  });
});

describe('deleteHypothesis', () => {
  it('debería eliminar una hipótesis existente', async () => {
    // Mock de Artifact.findAll y destroy
    Artifact.findAll = jest.fn().mockResolvedValue([]);
    Artifact.destroy = jest.fn().mockResolvedValue(0);
    
    const mockHypothesis = {
      ...createTestHypothesis(),
      destroy: jest.fn().mockResolvedValue(true)
    };
    Hypothesis.findOne.mockResolvedValue(mockHypothesis);

    await hypothesisController.deleteHypothesis(req, res);

    expect(Artifact.findAll).toHaveBeenCalledWith({
      where: { hypothesisId: '1' },
      attributes: ['id']
    });
    expect(mockHypothesis.destroy).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      message: 'Hipótesis eliminada correctamente'
    });
  });
});