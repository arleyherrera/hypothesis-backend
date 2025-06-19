// ===== vectorContext/contextGeneration.js - Generación de contexto =====

const config = require('./config');

class ContextGeneration {
  constructor(textProcessor) {
    this.textProcessor = textProcessor;
  }

  // Módulo de generación de contexto
  generateArtifactContext(artifact) {
    const contextParts = [
      this.generateProblemContext(artifact), // Problema primero
      this.generateBasicInfo(artifact),
      this.generateContentSummary(artifact),
      this.generateKeywordsSection(artifact),
      this.generatePhaseContext(artifact)
    ];
    
    return contextParts.join('\n').trim();
  }
  
  generatePhaseContext(artifact) {
    const phaseIndex = config.PHASE_ORDER.indexOf(artifact.phase);
    const phasePosition = phaseIndex >= 0 ? `${phaseIndex + 1} de ${config.PHASE_ORDER.length}` : 'desconocida';
    return `Posición en metodología: Fase ${phasePosition}
Fase actual: ${artifact.phase}`;
  }

  generateBasicInfo(artifact) {
    return `Problema abordado: ${artifact.hypothesis?.problem || 'No especificado'}
Fase: ${artifact.phase}
Nombre del artefacto: ${artifact.name}
Descripción: ${artifact.description}`;
  }

  generateContentSummary(artifact) {
    const maxLength = config.SEARCH_CONFIG.MAX_CONTEXT_LENGTH;
    return `Contenido resumen: ${artifact.content.substring(0, maxLength)}...
Fecha: ${artifact.createdAt}`;
  }

  generateKeywordsSection(artifact) {
    const keywords = this.textProcessor.extractKeywords(artifact.content);
    return `Palabras clave: ${keywords}`;
  }

  generateProblemContext(artifact) {
    if (artifact.hypothesis && artifact.hypothesis.problem) {
      return `PROBLEMA CENTRAL: ${artifact.hypothesis.problem}
====================================
Este artefacto aborda específicamente el problema identificado arriba.
====================================`;
    }
    return '';
  }

  // Construcción de queries
  buildSearchQuery(phase, artifactName, problem) {
    // Extraer palabras clave del problema
    const problemKeywords = problem ? 
      this.textProcessor.extractKeywords(problem).split(', ').slice(0, 3).join(' ') : '';
    return `${problemKeywords} ${artifactName} ${phase} metodología lean startup problema`;
  }

  // Creación de metadata
  createChromaMetadata(artifact) {
    return {
      artifactId: artifact.id,
      hypothesisId: artifact.hypothesisId,
      phase: artifact.phase,
      name: artifact.name,
      createdAt: artifact.createdAt.toISOString(),
      keywords: this.textProcessor.extractKeywords(artifact.content),
      phaseIndex: config.PHASE_ORDER.indexOf(artifact.phase)
    };
  }
}

module.exports = ContextGeneration;