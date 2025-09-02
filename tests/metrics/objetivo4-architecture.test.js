// tests/metrics/objetivo4-architecture.test.js

const request = require('supertest');
const app = require('../../server');
const { sequelize } = require('../../models');
const fs = require('fs');
const path = require('path');

describe('OBJETIVO 4 - MÉTRICAS: Arquitectura sin errores críticos', () => {
  let errorLog = [];
  let originalConsoleError;
  let unhandledErrors = [];

  beforeAll(() => {
    // Capturar TODOS los errores
    originalConsoleError = console.error;
    console.error = (...args) => {
      errorLog.push({
        type: 'console.error',
        message: args.join(' '),
        timestamp: new Date().toISOString()
      });
      originalConsoleError(...args);
    };

    // Capturar errores no manejados
    process.on('uncaughtException', (error) => {
      unhandledErrors.push({
        type: 'uncaughtException',
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
    });

    process.on('unhandledRejection', (reason, promise) => {
      unhandledErrors.push({
        type: 'unhandledRejection',
        reason: reason,
        timestamp: new Date().toISOString()
      });
    });
  });

  afterAll(() => {
    console.error = originalConsoleError;
    
    // Generar reporte de errores
    const errorReport = {
      totalErrors: errorLog.length + unhandledErrors.length,
      consoleErrors: errorLog.length,
      unhandledErrors: unhandledErrors.length,
      criticalErrors: [...errorLog, ...unhandledErrors].filter(e => 
        e.message?.includes('CRITICAL') || 
        e.type === 'uncaughtException'
      ),
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(__dirname, '../../logs/architecture-error-report.json'),
      JSON.stringify(errorReport, null, 2)
    );
  });

  describe('MÉTRICA: Funcionalidad sin errores críticos', () => {
    test('Stack tecnológico completo sin errores', async () => {
      const stackValidation = {
        express: false,
        nodejs: false,
        postgresql: false,
        sequelize: false,
        apiRest: false
      };

      // 1. Validar Node.js
      stackValidation.nodejs = process.version.startsWith('v');
      expect(stackValidation.nodejs).toBe(true);

      // 2. Validar Express
      expect(app).toBeDefined();
      expect(app.listen).toBeDefined();
      stackValidation.express = true;

      // 3. Validar PostgreSQL + Sequelize
      try {
        await sequelize.authenticate();
        stackValidation.postgresql = true;
        stackValidation.sequelize = true;
      } catch (error) {
        fail('No se pudo conectar a PostgreSQL');
      }

      // 4. Validar API REST
      const response = await request(app).get('/health');
      stackValidation.apiRest = response.status === 200;

      // Verificar que no hubo errores críticos
      const criticalErrors = errorLog.filter(e => 
        e.message.includes('CRITICAL') || 
        e.message.includes('FATAL') ||
        e.message.includes('Error:')
      );

      expect(criticalErrors).toHaveLength(0);
      
      // Todos los componentes deben estar validados
      Object.values(stackValidation).forEach(valid => {
        expect(valid).toBe(true);
      });

      console.log('\n✅ Stack Tecnológico Validado:');
      console.table(stackValidation);
    });

    test('Flujo completo sin errores críticos', async () => {
      const flowSteps = [];
      const startErrors = errorLog.length;

      try {
        // PASO 1: Registro
        flowSteps.push({ step: 'Registro', status: 'iniciado' });
        const registerRes = await request(app)
          .post('/api/auth/register')
          .send({
            name: 'Architecture Test',
            email: `arch${Date.now()}@test.com`,
            password: 'ArchTest123!'
          });
        
        expect(registerRes.status).toBe(201);
        flowSteps[0].status = 'completado';

        // PASO 2: Login
        flowSteps.push({ step: 'Login', status: 'iniciado' });
        const loginRes = await request(app)
          .post('/api/auth/login')
          .send({
            email: registerRes.body.email,
            password: 'ArchTest123!'
          });
        
        expect(loginRes.status).toBe(200);
        const token = loginRes.body.token;
        flowSteps[1].status = 'completado';

        // PASO 3: Crear Hipótesis
        flowSteps.push({ step: 'Crear Hipótesis', status: 'iniciado' });
        const hypRes = await request(app)
          .post('/api/hypotheses')
          .set('Authorization', `Bearer ${token}`)
          .send({
            problem: 'Problema arquitectónico de prueba para validar el sistema completo',
            name: 'Hipótesis Arquitectura',
            solution: 'Solución de prueba',
            customerSegment: 'Testers',
            valueProposition: 'Valor de prueba'
          });
        
        expect(hypRes.status).toBe(201);
        flowSteps[2].status = 'completado';

        // PASO 4: Generar Artefactos
        flowSteps.push({ step: 'Generar Artefactos', status: 'iniciado' });
        const artifactRes = await request(app)
          .post(`/api/artifacts/${hypRes.body.id}/generate/construir`)
          .set('Authorization', `Bearer ${token}`);
        
        expect(artifactRes.status).toBe(201);
        flowSteps[3].status = 'completado';

        // PASO 5: Obtener Estadísticas
        flowSteps.push({ step: 'Obtener Estadísticas', status: 'iniciado' });
        const statsRes = await request(app)
          .get(`/api/artifacts/${hypRes.body.id}/context-stats`)
          .set('Authorization', `Bearer ${token}`);
        
        expect(statsRes.status).toBe(200);
        flowSteps[4].status = 'completado';

      } catch (error) {
        const lastStep = flowSteps.find(s => s.status === 'iniciado');
        if (lastStep) lastStep.status = 'fallido';
        throw error;
      }

      // Verificar que no se generaron errores críticos durante el flujo
      const newErrors = errorLog.length - startErrors;
      const criticalNewErrors = errorLog.slice(startErrors).filter(e => 
        e.message.includes('CRITICAL') || 
        e.message.includes('FATAL')
      );

      console.log('\n📊 Resumen del Flujo:');
      console.table(flowSteps);
      console.log(`Errores nuevos durante el flujo: ${newErrors}`);
      console.log(`Errores críticos: ${criticalNewErrors.length}`);

      expect(criticalNewErrors).toHaveLength(0);
      expect(unhandledErrors).toHaveLength(0);
    });

    test('Manejo de errores sin caídas del sistema', async () => {
      const errorScenarios = [
        // Autenticación inválida
        {
          name: 'Token inválido',
          request: () => request(app)
            .get('/api/hypotheses')
            .set('Authorization', 'Bearer invalid-token'),
          expectedStatus: 401
        },
        // Datos inválidos
        {
          name: 'Hipótesis sin datos requeridos',
          request: () => request(app)
            .post('/api/hypotheses')
            .set('Authorization', `Bearer ${global.testToken || 'mock'}`)
            .send({}),
          expectedStatus: 400
        },
        // Recurso inexistente
        {
          name: 'Hipótesis inexistente',
          request: () => request(app)
            .get('/api/hypotheses/99999')
            .set('Authorization', `Bearer ${global.testToken || 'mock'}`),
          expectedStatus: 404
        },
        // Fase inválida
        {
          name: 'Fase no válida',
          request: () => request(app)
            .post('/api/artifacts/1/generate/fase-invalida')
            .set('Authorization', `Bearer ${global.testToken || 'mock'}`),
          expectedStatus: 400
        }
      ];

      for (const scenario of errorScenarios) {
        const response = await scenario.request();
        
        // Debe manejar el error sin caerse (no 5xx)
        expect(response.status).toBe(scenario.expectedStatus);
        expect(response.status).toBeLessThan(500);
        
        // No debe generar errores no manejados
        expect(unhandledErrors).toHaveLength(0);
      }
    });

    test('Verificación final: 0 errores críticos', () => {
      // Análisis final de todos los errores capturados
      const criticalErrors = [
        ...errorLog.filter(e => 
          e.message.includes('CRITICAL') || 
          e.message.includes('FATAL') ||
          e.message.includes('uncaught') ||
          e.message.includes('unhandled')
        ),
        ...unhandledErrors
      ];

      console.log('\n📋 Resumen Final de Errores:');
      console.log(`Total de logs de error: ${errorLog.length}`);
      console.log(`Errores no manejados: ${unhandledErrors.length}`);
      console.log(`Errores críticos: ${criticalErrors.length}`);

      if (criticalErrors.length > 0) {
        console.log('\n❌ Errores críticos encontrados:');
        criticalErrors.forEach((err, index) => {
          console.log(`\n${index + 1}. ${err.type || 'console.error'}`);
          console.log(`   Mensaje: ${err.message || err.reason}`);
          console.log(`   Tiempo: ${err.timestamp}`);
        });
      }

      // MÉTRICA FINAL: 0 errores críticos
      expect(criticalErrors).toHaveLength(0);
    });
  });
});