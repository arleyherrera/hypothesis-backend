const aiController = require('../../controllers/aiController');
const { createTestCase, createTestScenario } = require('../templates/testDataTemplate');
const axios = require('axios');

jest.mock('axios');
jest.mock('../../models');
jest.mock('../../helpers/controllerUtils', () => ({
  handleError: jest.fn(),
  logOperation: jest.fn()
}));

describe('AIController - Generación de Hipótesis con Entrada/Salida', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 1 }, body: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    
    process.env.AI_API_KEY = 'test-api-key';
    jest.clearAllMocks();
  });

  describe('GENERACIÓN DE HIPÓTESIS DESDE PROBLEMA', () => {
    const generationScenarios = createTestScenario('Hypothesis Generation from Problem', [
      createTestCase(
        'Generar 3 hipótesis desde problema de restaurante',
        {
          body: {
            problem: 'Los restaurantes familiares pierden 40% de reservas porque los clientes no pueden confirmar disponibilidad en tiempo real y terminan yendo a cadenas con apps'
          }
        },
        {
          status: 200,
          response: {
            message: 'Opciones de hipótesis generadas exitosamente',
            problem: 'Los restaurantes familiares pierden 40% de reservas porque los clientes no pueden confirmar disponibilidad en tiempo real y terminan yendo a cadenas con apps',
            options: [
              {
                name: 'Creemos que dueños de restaurantes 35-55 años tienen el problema de perder reservas por falta de confirmación online. Si les ofrecemos app de reservas con confirmación instantánea, entonces reducirán pérdidas 30% y pagarán $29/mes',
                solution: 'App móvil minimalista con sistema de reservas en tiempo real. Features: 1) Vista calendario con disponibilidad live, 2) Confirmación automática por SMS/WhatsApp, 3) Panel admin simple. Desarrollo: PWA con React en 3 semanas',
                customerSegment: 'Dueños de restaurantes familiares, 35-55 años, con 30-80 cubiertos, en ciudades >50k habitantes. Actualmente usan teléfono/libreta. Los encuentras en asociaciones gastronómicas locales y grupos de Facebook de restauranteros',
                valueProposition: 'Recupera el 40% de reservas perdidas (≈$2000/mes extra). Sistema 10x más simple que apps de cadenas. Sin comisiones por reserva. ROI en 15 días. Métrica: 80% reducción en no-shows',
                problem: 'Los restaurantes familiares pierden 40% de reservas porque los clientes no pueden confirmar disponibilidad en tiempo real y terminan yendo a cadenas con apps'
              },
              {
                name: 'Creemos que comensales millennials urbanos tienen problema de incertidumbre al reservar en restaurantes locales. Si les damos widget de reservas en Google Maps, entonces 60% preferirá locales y restaurantes ganarán $1500/mes extra',
                solution: 'Widget integrable en Google My Business y redes sociales. Features: 1) Botón "Reservar Mesa" en búsquedas, 2) Confirmación instantánea, 3) Recordatorios automáticos. Implementación: API + iframe responsivo en 2 semanas',
                customerSegment: 'Profesionales 28-40 años que buscan restaurantes en Google Maps, valoran experiencias locales pero necesitan conveniencia. Actualmente llaman o van sin reserva. Comportamiento: 70% busca en móvil mientras se desplaza',
                valueProposition: 'Restaurantes aparecen como "Reserva Disponible" en Google (ventaja competitiva). Clientes reservan en 2 clicks desde donde ya buscan. 0% comisión vs 15% delivery apps. Métrica éxito: 50 reservas/mes desde Google',
                problem: 'Los restaurantes familiares pierden 40% de reservas porque los clientes no pueden confirmar disponibilidad en tiempo real y terminan yendo a cadenas con apps'
              },
              {
                name: 'Creemos que restaurantes sin personal técnico pierden clientes por no gestionar reservas digitalmente. Si creamos marketplace de mesas último minuto con descuentos, entonces llenarán 70% mesas vacías y ganarán 25% más',
                solution: 'Marketplace "LastMinuteTable" conecta mesas vacías con comensales. Features: 1) Restaurantes publican disponibilidad con 10-20% dto, 2) Push notifications a usuarios cercanos, 3) Reserva 1-click. MVP: App Flutter en 4 semanas',
                customerSegment: 'Restaurantes con ocupación <70% en días entre semana, sin recursos para marketing digital. Comensales price-sensitive que deciden dónde comer <2hrs antes. Ubicación: zonas urbanas con alta densidad de oficinas',
                valueProposition: 'Restaurantes llenan mesas vacías que igual perderían (ingreso incremental 100%). Comensales ahorran 15% comiendo en lugares premium. Win-win. Comisión 5% solo por mesas efectivas. Métrica: 20 mesas extra/semana',
                problem: 'Los restaurantes familiares pierden 40% de reservas porque los clientes no pueden confirmar disponibilidad en tiempo real y terminan yendo a cadenas con apps'
              }
            ]
          }
        },
        'Debe generar 3 opciones de hipótesis diferentes y testables para el problema del restaurante'
      ),

      createTestCase(
        'Generar hipótesis para problema de educación online',
        {
          body: {
            problem: 'Los estudiantes universitarios abandonan 65% de cursos online porque no tienen retroalimentación personalizada ni interacción con profesores'
          }
        },
        {
          status: 200,
          response: {
            message: 'Opciones de hipótesis generadas exitosamente',
            problem: 'Los estudiantes universitarios abandonan 65% de cursos online porque no tienen retroalimentación personalizada ni interacción con profesores',
            options: [
              {
                name: expect.stringContaining('estudiantes'),
                solution: expect.stringContaining('personalizada'),
                customerSegment: expect.stringContaining('universitarios'),
                valueProposition: expect.stringContaining('reducir abandono'),
                problem: 'Los estudiantes universitarios abandonan 65% de cursos online porque no tienen retroalimentación personalizada ni interacción con profesores'
              },
              {
                name: expect.any(String),
                solution: expect.any(String),
                customerSegment: expect.any(String),
                valueProposition: expect.any(String),
                problem: 'Los estudiantes universitarios abandonan 65% de cursos online porque no tienen retroalimentación personalizada ni interacción con profesores'
              },
              {
                name: expect.any(String),
                solution: expect.any(String),
                customerSegment: expect.any(String),
                valueProposition: expect.any(String),
                problem: 'Los estudiantes universitarios abandonan 65% de cursos online porque no tienen retroalimentación personalizada ni interacción con profesores'
              }
            ]
          }
        },
        'Debe adaptar las hipótesis al contexto educativo'
      ),

      createTestCase(
        'Error: Problema muy corto',
        {
          body: {
            problem: 'Problema corto'
          }
        },
        {
          status: 400,
          response: {
            message: 'El problema debe tener al menos 20 caracteres'
          }
        },
        'Debe validar longitud mínima del problema'
      ),

      createTestCase(
        'Error: Sin API Key configurada',
        {
          body: {
            problem: 'Este es un problema válido de más de 20 caracteres'
          },
          noApiKey: true
        },
        {
          status: 500,
          response: {
            message: 'Servicio de IA no disponible'
          }
        },
        'Debe manejar ausencia de API key'
      )
    ]);

    generationScenarios.scenarios.forEach(scenario => {
      it(`${scenario.name}`, async () => {
        console.log('\n📥 ENTRADA:', JSON.stringify(scenario.input, null, 2));
        
        req.body = scenario.input.body;
        
        if (scenario.input.noApiKey) {
          delete process.env.AI_API_KEY;
        }
        
        if (scenario.expectedOutput.status === 200) {
          // Mock de respuesta exitosa de IA
          const mockAIResponse = {
            options: scenario.expectedOutput.response.options
          };
          
          axios.post.mockResolvedValue({
            data: {
              choices: [{
                message: {
                  content: JSON.stringify(mockAIResponse)
                }
              }]
            }
          });
        }

        await aiController.generateHypothesisFromProblem(req, res);

        console.log('📤 SALIDA ESPERADA:', JSON.stringify(scenario.expectedOutput, null, 2));
        
        expect(res.status).toHaveBeenCalledWith(scenario.expectedOutput.status);
        
        if (scenario.expectedOutput.status === 200) {
          const response = res.json.mock.calls[0][0];
          expect(response.message).toBe(scenario.expectedOutput.response.message);
          expect(response.problem).toBe(scenario.input.body.problem);
          expect(response.options).toHaveLength(3);
          
          // Verificar estructura de cada opción
          response.options.forEach(option => {
            expect(option).toHaveProperty('name');
            expect(option).toHaveProperty('solution');
            expect(option).toHaveProperty('customerSegment');
            expect(option).toHaveProperty('valueProposition');
            expect(option).toHaveProperty('problem');
            expect(option.name.length).toBeLessThanOrEqual(255); // Límite de DB
          });
        } else {
          expect(res.json).toHaveBeenCalledWith(scenario.expectedOutput.response);
        }
      });
    });
  });
});