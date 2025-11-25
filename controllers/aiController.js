const { Hypothesis, Artifact } = require('../models');
const axios = require('axios');
const vectorContextService = require('../services/vectorContextService');
const { handleError, validatePhase, logOperation } = require('../helpers/controllerUtils');
const { getSpecificPrompt } = require('./aiPrompts');
require('dotenv').config();

const AI_CONFIG = {
  SERVICE_URL: process.env.AI_SERVICE_URL || 'https://api.anthropic.com/v1/messages',
  API_KEY: process.env.AI_API_KEY,
  MODEL: process.env.AI_MODEL || "claude-3-haiku-20240307",
  TEMPERATURE: parseFloat(process.env.AI_TEMPERATURE) || 0.7,
  MAX_TOKENS: parseInt(process.env.AI_MAX_TOKENS) || 4000,
  TIMEOUT: parseInt(process.env.AI_TIMEOUT) || 60000,
  MAX_RETRIES: parseInt(process.env.AI_MAX_RETRIES) || 3,
  RETRY_DELAY: parseInt(process.env.AI_RETRY_DELAY) || 2000,
  DELAY_BETWEEN_ARTIFACTS: parseInt(process.env.AI_DELAY_BETWEEN) || 1000, // 1 segundo (Anthropic no tiene rate limit agresivo)
  PROVIDER: process.env.AI_PROVIDER || 'anthropic' // 'anthropic' o 'openai-compatible'
};

const ARTIFACT_TEMPLATES = require('./artifactTemplates');

// Función de delay para esperas
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Función para crear request a la IA con reintentos (soporta Anthropic y OpenAI-compatible)
const createAIRequest = async (prompt, retryCount = 0) => {
  try {
    const isAnthropic = AI_CONFIG.PROVIDER === 'anthropic';
    const systemMessage = "Eres un consultor experto en metodología Lean Startup con amplia experiencia ayudando a startups a validar sus hipótesis. Generas artefactos coherentes que se integran perfectamente con el trabajo previo, manteniendo consistencia tanto dentro de cada fase como entre fases diferentes.";

    // Configurar body según el proveedor
    const requestBody = isAnthropic ? {
      model: AI_CONFIG.MODEL,
      max_tokens: AI_CONFIG.MAX_TOKENS,
      system: systemMessage,
      messages: [
        { role: "user", content: prompt }
      ]
    } : {
      model: AI_CONFIG.MODEL,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: prompt }
      ],
      temperature: AI_CONFIG.TEMPERATURE,
      max_tokens: AI_CONFIG.MAX_TOKENS
    };

    // Configurar headers según el proveedor
    const headers = isAnthropic ? {
      'x-api-key': AI_CONFIG.API_KEY,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    } : {
      'Authorization': `Bearer ${AI_CONFIG.API_KEY}`,
      'Content-Type': 'application/json'
    };

    const response = await axios.post(
      AI_CONFIG.SERVICE_URL,
      requestBody,
      { headers, timeout: AI_CONFIG.TIMEOUT }
    );

    // Normalizar respuesta para que sea consistente
    if (isAnthropic) {
      // Convertir formato Anthropic a formato OpenAI-like para compatibilidad
      response.data = {
        choices: [{
          message: {
            content: response.data.content[0].text
          }
        }]
      };
    }

    return response;
  } catch (error) {
    const isRetryable = isRetryableError(error);

    console.error(`[IA] Error en request (intento ${retryCount + 1}/${AI_CONFIG.MAX_RETRIES}):`, {
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
      retryable: isRetryable
    });

    // Si es un error recuperable y no hemos excedido los reintentos
    if (isRetryable && retryCount < AI_CONFIG.MAX_RETRIES - 1) {
      const waitTime = AI_CONFIG.RETRY_DELAY * Math.pow(2, retryCount);
      console.log(`[IA] Reintentando en ${waitTime}ms...`);
      await delay(waitTime);
      return createAIRequest(prompt, retryCount + 1);
    }

    throw error;
  }
};

