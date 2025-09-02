// tests/objetivo1-semantic-evaluation.test.js

const request = require('supertest');
const app = require('../server');
const VectorContextService = require('../services/vectorContextService');
const { Hypothesis, Artifact, ArtifactContext } = require('../models');

describe('OBJETIVO 1: Sistema de Evaluación Semántica', () => {
  let authToken;
  let vectorService;
  const HYPOTHESIS_ID = 119; // Tu ID con datos existentes
  let errorLogs = [];
  let originalConsoleError;

  beforeAll(async () => {
    // Inicializar servicio de vectores
    vectorService = new VectorContextService();
    
    // Interceptar errores para verificar que no hay errores críticos
    originalConsoleError = console.error;
    console.error = (...args) => {
      const errorMessage = args.join(' ');
      errorLogs.push({
        message: errorMessage,
        timestamp: new Date().toISOString(),
        isCritical: errorMessage.includes('CRITICAL') || 
                   errorMessage.includes('Error') ||
                   errorMessage.includes('Failed')
      });
      originalConsoleError.apply(console, args);
    };

    // Autenticarse (ajusta con tus credenciales de prueba)
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'hhh@gmail.com', // Cambia por tu email de prueba
        password: 'hhh123456' // Cambia por tu password de prueba
      });
    
    authToken = loginRes.body.token;
    
    console.log('🔍 Usando hipótesis existente ID:', HYPOTHESIS_ID);
  });

  afterAll(() => {
    console.error = originalConsoleError;
    
    // Generar reporte de errores
    console.log('\n📋 REPORTE DE ERRORES:');
    console.log(`Total de logs de error: ${errorLogs.length}`);
    console.log(`Errores críticos: ${errorLogs.filter(e => e.isCritical).length}`);
  });

  describe('MÉTRICA 1: 0 errores críticos en logs del sistema', () => {
    beforeEach(() => {
      errorLogs = []; // Limpiar logs para cada test
    });

    test('Evaluar coherencia de artefactos existentes sin errores críticos', async () => {
      console.log('\n🔍 Evaluando coherencia de hipótesis 119...\n');

      try {
        // 1. Verificar que la hipótesis existe y obtener sus datos
        const hypResponse = await request(app)
          .get(`/api/hypotheses/${HYPOTHESIS_ID}`)
          .set('Authorization', `Bearer ${authToken}`);
        
        expect(hypResponse.status).toBe(200);
        console.log(`✅ Hipótesis encontrada: "${hypResponse.body.name}"`);
        console.log(`   Artefactos existentes: ${hypResponse.body.artifacts?.length || 0}`);

        // 2. Obtener estadísticas de contexto semántico
        const statsResponse = await request(app)
          .get(`/api/artifacts/${HYPOTHESIS_ID}/context-stats`)
          .set('Authorization', `Bearer ${authToken}`);
        
        expect(statsResponse.status).toBe(200);
        const stats = statsResponse.body.contextStats;
        
        console.log('\n📊 Estadísticas de Coherencia:');
        console.log(`   Total de contextos: ${stats.totalContexts}`);
        console.log(`   Fases completadas: ${stats.completedPhases}/${stats.totalPhases}`);
        console.log(`   Coherencia global: ${(stats.globalCoherence?.score * 100).toFixed(2)}%`);

        // 3. Evaluar coherencia por fase
        if (stats.phaseCoherence) {
          console.log('\n📈 Coherencia por Fase:');
          Object.entries(stats.phaseCoherence).forEach(([phase, score]) => {
            console.log(`   ${phase}: ${(score * 100).toFixed(2)}%`);
          });
        }

        // 4. Verificar transiciones entre fases
        if (stats.globalCoherence?.transitions) {
          console.log('\n🔄 Transiciones entre Fases:');
          Object.entries(stats.globalCoherence.transitions).forEach(([transition, score]) => {
            console.log(`   ${transition}: ${(score * 100).toFixed(2)}%`);
          });
        }

        // 5. Probar operaciones del sistema semántico
        console.log('\n🧪 Probando operaciones semánticas...');
        
        // Obtener un artefacto para actualizar
        const artifacts = hypResponse.body.artifacts || [];
        if (artifacts.length > 0) {
          const testArtifact = await Artifact.findByPk(artifacts[0].id);
          
          // Actualizar contexto
          await vectorService.updateArtifactContext(testArtifact);
          console.log(`✅ Contexto actualizado para artefacto: ${testArtifact.name}`);
          
          // Obtener contexto relevante
          const relevantContext = await vectorService.getRelevantContext(
            HYPOTHESIS_ID,
            testArtifact.phase,
            testArtifact.name
          );
          
          if (relevantContext) {
            console.log(`✅ Contexto relevante obtenido: ${relevantContext.contexts?.length || 0} resultados`);
          }
        }

        // VALIDACIÓN FINAL: No debe haber errores críticos
        const criticalErrors = errorLogs.filter(log => log.isCritical);
        
        console.log(`\n✅ Errores críticos encontrados: ${criticalErrors.length}`);
        expect(criticalErrors.length).toBe(0);
        
        if (criticalErrors.length > 0) {
          console.log('\n❌ Errores críticos detectados:');
          criticalErrors.forEach(err => {
            console.log(`   - ${err.timestamp}: ${err.message}`);
          });
        }

      } catch (error) {
        console.error('Error durante la evaluación:', error.message);
        throw error;
      }
    });

    test('Analizar coherencia profunda sin errores', async () => {
      console.log('\n🔬 Análisis profundo de coherencia...\n');
      
      try {
        // Obtener todos los contextos almacenados
        const contexts = await ArtifactContext.findAll({
          where: { hypothesisId: HYPOTHESIS_ID },
          limit: 10
        });
        
        console.log(`📦 Contextos encontrados: ${contexts.length}`);
        
        if (contexts.length >= 2) {
          // Calcular coherencia entre pares
          const coherenceScores = [];
          
          for (let i = 0; i < Math.min(contexts.length - 1, 5); i++) {
            for (let j = i + 1; j < Math.min(contexts.length, 5); j++) {
              const embedding1 = JSON.parse(contexts[i].embedding);
              const embedding2 = JSON.parse(contexts[j].embedding);
              
              const similarity = vectorService.cosineSimilarity(embedding1, embedding2);
              coherenceScores.push({
                pair: `${contexts[i].phase}-${contexts[j].phase}`,
                score: similarity
              });
            }
          }
          
          console.log('\n🔗 Coherencia entre Artefactos:');
          coherenceScores.forEach(({ pair, score }) => {
            console.log(`   ${pair}: ${(score * 100).toFixed(2)}%`);
          });
          
          const avgCoherence = coherenceScores.reduce((sum, item) => sum + item.score, 0) / coherenceScores.length;
          console.log(`\n📊 Coherencia promedio: ${(avgCoherence * 100).toFixed(2)}%`);
        }
        
        // Verificar que no hubo errores críticos
        const criticalErrors = errorLogs.filter(log => log.isCritical);
        expect(criticalErrors.length).toBe(0);
        
      } catch (error) {
        console.error('Error en análisis profundo:', error.message);
        throw error;
      }
    });
  });

  describe('MÉTRICA 2: Todas las pruebas de integración ejecutadas exitosamente', () => {
    test('Integración completa del sistema semántico con hipótesis 119', async () => {
      console.log('\n🔄 Prueba de integración completa...\n');
      
      const integrationSteps = {
        'Obtener hipótesis': false,
        'Obtener artefactos': false,
        'Verificar contextos': false,
        'Evaluar coherencia': false,
        'Generar recomendaciones': false
      };

      try {
        // 1. Obtener hipótesis completa
        console.log('1️⃣ Obteniendo hipótesis con artefactos...');
        const hypRes = await request(app)
          .get(`/api/hypotheses/${HYPOTHESIS_ID}`)
          .set('Authorization', `Bearer ${authToken}`);
        
        expect(hypRes.status).toBe(200);
        integrationSteps['Obtener hipótesis'] = true;
        
        const hypothesis = hypRes.body;
        console.log(`   ✅ Hipótesis: ${hypothesis.name}`);
        console.log(`   📄 Problema: ${hypothesis.problem.substring(0, 50)}...`);

        // 2. Verificar artefactos
        console.log('\n2️⃣ Verificando artefactos...');
        const artifactsRes = await request(app)
          .get(`/api/artifacts/${HYPOTHESIS_ID}`)
          .set('Authorization', `Bearer ${authToken}`);
        
        expect(artifactsRes.status).toBe(200);
        integrationSteps['Obtener artefactos'] = true;
        
        const artifacts = artifactsRes.body;
        console.log(`   ✅ Total de artefactos: ${artifacts.length}`);
        
        // Contar por fase
        const phaseCount = {};
        artifacts.forEach(a => {
          phaseCount[a.phase] = (phaseCount[a.phase] || 0) + 1;
        });
        
        console.log('   📊 Distribución por fase:');
        Object.entries(phaseCount).forEach(([phase, count]) => {
          console.log(`      - ${phase}: ${count} artefactos`);
        });

        // 3. Verificar contextos vectoriales
        console.log('\n3️⃣ Verificando contextos vectoriales...');
        const contextStats = await vectorService.getContextStats(HYPOTHESIS_ID);
        
        expect(contextStats).toBeDefined();
        expect(contextStats.totalContexts).toBeGreaterThan(0);
        integrationSteps['Verificar contextos'] = true;
        
        console.log(`   ✅ Contextos almacenados: ${contextStats.totalContexts}`);

        // 4. Evaluar coherencia global
        console.log('\n4️⃣ Evaluando coherencia global...');
        const coherenceReport = await request(app)
          .get(`/api/artifacts/${HYPOTHESIS_ID}/context-stats`)
          .set('Authorization', `Bearer ${authToken}`);
        
        expect(coherenceReport.status).toBe(200);
        integrationSteps['Evaluar coherencia'] = true;
        
        const globalCoherence = coherenceReport.body.contextStats?.globalCoherence;
        console.log(`   ✅ Score de coherencia: ${(globalCoherence?.score * 100).toFixed(2)}%`);
        console.log(`   💡 Recomendación: ${globalCoherence?.recommendation}`);

        // 5. Verificar que el sistema puede generar recomendaciones
        console.log('\n5️⃣ Verificando sistema de recomendaciones...');
        if (globalCoherence?.recommendation) {
          integrationSteps['Generar recomendaciones'] = true;
          console.log('   ✅ Sistema de recomendaciones funcionando');
        }

        // Resumen final
        console.log('\n📋 RESUMEN DE INTEGRACIÓN:');
        Object.entries(integrationSteps).forEach(([step, success]) => {
          console.log(`   ${success ? '✅' : '❌'} ${step}`);
        });

        const allStepsCompleted = Object.values(integrationSteps).every(v => v === true);
        expect(allStepsCompleted).toBe(true);

        // Verificar que no hubo errores críticos durante la integración
        const criticalErrors = errorLogs.filter(log => log.isCritical);
        expect(criticalErrors.length).toBe(0);

        console.log('\n✅ TODAS LAS PRUEBAS DE INTEGRACIÓN COMPLETADAS EXITOSAMENTE');

      } catch (error) {
        console.error('❌ Error en prueba de integración:', error.message);
        
        // Mostrar qué pasos se completaron
        console.log('\nPasos completados:');
        Object.entries(integrationSteps).forEach(([step, success]) => {
          console.log(`   ${success ? '✅' : '❌'} ${step}`);
        });
        
        throw error;
      }
    });

    test('Verificar calidad de la evaluación semántica', async () => {
      console.log('\n🎯 Verificando calidad de evaluación...\n');
      
      try {
        // Obtener un reporte detallado de coherencia
        const reportRes = await request(app)
          .get(`/api/artifacts/${HYPOTHESIS_ID}/context-stats`)
          .set('Authorization', `Bearer ${authToken}`);
        
        const stats = reportRes.body.contextStats;
        
        // Verificar que tenemos datos de calidad
        expect(stats).toBeDefined();
        expect(stats.phaseDistribution).toBeDefined();
        expect(stats.phaseCoherence).toBeDefined();
        expect(stats.globalCoherence).toBeDefined();
        
        // Mostrar análisis de calidad
        console.log('📊 ANÁLISIS DE CALIDAD:');
        console.log(`   Fases analizadas: ${Object.keys(stats.phaseCoherence || {}).length}`);
        console.log(`   Coherencia mínima: ${Math.min(...Object.values(stats.phaseCoherence || {0: 0})) * 100}%`);
        console.log(`   Coherencia máxima: ${Math.max(...Object.values(stats.phaseCoherence || {0: 0})) * 100}%`);
        
        // Verificar sin errores
        const criticalErrors = errorLogs.filter(log => log.isCritical);
        expect(criticalErrors.length).toBe(0);
        
        console.log('\n✅ Evaluación semántica de alta calidad confirmada');
        
      } catch (error) {
        console.error('Error verificando calidad:', error.message);
        throw error;
      }
    });
  });
});