
// tests/simple-ia-concurrent.test.js

const request = require('supertest');
const app = require('../server');

describe('Objetivo 3 - Generación de Artefactos Concurrente', () => {
  test('10 solicitudes concurrentes de generación de artefactos', async () => {
    try {
      // 1. Crear usuario
      const timestamp = Date.now();
      const userResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: `test${timestamp}@example.com`,
          password: 'Test123!'
        });

      // Si el registro falla, intentar login
      let token;
      if (userResponse.status === 201) {
        token = userResponse.body.token;
      } else {
        const loginResponse = await request(app)
          .post('/api/auth/login')
          .send({
            email: `test${timestamp}@example.com`,
            password: 'Test123!'
          });
        token = loginResponse.body.token;
      }

      // 2. Crear hipótesis
      const hypResponse = await request(app)
        .post('/api/hypotheses')
        .set('Authorization', `Bearer ${token}`)
        .send({
          problem: 'Problema de más de veinte caracteres para la prueba de concurrencia',
          name: 'Test Concurrencia',
          solution: 'Solución de prueba',
          customerSegment: 'Segmento de prueba',
          valueProposition: 'Valor de prueba'
        });

      expect(hypResponse.status).toBe(201);
      const hypothesisId = hypResponse.body.id;

      // 3. Crear 10 solicitudes concurrentes
      console.log('\nIniciando 10 solicitudes concurrentes...\n');
      
      const promises = [];
      for (let i = 0; i < 10; i++) {
        const promise = request(app)
          .post(`/api/artifacts/${hypothesisId}/generate/construir`)
          .set('Authorization', `Bearer ${token}`)
          .then(res => {
            console.log(`Solicitud ${i + 1}: Status ${res.status}`);
            return res;
          });
        
        promises.push(promise);
      }

      // 4. Ejecutar todas al mismo tiempo
      const results = await Promise.all(promises);

      // 5. Contar exitosas
      const exitosas = results.filter(r => r.status === 201).length;
      const fallidas = results.filter(r => r.status !== 201).length;

      console.log(`\nResultados:`);
      console.log(`✅ Exitosas: ${exitosas}/10`);
      console.log(`❌ Fallidas: ${fallidas}/10`);

      // 6. Validar métrica
      expect(exitosas).toBe(10);

      // 7. Validar que cada una generó 6 artefactos
      results.forEach((res, index) => {
        if (res.status === 201) {
          expect(res.body.artifacts).toBeDefined();
          expect(res.body.artifacts.length).toBe(6);
        }
      });

    } catch (error) {
      console.error('Error en el test:', error.message);
      throw error;
    }
  });
});