// Determinar si el error es recuperable
const isRetryableError = (error) => {
  // Errores de red o timeout
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND') {
    return true;
  }

  // Errores HTTP recuperables
  const status = error.response?.status;
  if (status) {
    // 429: Rate limit, 500-503: Errores del servidor
    return status === 429 || status === 500 || status === 502 || status === 503;
  }

  return false;
};

const buildBasePrompt = (phase, hypothesisData, artifactName) => `
Actúa como un consultor experto especializado en metodología Lean Startup con más de 10 años de experiencia.
Estás generando un artefacto específico llamado "${artifactName}" para la fase de "${phase}".

PROBLEMA CENTRAL A RESOLVER:
${hypothesisData.problem}

DETALLES DE LA HIPÓTESIS:
- Solución Propuesta: ${hypothesisData.solution}
- Segmento de Clientes: ${hypothesisData.customerSegment}
- Propuesta de Valor: ${hypothesisData.valueProposition}
- Nombre del Proyecto: ${hypothesisData.name}

IMPORTANTE: 
- Este artefacto debe estar COMPLETAMENTE BASADO en el PROBLEMA descrito arriba
- TODO el contenido debe partir del problema como punto central
- La solución y todos los elementos deben responder directamente a este problema
- NO generes ejemplos genéricos, todo debe ser específico para ESTE problema

Genera contenido detallado y personalizado basándote en el problema específico identificado.
`;

const getContextualPrompt = async (hypothesisId, phase, artifactName) => {
  try {
    const contextResult = await vectorContextService.getRelevantContext(hypothesisId, phase, artifactName);
    if (!contextResult || !contextResult.contexts?.length) return '';
    
    const { contexts, coherenceGuidelines } = contextResult;
    
    // Separar contextos por fase
    const samePhaseContexts = contexts.filter(ctx => ctx.metadata.phase === phase);
    const adjacentPhaseContexts = contexts.filter(ctx => ctx.metadata.phase !== phase);
    
    let prompt = '\n\n=== CONTEXTO Y COHERENCIA ===\n';
    
    // Contextos de la misma fase
    if (samePhaseContexts.length > 0) {
      prompt += '\nARTEFACTOS DE LA MISMA FASE (Mantener alta coherencia):\n';
      samePhaseContexts.forEach((ctx, i) => {
        prompt += `\nArtefacto ${i + 1} - ${ctx.metadata.name}:\n${ctx.content}\n`;
        prompt += `Relevancia: ${(ctx.similarity * 100).toFixed(1)}%\n`;
      });
    }
    
    // Contextos de fases relacionadas
    if (adjacentPhaseContexts.length > 0) {
      prompt += '\n\nARTEFACTOS DE FASES RELACIONADAS (Mantener continuidad):\n';
      adjacentPhaseContexts.forEach((ctx, i) => {
        prompt += `\nFase ${ctx.metadata.phase} - ${ctx.metadata.name}:\n${ctx.content}\n`;
      });
    }
    
    // Guías de coherencia
    if (coherenceGuidelines) {
      prompt += '\n\nGUÍAS DE COHERENCIA:\n';
      prompt += `- Terminología clave a mantener: ${coherenceGuidelines.terminology.join(', ')}\n`;
      prompt += `- ${coherenceGuidelines.phaseContext}\n`;
      coherenceGuidelines.constraints.forEach(constraint => {
        prompt += `- ${constraint}\n`;
      });
    }
    
    prompt += '\n\nIMPORTANTE: Mantén coherencia con los artefactos existentes, especialmente con los de la misma fase.';
    
    return prompt;
  } catch (error) {
    console.error('Error al obtener contexto:', error);
    return '';
  }
};

