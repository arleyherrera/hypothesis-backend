// tests/validation/coherenceValidation.js
const { Hypothesis, Artifact, ArtifactContext } = require('../../models');
const vectorContextService = require('../../services/vectorContextService');
const { ChromaClient } = require('chromadb');

class CoherenceValidator {
  constructor() {
    this.results = {
      totalArtifacts: 0,
      coherentArtifacts: 0,
      incoherentArtifacts: 0,
      detailedResults: []
    };
  }

  /**
   * Valida la coherencia de todos los artefactos en el sistema
   */
  async validateAllArtifacts() {
    console.log('🔍 Iniciando validación de coherencia semántica...\n');
    
    try {
      // Obtener todas las hipótesis con sus artefactos
      const hypotheses = await Hypothesis.findAll({
        include: [{
          model: Artifact,
          as: 'artifacts'
        }]
      });

      for (const hypothesis of hypotheses) {
        await this.validateHypothesisArtifacts(hypothesis);
      }

      this.printResults();
      return this.calculateMetrics();

    } catch (error) {
      console.error('Error en validación:', error);
      throw error;
    }
  }

  /**
   * Valida los artefactos de una hipótesis específica
   */
  async validateHypothesisArtifacts(hypothesis) {
    console.log(`\n📋 Validando hipótesis: ${hypothesis.name}`);
    console.log(`   ID: ${hypothesis.id}`);
    console.log(`   Artefactos: ${hypothesis.artifacts.length}`);

    for (const artifact of hypothesis.artifacts) {
      const coherenceScore = await this.calculateArtifactCoherence(artifact, hypothesis);
      
      this.results.totalArtifacts++;
      
      const isCoherent = coherenceScore >= 0.7; // 70% threshold
      if (isCoherent) {
        this.results.coherentArtifacts++;
      } else {
        this.results.incoherentArtifacts++;
      }

      this.results.detailedResults.push({
        hypothesisId: hypothesis.id,
        hypothesisName: hypothesis.name,
        artifactId: artifact.id,
        artifactName: artifact.name,
        phase: artifact.phase,
        coherenceScore: coherenceScore,
        isCoherent: isCoherent,
        details: await this.getCoherenceDetails(artifact, hypothesis)
      });

      console.log(`   ✓ ${artifact.name}: ${(coherenceScore * 100).toFixed(2)}% coherencia`);
    }
  }

  /**
   * Calcula el score de coherencia de un artefacto
   */
  async calculateArtifactCoherence(artifact, hypothesis) {
    const scores = {
      problemAlignment: 0,
      solutionAlignment: 0,
      contentRelevance: 0,
      phaseCoherence: 0,
      keywordMatch: 0
    };

    // 1. Alineación con el problema (30%)
    scores.problemAlignment = this.calculateTextAlignment(
      artifact.content.toLowerCase(),
      hypothesis.problem.toLowerCase()
    );

    // 2. Alineación con la solución (20%)
    scores.solutionAlignment = this.calculateTextAlignment(
      artifact.content.toLowerCase(),
      hypothesis.solution.toLowerCase()
    );

    // 3. Relevancia del contenido (20%)
    scores.contentRelevance = await this.calculateContentRelevance(artifact, hypothesis);

    // 4. Coherencia de fase (20%)
    scores.phaseCoherence = await this.calculatePhaseCoherence(artifact, hypothesis.id);

    // 5. Coincidencia de palabras clave (10%)
    scores.keywordMatch = this.calculateKeywordMatch(artifact, hypothesis);

    // Calcular score ponderado
    const weightedScore = 
      (scores.problemAlignment * 0.3) +
      (scores.solutionAlignment * 0.2) +
      (scores.contentRelevance * 0.2) +
      (scores.phaseCoherence * 0.2) +
      (scores.keywordMatch * 0.1);

    return weightedScore;
  }

  /**
   * Calcula la alineación entre dos textos
   */
  calculateTextAlignment(text1, text2) {
    const words1 = this.extractKeywords(text1);
    const words2 = this.extractKeywords(text2);
    
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    
    return union.length > 0 ? intersection.length / union.length : 0;
  }

