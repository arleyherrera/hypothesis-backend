// Archivo completo controllers/artifactTemplates.js

const artifactTypes = {
  construir: [
    { name: 'MVP Personalizado', description: 'Plan detallado para construir tu producto mínimo viable.' },
    { name: 'Mapa de Empatía Personalizado', description: 'Análisis profundo de tu segmento de clientes.' },
    { name: 'Backlog de Funcionalidades', description: 'Priorización de características críticas para tu MVP.' },
    { name: 'Experimentos de Validación', description: 'Diseño de experimentos para validar tus supuestos clave.' },
    { name: 'Plan de Recursos', description: 'Estrategia para optimizar los recursos necesarios.' },
    { name: 'Estrategia de Early Adopters', description: 'Plan para conseguir tus primeros usuarios.' }
  ],
  medir: [
    { name: 'Framework de KPIs Personalizado', description: 'Indicadores clave de rendimiento para tu hipótesis.' },
    { name: 'Plan de Analítica', description: 'Estrategia para implementar análisis de datos.' },
    { name: 'Diseño de Tests A/B', description: 'Experimentos para optimizar tu solución.' },
    { name: 'Embudo de Conversión', description: 'Análisis de las etapas clave de conversión.' },
    { name: 'Sistema de Retroalimentación', description: 'Métodos para recopilar feedback de usuarios.' },
    { name: 'Dashboard de Métricas', description: 'Visualización de datos clave para tu startup.' }
  ],
  aprender: [
    { name: 'Framework de Análisis', description: 'Sistema para interpretar los datos recopilados.' },
    { name: 'Matriz de Aprendizajes', description: 'Organización de insights obtenidos.' },
    { name: 'Validación de Hipótesis', description: 'Evaluación de la validez de tu hipótesis principal.' },
    { name: 'Identificación de Patrones', description: 'Análisis de comportamientos recurrentes.' },
    { name: 'Guía de Entrevistas', description: 'Protocolo para obtener insights cualitativos.' },
    { name: 'Plan de Iteración', description: 'Estrategia para aplicar los aprendizajes obtenidos.' }
  ],
  pivotar: [
    { name: 'Matriz de Decisión', description: 'Evaluación de posibles pivotes para tu startup.' },
    { name: 'Análisis de Oportunidades', description: 'Exploración de nuevas direcciones de negocio.' },
    { name: 'Plan de Transición', description: 'Estrategia para implementar el pivote.' },
    { name: 'Comunicación de Cambios', description: 'Guía para informar a stakeholders.' },
    { name: 'Redefinición de Mercado', description: 'Análisis del nuevo segmento objetivo.' },
    { name: 'Validación Rápida', description: 'Experimentos para validar el nuevo enfoque.' }
  ],
  iterar: [
    { name: 'Plan de Optimización', description: 'Mejoras incrementales para tu solución.' },
    { name: 'Priorización RICE', description: 'Framework para priorizar mejoras.' },
    { name: 'Roadmap de Iteración', description: 'Cronograma para implementar mejoras.' },
    { name: 'Matriz de Impacto', description: 'Evaluación del impacto potencial de cada mejora.' },
    { name: 'Estrategia de Crecimiento', description: 'Plan para escalar una vez validada la solución.' },
    { name: 'Sistema de Feedback Loop', description: 'Proceso continuo de mejora basada en datos.' }
  ]
};

const getTemplatesForPhase = (phase) => {
  return artifactTypes[phase] || [];
};

const getSpecificPrompt = (phase, artifactName) => {
  // Importar los prompts específicos
  try {
    const { getSpecificPrompt: specificPromptGetter } = require('./aiPrompts');
    return specificPromptGetter(phase, artifactName);
  } catch (error) {
    // Si no se puede importar, usar un prompt genérico
    return `Genera contenido detallado y personalizado para ${artifactName} en la fase ${phase}.
    
    IMPORTANTE: Basa TODO el contenido en la hipótesis específica proporcionada.
    Incluye:
    1. Introducción al propósito del artefacto
    2. Análisis de la situación actual
    3. Recomendaciones específicas y accionables
    4. Ejemplos concretos
    5. Próximos pasos claros
    
    Utiliza formato markdown para estructurar tu respuesta.`;
  }
};

const getDefaultContent = (phase, artifactName, hypothesisData) => {
  return `# ${artifactName}

## Problema Central que Abordamos
${hypothesisData.problem}

---

## Contexto de la Hipótesis
**Proyecto:** ${hypothesisData.name}
**Fase actual:** ${phase}

## Solución Propuesta
${hypothesisData.solution}

## Segmento Objetivo
${hypothesisData.customerSegment}

## Propuesta de Valor
${hypothesisData.valueProposition}

## Desarrollo del Artefacto

Este artefacto se desarrolla específicamente para abordar el problema identificado arriba.

### Análisis del Problema
[Análisis detallado de cómo este artefacto ayuda a resolver el problema]

### Implementación
[Detalles de implementación específicos para el problema]

### Métricas de Éxito
[Cómo mediremos si estamos resolviendo el problema efectivamente]

## Próximos Pasos
1. Validar que este artefacto responde directamente al problema
2. Medir el impacto en la solución del problema
3. Iterar basándose en los aprendizajes

**Nota**: Este es un artefacto plantilla. Para contenido personalizado que profundice en el problema específico, utilice la generación con IA.`;
};

// IMPORTANTE: Exportar todo correctamente
module.exports = {
  artifactTypes,
  getTemplatesForPhase,
  getSpecificPrompt,
  getDefaultContent
};