const getPhaseTransitionPrompt = (currentPhase, previousPhases) => {
  if (!previousPhases || previousPhases.length === 0) return '';
  
  let prompt = '\n\n=== TRANSICIÓN ENTRE FASES ===\n';
  prompt += 'Este artefacto debe construir sobre el trabajo de fases anteriores:\n';
  
  previousPhases.forEach(phase => {
    prompt += `- Fase "${phase}": Asegúrate de que las decisiones y aprendizajes de esta fase se reflejen\n`;
  });
  
  prompt += '\nMantén una narrativa coherente que muestre la evolución del proyecto a través de las fases.';
  
  return prompt;
};

const generatePrompt = async (phase, hypothesisData, artifactName) => {
  const basePrompt = buildBasePrompt(phase, hypothesisData, artifactName);
  const contextPrompt = await getContextualPrompt(hypothesisData.id, phase, artifactName);
  const specificPrompt = getSpecificPrompt(phase, artifactName);
  
  // Obtener fases anteriores completadas
  const stats = await vectorContextService.getContextStats(hypothesisData.id);
  const completedPhases = stats?.phaseDistribution?.map(p => p.phase) || [];
  const phaseOrder = ['construir', 'medir', 'aprender', 'pivotar', 'iterar'];
  const currentPhaseIndex = phaseOrder.indexOf(phase);
  const previousPhases = completedPhases.filter(p => phaseOrder.indexOf(p) < currentPhaseIndex);
  
  const transitionPrompt = getPhaseTransitionPrompt(phase, previousPhases);
  
  return `${basePrompt}${contextPrompt}${transitionPrompt}\n\n${specificPrompt}\n
INSTRUCCIONES FINALES CRÍTICAS:
- TODO el contenido DEBE basarse en el problema: "${hypothesisData.problem}"
- Cada sección debe explicar cómo aborda aspectos específicos del problema
- Usa el problema como punto de partida para cada análisis
- La solución "${hypothesisData.solution}" debe responder directamente al problema
- El segmento "${hypothesisData.customerSegment}" debe ser quien experimenta este problema
- La propuesta de valor "${hypothesisData.valueProposition}" debe resolver este problema
- NO inventes información, usa SOLO lo proporcionado en la hipótesis
- Utiliza formato markdown para estructurar tu respuesta
- Longitud mínima: 800 palabras
- Mantén coherencia con artefactos existentes
- Usa la terminología establecida en artefactos previos`;
};

const createArtifact = async (hypothesisId, phase, artifactType, content, suffix = '') => {
  return Artifact.create({
    hypothesisId,
    name: artifactType.name + suffix,
    phase,
    description: artifactType.description,
    content
  });
};

const storeVectorContext = async (artifact) => {
  try {
    await vectorContextService.storeArtifactContext(artifact);
    logOperation('Contexto vectorial almacenado', { artifactId: artifact.id });
  } catch (error) {
    console.error('Error al almacenar contexto vectorial:', error);
  }
};