  /**
   * Extrae palabras clave relevantes
   */
  extractKeywords(text) {
    const stopWords = new Set(['el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se']);
    return text
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.has(word))
      .slice(0, 20);
  }

  /**
   * Calcula la relevancia del contenido usando vectores
   */
  async calculateContentRelevance(artifact, hypothesis) {
    try {
      const stats = await vectorContextService.getContextStats(hypothesis.id);
      if (stats && stats.phaseCoherence && stats.phaseCoherence[artifact.phase]) {
        return stats.phaseCoherence[artifact.phase];
      }
    } catch (error) {
      console.error('Error calculando relevancia:', error);
    }
    return 0.5; // Default medio si no hay datos
  }

  /**
   * Calcula coherencia dentro de la fase
   */
  async calculatePhaseCoherence(artifact, hypothesisId) {
    try {
      const phaseArtifacts = await Artifact.findAll({
        where: { 
          hypothesisId: hypothesisId,
          phase: artifact.phase
        }
      });

      if (phaseArtifacts.length <= 1) return 1; // Si es el único, es coherente

      // Aquí podrías usar el vectorContextService para comparar embeddings
      return 0.8; // Valor por defecto alto
    } catch (error) {
      return 0.5;
    }
  }

  /**
   * Calcula coincidencia de palabras clave
   */
  calculateKeywordMatch(artifact, hypothesis) {
    const hypothesisKeywords = [
      ...this.extractKeywords(hypothesis.problem),
      ...this.extractKeywords(hypothesis.solution),
      ...this.extractKeywords(hypothesis.customerSegment),
      ...this.extractKeywords(hypothesis.valueProposition)
    ];

    const artifactKeywords = this.extractKeywords(artifact.content);
    
    const matches = artifactKeywords.filter(keyword => 
      hypothesisKeywords.some(hk => hk.includes(keyword) || keyword.includes(hk))
    );

    return artifactKeywords.length > 0 ? matches.length / artifactKeywords.length : 0;
  }

  /**
   * Obtiene detalles de coherencia
   */
  async getCoherenceDetails(artifact, hypothesis) {
    return {
      mentionsProblem: artifact.content.toLowerCase().includes(hypothesis.problem.toLowerCase().substring(0, 20)),
      mentionsSolution: artifact.content.toLowerCase().includes(hypothesis.solution.toLowerCase().substring(0, 20)),
      wordCount: artifact.content.split(/\s+/).length,
      hasStructure: artifact.content.includes('#') || artifact.content.includes('##'),
      phaseAppropriate: this.isPhaseAppropriate(artifact)
    };
  }

  /**
   * Verifica si el contenido es apropiado para la fase
   */
  isPhaseAppropriate(artifact) {
    const phaseKeywords = {
      construir: ['mvp', 'producto', 'desarrollo', 'características', 'funcionalidades'],
      medir: ['métricas', 'kpi', 'indicadores', 'datos', 'análisis'],
      aprender: ['aprendizaje', 'insights', 'conclusiones', 'validación', 'hipótesis'],
      pivotar: ['cambio', 'nueva dirección', 'pivote', 'alternativa', 'ajuste'],
      iterar: ['mejora', 'optimización', 'iteración', 'refinamiento', 'evolución']
    };

    const keywords = phaseKeywords[artifact.phase] || [];
    const content = artifact.content.toLowerCase();
    
    return keywords.some(keyword => content.includes(keyword));
  }

  /**
   * Imprime los resultados
   */
  printResults() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 RESULTADOS DE VALIDACIÓN DE COHERENCIA');
    console.log('='.repeat(80));
    
    console.log(`\nTotal de artefactos analizados: ${this.results.totalArtifacts}`);
    console.log(`Artefactos coherentes: ${this.results.coherentArtifacts} ✅`);
    console.log(`Artefactos incoherentes: ${this.results.incoherentArtifacts} ❌`);
    
    const percentage = this.results.totalArtifacts > 0 
      ? (this.results.coherentArtifacts / this.results.totalArtifacts * 100).toFixed(2)
      : 0;
    
    console.log(`\n🎯 Porcentaje de coherencia: ${percentage}%`);
    console.log(`📈 Métrica objetivo: ≥ 90%`);
    console.log(`✅ Estado: ${percentage >= 90 ? 'CUMPLIDO' : 'NO CUMPLIDO'}`);
    
    // Mostrar artefactos con baja coherencia
    const lowCoherence = this.results.detailedResults
      .filter(r => r.coherenceScore < 0.7)
      .sort((a, b) => a.coherenceScore - b.coherenceScore);
    
    if (lowCoherence.length > 0) {
      console.log('\n⚠️  Artefactos con baja coherencia:');
      lowCoherence.slice(0, 5).forEach(result => {
        console.log(`   - ${result.artifactName} (${result.phase}): ${(result.coherenceScore * 100).toFixed(2)}%`);
        console.log(`     Hipótesis: ${result.hypothesisName}`);
      });
    }
  }

  /**
   * Calcula las métricas finales
   */
  calculateMetrics() {
    const percentage = this.results.totalArtifacts > 0 
      ? (this.results.coherentArtifacts / this.results.totalArtifacts * 100)
      : 0;

    return {
      totalArtifacts: this.results.totalArtifacts,
      coherentArtifacts: this.results.coherentArtifacts,
      incoherentArtifacts: this.results.incoherentArtifacts,
      coherencePercentage: percentage,
      meetsObjective: percentage >= 90,
      detailedResults: this.results.detailedResults
    };
  }

  /**
   * Genera reporte detallado
   */
  async generateDetailedReport() {
    const fs = require('fs').promises;
    const path = require('path');
    
    const report = {
      generatedAt: new Date().toISOString(),
      summary: this.calculateMetrics(),
      byPhase: this.groupResultsByPhase(),
      byHypothesis: this.groupResultsByHypothesis(),
      recommendations: this.generateRecommendations()
    };

    const reportPath = path.join(__dirname, `coherence-report-${Date.now()}.json`);
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
    
    console.log(`\n📄 Reporte detallado guardado en: ${reportPath}`);
    return reportPath;
  }

  groupResultsByPhase() {
    const phases = {};
    this.results.detailedResults.forEach(result => {
      if (!phases[result.phase]) {
        phases[result.phase] = {
          total: 0,
          coherent: 0,
          avgScore: 0,
          scores: []
        };
      }
      phases[result.phase].total++;
      if (result.isCoherent) phases[result.phase].coherent++;
      phases[result.phase].scores.push(result.coherenceScore);
    });

    // Calcular promedios
    Object.keys(phases).forEach(phase => {
      const scores = phases[phase].scores;
      phases[phase].avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      delete phases[phase].scores;
    });

    return phases;
  }

  groupResultsByHypothesis() {
    const hypotheses = {};
    this.results.detailedResults.forEach(result => {
      if (!hypotheses[result.hypothesisId]) {
        hypotheses[result.hypothesisId] = {
          name: result.hypothesisName,
          total: 0,
          coherent: 0,
          avgScore: 0,
          scores: []
        };
      }
      hypotheses[result.hypothesisId].total++;
      if (result.isCoherent) hypotheses[result.hypothesisId].coherent++;
      hypotheses[result.hypothesisId].scores.push(result.coherenceScore);
    });

    // Calcular promedios
    Object.keys(hypotheses).forEach(id => {
      const scores = hypotheses[id].scores;
      hypotheses[id].avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      delete hypotheses[id].scores;
    });

    return hypotheses;
  }

  generateRecommendations() {
    const recommendations = [];
    const metrics = this.calculateMetrics();

    if (metrics.coherencePercentage < 90) {
      recommendations.push('Revisar y mejorar los prompts de IA para mayor alineación con las hipótesis');
      recommendations.push('Implementar validación adicional post-generación');
    }

    const byPhase = this.groupResultsByPhase();
    Object.entries(byPhase).forEach(([phase, data]) => {
      if (data.avgScore < 0.7) {
        recommendations.push(`Mejorar prompts específicos para la fase "${phase}"`);
      }
    });

    return recommendations;
  }
}

// Ejecutar validación
async function runCoherenceValidation() {
  const validator = new CoherenceValidator();
  
  try {
    const results = await validator.validateAllArtifacts();
    await validator.generateDetailedReport();
    
    return results;
  } catch (error) {
    console.error('Error en validación:', error);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  runCoherenceValidation();
}

module.exports = { CoherenceValidator, runCoherenceValidation };