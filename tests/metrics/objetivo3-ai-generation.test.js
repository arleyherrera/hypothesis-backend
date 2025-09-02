// tests/metrics/objetivo3-ai-generation.test.js

const request = require('supertest');
const app = require('../../server');
const { performance } = require('perf_hooks');

describe('OBJETIVO 3 - MÉTRICAS: Motor de Generación IA', () => {
  let authToken;
  let testHypotheses = [];

  beforeAll(async () => {
    // Crear usuario de prueba
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'AI Test User',
        email: `aitest${Date.now()}@example.com`,
        password: 'TestPass123!'
      });
    
    authToken = userRes.body.token;

    // Crear múltiples hipótesis para pruebas
    for (let i = 1; i <= 3; i++) {
      const res = await request(app)
        .post('/api/hypotheses')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          problem: `Problema de prueba número ${i} con descripción extensa para validación`,
          name: `Hipótesis Test ${i}`,
          solution: `Solución innovadora ${i}`,
          customerSegment: `Segmento ${i}`,
          valueProposition: `Propuesta de valor ${i}`
        });
      
      testHypotheses.push(res.body);
    }
  });

  describe('MÉTRICA 1: 6 artefactos generados correctamente por cada hipótesis', () => {
    test('Cada fase debe generar exactamente 6 artefactos', async () => {
      const phases = ['construir', 'medir', 'aprender', 'pivotar', 'iterar'];
      const hypothesis = testHypotheses[0];
      
      const generationReport = {
        hypothesisId: hypothesis.id,
        phases: {}
      };

      for (const phase of phases) {
        const response = await request(app)
          .post(`/api/artifacts/${hypothesis.id}/generate-ai/${phase}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(201);

        const artifacts = response.body.artifacts;
        
        // Validación estricta: EXACTAMENTE 6 artefactos
        expect(artifacts).toHaveLength(6);
        
        // Validar cada artefacto
        const artifactValidation = artifacts.map(artifact => ({
          name: artifact.name,
          hasContent: artifact.content && artifact.content.length > 100,
          correctPhase: artifact.phase === phase,
          hasDescription: !!artifact.description,
          contentQuality: artifact.content.includes(hypothesis.problem.substring(0, 20))
        }));

        // Todos los artefactos deben pasar la validación
        artifactValidation.forEach((validation, index) => {
          expect(validation.hasContent).toBe(true);
          expect(validation.correctPhase).toBe(true);
          expect(validation.hasDescription).toBe(true);
        });

        generationReport.phases[phase] = {
          count: artifacts.length,
          validations: artifactValidation
        };
      }

      // Generar reporte
      console.log('\n📊 Reporte de Generación:');
      console.table(
        Object.entries(generationReport.phases).map(([phase, data]) => ({
          Fase: phase,
          'Artefactos Generados': data.count,
          'Validación': data.count === 6 ? '✅' : '❌'
        }))
      );
    });

    test('Validar contenido específico de los 6 artefactos por fase', async () => {
      const expectedArtifacts = {
        construir: [
          'MVP Personalizado',
          'Mapa de Empatía Personalizado',
          'Backlog de Funcionalidades',
          'Experimentos de Validación',
          'Plan de Recursos',
          'Estrategia de Early Adopters'
        ],
        medir: [
          'Framework de KPIs Personalizado',
          'Plan de Analítica',
          'Diseño de Tests A/B',
          'Embudo de Conversión',
          'Sistema de Retroalimentación',
          'Dashboard de Métricas'
        ]
      };

      const hypothesis = testHypotheses[1];

      for (const [phase, expectedNames] of Object.entries(expectedArtifacts)) {
        const response = await request(app)
          .post(`/api/artifacts/${hypothesis.id}/generate-ai/${phase}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(201);

        const generatedNames = response.body.artifacts.map(a => a.name.replace(' (IA)', ''));
        
        // Verificar que se generaron los 6 artefactos esperados
        expectedNames.forEach(expectedName => {
          const found = generatedNames.some(name => name.includes(expectedName));
          expect(found).toBe(true);
        });
      }
    });
  });

  describe('MÉTRICA 2: API respondiendo correctamente a 10 solicitudes concurrentes', () => {
    test('Manejar 10 solicitudes concurrentes sin errores', async () => {
      const concurrentRequests = 10;
      const hypothesis = testHypotheses[2];
      const results = {
        successful: 0,
        failed: 0,
        times: [],
        errors: []
      };

      console.log('\n🚀 Iniciando prueba de concurrencia...');
      
      // Crear array de promesas
      const promises = Array(concurrentRequests).fill(null).map((_, index) => {
        const startTime = performance.now();
        
        return request(app)
          .post(`/api/artifacts/${hypothesis.id}/generate/construir`)
          .set('Authorization', `Bearer ${authToken}`)
          .then(response => {
            const endTime = performance.now();
            results.times.push(endTime - startTime);
            
            if (response.status === 201) {
              results.successful++;
              return { success: true, status: response.status, index };
            } else {
              results.failed++;
              results.errors.push({ index, status: response.status });
              return { success: false, status: response.status, index };
            }
          })
          .catch(error => {
            results.failed++;
            results.errors.push({ index, error: error.message });
            return { success: false, error: error.message, index };
          });
      });

      // Ejecutar todas las solicitudes concurrentemente
      const responses = await Promise.all(promises);

      // Análisis de resultados
      const avgTime = results.times.reduce((a, b) => a + b, 0) / results.times.length;
      const maxTime = Math.max(...results.times);
      const minTime = Math.min(...results.times);

      console.log('\n📊 Resultados de Concurrencia:');
      console.log(`✅ Exitosas: ${results.successful}/${concurrentRequests}`);
      console.log(`❌ Fallidas: ${results.failed}/${concurrentRequests}`);
      console.log(`⏱️  Tiempo promedio: ${avgTime.toFixed(2)}ms`);
      console.log(`⏱️  Tiempo máximo: ${maxTime.toFixed(2)}ms`);
      console.log(`⏱️  Tiempo mínimo: ${minTime.toFixed(2)}ms`);

      // VALIDACIÓN ESTRICTA
      expect(results.successful).toBe(concurrentRequests);
      expect(results.failed).toBe(0);
      
      // Verificar que todas las respuestas tienen 6 artefactos
      const detailedCheck = await request(app)
        .get(`/api/artifacts/${hypothesis.id}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      // Debe haber al menos 6 artefactos (pueden ser más si se ejecutó múltiples veces)
      expect(detailedCheck.body.length).toBeGreaterThanOrEqual(6);
    });

    test('Rendimiento bajo carga concurrente', async () => {
      const loadTestResults = {
        phases: ['construir', 'medir'],
        concurrentBatches: 3,
        requestsPerBatch: 10,
        results: []
      };

      for (let batch = 0; batch < loadTestResults.concurrentBatches; batch++) {
        const batchStart = performance.now();
        
        const promises = loadTestResults.phases.map(phase => {
          return Array(loadTestResults.requestsPerBatch / 2).fill(null).map(() => 
            request(app)
              .post(`/api/artifacts/${testHypotheses[0].id}/generate/${phase}`)
              .set('Authorization', `Bearer ${authToken}`)
          );
        }).flat();

        const responses = await Promise.all(promises);
        const batchEnd = performance.now();
        
        const successCount = responses.filter(r => r.status === 201).length;
        
        loadTestResults.results.push({
          batch: batch + 1,
          totalRequests: loadTestResults.requestsPerBatch,
          successful: successCount,
          duration: batchEnd - batchStart,
          avgTimePerRequest: (batchEnd - batchStart) / loadTestResults.requestsPerBatch
        });
      }

      // Validar que el rendimiento se mantiene estable
      const avgTimes = loadTestResults.results.map(r => r.avgTimePerRequest);
      const variance = Math.max(...avgTimes) - Math.min(...avgTimes);
      
      console.log('\n📊 Resultados de Carga:');
      console.table(loadTestResults.results);
      
      // El tiempo no debe variar más del 50% entre batches
      expect(variance).toBeLessThan(Math.min(...avgTimes) * 0.5);
      
      // Todas las solicitudes deben ser exitosas
      loadTestResults.results.forEach(result => {
        expect(result.successful).toBe(result.totalRequests);
      });
    });
  });
});