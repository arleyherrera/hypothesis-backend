// tests/controllers/aiController.test.js
const { Hypothesis, Artifact } = require('../../models');
const axios = require('axios');
const vectorContextService = require('../../services/vectorContextService');

// Mocks
jest.mock('../../models');
jest.mock('axios');
jest.mock('../../services/vectorContextService');

describe('AIController', () => {
  let req, res;
  let aiController;

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
    
    // Mock de vectorContextService
    vectorContextService.getContextStats.mockResolvedValue({
      phaseDistribution: [],
      globalCoherence: { score: 0.8 }
    });
    
    vectorContextService.storeArtifactContext.mockResolvedValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('generateArtifactWithAI', () => {
    it('debería usar plantillas de respaldo si no hay API key', async () => {
      const mockHypothesis = {
        id: 1,
        name: 'Test Hypothesis',
        problem: 'Test problem that needs to be solved urgently',
        solution: 'Test solution',
        customerSegment: 'Test segment',
        valueProposition: 'Test value',
        userId: 1
      };

      // Guardar el valor original
      const originalApiKey = process.env.AI_API_KEY;
      
      // Eliminar temporalmente la API key
      delete process.env.AI_API_KEY;
      
      // Limpiar el caché del módulo para recargar la configuración
      jest.resetModules();
      
      // Re-importar el controlador sin API key
      const aiController = require('../../controllers/aiController');
      
      req.params = { hypothesisId: 1, phase: 'construir' };
      
      // Mock de Hypothesis.findOne
      Hypothesis.findOne.mockResolvedValue(mockHypothesis);
      
      // Mock de Artifact.create para simular creación exitosa
      Artifact.create.mockImplementation((data) => Promise.resolve({
        id: Date.now(),
        ...data
      }));

      await aiController.generateArtifactWithAI(req, res);

      // Verificar que no se llamó a axios (no hay llamada a IA)
      expect(axios.post).not.toHaveBeenCalled();
      
      // Verificar que se crearon artefactos con plantillas
      expect(Artifact.create).toHaveBeenCalled();
      
      // Verificar respuesta exitosa
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
      // Re-importar con API key restaurada
      jest.resetModules();
      const aiController = require('../../controllers/aiController');
      
      const mockHypothesis = {
        id: 1,
        name: 'Test Hypothesis',
        problem: 'Test problem',
        userId: 1
      };

      req.params = { hypothesisId: 1, phase: 'fase-invalida' };
      
      Hypothesis.findOne.mockResolvedValue(mockHypothesis);

      await aiController.generateArtifactWithAI(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Fase no válida'
      });
    });

    it('debería retornar 404 si la hipótesis no existe', async () => {
      jest.resetModules();
      const aiController = require('../../controllers/aiController');
      
      req.params = { hypothesisId: 999, phase: 'construir' };
      
      Hypothesis.findOne.mockResolvedValue(null);

      await aiController.generateArtifactWithAI(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Hipótesis no encontrada'
      });
    });

    it('debería generar artefactos con IA cuando hay API key', async () => {
      // Asegurar que hay API key
      process.env.AI_API_KEY = 'test-api-key';
      
      jest.resetModules();
      const aiController = require('../../controllers/aiController');
      
      const mockHypothesis = {
        id: 1,
        name: 'Test Hypothesis',
        problem: 'Test problem that needs solution',
        solution: 'Test solution',
        customerSegment: 'Test segment',
        valueProposition: 'Test value',
        userId: 1
      };

      req.params = { hypothesisId: 1, phase: 'construir' };
      
      Hypothesis.findOne.mockResolvedValue(mockHypothesis);
      
      // Mock de respuesta de IA
      axios.post.mockResolvedValue({
        data: {
          choices: [{
            message: {
              content: '# Contenido generado por IA\n\nEste es un contenido de prueba...'
            }
          }]
        }
      });
      
      // Mock de Artifact.create
      Artifact.create.mockImplementation((data) => Promise.resolve({
        id: Date.now(),
        ...data
      }));
      
      // Mock de getRelevantContext
      vectorContextService.getRelevantContext.mockResolvedValue({
        contexts: [],
        coherenceGuidelines: {
          terminology: ['test'],
          constraints: [],
          recommendations: [],
          phaseContext: 'Fase actual: construir'
        }
      });

      await aiController.generateArtifactWithAI(req, res);

      // Verificar que se llamó a la IA
      expect(axios.post).toHaveBeenCalled();
      
      // Verificar que se crearon artefactos
      expect(Artifact.create).toHaveBeenCalled();
      
      // Verificar respuesta exitosa
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('artefactos generados con IA'),
          artifacts: expect.any(Array)
        })
      );
    });
  });

  describe('improveArtifactWithAI', () => {
    it('debería retornar error si no hay API key', async () => {
      const originalApiKey = process.env.AI_API_KEY;
      delete process.env.AI_API_KEY;
      
      jest.resetModules();
      const aiController = require('../../controllers/aiController');
      
      req.params = { id: 1 };

      await aiController.improveArtifactWithAI(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No se ha configurado la clave API para el servicio de IA'
      });
      
      process.env.AI_API_KEY = originalApiKey;
    });

    it('debería mejorar un artefacto existente', async () => {
      process.env.AI_API_KEY = 'test-api-key';
      
      jest.resetModules();
      const aiController = require('../../controllers/aiController');
      
      const mockArtifact = {
        id: 1,
        name: 'Test Artifact',
        phase: 'construir',
        content: 'Contenido original',
        hypothesisId: 1,
        hypothesis: { userId: 1 },
        update: jest.fn().mockResolvedValue(true)
      };

      req.params = { id: 1 };
      req.body = { prompt: 'Mejora específica' };
      
      Artifact.findByPk.mockResolvedValue(mockArtifact);
      
      // Mock de respuesta de IA
      axios.post.mockResolvedValue({
        data: {
          choices: [{
            message: {
              content: '# Contenido mejorado\n\nEste es un contenido mejorado...'
            }
          }]
        }
      });
      
      // Mock de contexto
      vectorContextService.getRelevantContext.mockResolvedValue({
        contexts: [],
        coherenceGuidelines: {}
      });
      
      vectorContextService.updateArtifactContext.mockResolvedValue(true);
      
      vectorContextService.getContextStats.mockResolvedValue({
        phaseCoherence: { construir: 0.7 }
      });

      await aiController.improveArtifactWithAI(req, res);

      expect(mockArtifact.update).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Artefacto mejorado con IA',
          artifact: expect.any(Object),
          coherenceImprovement: expect.any(Object)
        })
      );
    });
  });

  describe('getContextStats', () => {
    it('debería obtener estadísticas de contexto', async () => {
      jest.resetModules();
      const aiController = require('../../controllers/aiController');
      
      const mockHypothesis = {
        id: 1,
        userId: 1
      };

      req.params = { hypothesisId: 1 };
      
      Hypothesis.findOne.mockResolvedValue(mockHypothesis);
      
      const mockStats = {
        totalContexts: 10,
        phaseDistribution: [{ phase: 'construir', count: 5 }],
        globalCoherence: { score: 0.85 }
      };
      
      vectorContextService.getContextStats.mockResolvedValue(mockStats);

      await aiController.getContextStats(req, res);

      expect(res.json).toHaveBeenCalledWith({
        hypothesisId: 1,
        contextStats: mockStats,
        globalCoherence: mockStats.globalCoherence
      });
    });
  });

  describe('generateHypothesisFromProblem', () => {
    it('debería generar opciones de hipótesis desde un problema', async () => {
      process.env.AI_API_KEY = 'test-api-key';
      
      jest.resetModules();
      const aiController = require('../../controllers/aiController');
      
      req.body = {
        problem: 'Los emprendedores pierden mucho tiempo validando ideas manualmente'
      };
      
      // Mock de respuesta de IA
      axios.post.mockResolvedValue({
        data: {
          choices: [{
            message: {
              content: JSON.stringify({
                options: [
                  {
                    name: 'Hipótesis 1',
                    solution: 'Solución 1',
                    customerSegment: 'Segmento 1',
                    valueProposition: 'Propuesta 1'
                  },
                  {
                    name: 'Hipótesis 2',
                    solution: 'Solución 2',
                    customerSegment: 'Segmento 2',
                    valueProposition: 'Propuesta 2'
                  },
                  {
                    name: 'Hipótesis 3',
                    solution: 'Solución 3',
                    customerSegment: 'Segmento 3',
                    valueProposition: 'Propuesta 3'
                  }
                ]
              })
            }
          }]
        }
      });

      await aiController.generateHypothesisFromProblem(req, res);

      expect(axios.post).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Opciones de hipótesis generadas exitosamente',
          problem: req.body.problem,
          options: expect.arrayContaining([
            expect.objectContaining({
              name: expect.any(String),
              solution: expect.any(String),
              customerSegment: expect.any(String),
              valueProposition: expect.any(String),
              problem: req.body.problem
            })
          ])
        })
      );
    });

    it('debería validar longitud mínima del problema', async () => {
      jest.resetModules();
      const aiController = require('../../controllers/aiController');
      
      req.body = { problem: 'Muy corto' };

      await aiController.generateHypothesisFromProblem(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'El problema debe tener al menos 20 caracteres'
      });
    });
  });
});