const request = require('supertest');
const app = require('../../server');
const { createTestCase, createTestScenario } = require('../templates/testDataTemplate');

// Mocks necesarios
jest.mock('../../models', () => {
  const mockModels = {
    User: {
      findOne: jest.fn(),
      create: jest.fn(),
      findByPk: jest.fn()
    },
    Hypothesis: {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn()
    },
    Artifact: {
      findAll: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn()
    },
    sequelize: {
      authenticate: jest.fn().mockResolvedValue(true),
      sync: jest.fn().mockResolvedValue(true),
      close: jest.fn()
    }
  };
  return mockModels;
});

jest.mock('bcryptjs', () => ({
  hash: jest.fn(password => Promise.resolve(`hashed_${password}`)),
  compare: jest.fn((password, hash) => Promise.resolve(hash === `hashed_${password}`))
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'test-jwt-token'),
  verify: jest.fn(() => ({ id: 1 }))
}));

describe('Flujo Completo de Usuario - Entrada/Salida Real', () => {
  const { User, Hypothesis, Artifact } = require('../../models');

  describe('FLUJO COMPLETO: REGISTRO → LOGIN → HIPÓTESIS → ARTEFACTOS', () => {
    const completeFlowScenarios = createTestScenario('Complete User Flow', [
      createTestCase(
        'Flujo exitoso de usuario nuevo',
        {
          // Paso 1: Registro
          registration: {
            name: 'Emprendedor Tech',
            email: 'emprendedor@startup.com',
            password: 'Secure123!'
          },
          // Paso 2: Login
          login: {
            email: 'emprendedor@startup.com',
            password: 'Secure123!'
          },
          // Paso 3: Crear hipótesis
          hypothesis: {
            problem: 'Las startups tech pierden 70% del tiempo en reuniones improductivas sin agenda clara',
            name: 'MeetingOptimizer',
            solution: 'App que genera agendas automáticas basadas en objetivos del sprint',
            customerSegment: 'Equipos de desarrollo ágil de 5-20 personas',
            valueProposition: 'Reduce 50% el tiempo en reuniones y aumenta productividad del equipo'
          },
          // Paso 4: Generar artefactos
          artifactGeneration: {
            phase: 'construir'
          }
        },
        {
          // Resultados esperados de cada paso
          registrationResult: {
            status: 201,
            body: {
              id: 1,
              name: 'Emprendedor Tech',
              email: 'emprendedor@startup.com',
              token: 'test-jwt-token'
            }
          },
          loginResult: {
            status: 200,
            body: {
              id: 1,
              name: 'Emprendedor Tech',
              email: 'emprendedor@startup.com',
              token: 'test-jwt-token'
            }
          },
          hypothesisResult: {
            status: 201,
            body: {
              id: 1,
              problem: 'Las startups tech pierden 70% del tiempo en reuniones improductivas sin agenda clara',
              name: 'MeetingOptimizer',
              solution: 'App que genera agendas automáticas basadas en objetivos del sprint',
              customerSegment: 'Equipos de desarrollo ágil de 5-20 personas',
              valueProposition: 'Reduce 50% el tiempo en reuniones y aumenta productividad del equipo',
              userId: 1
            }
          },
          artifactsResult: {
            status: 201,
            body: {
              message: '6 artefactos generados para construir',
              artifacts: expect.arrayContaining([
                expect.objectContaining({
                  name: 'MVP Personalizado',
                  phase: 'construir'
                }),
                expect.objectContaining({
                  name: 'Mapa de Empatía Personalizado',
                  phase: 'construir'
                })
              ])
            }
          }
        },
        'Usuario completa todo el flujo desde registro hasta generación de artefactos'
      )
    ]);

    completeFlowScenarios.scenarios.forEach(scenario => {
      it(`${scenario.name}`, async () => {
        console.log('\n🚀 INICIANDO FLUJO COMPLETO DE USUARIO\n');
        
        let authToken;
        let userId;
        let hypothesisId;

        // PASO 1: REGISTRO
        console.log('📥 PASO 1 - REGISTRO:', JSON.stringify(scenario.input.registration, null, 2));
        
        User.findOne.mockResolvedValue(null); // No existe
        User.create.mockResolvedValue({
          id: 1,
          ...scenario.input.registration,
          password: `hashed_${scenario.input.registration.password}`
        });

        const registerResponse = await request(app)
          .post('/api/auth/register')
          .send(scenario.input.registration);

        console.log('📤 Resultado registro:', {
          status: registerResponse.status,
          userId: registerResponse.body.id
        });

        expect(registerResponse.status).toBe(scenario.expectedOutput.registrationResult.status);
        expect(registerResponse.body).toMatchObject(scenario.expectedOutput.registrationResult.body);
        
        authToken = registerResponse.body.token;
        userId = registerResponse.body.id;

        // PASO 2: LOGIN
        console.log('\n📥 PASO 2 - LOGIN:', JSON.stringify(scenario.input.login, null, 2));
        
        User.findOne.mockResolvedValue({
          id: userId,
          email: scenario.input.login.email,
          password: `hashed_${scenario.input.login.password}`,
          name: scenario.input.registration.name
        });

        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send(scenario.input.login);

        console.log('📤 Resultado login:', {
          status: loginResponse.status,
          tokenRecibido: !!loginResponse.body.token
        });

        expect(loginResponse.status).toBe(scenario.expectedOutput.loginResult.status);
        authToken = loginResponse.body.token;

        // PASO 3: CREAR HIPÓTESIS
        console.log('\n📥 PASO 3 - CREAR HIPÓTESIS:', JSON.stringify(scenario.input.hypothesis, null, 2));
        
        User.findByPk.mockResolvedValue({ id: userId });
        Hypothesis.create.mockResolvedValue({
          id: 1,
          ...scenario.input.hypothesis,
          userId: userId
        });

        const hypothesisResponse = await request(app)
          .post('/api/hypotheses')
          .set('Authorization', `Bearer ${authToken}`)
          .send(scenario.input.hypothesis);

        console.log('📤 Resultado hipótesis:', {
          status: hypothesisResponse.status,
          hypothesisId: hypothesisResponse.body.id,
          name: hypothesisResponse.body.name
        });

        expect(hypothesisResponse.status).toBe(scenario.expectedOutput.hypothesisResult.status);
        expect(hypothesisResponse.body).toMatchObject(scenario.expectedOutput.hypothesisResult.body);
        
        hypothesisId = hypothesisResponse.body.id;

        // PASO 4: GENERAR ARTEFACTOS
        console.log('\n📥 PASO 4 - GENERAR ARTEFACTOS:', {
          hypothesisId: hypothesisId,
          phase: scenario.input.artifactGeneration.phase
        });
        
        Hypothesis.findOne.mockResolvedValue({
          id: hypothesisId,
          ...scenario.input.hypothesis,
          userId: userId
        });
        
        Artifact.destroy.mockResolvedValue(0);
        
        const mockArtifacts = [
          'MVP Personalizado',
          'Mapa de Empatía Personalizado',
          'Backlog de Funcionalidades',
          'Experimentos de Validación',
          'Plan de Recursos',
          'Estrategia de Early Adopters'
        ].map((name, index) => ({
          id: index + 1,
          name: name,
          phase: 'construir',
          description: `Descripción de ${name}`,
          content: `Contenido generado para ${name}`,
          hypothesisId: hypothesisId
        }));
        
        Artifact.create.mockImplementation((data) => 
          Promise.resolve(mockArtifacts.find(a => a.name === data.name))
        );

        const artifactsResponse = await request(app)
          .post(`/api/artifacts/${hypothesisId}/generate/${scenario.input.artifactGeneration.phase}`)
          .set('Authorization', `Bearer ${authToken}`);

        console.log('📤 Resultado artefactos:', {
          status: artifactsResponse.status,
          message: artifactsResponse.body.message,
          artifactsGenerados: artifactsResponse.body.artifacts?.length || 0
        });

        expect(artifactsResponse.status).toBe(scenario.expectedOutput.artifactsResult.status);
        expect(artifactsResponse.body.message).toBe(scenario.expectedOutput.artifactsResult.body.message);
        expect(artifactsResponse.body.artifacts).toHaveLength(6);

        console.log('\n✅ FLUJO COMPLETO EXITOSO');
        console.log('Resumen:');
        console.log(`- Usuario creado: ${scenario.input.registration.email}`);
        console.log(`- Hipótesis creada: ${scenario.input.hypothesis.name}`);
        console.log(`- Artefactos generados: 6 para fase ${scenario.input.artifactGeneration.phase}`);
      });
    });
  });

  describe('FLUJOS CON ERRORES', () => {
    const errorFlowScenarios = createTestScenario('Error Flows', [
      createTestCase(
        'Usuario intenta crear hipótesis sin autenticación',
        {
          hypothesis: {
            problem: 'Problema sin autenticación',
            name: 'Test',
            solution: 'Test',
            customerSegment: 'Test',
            valueProposition: 'Test'
          }
        },
        {
          status: 401,
          body: {
            message: 'No está autorizado para acceder a este recurso'
          }
        },
        'Debe rechazar peticiones sin token'
      ),

      createTestCase(
        'Usuario intenta generar artefactos de hipótesis que no le pertenece',
        {
          userId: 1,
          hypothesisOwnerId: 2,
          hypothesisId: 99,
          phase: 'construir'
        },
        {
          status: 404,
          body: {
            message: 'Hipótesis no encontrada'
          }
        },
        'Debe proteger hipótesis de otros usuarios'
      )
    ]);

    errorFlowScenarios.scenarios.forEach(scenario => {
      it(`${scenario.name}`, async () => {
        console.log('\n📥 ENTRADA:', JSON.stringify(scenario.input, null, 2));
        
        if (scenario.name.includes('sin autenticación')) {
          const response = await request(app)
            .post('/api/hypotheses')
            .send(scenario.input.hypothesis);

          console.log('📤 SALIDA:', {
            status: response.status,
            body: response.body
          });

          expect(response.status).toBe(scenario.expectedOutput.status);
          expect(response.body).toMatchObject(scenario.expectedOutput.body);
        }
        
        if (scenario.name.includes('no le pertenece')) {
          User.findByPk.mockResolvedValue({ id: scenario.input.userId });
          Hypothesis.findOne.mockResolvedValue(null); // No encuentra porque es de otro usuario

          const response = await request(app)
            .post(`/api/artifacts/${scenario.input.hypothesisId}/generate/${scenario.input.phase}`)
            .set('Authorization', 'Bearer test-token');

          expect(response.status).toBe(scenario.expectedOutput.status);
        }
      });
    });
  });
});