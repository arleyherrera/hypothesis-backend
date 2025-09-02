// tests/validation/analyzeSpecificHypothesis.js
const path = require('path');
const { Hypothesis, Artifact, User } = require('../../models'); // Ruta corregida
const vectorContextService = require('../../services/vectorContextService'); // Ruta corregida
const { Op } = require('sequelize');

class SpecificHypothesisAnalyzer {
  constructor(hypothesisId) {
    this.hypothesisId = hypothesisId;
    this.results = {
      hypothesis: null,
      artifacts: [],
      coherenceAnalysis: {},
      artifactsByPhase: {},
      totalArtifacts: 0,
      coherenceScores: []
    };
  }

  /**
   * Ejecuta análisis completo de la hipótesis específica
   */
  async analyze() {
    console.log(`\n🔍 Analizando Hipótesis ID: ${this.hypothesisId}\n`);
    console.log('='.repeat(80));

    try {
      // 1. Obtener la hipótesis
      await this.getHypothesis();
      
      if (!this.results.hypothesis) {
        console.error(`❌ No se encontró la hipótesis con ID: ${this.hypothesisId}`);
        return null;
      }

      // 2. Obtener artefactos
      await this.getArtifacts();

      // 3. Analizar coherencia
      await this.analyzeCoherence();

      // 4. Generar reporte
      this.generateReport();

      // 5. Guardar reporte
      await this.saveReport();

      return this.results;

    } catch (error) {
      console.error('❌ Error durante el análisis:', error);
      throw error;
    }
  }

  /**
   * Obtiene la hipótesis específica
   */
  async getHypothesis() {
    try {
      this.results.hypothesis = await Hypothesis.findOne({
        where: { id: this.hypothesisId },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }]
      });