const generateArtifactWithAI = async (req, res) => {
  try {
    const { hypothesisId, phase } = req.params;
    logOperation('Generando artefactos con IA', { hypothesisId, phase });
    
    // Debug mejorado
    console.log('=== DEBUG GENERACIÓN IA ===');
    console.log('API Key presente:', !!AI_CONFIG.API_KEY);
    console.log('API Key longitud:', AI_CONFIG.API_KEY?.length);
    console.log('Service URL:', AI_CONFIG.SERVICE_URL);
    
    if (!AI_CONFIG.API_KEY) {
      console.log('No hay API Key, usando plantillas de respaldo');
      return useFallbackGenerator(req, res);
    }
    
    const hypothesis = await Hypothesis.findOne({
      where: { id: hypothesisId, userId: req.user.id }
    });
    
    if (!hypothesis) return res.status(404).json({ message: 'Hipótesis no encontrada' });
    if (!validatePhase(phase)) return res.status(400).json({ message: 'Fase no válida' });
    
    // Verificar coherencia antes de generar
    const stats = await vectorContextService.getContextStats(hypothesisId);
    
    const artifactsForPhase = ARTIFACT_TEMPLATES.artifactTypes[phase];
    const createdArtifacts = [];
    
    for (let i = 0; i < artifactsForPhase.length; i++) {
      const artifactType = artifactsForPhase[i];
      try {
        console.log(`[${i + 1}/${artifactsForPhase.length}] Generando ${artifactType.name}...`);
        const prompt = await generatePrompt(phase, hypothesis, artifactType.name);
        console.log('Prompt generado, llamando a IA...');

        const aiResponse = await createAIRequest(prompt);
        console.log('Respuesta IA recibida');

        const content = aiResponse.data.choices[0].message.content;

        const artifact = await createArtifact(hypothesisId, phase, artifactType, content, ' (IA)');
        await storeVectorContext(artifact);
        createdArtifacts.push(artifact);
        console.log(`✓ [${i + 1}/${artifactsForPhase.length}] ${artifactType.name} generado exitosamente`);

        // Delay entre artefactos para evitar rate limiting (excepto en el último)
        if (i < artifactsForPhase.length - 1) {
          console.log(`[IA] Esperando ${AI_CONFIG.DELAY_BETWEEN_ARTIFACTS}ms antes del siguiente artefacto...`);
          await delay(AI_CONFIG.DELAY_BETWEEN_ARTIFACTS);
        }
      } catch (error) {
        console.error(`✗ Error generando ${artifactType.name}:`, {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });

        // Si es rate limit, esperar más tiempo y continuar
        if (error.response?.status === 429) {
          const retryAfter = parseInt(error.response.headers?.['retry-after']) || 30;
          console.log(`[IA] Rate limit alcanzado. Esperando ${retryAfter} segundos...`);
          await delay(retryAfter * 1000);
        }
      }
    }
    
    if (!createdArtifacts.length) {
      console.log('No se pudo generar ningún artefacto, usando fallback');
      return handleError(res, new Error('No se pudo generar ningún artefacto'), 'Error al generar artefactos con IA');
    }
    
    // Obtener análisis de coherencia actualizado
    const updatedStats = await vectorContextService.getContextStats(hypothesisId);
    
    res.status(201).json({ 
      message: `${createdArtifacts.length} artefactos generados con IA`,
      artifacts: createdArtifacts,
      coherenceAnalysis: updatedStats.globalCoherence
    });
  } catch (error) {
    console.error('Error general en generateArtifactWithAI:', error);
    return useFallbackGenerator(req, res);
  }
};

