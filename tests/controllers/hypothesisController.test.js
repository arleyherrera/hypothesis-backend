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
    findAll: jest.fn(),
    destroy: jest.fn(),
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
    // Inicializar req y res para cada test
    req = {
      user: { id: 1 },
      params: { id: '1' },
      body: {}
    };
    
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    // Limpiar todos los mocks
    jest.clearAllMocks();
  });

  describe('getHypotheses', () => {
    it('debería obtener todas las hipótesis del usuario', async () => {
      const mockHypotheses = [
        createTestHypothesis({ id: 1, userId: 1 }),
        createTestHypothesis({ id: 2, userId: 1 })
      ];
      
      Hypothesis.findAll.mockResolvedValue(mockHypotheses);

      await hypothesisController.getHypotheses(req, res);

      expect(Hypothesis.findAll).toHaveBeenCalledWith({
        where: { userId: req.user.id },
        include: [{ model: Artifact, as: 'artifacts' }]
      });
      expect(res.json).toHaveBeenCalledWith(mockHypotheses);
    });

    it('debería retornar array vacío si no hay hipótesis', async () => {
      Hypothesis.findAll.mockResolvedValue([]);

      await hypothesisController.getHypotheses(req, res);

      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getHypothesisById', () => {
    it('debería obtener una hipótesis específica', async () => {
      const mockHypothesis = createTestHypothesis({ id: 1, userId: 1 });
      Hypothesis.findOne.mockResolvedValue(mockHypothesis);

      await hypothesisController.getHypothesisById(req, res);

      expect(Hypothesis.findOne).toHaveBeenCalledWith({
        where: { id: req.params.id, userId: req.user.id },
        include: [{ model: Artifact, as: 'artifacts' }]
      });
      expect(res.json).toHaveBeenCalledWith(mockHypothesis);
    });

    it('debería retornar 404 si la hipótesis no existe', async () => {
      Hypothesis.findOne.mockResolvedValue(null);

      await hypothesisController.getHypothesisById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Hipótesis no encontrada' });
    });
  });

  describe('createHypothesis', () => {
    beforeEach(() => {
      req.body = {
        name: 'Nueva Hipótesis',
        problem: 'Este es un problema complejo que necesita solución urgente',
        solution: 'Solución innovadora propuesta',
        customerSegment: 'Segmento de clientes específico',
        valueProposition: 'Propuesta de valor única'
      };
    });

    it('debería crear una nueva hipótesis', async () => {
      const { validateRequiredFields } = require('../../helpers/controllerUtils');
      
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

    it('debería validar longitud mínima del problema', async () => {
      const { validateRequiredFields } = require('../../helpers/controllerUtils');
      
      validateRequiredFields.mockImplementation(() => ({
        isValid: true,
        missingFields: []
      }));
      
      req.body.problem = 'Problema corto';

      await hypothesisController.createHypothesis(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'El problema debe tener al menos 20 caracteres para ser suficientemente específico'
      });
    });
  });

  describe('updateHypothesis', () => {
    it('debería actualizar una hipótesis existente', async () => {
      const mockHypothesis = {
        ...createTestHypothesis(),
        update: jest.fn().mockResolvedValue(true)
      };
      
      Hypothesis.findOne.mockResolvedValue(mockHypothesis);
      
      req.body = { name: 'Hipótesis Actualizada' };

      await hypothesisController.updateHypothesis(req, res);

      expect(mockHypothesis.update).toHaveBeenCalledWith(req.body);
      expect(res.json).toHaveBeenCalledWith(mockHypothesis);
    });

    it('debería validar longitud del problema al actualizar', async () => {
      const mockHypothesis = {
        ...createTestHypothesis(),
        update: jest.fn()
      };
      
      Hypothesis.findOne.mockResolvedValue(mockHypothesis);
      
      req.body = { problem: 'Muy corto' };

      await hypothesisController.updateHypothesis(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'El problema debe tener al menos 20 caracteres'
      });
    });
  });

  describe('deleteHypothesis', () => {
    it('debería eliminar una hipótesis existente', async () => {
      const mockHypothesis = {
        ...createTestHypothesis(),
        destroy: jest.fn().mockResolvedValue(true)
      };
      
      Hypothesis.findOne.mockResolvedValue(mockHypothesis);
      Artifact.findAll.mockResolvedValue([]);
      Artifact.destroy.mockResolvedValue(0);

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

    it('debería eliminar artefactos asociados', async () => {
      const mockHypothesis = {
        ...createTestHypothesis(),
        destroy: jest.fn().mockResolvedValue(true)
      };
      
      const mockArtifacts = [
        { id: 1 },
        { id: 2 }
      ];
      
      Hypothesis.findOne.mockResolvedValue(mockHypothesis);
      Artifact.findAll.mockResolvedValue(mockArtifacts);
      Artifact.destroy.mockResolvedValue(2);

      // Mock temporal de ArtifactContext
      jest.mock('../../models', () => ({
        ...jest.requireActual('../../models'),
        ArtifactContext: {
          destroy: jest.fn().mockResolvedValue(2)
        }
      }));

      await hypothesisController.deleteHypothesis(req, res);

      expect(Artifact.destroy).toHaveBeenCalledWith({
        where: { hypothesisId: '1' }
      });
      expect(mockHypothesis.destroy).toHaveBeenCalled();
    });

    it('debería retornar 404 si la hipótesis no existe', async () => {
      Hypothesis.findOne.mockResolvedValue(null);

      await hypothesisController.deleteHypothesis(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Hipótesis no encontrada' });
    });
  });
});