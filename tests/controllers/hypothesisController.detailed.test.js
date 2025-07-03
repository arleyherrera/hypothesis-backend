const hypothesisController = require('../../controllers/hypothesisController');
const { Hypothesis, Artifact } = require('../../models');
const { createTestCase, createTestScenario } = require('../templates/testDataTemplate');

jest.mock('../../models');
jest.mock('../../helpers/controllerUtils', () => ({
  handleError: jest.fn(),
  validateRequiredFields: jest.fn(),
  logOperation: jest.fn()
}));

describe('HypothesisController - Pruebas Detalladas', () => {
  let req, res;

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
  });

  describe('CREACIÓN DE HIPÓTESIS', () => {
    const creationScenarios = createTestScenario('Hypothesis Creation', [
      createTestCase(
        'Creación exitosa con todos los campos',
        {
          body: {
            problem: 'Los pequeños negocios pierden 40% de clientes potenciales por no tener presencia digital efectiva',
            name: 'Presencia Digital para PyMEs',
            solution: 'Plataforma no-code para crear sitios web profesionales en 15 minutos',
            customerSegment: 'Dueños de pequeños negocios sin conocimientos técnicos, 25-55 años',
            valueProposition: 'Crea tu sitio web profesional sin programar y aumenta tus ventas 30%'
          },
          userId: 1
        },
        {
          status: 201,
          response: {
            id: 1,
            problem: 'Los pequeños negocios pierden 40% de clientes potenciales por no tener presencia digital efectiva',
            name: 'Presencia Digital para PyMEs',
            solution: 'Plataforma no-code para crear sitios web profesionales en 15 minutos',
            customerSegment: 'Dueños de pequeños negocios sin conocimientos técnicos, 25-55 años',
            valueProposition: 'Crea tu sitio web profesional sin programar y aumenta tus ventas 30%',
            userId: 1,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date)
          }
        },
        'Hipótesis válida se crea correctamente con todos los campos'
      ),
      
      createTestCase(
        'Error: Problema muy corto',
        {
          body: {
            problem: 'Problema corto',
            name: 'Test',
            solution: 'Solución test',
            customerSegment: 'Segmento test',
            valueProposition: 'Propuesta test'
          },
          userId: 1
        },
        {
          status: 400,
          response: {
            message: 'El problema debe tener al menos 20 caracteres para ser suficientemente específico'
          }
        },
        'Problema con menos de 20 caracteres debe ser rechazado'
      ),
      
      createTestCase(
        'Error: Campos faltantes',
        {
          body: {
            problem: 'Este es un problema lo suficientemente largo para pasar la validación',
            name: 'Test Hypothesis'
            // Faltan: solution, customerSegment, valueProposition
          },
          userId: 1
        },
        {
          status: 400,
          response: {
            message: 'Campos requeridos faltantes',
            missingFields: ['solution', 'customerSegment', 'valueProposition']
          }
        },
        'Debe validar que todos los campos requeridos estén presentes'
      )
    ]);

    creationScenarios.scenarios.forEach(scenario => {
      it(`${scenario.name}`, async () => {
        console.log('\n📥 ENTRADA:', JSON.stringify(scenario.input, null, 2));
        
        // Configurar mocks
        const { validateRequiredFields } = require('../../helpers/controllerUtils');
        
        if (scenario.name.includes('exitosa')) {
          validateRequiredFields.mockReturnValue({ isValid: true, missingFields: [] });
          Hypothesis.create.mockResolvedValue({
            id: 1,
            ...scenario.input.body,
            userId: scenario.input.userId,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        } else if (scenario.name.includes('Campos faltantes')) {
          validateRequiredFields.mockReturnValue({ 
            isValid: false, 
            missingFields: scenario.expectedOutput.response.missingFields 
          });
        } else {
          validateRequiredFields.mockReturnValue({ isValid: true, missingFields: [] });
        }

        // Ejecutar
        req.body = scenario.input.body;
        req.user.id = scenario.input.userId;
        await hypothesisController.createHypothesis(req, res);

        // Verificar
        console.log('📤 SALIDA ESPERADA:', JSON.stringify(scenario.expectedOutput, null, 2));
        expect(res.status).toHaveBeenCalledWith(scenario.expectedOutput.status);
        expect(res.json).toHaveBeenCalledWith(
          expect.objectContaining(scenario.expectedOutput.response)
        );
      });
    });
  });
});