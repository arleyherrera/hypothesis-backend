// ===== prompts/index.js - Archivo principal que exporta todos los prompts =====

const { COHERENCE_INSTRUCTIONS } = require('./coherenceInstructions');
const { construirPrompts } = require('./phases/construir');
const { medirPrompts } = require('./phases/medir');
const { aprenderPrompts } = require('./phases/aprender');
const { pivotarPrompts } = require('./phases/pivotar');
const { iterarPrompts } = require('./phases/iterar');

/**
 * Fases válidas del ciclo Lean Startup
 * @constant {string[]}
 */
const VALID_PHASES = ['construir', 'medir', 'aprender', 'pivotar', 'iterar'];

/**
 * Combina todos los prompts específicos organizados por fase
 * @constant {Object.<string, Object>}
 */
const specificPrompts = {
  construir: construirPrompts,
  medir: medirPrompts,
  aprender: aprenderPrompts,
  pivotar: pivotarPrompts,
  iterar: iterarPrompts
};

/**
 * Obtiene el prompt específico para un artefacto
 * @param {string} phase - La fase del proceso (construir, medir, aprender, pivotar, iterar)
 * @param {string} artifactName - El nombre del artefacto
 * @returns {string} El prompt específico o uno genérico si no existe
 * @throws {Error} Si phase o artifactName no están definidos o son inválidos
 */
const getSpecificPrompt = (phase, artifactName) => {
  // Validación de parámetros
  if (!phase || typeof phase !== 'string') {
    throw new Error('El parámetro "phase" es requerido y debe ser un string');
  }

  if (!VALID_PHASES.includes(phase)) {
    throw new Error(`La fase "${phase}" no es válida. Fases válidas: ${VALID_PHASES.join(', ')}`);
  }

  if (!artifactName || typeof artifactName !== 'string') {
    throw new Error('El parámetro "artifactName" es requerido y debe ser un string');
  }

  // Si existe un prompt específico, úsalo
  if (specificPrompts[phase] && specificPrompts[phase][artifactName]) {
    return `
RECUERDA: DEBES basar TODO el contenido en la hipótesis específica proporcionada.
No uses ejemplos genéricos. Cada punto debe relacionarse directamente con:
- El PROBLEMA que el USUARIO experimenta (identificado en la hipótesis)
- La solución propuesta para resolver el PROBLEMA del USUARIO
- El segmento de clientes (USUARIOS que tienen el PROBLEMA)
- La propuesta de valor (cómo resuelve el PROBLEMA del USUARIO)

${specificPrompts[phase][artifactName]}`;
  }

  // Si no existe prompt específico, usa uno genérico con todas las instrucciones de coherencia
  return `
${COHERENCE_INSTRUCTIONS.general}
${COHERENCE_INSTRUCTIONS.userCentered}

IMPORTANTE: Basa TODO el contenido en la hipótesis específica proporcionada arriba.

Por favor, genera contenido detallado, práctico y personalizado para este artefacto.
Incluye:
1. Introducción al propósito del artefacto EN EL CONTEXTO del PROBLEMA del USUARIO
2. Análisis de cómo el USUARIO experimenta el problema actualmente
3. Recomendaciones específicas y accionables para resolver el PROBLEMA del USUARIO
4. Ejemplos concretos de cómo los USUARIOS del segmento usarían la solución
5. Próximos pasos para validar CON usuarios reales

NO generes contenido genérico. Todo debe ser específico para el PROBLEMA de este USUARIO.

Organiza tu respuesta en secciones con formato markdown para facilitar su lectura.`;
};

module.exports = {
  specificPrompts,
  getSpecificPrompt,
  COHERENCE_INSTRUCTIONS,
  VALID_PHASES
};