const improveArtifactWithAI = async (req, res) => {
  try {
    const { id } = req.params;
    logOperation('Mejorando artefacto con IA', { id });
    
    if (!AI_CONFIG.API_KEY) {
      return res.status(500).json({ message: 'No se ha configurado la clave API para el servicio de IA' });
    }
    
    const artifact = await Artifact.findByPk(id, {
      include: [{ model: Hypothesis, as: 'hypothesis' }]
    });
    
    if (!artifact) return res.status(404).json({ message: 'Artefacto no encontrado' });
    if (artifact.hypothesis.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    const contextPrompt = await getContextualPrompt(artifact.hypothesisId, artifact.phase, artifact.name);
    
    // Obtener estadísticas de coherencia actuales
    const currentStats = await vectorContextService.getContextStats(artifact.hypothesisId);
    const phaseCoherence = currentStats?.phaseCoherence?.[artifact.phase] || 0;
    
    const aiPrompt = req.body.prompt || `Mejora este artefacto de "${artifact.phase}":
${contextPrompt}

COHERENCIA ACTUAL DE LA FASE: ${(phaseCoherence * 100).toFixed(1)}%
${phaseCoherence < 0.5 ? 'IMPORTANTE: La coherencia de esta fase es baja. Asegúrate de alinear mejor este artefacto con otros de la misma fase.' : ''}

ARTEFACTO ACTUAL: 
${artifact.content}

Mejora este artefacto para que sea:
1. Más específico y detallado
2. Más coherente con otros artefactos de la fase
3. Mejor alineado con las decisiones tomadas en fases anteriores
4. Más accionable y práctico`;
    
    const aiResponse = await createAIRequest(aiPrompt);
    const improvedContent = aiResponse.data.choices[0].message.content;
    
    await artifact.update({
      content: improvedContent,
      name: artifact.name.includes('(Mejorado)') ? artifact.name : `${artifact.name} (Mejorado)`,
      description: `${artifact.description} Versión mejorada con IA para mayor coherencia.`
    });
    
    await vectorContextService.updateArtifactContext(artifact);
    
    // Obtener nueva coherencia
    const updatedStats = await vectorContextService.getContextStats(artifact.hypothesisId);
    const newPhaseCoherence = updatedStats?.phaseCoherence?.[artifact.phase] || 0;
    
    res.json({ 
      message: 'Artefacto mejorado con IA', 
      artifact,
      coherenceImprovement: {
        before: phaseCoherence,
        after: newPhaseCoherence,
        improvement: newPhaseCoherence - phaseCoherence
      }
    });
  } catch (error) {
    handleError(res, error, 'Error al mejorar artefacto con IA');
  }
};

// NUEVA FUNCIÓN: Mejorar todos los artefactos de una hipótesis/fase
const improveAllArtifactsWithAI = async (req, res) => {
  try {
    const { hypothesisId, phase } = req.params;
    logOperation('Mejorando todos los artefactos con IA', { hypothesisId, phase });
    
    if (!AI_CONFIG.API_KEY) {
      return res.status(500).json({ message: 'No se ha configurado la clave API para el servicio de IA' });
    }
    
    // Obtener TODOS los artefactos de esta fase
    const artifacts = await Artifact.findAll({
      where: { 
        hypothesisId, 
        phase 
      },
      include: [{ model: Hypothesis, as: 'hypothesis' }]
    });
    
    if (!artifacts.length) {
      return res.status(404).json({ message: 'No hay artefactos para mejorar' });
    }
    
    // Verificar autorización
    if (artifacts[0].hypothesis.userId !== req.user.id) {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    const hypothesis = artifacts[0].hypothesis;
    const improvedArtifacts = [];
    
    // Mejorar cada artefacto
    for (const artifact of artifacts) {
      try {
        // Si ya fue mejorado, saltar
        if (artifact.name.includes('(Mejorado)')) {
          improvedArtifacts.push(artifact);
          continue;
        }
        
        // Prompt simple para SOLO agregar contenido adicional
        const appendPrompt = `
Hipótesis:
- Problema: ${hypothesis.problem}
- Solución: ${hypothesis.solution}
- Segmento: ${hypothesis.customerSegment}
- Propuesta de valor: ${hypothesis.valueProposition}

Artefacto actual "${artifact.name}" de la fase "${phase}":
${artifact.content}

INSTRUCCIONES CRÍTICAS:
- NO modifiques ni reescribas el contenido existente
- SOLO genera 2-3 párrafos ADICIONALES que complementen lo que ya existe
- Agrega información práctica, ejemplos específicos o métricas relevantes
- Mantén el mismo tono y estilo del artefacto original
- NO incluyas títulos ni subtítulos
- NO repitas información ya mencionada

Genera ÚNICAMENTE el contenido adicional (2-3 párrafos):`;
        
        const aiResponse = await createAIRequest(appendPrompt);
        const additionalContent = aiResponse.data.choices[0].message.content;
        
        // Agregar separador visual y contenido adicional
        const separator = '\n\n---\n\n**✨ Información Adicional:**\n\n';
        const improvedContent = artifact.content + separator + additionalContent;
        
        // Actualizar el artefacto
        await artifact.update({
          content: improvedContent,
          name: `${artifact.name} (Mejorado)`
        });
        
        // IMPORTANTE: Actualizar contexto vectorial para mantener coherencia
        await vectorContextService.updateArtifactContext(artifact);
        
        improvedArtifacts.push(artifact);
        
        // Pequeña pausa para no sobrecargar la API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`Error mejorando artefacto ${artifact.id}:`, error);
      }
    }
    
    res.json({ 
      message: `${improvedArtifacts.length} artefactos mejorados exitosamente`,
      artifacts: improvedArtifacts,
      phase: phase
    });
    
  } catch (error) {
    handleError(res, error, 'Error al mejorar artefactos con IA');
  }
};

const getContextStats = async (req, res) => {
  try {
    const { hypothesisId } = req.params;
    
    const hypothesis = await Hypothesis.findOne({
      where: { id: hypothesisId, userId: req.user.id }
    });
    
    if (!hypothesis) return res.status(404).json({ message: 'Hipótesis no encontrada' });
    
    const stats = await vectorContextService.getContextStats(hypothesisId);
    
    res.json({ 
      hypothesisId, 
      contextStats: stats,
      globalCoherence: stats?.globalCoherence // La coherencia global ya viene en stats
    });
  } catch (error) {
    handleError(res, error, 'Error al obtener estadísticas de contexto');
  }
};

const getCoherenceReport = async (req, res) => {
  try {
    const { hypothesisId } = req.params;
    
    const hypothesis = await Hypothesis.findOne({
      where: { id: hypothesisId, userId: req.user.id }
    });
    
    if (!hypothesis) return res.status(404).json({ message: 'Hipótesis no encontrada' });
    
    const stats = await vectorContextService.getContextStats(hypothesisId);
    
    if (!stats) {
      return res.status(404).json({ message: 'No hay estadísticas disponibles' });
    }
    
    // La coherencia global ya viene incluida en stats
    const globalAnalysis = stats.globalCoherence || { 
      score: 0, 
      transitions: {}, 
      recommendation: 'No hay suficientes datos para análisis' 
    };
    
    // Generar reporte detallado
    const report = {
      summary: {
        totalArtifacts: stats.totalContexts,
        completedPhases: stats.completedPhases,
        totalPhases: stats.totalPhases,
        globalCoherence: globalAnalysis.score
      },
      phaseDetails: stats.phaseDistribution.map(phase => ({
        phase: phase.phase,
        artifactCount: phase.count,
        coherence: stats.phaseCoherence[phase.phase] || 0,
        status: stats.phaseCoherence[phase.phase] > 0.5 ? 'good' : 'needs-improvement'
      })),
      phaseTransitions: globalAnalysis.transitions,
      recommendations: globalAnalysis.recommendation,
      actionItems: generateActionItems(stats, globalAnalysis)
    };
    
    res.json(report);
  } catch (error) {
    handleError(res, error, 'Error al generar reporte de coherencia');
  }
};

const generateActionItems = (stats, globalAnalysis) => {
  const actionItems = [];
  
  // Verificar fases con baja coherencia
  Object.entries(stats.phaseCoherence).forEach(([phase, coherence]) => {
    if (coherence < 0.5) {
      actionItems.push({
        priority: 'high',
        phase: phase,
        action: `Revisar y mejorar coherencia en fase "${phase}"`,
        detail: 'Los artefactos de esta fase muestran baja coherencia entre sí'
      });
    }
  });
  
  // Verificar transiciones problemáticas
  Object.entries(globalAnalysis.phaseTransitions).forEach(([transition, coherence]) => {
    if (coherence < 0.4) {
      actionItems.push({
        priority: 'medium',
        transition: transition,
        action: `Mejorar transición ${transition}`,
        detail: 'La continuidad entre estas fases necesita fortalecerse'
      });
    }
  });
  
  return actionItems;
};

const useFallbackGenerator = async (req, res) => {
  try {
    const { hypothesisId, phase } = req.params;
    logOperation('Usando generador de respaldo', { hypothesisId, phase });
    
    const hypothesis = await Hypothesis.findOne({
      where: { id: hypothesisId, userId: req.user.id }
    });
    
    if (!hypothesis) return res.status(404).json({ message: 'Hipótesis no encontrada' });
    if (!validatePhase(phase)) return res.status(400).json({ message: 'Fase no válida' });
    
    const artifactsForPhase = ARTIFACT_TEMPLATES.artifactTypes[phase];
    const createdArtifacts = [];
    
    for (const artifactType of artifactsForPhase) {
      try {
        const content = ARTIFACT_TEMPLATES.getDefaultContent(phase, artifactType.name, hypothesis);
        const artifact = await createArtifact(hypothesisId, phase, artifactType, content, ' (Plantilla)');
        createdArtifacts.push(artifact);
      } catch (error) {
        console.error(`Error creando plantilla ${artifactType.name}:`, error);
      }
    }
    
    res.status(201).json({ 
      message: `${createdArtifacts.length} artefactos de respaldo generados`,
      artifacts: createdArtifacts,
      note: 'Plantillas generadas porque el servicio de IA no está disponible.'
    });
  } catch (error) {
    handleError(res, error, 'Error al generar artefactos');
  }
};

const generateHypothesisFromProblem = async (req, res) => {
  try {
    const { problem } = req.body;
    logOperation('Generando hipótesis con IA desde problema', { userId: req.user.id });
    
    if (!problem || problem.length < 20) {
      return res.status(400).json({ 
        message: 'El problema debe tener al menos 20 caracteres' 
      });
    }
    
    if (!AI_CONFIG.API_KEY) {
      return res.status(500).json({ 
        message: 'Servicio de IA no disponible' 
      });
    }
    
    const prompt = `
Actúa como un experto en Lean Startup y emprendimiento con 10 años de experiencia validando hipótesis de negocio.

PROBLEMA IDENTIFICADO:
"${problem}"

Tu tarea es transformar este problema en 3 hipótesis TESTABLES siguiendo la metodología Lean Startup.

IMPORTANTE - Cada hipótesis debe seguir EXACTAMENTE esta estructura para el campo 'name':
"Creemos que [segmento específico] tiene el problema de [problema claro].
Si les ofrecemos [solución concreta], entonces [métrica/comportamiento medible]."

CRITERIOS PARA CADA HIPÓTESIS:
1. Debe ser TESTABLE en 2-4 semanas
2. Debe tener métricas claras de éxito
3. El segmento debe ser lo suficientemente específico para encontrar 10-20 personas
4. La solución debe ser un MVP realizable con recursos mínimos
5. Cada opción debe tener un enfoque DIFERENTE (no solo variaciones)
6. El campo 'name' NO DEBE EXCEDER 255 CARACTERES - sé conciso

TIPS PARA MANTENER EL NOMBRE CORTO:
- Usa números en lugar de palabras (4h en vez de "cuatro horas")
- Abrevia donde sea posible (app, min, h/semana)
- Omite palabras innecesarias ("de", "en", "para" cuando sea posible)
- Sé específico pero breve en segmentos (diseñadores 25-35 en vez de "diseñadores gráficos freelance de 25 a 35 años")

ENFOQUES SUGERIDOS:
- Opción 1: Enfoque tecnológico/digital
- Opción 2: Enfoque de servicio/humano
- Opción 3: Enfoque híbrido o de comunidad

Para cada opción, genera:
1. name: La hipótesis COMPLETA siguiendo EXACTAMENTE esta plantilla:
   "Creemos que [segmento] tiene el problema de [problema]. Si les ofrecemos [solución], entonces [resultado]"
   IMPORTANTE: 
   - Este campo 'name' debe contener la hipótesis completa en formato Lean Canvas
   - MÁXIMO 255 CARACTERES TOTAL
   - Sé conciso pero específico
   - Usa números y abreviaciones donde sea apropiado
2. solution: MVP específico que se puede construir en 2-4 semanas. Incluye:
   - Qué es exactamente (app, servicio, proceso, etc.)
   - Características mínimas (máximo 3)
   - Cómo se implementaría
3. customerSegment: Perfil ultra-específico. Incluye:
   - Demografía (edad, ubicación, ocupación)
   - Comportamiento actual relacionado al problema
   - Dónde encontrarlos para validar
4. valueProposition: Propuesta única que incluya:
   - Beneficio principal medible (ahorro tiempo/dinero, mejora en X%)
   - Por qué es 10x mejor que la alternativa actual
   - Qué métrica validaría el éxito

EJEMPLO DE FORMATO ESPERADO (name con máximo 255 caracteres):
Si el problema fuera "Los freelancers pierden tiempo haciendo facturas manualmente":

name: "Creemos que diseñadores freelance 25-35 años tienen el problema de perder 4h/semana en facturas. Si les ofrecemos app móvil de facturas en 1 click, entonces reducirán a 10min y pagarán $5/mes"
(Ejemplo: 198 caracteres)

solution: "App móvil minimalista que genera facturas profesionales. Características: 1) Plantillas prediseñadas, 2) Cálculo automático de impuestos, 3) Envío directo por WhatsApp. Implementación: PWA con React en 3 semanas"

customerSegment: "Diseñadores gráficos freelance, 25-35 años, en ciudades grandes (CDMX, Guadalajara), que facturan 5-15 clientes/mes. Actualmente usan Excel. Encontrarlos en grupos de Facebook de diseñadores y coworkings creativos"

valueProposition: "Ahorra 15+ horas al mes (de 4 horas/semana a 10 min), permitiendo tomar 2 proyectos extra = $1000 USD más/mes. Es 10x mejor que Excel porque es móvil y automatizado. Métrica de éxito: 80% de usuarios activos después de 30 días"

Responde ÚNICAMENTE con un JSON válido en este formato:
{
  "options": [
    {
      "name": "Creemos que [segmento] tiene el problema de [problema]. Si les ofrecemos [solución], entonces [resultado]",
      "solution": "descripción detallada del MVP con implementación específica",
      "customerSegment": "segmento ultra-específico con forma de encontrarlos",
      "valueProposition": "propuesta medible con métrica de validación"
    },
    {
      "name": "Creemos que [segmento] tiene el problema de [problema]. Si les ofrecemos [solución], entonces [resultado]",
      "solution": "descripción detallada del MVP con implementación específica",
      "customerSegment": "segmento ultra-específico con forma de encontrarlos",
      "valueProposition": "propuesta medible con métrica de validación"
    },
    {
      "name": "Creemos que [segmento] tiene el problema de [problema]. Si les ofrecemos [solución], entonces [resultado]",
      "solution": "descripción detallada del MVP con implementación específica",
      "customerSegment": "segmento ultra-específico con forma de encontrarlos",
      "valueProposition": "propuesta medible con métrica de validación"
    }
  ]
}`;

    const aiResponse = await createAIRequest(prompt);
    const content = aiResponse.data.choices[0].message.content;
    
    // Intentar parsear la respuesta JSON
    let hypothesisOptions;
    try {
      // Limpiar el contenido de posibles caracteres extra
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      hypothesisOptions = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Error parseando respuesta de IA:', parseError);
      console.error('Contenido recibido:', content);
      
      // Fallback: intentar generar opciones manualmente si el formato no es correcto
      return res.status(500).json({ 
        message: 'Error al procesar la respuesta de IA', 
        error: 'Formato de respuesta inválido' 
      });
    }
    
    // Validar que tengamos las opciones esperadas
    if (!hypothesisOptions.options || !Array.isArray(hypothesisOptions.options)) {
      return res.status(500).json({ 
        message: 'La IA no generó opciones válidas' 
      });
    }
    
    // Asegurar que cada opción incluya el problema original
    const optionsWithProblem = hypothesisOptions.options.map(option => ({
      ...option,
      problem: problem // Incluir el problema original en cada opción
    }));
    
    res.json({ 
      message: 'Opciones de hipótesis generadas exitosamente',
      problem: problem,
      options: optionsWithProblem
    });
    
  } catch (error) {
    console.error('Error en generateHypothesisFromProblem:', error);
    handleError(res, error, 'Error al generar opciones de hipótesis con IA');
  }
};


module.exports = {
  generateArtifactWithAI,
  improveArtifactWithAI,
  improveAllArtifactsWithAI,
  getContextStats,
  getCoherenceReport,
  generateHypothesisFromProblem
};