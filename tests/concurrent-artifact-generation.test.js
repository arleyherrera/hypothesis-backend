// tests/concurrent-artifact-generation.test.js

const request = require('supertest');
const app = require('../server');

describe('OBJETIVO 3: Motor de Generación de Artefactos - Concurrencia', () => {
  let authToken;
  let hypothesisId;

  beforeAll(async () => {
    // 1. Crear usuario
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Concurrent Test',
        email: `concurrent${Date.now()}@test.com`,
        password: 'Test123!'
      });
    
    authToken = userRes.body.token;

    // 2. Crear UNA hipótesis para las 10 solicitudes
    const hypRes = await request(app)
      .post('/api/hypotheses')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        problem: 'Problema para probar generación concurrente de artefactos con IA',
        name: 'Test Concurrencia IA',
        solution: 'Solución para pruebas concurrentes',
        customerSegment: 'Testers',
        valueProposition: 'Validar concurrencia'
      });

    hypothesisId = hypRes.body.id;
  });

  test('API debe generar artefactos correctamente con 10 solicitudes concurrentes', async () => {
    console.log('\n🚀 Probando 10 solicitudes concurrentes de generación...\n');

    // Crear 10 solicitudes concurrentes al mismo endpoint
    const promises = Array(10).fill(null).map((_, index) => {
      console.log(`📤 Solicitud #${index + 1} - Generando artefactos...`);
      
      // Usar el endpoint de generación (con o sin IA)
      return request(app)
        .post(`/api/artifacts/${hypothesisId}/generate/construir`)
        .set('Authorization', `Bearer ${authToken}`)
        .then(response => {
          console.log(`✅ Solicitud #${index + 1} - Status: ${response.status}`);
          return response;
        })
        .catch(error => {
          console.log(`❌ Solicitud #${index + 1} - Error`);
          return { status: 500, error };
        });
    });

    // Ejecutar todas las solicitudes AL MISMO TIEMPO
    const responses = await Promise.all(promises);

    // Contar respuestas exitosas
    const successful = responses.filter(r => r.status === 201).length;
    const failed = responses.filter(r => r.status !== 201).length;

    console.log('\n📊 RESULTADOS:');
    console.log(`✅ Exitosas: ${successful}/10`);
    console.log(`❌ Fallidas: ${failed}/10`);

    // Verificar que cada respuesta exitosa tiene 6 artefactos
    let totalArtifacts = 0;
    responses.forEach((res, index) => {
      if (res.status === 201 && res.body.artifacts) {
        const count = res.body.artifacts.length;
        console.log(`   Solicitud #${index + 1}: ${count} artefactos`);
        totalArtifacts += count;
      }
    });

    // MÉTRICAS A VALIDAR:
    // 1. Las 10 solicitudes deben responder correctamente
    expect(successful).toBe(10);
    
    // 2. Cada respuesta debe tener 6 artefactos
    responses.forEach(res => {
      if (res.status === 201) {
        expect(res.body.artifacts).toHaveLength(6);
      }
    });

    console.log(`\n✅ MÉTRICA CUMPLIDA: ${successful}/10 solicitudes concurrentes exitosas`);
    console.log(`📦 Total de artefactos generados: ${totalArtifacts}`);
  });
});