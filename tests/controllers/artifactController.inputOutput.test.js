const artifactController = require('../../controllers/artifactController');
const { Hypothesis, Artifact } = require('../../models');
const { createTestCase, createTestScenario } = require('../templates/testDataTemplate');

jest.mock('../../models');
jest.mock('../../helpers/controllerUtils', () => ({
  handleError: jest.fn(),
  validatePhase: jest.fn(phase => {
    const validPhases = ['construir', 'medir', 'aprender', 'pivotar', 'iterar'];
    return validPhases.includes(phase);
  }),
  logOperation: jest.fn()
}));

describe('ArtifactController - Pruebas con Entrada/Salida Real', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 1 }, params: {}, body: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('OBTENER ARTEFACTOS', () => {
    const getScenarios = createTestScenario('Get Artifacts', [
      createTestCase(
        'Obtener artefactos de una hipótesis con artefactos',
        {
          params: { hypothesisId: 1 },
          hypothesis: {
            id: 1,
            name: 'Sistema de Reservas',
            userId: 1
          },
          existingArtifacts: [
            {
              id: 1,
              name: 'MVP Personalizado (IA)',
              phase: 'construir',
              description: 'Plan detallado para construir tu producto mínimo viable.',
              content: '# MVP Personalizado\n\nContenido generado por IA...',
              hypothesisId: 1
            },
            {
              id: 2,
              name: 'Mapa de Empatía Personalizado (IA)',
              phase: 'construir',
              description: 'Análisis profundo de tu segmento de clientes.',
              content: '# Mapa de Empatía\n\nContenido generado por IA...',
              hypothesisId: 1
            }
          ]
        },
        {
          status: 200,
          response: [
            {
              id: 1,
              name: 'MVP Personalizado (IA)',
              phase: 'construir',
              description: 'Plan detallado para construir tu producto mínimo viable.',
              content: expect.any(String),
              hypothesisId: 1
            },
            {
              id: 2,
              name: 'Mapa de Empatía Personalizado (IA)',
              phase: 'construir',
              description: 'Análisis profundo de tu segmento de clientes.',
              content: expect.any(String),
              hypothesisId: 1
            }
          ]
        },
        'Debe retornar todos los artefactos de la hipótesis'
      ),
      
      createTestCase(
        'Obtener artefactos de hipótesis sin artefactos',
        {
          params: { hypothesisId: 2 },
          hypothesis: {
            id: 2,
            name: 'Nueva Hipótesis',
            userId: 1
          },
          existingArtifacts: []
        },
        {
          status: 200,
          response: []
        },
        'Debe retornar array vacío cuando no hay artefactos'
      )
    ]);

    getScenarios.scenarios.forEach(scenario => {
      it(`${scenario.name}`, async () => {
        console.log('\n📥 ENTRADA:', JSON.stringify(scenario.input, null, 2));
        
        req.params = scenario.input.params;
        
        Hypothesis.findOne.mockResolvedValue(scenario.input.hypothesis);
        Artifact.findAll.mockResolvedValue(scenario.input.existingArtifacts);

        await artifactController.getArtifactsByHypothesis(req, res);

        console.log('📤 SALIDA ESPERADA:', JSON.stringify(scenario.expectedOutput, null, 2));
        
        expect(res.json).toHaveBeenCalledWith(scenario.expectedOutput.response);
      });
    });
  });

  describe('GENERACIÓN DE ARTEFACTOS POR FASE', () => {
    const generationScenarios = createTestScenario('Artifact Generation', [
      createTestCase(
        'Generar artefactos para fase CONSTRUIR',
        {
          params: { hypothesisId: 1, phase: 'construir' },
          hypothesis: {
            id: 1,
            name: 'Sistema de Reservas para Restaurantes',
            problem: 'Los restaurantes pequeños pierden 30% de clientes potenciales por no tener sistema de reservas online',
            solution: 'App móvil simple para reservas con confirmación automática',
            customerSegment: 'Restaurantes familiares con 20-50 mesas',
            valueProposition: 'Aumenta ocupación 25% con sistema de reservas sin comisiones',
            userId: 1
          }
        },
        {
          status: 201,
          response: {
            message: '6 artefactos generados para construir',
            artifacts: [
              {
                name: 'MVP Personalizado',
                phase: 'construir',
                description: 'Plan detallado para construir tu producto mínimo viable.',
                content: expect.stringContaining('# MVP Personalizado'),
                hypothesisId: 1
              },
              {
                name: 'Mapa de Empatía Personalizado',
                phase: 'construir',
                description: 'Análisis profundo de tu segmento de clientes.',
                content: expect.stringContaining('# Mapa de Empatía'),
                hypothesisId: 1
              },
              {
                name: 'Backlog de Funcionalidades',
                phase: 'construir',
                description: 'Priorización de características críticas para tu MVP.',
                content: expect.stringContaining('# Backlog'),
                hypothesisId: 1
              },
              {
                name: 'Experimentos de Validación',
                phase: 'construir',
                description: 'Diseño de experimentos para validar tus supuestos clave.',
                content: expect.stringContaining('# Experimentos'),
                hypothesisId: 1
              },
              {
                name: 'Plan de Recursos',
                phase: 'construir',
                description: 'Estrategia para optimizar los recursos necesarios.',
                content: expect.stringContaining('# Plan de Recursos'),
                hypothesisId: 1
              },
              {
                name: 'Estrategia de Early Adopters',
                phase: 'construir',
                description: 'Plan para conseguir tus primeros usuarios.',
                content: expect.stringContaining('# Estrategia'),
                hypothesisId: 1
              }
            ]
          }
        },
        'Debe generar exactamente 6 artefactos con plantillas para la fase construir'
      ),

      createTestCase(
        'Generar artefactos para fase MEDIR',
        {
          params: { hypothesisId: 2, phase: 'medir' },
          hypothesis: {
            id: 2,
            name: 'Plataforma de Mentoría Online',
            problem: 'Emprendedores novatos fracasan en 80% por falta de mentoría accesible y personalizada',
            solution: 'Marketplace que conecta mentores expertos con emprendedores por videollamada',
            customerSegment: 'Emprendedores tech primera vez, 25-40 años, LATAM',
            valueProposition: 'Reduce fracaso 50% con mentoría 1:1 a precio accesible',
            userId: 1
          }
        },
        {
          status: 201,
          response: {
            message: '6 artefactos generados para medir',
            artifacts: [
              {
                name: 'Framework de KPIs Personalizado',
                phase: 'medir',
                description: 'Indicadores clave de rendimiento para tu hipótesis.',
                content: expect.stringContaining('KPIs'),
                hypothesisId: 2
              },
              {
                name: 'Plan de Analítica',
                phase: 'medir',
                description: 'Estrategia para implementar análisis de datos.',
                content: expect.stringContaining('Analítica'),
                hypothesisId: 2
              },
              {
                name: 'Diseño de Tests A/B',
                phase: 'medir',
                description: 'Experimentos para optimizar tu solución.',
                content: expect.stringContaining('A/B'),
                hypothesisId: 2
              },
              {
                name: 'Embudo de Conversión',
                phase: 'medir',
                description: 'Análisis de las etapas clave de conversión.',
                content: expect.stringContaining('Embudo'),
                hypothesisId: 2
              },
              {
                name: 'Sistema de Retroalimentación',
                phase: 'medir',
                description: 'Métodos para recopilar feedback de usuarios.',
                content: expect.stringContaining('Retroalimentación'),
                hypothesisId: 2
              },
              {
                name: 'Dashboard de Métricas',
                phase: 'medir',
                description: 'Visualización de datos clave para tu startup.',
                content: expect.stringContaining('Dashboard'),
                hypothesisId: 2
              }
            ]
          }
        },
        'Debe generar 6 artefactos específicos para métricas y medición'
      ),

      createTestCase(
        'Error: Fase inválida',
        {
          params: { hypothesisId: 1, phase: 'fase-inexistente' },
          hypothesis: {
            id: 1,
            name: 'Test Hypothesis',
            userId: 1
          }
        },
        {
          status: 400,
          response: {
            message: 'Fase no válida'
          }
        },
        'Debe rechazar fases que no existen en la metodología'
      ),

      createTestCase(
        'Error: Hipótesis no encontrada',
        {
          params: { hypothesisId: 999, phase: 'construir' },
          hypothesis: null
        },
        {
          status: 404,
          response: {
            message: 'Hipótesis no encontrada'
          }
        },
        'Debe retornar 404 si la hipótesis no existe'
      )
    ]);

    generationScenarios.scenarios.forEach(scenario => {
      it(`${scenario.name}`, async () => {
        console.log('\n📥 ENTRADA:', JSON.stringify(scenario.input, null, 2));
        
        req.params = scenario.input.params;
        
        if (scenario.input.hypothesis) {
          Hypothesis.findOne.mockResolvedValue(scenario.input.hypothesis);
          Artifact.destroy.mockResolvedValue(0);
          
          // Mock de create que simula la creación real con plantillas
          const ARTIFACT_TEMPLATES = require('../../controllers/artifactTemplates');
          const templates = ARTIFACT_TEMPLATES.getTemplatesForPhase(scenario.input.params.phase);
          
          Artifact.create.mockImplementation((data) => {
            return Promise.resolve({
              id: Date.now() + Math.random(),
              ...data,
              content: ARTIFACT_TEMPLATES.getDefaultContent(
                data.phase, 
                data.name, 
                scenario.input.hypothesis
              )
            });
          });
        } else {
          Hypothesis.findOne.mockResolvedValue(null);
        }

        await artifactController.generateArtifacts(req, res);

        console.log('📤 SALIDA ESPERADA:', JSON.stringify(scenario.expectedOutput, null, 2));
        
        expect(res.status).toHaveBeenCalledWith(scenario.expectedOutput.status);
        
        if (scenario.expectedOutput.status === 201) {
          const response = res.json.mock.calls[0][0];
          expect(response.message).toBe(scenario.expectedOutput.response.message);
          
          // Verificar que se generaron la cantidad correcta de artefactos
          expect(response.artifacts).toHaveLength(scenario.expectedOutput.response.artifacts.length);
          
          // Verificar cada artefacto
          response.artifacts.forEach((artifact, index) => {
            const expectedArtifact = scenario.expectedOutput.response.artifacts[index];
            expect(artifact.name).toBe(expectedArtifact.name);
            expect(artifact.phase).toBe(expectedArtifact.phase);
            expect(artifact.description).toBe(expectedArtifact.description);
            
            // Verificar que el contenido menciona el problema de la hipótesis
            expect(artifact.content).toContain(scenario.input.hypothesis.problem);
          });
        } else {
          expect(res.json).toHaveBeenCalledWith(scenario.expectedOutput.response);
        }
      });
    });
  });

  describe('ACTUALIZACIÓN DE ARTEFACTOS', () => {
    const updateScenarios = createTestScenario('Update Artifacts', [
      createTestCase(
        'Actualizar contenido de un artefacto',
        {
          params: { id: 1 },
          body: {
            content: '# MVP Actualizado\n\nNuevo contenido mejorado basado en feedback...'
          },
          existingArtifact: {
            id: 1,
            name: 'MVP Personalizado',
            phase: 'construir',
            content: 'Contenido original',
            hypothesis: { userId: 1 },
            update: jest.fn().mockResolvedValue(true)
          }
        },
        {
          status: 200,
          response: {
            id: 1,
            name: 'MVP Personalizado',
            phase: 'construir',
            content: '# MVP Actualizado\n\nNuevo contenido mejorado basado en feedback...'
          }
        },
        'Debe permitir actualizar el contenido de un artefacto existente'
      ),
      
      createTestCase(
        'Error: Usuario no autorizado',
        {
          params: { id: 1 },
          body: { content: 'Intento de actualización' },
          existingArtifact: {
            id: 1,
            hypothesis: { userId: 2 } // Usuario diferente
          }
        },
        {
          status: 403,
          response: {
            message: 'No autorizado'
          }
        },
        'Debe rechazar actualizaciones de usuarios no autorizados'
      )
    ]);

    updateScenarios.scenarios.forEach(scenario => {
      it(`${scenario.name}`, async () => {
        console.log('\n📥 ENTRADA:', JSON.stringify(scenario.input, null, 2));
        
        req.params = scenario.input.params;
        req.body = scenario.input.body;
        
        Artifact.findByPk.mockResolvedValue(scenario.input.existingArtifact);

        await artifactController.updateArtifact(req, res);

        console.log('📤 SALIDA ESPERADA:', JSON.stringify(scenario.expectedOutput, null, 2));
        
        if (scenario.expectedOutput.status === 200) {
          expect(scenario.input.existingArtifact.update).toHaveBeenCalledWith(scenario.input.body);
          expect(res.json).toHaveBeenCalledWith(scenario.input.existingArtifact);
        } else {
          expect(res.status).toHaveBeenCalledWith(scenario.expectedOutput.status);
          expect(res.json).toHaveBeenCalledWith(scenario.expectedOutput.response);
        }
      });
    });
  });

  describe('ELIMINACIÓN DE ARTEFACTOS', () => {
    const deleteScenarios = createTestScenario('Delete Artifacts', [
      createTestCase(
        'Eliminar artefacto exitosamente',
        {
          params: { id: 1 },
          existingArtifact: {
            id: 1,
            name: 'MVP Personalizado',
            hypothesis: { userId: 1 },
            destroy: jest.fn().mockResolvedValue(true)
          }
        },
        {
          status: 200,
          response: {
            message: 'Artefacto eliminado correctamente'
          }
        },
        'Debe permitir eliminar un artefacto propio'
      )
    ]);

    deleteScenarios.scenarios.forEach(scenario => {
      it(`${scenario.name}`, async () => {
        console.log('\n📥 ENTRADA:', JSON.stringify(scenario.input, null, 2));
        
        req.params = scenario.input.params;
        
        Artifact.findByPk.mockResolvedValue(scenario.input.existingArtifact);

        await artifactController.deleteArtifact(req, res);

        console.log('📤 SALIDA ESPERADA:', JSON.stringify(scenario.expectedOutput, null, 2));
        
        expect(scenario.input.existingArtifact.destroy).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(scenario.expectedOutput.response);
      });
    });
  });
});