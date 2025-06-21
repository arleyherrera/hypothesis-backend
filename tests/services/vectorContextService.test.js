// tests/services/vectorContextService.test.js
const VectorContextService = require('../../services/vectorContext');
const { ArtifactContext } = require('../../models');
const { ChromaClient } = require('chromadb');

jest.mock('../../models');
jest.mock('chromadb');

describe('VectorContextService', () => {
  let service;
  let mockCollection;

  beforeEach(() => {
    mockCollection = {
      add: jest.fn(),
      query: jest.fn(),
      delete: jest.fn()
    };

    ChromaClient.mockImplementation(() => ({
      getCollection: jest.fn().mockResolvedValue(mockCollection),
      createCollection: jest.fn().mockResolvedValue(mockCollection)
    }));

    service = new VectorContextService();
    jest.clearAllMocks();
  });

  describe('storeArtifactContext', () => {
  it('debería almacenar contexto de artefacto correctamente', async () => {
    const mockArtifact = {
      id: 1,
      hypothesisId: 1,
      phase: 'construir',
      name: 'Test Artifact',
      content: 'Test content for the artifact', // Añadir contenido
      description: 'Test description',
      createdAt: new Date(),
      hypothesis: { // Añadir hipótesis anidada si es necesaria
        problem: 'Test problem'
      }
    };

    ArtifactContext.create.mockResolvedValue({ 
      id: 1,
      embedding: JSON.stringify([0.1, 0.2, 0.3]) // Mock de embedding
    });

    const result = await service.storeArtifactContext(mockArtifact);

    expect(result).toBe(true);
    expect(mockCollection.add).toHaveBeenCalled();
    expect(ArtifactContext.create).toHaveBeenCalledWith(
      expect.objectContaining({
        hypothesisId: mockArtifact.hypothesisId,
        artifactId: mockArtifact.id,
        phase: mockArtifact.phase
      })
    );
  });
});

describe('getContextStats', () => {
  it('debería calcular estadísticas de contexto', async () => {
    ArtifactContext.count.mockResolvedValue(10);
    
    // Mock correcto de findAll con estructura de Sequelize
    ArtifactContext.findAll.mockImplementation((options) => {
      if (options.group) {
        // Para la distribución por fase
        return Promise.resolve([
          { phase: 'construir', dataValues: { count: '5' } },
          { phase: 'medir', dataValues: { count: '5' } }
        ]);
      } else {
        // Para el cálculo de coherencia - necesita embeddings válidos
        return Promise.resolve([
          { 
            phase: options.where.phase,
            embedding: JSON.stringify([0.1, 0.2, 0.3]),
            phaseIndex: 0
          },
          { 
            phase: options.where.phase,
            embedding: JSON.stringify([0.2, 0.3, 0.4]),
            phaseIndex: 0
          }
        ]);
      }
    });

    const stats = await service.getContextStats(1);

    expect(stats).toBeTruthy();
    expect(stats).toMatchObject({
      totalContexts: 10,
      phaseDistribution: expect.any(Array),
      completedPhases: expect.any(Number)
    });
  });
});
});