// tests/metrics/objetivo1-semantic-evaluation.test.js

const VectorContextService = require('../../services/vectorContextService');
const { Hypothesis, Artifact } = require('../../models');
const fs = require('fs');
const path = require('path');

describe('OBJETIVO 1 - MÉTRICAS: Sistema de Evaluación Semántica', () => {
  let errorLogPath = path.join(__dirname, '../../logs/semantic-errors.log');
  let criticalErrors = [];
  
  // Interceptar TODOS los errores del sistema
  beforeAll(() => {
    // Crear directorio de logs si no existe
    const logDir = path.dirname(errorLogPath);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    // Interceptar console.error
    const originalError = console.error;
    console.error = (...args) => {
      const errorMsg = args.join(' ');
      criticalErrors.push(errorMsg);
      fs.appendFileSync(errorLogPath, `${new Date().toISOString()} - ERROR: ${errorMsg}\n`);
      originalError.apply(console, args);
    };
    
    // Interceptar errores no capturados
    process.on('uncaughtException', (error) => {
      criticalErrors.push(`CRITICAL: ${error.message}`);
      fs.appendFileSync(errorLogPath, `${new Date().toISOString()} - CRITICAL: ${error.message}\n${error.stack}\n`);
    });
    
    process.on('unhandledRejection', (reason, promise) => {
      criticalErrors.push(`CRITICAL PROMISE: ${reason}`);
      fs.appendFileSync(errorLogPath, `${new Date().toISOString()} - CRITICAL PROMISE: ${reason}\n`);
    });
  });

  afterAll(() => {
    // Generar reporte de errores
    const report = {
      timestamp: new Date().toISOString(),
      totalErrors: criticalErrors.length,
      criticalErrors: criticalErrors.filter(e => e.includes('CRITICAL')),
      semanticErrors: criticalErrors.filter(e => e.includes('semantic') || e.includes('vector'))
    };
    
    fs.writeFileSync(
      path.join(__dirname, '../../logs/semantic-evaluation-report.json'),
      JSON.stringify(report, null, 2)
    );
  });

  describe('MÉTRICA 1: 0 errores críticos en logs del sistema', () => {
    test('No debe haber errores críticos durante evaluación semántica', async () => {
      criticalErrors = []; // Reset para esta prueba
      
      const vectorService = new VectorContextService();
      
      // Crear datos de prueba complejos
      const hypothesis = await Hypothesis.create({
        problem: 'Los emprendedores pierden mucho tiempo validando ideas que no funcionan eficientemente',
        name: 'Sistema de Validación Rápida',
        solution: 'Plataforma automatizada con IA para validación en 48 horas',
        customerSegment: 'Emprendedores tecnológicos con presupuesto limitado',
        valueProposition: 'Reduce el tiempo de validación de 3 meses a 2 días',
        userId: 1
      });

      // Probar todas las operaciones del sistema semántico
      const operations = [
        // 1. Almacenamiento de contexto
        async () => {
          const artifact = await Artifact.create({
            hypothesisId: hypothesis.id,
            name: 'MVP Detallado',
            phase: 'construir',
            description: 'Plan completo del MVP',
            content: 'Contenido extenso sobre el MVP con validación rápida usando IA y automatización'
          });
          await vectorService.storeArtifactContext(artifact);
        },
        
        // 2. Recuperación de contexto
        async () => {
          await vectorService.getRelevantContext(hypothesis.id, 'medir', 'KPIs');
        },
        
        // 3. Análisis de coherencia
        async () => {
          await vectorService.getContextStats(hypothesis.id);
        },
        
        // 4. Actualización de contexto
        async () => {
          const artifact = await Artifact.findOne({ where: { hypothesisId: hypothesis.id } });
          artifact.content = 'Contenido actualizado con nuevas métricas de validación';
          await artifact.save();
          await vectorService.updateArtifactContext(artifact);
        }
      ];

      // Ejecutar todas las operaciones
      for (const operation of operations) {
        await operation();
      }

      // VALIDACIÓN DE MÉTRICA
      const semanticCriticalErrors = criticalErrors.filter(error => 
        error.includes('CRITICAL') || 
        error.includes('Error al') ||
        error.includes('Failed to') ||
        error.includes('Exception')
      );

      expect(semanticCriticalErrors).toHaveLength(0);
      
      if (semanticCriticalErrors.length > 0) {
        console.log('❌ Errores críticos encontrados:', semanticCriticalErrors);
      }
    });

    test('Sistema debe manejar casos extremos sin errores críticos', async () => {
      criticalErrors = [];
      
      const vectorService = new VectorContextService();
      
      // Casos extremos
      const edgeCases = [
        // Texto muy largo
        async () => {
          const longContent = 'a'.repeat(10000);
          await vectorService.generateEmbedding(longContent);
        },
        
        // Texto con caracteres especiales
        async () => {
          const specialContent = '🚀 Ñoño 你好 مرحبا @#$%^&*()';
          await vectorService.generateEmbedding(specialContent);
        },
        
        // Hipótesis inexistente
        async () => {
          const result = await vectorService.getContextStats(99999);
          expect(result).toBeNull(); // Debe retornar null, no error
        }
      ];

      for (const testCase of edgeCases) {
        await testCase();
      }

      // Verificar que no hay errores críticos
      expect(criticalErrors.filter(e => e.includes('CRITICAL'))).toHaveLength(0);
    });
  });

  describe('MÉTRICA 2: Todas las pruebas de integración ejecutadas exitosamente', () => {
    test('Integración completa: Hipótesis → Artefactos → Vectores → Coherencia', async () => {
      const testResults = {
        storeContext: false,
        retrieveContext: false,
        calculateCoherence: false,
        updateContext: false,
        deleteContext: false
      };

      try {
        // 1. Crear hipótesis completa
        const hypothesis = await Hypothesis.create({
          problem: 'Problema complejo que requiere validación semántica profunda',
          name: 'Test Integración Completa',
          solution: 'Solución innovadora con múltiples componentes',
          customerSegment: 'Segmento específico de prueba',
          valueProposition: 'Propuesta de valor única y medible',
          userId: 1
        });

        // 2. Crear artefactos de múltiples fases
        const phases = ['construir', 'medir', 'aprender'];
        const artifacts = [];

        for (const phase of phases) {
          const artifact = await Artifact.create({
            hypothesisId: hypothesis.id,
            name: `Artefacto ${phase}`,
            phase: phase,
            description: `Descripción para ${phase}`,
            content: `Contenido detallado sobre ${phase} con coherencia semántica`
          });
          
          // Almacenar contexto
          const stored = await vectorService.storeArtifactContext(artifact);
          testResults.storeContext = stored;
          artifacts.push(artifact);
        }

        // 3. Recuperar contexto relevante
        const context = await vectorService.getRelevantContext(
          hypothesis.id, 
          'pivotar', 
          'Estrategia de Pivote'
        );
        testResults.retrieveContext = context !== null;

        // 4. Calcular coherencia
        const stats = await vectorService.getContextStats(hypothesis.id);
        testResults.calculateCoherence = stats !== null && stats.globalCoherence.score > 0;

        // 5. Actualizar contexto
        artifacts[0].content = 'Contenido actualizado para mejorar coherencia';
        await artifacts[0].save();
        const updated = await vectorService.updateArtifactContext(artifacts[0]);
        testResults.updateContext = updated;

        // 6. Eliminar contexto
        const deleted = await vectorService.deleteArtifactContext(artifacts[0].id);
        testResults.deleteContext = deleted;

        // VALIDACIÓN: Todas las operaciones deben ser exitosas
        Object.entries(testResults).forEach(([operation, success]) => {
          expect(success).toBe(true);
        });

      } catch (error) {
        fail(`Error en integración: ${error.message}`);
      }
    });

    test('Coherencia multi-fase debe funcionar correctamente', async () => {
      // Crear hipótesis con artefactos en todas las fases
      const hypothesis = await Hypothesis.create({
        problem: 'Problema que requiere análisis multi-fase',
        name: 'Test Multi-fase',
        solution: 'Solución iterativa',
        customerSegment: 'Múltiples segmentos',
        valueProposition: 'Valor evolutivo',
        userId: 1
      });

      const allPhases = ['construir', 'medir', 'aprender', 'pivotar', 'iterar'];
      
      // Crear 2 artefactos por fase
      for (const phase of allPhases) {
        for (let i = 1; i <= 2; i++) {
          const artifact = await Artifact.create({
            hypothesisId: hypothesis.id,
            name: `${phase} - Artefacto ${i}`,
            phase: phase,
            description: `Descripción ${i}`,
            content: `Contenido coherente para ${phase} número ${i}`
          });
          
          await vectorService.storeArtifactContext(artifact);
        }
      }

      // Obtener estadísticas
      const stats = await vectorService.getContextStats(hypothesis.id);

      // Validaciones de integración
      expect(stats.totalContexts).toBe(10); // 2 por cada una de las 5 fases
      expect(stats.completedPhases).toBe(5);
      expect(Object.keys(stats.phaseCoherence)).toHaveLength(5);
      expect(stats.globalCoherence.score).toBeGreaterThan(0);
      expect(stats.globalCoherence.transitions).toBeDefined();
    });
  });
});