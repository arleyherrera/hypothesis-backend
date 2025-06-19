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

describe('HypothesisController', () => {
  let req, res;

  beforeEach(() => {
    // Setup request and response mocks
    req = {
      user: createTestUser(),
      params: {},
      body: {}
    };
    
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };

    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('getHypotheses', () => {
    it('debería obtener todas las hipótesis del usuario', async () => {
      const mockHypotheses = [createTestHypothesis()];
      Hypothesis.findAll.mockResolvedValue(mockHypotheses);

      await hypothesisController.getHypotheses(req, res);

      expect(Hypothesis.findAll).toHaveBeenCalledWith({
        where: { userId: req.user.id },
        include: [{ model: Artifact, as: 'artifacts' }]
      });
      expect(res.json).toHaveBeenCalledWith(mockHypotheses);
    });

    it('debería retornar array vacío si no hay hipótesis', async () => {
      Hypothesis.findAll.mockResolvedValue(null);

      await hypothesisController.getHypotheses(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('debería manejar errores correctamente', async () => {
      const error = new Error('Database error');
      Hypothesis.findAll.mockRejectedValue(error);
      
      const { handleError } = require('../../helpers/controllerUtils');

      await hypothesisController.getHypotheses(req, res);

      expect(handleError).toHaveBeenCalledWith(res, error, 'Error al obtener hipótesis');
    });
  });

  describe('getHypothesisById', () => {
    beforeEach(() => {
      req.params.id = '1';
    });

    it('debería obtener una hipótesis por ID', async () => {
      const mockHypothesis = createTestHypothesis();
      Hypothesis.findOne.mockResolvedValue(mockHypothesis);

      await hypothesisController.getHypothesisById(req, res);

      expect(Hypothesis.findOne).toHaveBeenCalledWith({
        where: { id: '1', userId: req.user.id },
        include: [{ model: Artifact, as: 'artifacts' }]
      });
      expect(res.json).toHaveBeenCalledWith(mockHypothesis);
    });    it('debería retornar 404 si la hipótesis no existe', async () => {
      Hypothesis.findOne.mockResolvedValue(null);

      await hypothesisController.getHypothesisById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Hipótesis no encontrada'
      });
    });
  });

  describe('createHypothesis', () => {
    beforeEach(() => {
      req.body = {
        name: 'Nueva Hipótesis',
        problem: 'Problema test',
        solution: 'Solución test',
        customerSegment: 'Segmento test',
        valueProposition: 'Propuesta test'
      };
    });    it('debería crear una nueva hipótesis', async () => {
      const { validateRequiredFields } = require('../../helpers/controllerUtils');
      validateRequiredFields.mockReturnValue({ isValid: true, missingFields: [] });
      
      const mockHypothesis = createTestHypothesis(req.body);
      Hypothesis.create.mockResolvedValue(mockHypothesis);

      await hypothesisController.createHypothesis(req, res);

      expect(validateRequiredFields).toHaveBeenCalled();
      expect(Hypothesis.create).toHaveBeenCalledWith({
        userId: req.user.id,
        ...req.body
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockHypothesis);
    });    it('debería validar campos requeridos', async () => {
      const { validateRequiredFields } = require('../../helpers/controllerUtils');
      validateRequiredFields.mockReturnValue({ 
        isValid: false, 
        missingFields: ['problem', 'solution'] 
      });

      await hypothesisController.createHypothesis(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Campos requeridos faltantes',
        missingFields: ['problem', 'solution']
      });
    });
  });

  describe('updateHypothesis', () => {
    beforeEach(() => {
      req.params.id = '1';
      req.body = {
        name: 'Hipótesis Actualizada'
      };
    });    it('debería actualizar una hipótesis existente', async () => {
      const mockHypothesis = {
        ...createTestHypothesis(),
        update: jest.fn().mockResolvedValue(true)
      };
      Hypothesis.findOne.mockResolvedValue(mockHypothesis);

      await hypothesisController.updateHypothesis(req, res);

      expect(mockHypothesis.update).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(mockHypothesis);
    });    it('debería retornar 404 si la hipótesis no existe', async () => {
      Hypothesis.findOne.mockResolvedValue(null);

      await hypothesisController.updateHypothesis(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Hipótesis no encontrada'
      });
    });
  });

  describe('deleteHypothesis', () => {
    beforeEach(() => {
      req.params.id = '1';
    });    it('debería eliminar una hipótesis existente', async () => {
      const mockHypothesis = {
        ...createTestHypothesis(),
        destroy: jest.fn().mockResolvedValue(true)
      };
      Hypothesis.findOne.mockResolvedValue(mockHypothesis);

      await hypothesisController.deleteHypothesis(req, res);

      expect(mockHypothesis.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        message: 'Hipótesis eliminada'
      });
    });    it('debería retornar 404 si la hipótesis no existe', async () => {
      Hypothesis.findOne.mockResolvedValue(null);

      await hypothesisController.deleteHypothesis(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Hipótesis no encontrada'
      });
    });
  });
});
