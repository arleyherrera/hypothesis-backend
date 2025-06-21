// tests/controllers/aiController.test.js
const aiController = require('../../controllers/aiController');
const { Hypothesis, Artifact } = require('../../models');
const axios = require('axios');
const vectorContextService = require('../../services/vectorContextService');

// Mocks
jest.mock('../../models');
jest.mock('axios');
jest.mock('../../services/vectorContextService');

  beforeEach(() => {
    req = {
      user: { id: 1 },
      params: {},
      body: {}
    };
    
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
    
    // Mock de console para evitar logs en tests
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // tests/controllers/aiController.test.js

// tests/controllers/aiController.test.js

describe('generateArtifactWithAI', () => {
  it('debería usar plantillas de respaldo si no hay API key', async () => {
    const mockHypothesis = {
      id: 1,
      name: 'Test Hypothesis',
      problem: 'Test problem',
      solution: 'Test solution',
      customerSegment: 'Test segment',
      valueProposition: 'Test value'
    };

    // Guardar el valor original y eliminar API key
    const originalApiKey = process.env.AI_API_KEY;
    delete process.env.AI_API_KEY;
    
    // Limpiar el caché del módulo para recargar la configuración
    jest.resetModules();
    const aiController = require('../../controllers/aiController');
    
    req.params = { hypothesisId: 1, phase: 'construir' };
    Hypothesis.findOne.mockResolvedValue(mockHypothesis);
    
    Artifact.create.mockImplementation((data) => Promise.resolve({
      id: Date.now(),
      ...data
    }));

    await aiController.generateArtifactWithAI(req, res);

    expect(axios.post).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringContaining('artefactos de respaldo generados'),
        note: expect.stringContaining('Plantillas generadas')
      })
    );
    
    // Restaurar API key
    process.env.AI_API_KEY = originalApiKey;
  });

  it('debería validar fases inválidas', async () => {
    const mockHypothesis = {
      id: 1,
      name: 'Test Hypothesis',
      problem: 'Test problem'
    };

    req.params = { hypothesisId: 1, phase: 'fase-invalida' };
    Hypothesis.findOne.mockResolvedValue(mockHypothesis); // Añadir este mock

    await aiController.generateArtifactWithAI(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Fase no válida'
    });
  });
});