      if (this.results.hypothesis) {
        console.log('✅ Hipótesis encontrada:');
        console.log(`   Nombre: ${this.results.hypothesis.name}`);
        console.log(`   Usuario: ${this.results.hypothesis.user.name} (${this.results.hypothesis.user.email})`);
        console.log(`   Creada: ${this.results.hypothesis.createdAt}`);
        console.log('\n📋 Detalles:');
        console.log(`   Problema: ${this.results.hypothesis.problem}`);
        console.log(`   Solución: ${this.results.hypothesis.solution}`);
        console.log(`   Segmento: ${this.results.hypothesis.customerSegment}`);
        console.log(`   Propuesta de valor: ${this.results.hypothesis.valueProposition}`);
      }
    } catch (error) {
      console.error('Error obteniendo hipótesis:', error);
    }
  }

  /**
   * Obtiene todos los artefactos de la hipótesis
   */
  async getArtifacts() {
    try {
      this.results.artifacts = await Artifact.findAll({
        where: { hypothesisId: this.hypothesisId },
        order: [['phase', 'ASC'], ['createdAt', 'ASC']]
      });

      this.results.totalArtifacts = this.results.artifacts.length;
      
      console.log(`\n📦 Artefactos encontrados: ${this.results.totalArtifacts}`);

      // Agrupar por fase
      const phases = ['construir', 'medir', 'aprender', 'pivotar', 'iterar'];
      phases.forEach(phase => {
        this.results.artifactsByPhase[phase] = this.results.artifacts.filter(a => a.phase === phase);
        console.log(`   ${phase}: ${this.results.artifactsByPhase[phase].length} artefactos`);
      });

      // Mostrar lista de artefactos
      console.log('\n📑 Lista de artefactos:');
      this.results.artifacts.forEach((artifact, index) => {
        console.log(`   ${index + 1}. [${artifact.phase}] ${artifact.name}`);
        console.log(`      Creado: ${artifact.createdAt}`);
        console.log(`      Tamaño: ${artifact.content.length} caracteres`);
      });
    } catch (error) {
      console.error('Error obteniendo artefactos:', error);
    }
  }

  /**
   * Analiza la coherencia de los artefactos
   */
  async analyzeCoherence() {
    console.log('\n🔍 Analizando coherencia...\n');

    try {
      // Obtener estadísticas de contexto vectorial
      const contextStats = await vectorContextService.getContextStats(this.hypothesisId);
      
      if (contextStats) {
        this.results.coherenceAnalysis = {
          globalScore: contextStats.globalCoherence?.score || 0,
          phaseCoherence: contextStats.phaseCoherence || {},
          recommendation: contextStats.globalCoherence?.recommendation || 'No disponible'
        };

        console.log('📊 Coherencia Global:');
        console.log(`   Score: ${(this.results.coherenceAnalysis.globalScore * 100).toFixed(2)}%`);
        console.log(`   Recomendación: ${this.results.coherenceAnalysis.recommendation}`);

        console.log('\n📊 Coherencia por Fase:');
        Object.entries(this.results.coherenceAnalysis.phaseCoherence).forEach(([phase, score]) => {
          console.log(`   ${phase}: ${(score * 100).toFixed(2)}%`);
        });
      }

      // Análisis detallado de cada artefacto
      console.log('\n📋 Análisis detallado de artefactos:');
      
      for (const artifact of this.results.artifacts) {
        const coherenceScore = await this.calculateArtifactCoherence(artifact);
        this.results.coherenceScores.push({
          artifactId: artifact.id,
          artifactName: artifact.name,
          phase: artifact.phase,
          coherenceScore: coherenceScore,
          analysis: this.analyzeArtifactContent(artifact)
        });

        console.log(`\n   ${artifact.name} (${artifact.phase}):`);
        console.log(`   - Coherencia: ${(coherenceScore * 100).toFixed(2)}%`);
        console.log(`   - Menciona problema: ${artifact.content.toLowerCase().includes(this.results.hypothesis.problem.toLowerCase().substring(0, 30)) ? 'Sí' : 'No'}`);
        console.log(`   - Menciona solución: ${artifact.content.toLowerCase().includes(this.results.hypothesis.solution.toLowerCase().substring(0, 30)) ? 'Sí' : 'No'}`);
        console.log(`   - Longitud: ${artifact.content.length} caracteres`);
      }

      // Calcular coherencia promedio
      if (this.results.coherenceScores.length > 0) {
        const avgCoherence = this.results.coherenceScores.reduce((sum, score) => sum + score.coherenceScore, 0) / this.results.coherenceScores.length;
        console.log(`\n🎯 Coherencia promedio total: ${(avgCoherence * 100).toFixed(2)}%`);
        console.log(`📈 Estado: ${avgCoherence >= 0.9 ? '✅ CUMPLE (≥90%)' : '❌ NO CUMPLE (<90%)'}`);
      }

    } catch (error) {
      console.error('Error analizando coherencia:', error);
    }
  }

  /**
   * Calcula la coherencia de un artefacto específico
   */
  async calculateArtifactCoherence(artifact) {
    const hypothesis = this.results.hypothesis;
    
    // Análisis simple de coherencia basado en contenido
    let score = 0;
    const weights = {
      mentionsProblem: 0.3,
      mentionsSolution: 0.2,
      mentionsSegment: 0.15,
      mentionsValue: 0.15,
      hasStructure: 0.1,
      adequateLength: 0.1
    };

    const content = artifact.content.toLowerCase();
    const problem = hypothesis.problem.toLowerCase();
    const solution = hypothesis.solution.toLowerCase();
    const segment = hypothesis.customerSegment.toLowerCase();
    const value = hypothesis.valueProposition.toLowerCase();

    // Verificar menciones
    if (content.includes(problem.substring(0, 30))) score += weights.mentionsProblem;
    if (content.includes(solution.substring(0, 20))) score += weights.mentionsSolution;
    if (content.includes(segment.substring(0, 20))) score += weights.mentionsSegment;
    if (content.includes(value.substring(0, 20))) score += weights.mentionsValue;

    // Verificar estructura
    if (artifact.content.includes('#') || artifact.content.includes('##')) {
      score += weights.hasStructure;
    }

    // Verificar longitud adecuada
    if (artifact.content.length >= 500) {
      score += weights.adequateLength;
    }

    return score;
  }

  /**
   * Analiza el contenido del artefacto
   */
  analyzeArtifactContent(artifact) {
    const content = artifact.content.toLowerCase();
    const hypothesis = this.results.hypothesis;

    return {
      wordCount: artifact.content.split(/\s+/).length,
      hasMarkdownStructure: artifact.content.includes('#'),
      mentionsProblem: content.includes(hypothesis.problem.toLowerCase().substring(0, 30)),
      mentionsSolution: content.includes(hypothesis.solution.toLowerCase().substring(0, 20)),
      mentionsCustomerSegment: content.includes(hypothesis.customerSegment.toLowerCase().substring(0, 20)),
      mentionsValueProposition: content.includes(hypothesis.valueProposition.toLowerCase().substring(0, 20)),
      isAIGenerated: artifact.name.includes('(IA)') || artifact.name.includes('(Mejorado)'),
      isTemplate: artifact.name.includes('(Plantilla)')
    };
  }

  /**
   * Genera el reporte en consola
   */
  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 RESUMEN DEL ANÁLISIS');
    console.log('='.repeat(80));

    console.log('\n🎯 Hipótesis:', this.results.hypothesis.name);
    console.log('👤 Usuario:', this.results.hypothesis.user.name);
    console.log('📅 Creada:', new Date(this.results.hypothesis.createdAt).toLocaleDateString('es-ES'));
    
    console.log('\n📦 Artefactos:');
    console.log(`   Total: ${this.results.totalArtifacts}`);
    Object.entries(this.results.artifactsByPhase).forEach(([phase, artifacts]) => {
      console.log(`   ${phase}: ${artifacts.length}`);
    });

    if (this.results.coherenceScores.length > 0) {
      const avgCoherence = this.results.coherenceScores.reduce((sum, score) => sum + score.coherenceScore, 0) / this.results.coherenceScores.length;
      console.log('\n🔍 Coherencia:');
      console.log(`   Promedio general: ${(avgCoherence * 100).toFixed(2)}%`);
      console.log(`   Coherencia global: ${(this.results.coherenceAnalysis.globalScore * 100).toFixed(2)}%`);
      
      // Artefactos con mejor y peor coherencia
      const sortedByCoherence = [...this.results.coherenceScores].sort((a, b) => b.coherenceScore - a.coherenceScore);
      console.log('\n📈 Top 3 artefactos más coherentes:');
      sortedByCoherence.slice(0, 3).forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.artifactName}: ${(item.coherenceScore * 100).toFixed(2)}%`);
      });

      console.log('\n📉 Top 3 artefactos menos coherentes:');
      sortedByCoherence.slice(-3).reverse().forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.artifactName}: ${(item.coherenceScore * 100).toFixed(2)}%`);
      });
    }

    // Estadísticas de generación
    const aiGenerated = this.results.artifacts.filter(a => a.name.includes('(IA)') || a.name.includes('(Mejorado)')).length;
    const templateGenerated = this.results.artifacts.filter(a => a.name.includes('(Plantilla)')).length;
    
    console.log('\n🤖 Método de generación:');
    console.log(`   Generados con IA: ${aiGenerated}`);
    console.log(`   Generados con plantilla: ${templateGenerated}`);
    console.log(`   Otros: ${this.results.totalArtifacts - aiGenerated - templateGenerated}`);
  }

  /**
   * Guarda el reporte en archivo
   */
  async saveReport() {
    const fs = require('fs').promises;
    
    const report = {
      timestamp: new Date().toISOString(),
      hypothesisId: this.hypothesisId,
      hypothesis: {
        id: this.results.hypothesis.id,
        name: this.results.hypothesis.name,
        problem: this.results.hypothesis.problem,
        solution: this.results.hypothesis.solution,
        customerSegment: this.results.hypothesis.customerSegment,
        valueProposition: this.results.hypothesis.valueProposition,
        userId: this.results.hypothesis.userId,
        userName: this.results.hypothesis.user.name,
        userEmail: this.results.hypothesis.user.email,
        createdAt: this.results.hypothesis.createdAt
      },
      artifacts: {
        total: this.results.totalArtifacts,
        byPhase: Object.entries(this.results.artifactsByPhase).map(([phase, artifacts]) => ({
          phase,
          count: artifacts.length,
          artifacts: artifacts.map(a => ({
            id: a.id,
            name: a.name,
            contentLength: a.content.length,
            createdAt: a.createdAt
          }))
        }))
      },
      coherenceAnalysis: {
        ...this.results.coherenceAnalysis,
        averageScore: this.results.coherenceScores.length > 0 
          ? this.results.coherenceScores.reduce((sum, score) => sum + score.coherenceScore, 0) / this.results.coherenceScores.length
          : 0,
        detailedScores: this.results.coherenceScores
      }
    };

    const reportPath = path.join(__dirname, `hypothesis-${this.hypothesisId}-analysis-${Date.now()}.json`);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📄 Reporte guardado en: ${reportPath}`);

    // Generar reporte HTML también
    await this.generateHTMLReport(report);
  }

  /**
   * Genera reporte HTML
   */
  async generateHTMLReport(report) {
    const fs = require('fs').promises;

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Análisis Hipótesis ${this.hypothesisId} - ${report.hypothesis.name}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 40px;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        h1, h2 {
            color: #333;
        }
        h1 {
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }
        .info-box {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 5px solid #3498db;
        }
        .metric {
            display: inline-block;
            margin: 10px 20px;
            padding: 10px;
            background: #ecf0f1;
            border-radius: 5px;
        }
        .success {
            color: #27ae60;
            font-weight: bold;
        }
        .warning {
            color: #f39c12;
            font-weight: bold;
        }
        .danger {
            color: #e74c3c;
            font-weight: bold;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #3498db;
            color: white;
        }
        .phase-section {
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .artifact-item {
            padding: 10px;
            margin: 5px 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .coherence-bar {
            width: 100%;
            height: 20px;
            background: #ecf0f1;
            border-radius: 10px;
            overflow: hidden;
            margin: 5px 0;
        }
        .coherence-fill {
            height: 100%;
            background: #3498db;
            text-align: center;
            color: white;
            line-height: 20px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Análisis de Hipótesis #${this.hypothesisId}</h1>
        <h2>${report.hypothesis.name}</h2>
        <p><strong>Fecha de análisis:</strong> ${new Date(report.timestamp).toLocaleString('es-ES')}</p>
        
        <div class="info-box">
            <h3>Información de la Hipótesis</h3>
            <p><strong>Usuario:</strong> ${report.hypothesis.userName} (${report.hypothesis.userEmail})</p>
            <p><strong>Creada:</strong> ${new Date(report.hypothesis.createdAt).toLocaleDateString('es-ES')}</p>
            <p><strong>Problema:</strong> ${report.hypothesis.problem}</p>
            <p><strong>Solución:</strong> ${report.hypothesis.solution}</p>
            <p><strong>Segmento:</strong> ${report.hypothesis.customerSegment}</p>
            <p><strong>Propuesta de valor:</strong> ${report.hypothesis.valueProposition}</p>
        </div>

        <h2>Resumen de Coherencia</h2>
        <div class="metric">
            <strong>Coherencia Promedio:</strong> 
            <span class="${report.coherenceAnalysis.averageScore >= 0.9 ? 'success' : report.coherenceAnalysis.averageScore >= 0.7 ? 'warning' : 'danger'}">
                ${(report.coherenceAnalysis.averageScore * 100).toFixed(2)}%
            </span>
        </div>
        <div class="metric">
            <strong>Coherencia Global:</strong> 
            <span class="${report.coherenceAnalysis.globalScore >= 0.9 ? 'success' : report.coherenceAnalysis.globalScore >= 0.7 ? 'warning' : 'danger'}">
                ${(report.coherenceAnalysis.globalScore * 100).toFixed(2)}%
            </span>
        </div>
        <div class="metric">
            <strong>Estado:</strong> 
            <span class="${report.coherenceAnalysis.averageScore >= 0.9 ? 'success' : 'danger'}">
                ${report.coherenceAnalysis.averageScore >= 0.9 ? '✅ CUMPLE' : '❌ NO CUMPLE'}
            </span>
        </div>

        <h2>Artefactos por Fase</h2>
        ${report.artifacts.byPhase.map(phase => `
            <div class="phase-section">
                <h3>${phase.phase.charAt(0).toUpperCase() + phase.phase.slice(1)} (${phase.count} artefactos)</h3>
                ${phase.artifacts.map(artifact => `
                    <div class="artifact-item">
                        <strong>${artifact.name}</strong>
                        <br>
                        <small>ID: ${artifact.id} | Tamaño: ${artifact.contentLength} caracteres | Creado: ${new Date(artifact.createdAt).toLocaleDateString('es-ES')}</small>
                        ${this.getCoherenceBar(artifact.id, report.coherenceAnalysis.detailedScores)}
                    </div>
                `).join('')}
            </div>
        `).join('')}

        <h2>Análisis Detallado de Coherencia</h2>
        <table>
            <tr>
                <th>Artefacto</th>
                <th>Fase</th>
                <th>Coherencia</th>
                <th>Menciona Problema</th>
                <th>Menciona Solución</th>
                <th>Método</th>
            </tr>
            ${report.coherenceAnalysis.detailedScores.map(score => `
                <tr>
                    <td>${score.artifactName}</td>
                    <td>${score.phase}</td>
                    <td class="${score.coherenceScore >= 0.9 ? 'success' : score.coherenceScore >= 0.7 ? 'warning' : 'danger'}">
                        ${(score.coherenceScore * 100).toFixed(2)}%
                    </td>
                    <td>${score.analysis.mentionsProblem ? '✅' : '❌'}</td>
                    <td>${score.analysis.mentionsSolution ? '✅' : '❌'}</td>
                    <td>${score.analysis.isAIGenerated ? '🤖 IA' : score.analysis.isTemplate ? '📄 Plantilla' : '✏️ Manual'}</td>
                </tr>
            `).join('')}
        </table>

        <h2>Recomendaciones</h2>
        <div class="info-box">
            <p>${report.coherenceAnalysis.recommendation}</p>
            ${report.coherenceAnalysis.averageScore < 0.9 ? `
                <ul>
                    <li>Revise los artefactos con baja coherencia y considere regenerarlos</li>
                    <li>Asegúrese de que cada artefacto mencione explícitamente el problema</li>
                    <li>Verifique que las soluciones propuestas estén alineadas con la hipótesis</li>
                    <li>Considere usar la función de mejora con IA para los artefactos con menor puntuación</li>
                </ul>
            ` : `
                <p class="success">✅ La hipótesis cumple con los estándares de coherencia establecidos.</p>
            `}
        </div>
    </div>
</body>
</html>`;

    const htmlPath = path.join(__dirname, `hypothesis-${this.hypothesisId}-analysis-${Date.now()}.html`);
    await fs.writeFile(htmlPath, html);
    console.log(`📄 Reporte HTML guardado en: ${htmlPath}`);
  }

  getCoherenceBar(artifactId, scores) {
    const score = scores.find(s => s.artifactId === artifactId);
    if (!score) return '';
    
    const percentage = (score.coherenceScore * 100).toFixed(2);
    const color = score.coherenceScore >= 0.9 ? '#27ae60' : score.coherenceScore >= 0.7 ? '#f39c12' : '#e74c3c';
    
    return `
        <div class="coherence-bar">
            <div class="coherence-fill" style="width: ${percentage}%; background-color: ${color};">
                ${percentage}%
            </div>
        </div>
    `;
  }
}

// Función principal para ejecutar el análisis
async function analyzeHypothesis(hypothesisId) {
  const analyzer = new SpecificHypothesisAnalyzer(hypothesisId);
  
  try {
    const results = await analyzer.analyze();
    return results;
  } catch (error) {
    console.error('Error en análisis:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const hypothesisId = process.argv[2] || 119; // Por defecto usa 119
  
  console.log(`
╔══════════════════════════════════════════════════════════════════╗
║              ANÁLISIS DE HIPÓTESIS ESPECÍFICA                    ║
║                   Lean Startup Assistant                         ║
╚══════════════════════════════════════════════════════════════════╝
`);
  
  analyzeHypothesis(hypothesisId);
}

module.exports = { SpecificHypothesisAnalyzer, analyzeHypothesis };