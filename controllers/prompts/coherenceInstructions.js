// ===== coherenceInstructions.js - Instrucciones de coherencia reutilizables =====

const COHERENCE_INSTRUCTIONS = {
  general: `
INSTRUCCIONES DE COHERENCIA:
- Mantén consistencia con la terminología establecida en artefactos previos
- Asegura que las decisiones y conclusiones sean coherentes con fases anteriores
- Usa el mismo tono y nivel de detalle que los artefactos existentes
- Referencia explícitamente artefactos anteriores cuando sea relevante
- Evita contradicciones con información ya establecida`,

  samePhase: `
COHERENCIA DENTRO DE LA FASE:
- Este artefacto debe complementar y expandir los artefactos existentes de la misma fase
- No repitas información ya cubierta, construye sobre ella
- Mantén el mismo enfoque metodológico que otros artefactos de la fase
- Asegura que todos los artefactos de la fase cuenten una historia coherente`,

  crossPhase: `
COHERENCIA ENTRE FASES:
- Las conclusiones de fases anteriores deben informar este artefacto
- Muestra cómo este trabajo evoluciona desde las fases previas
- Prepara el terreno para las fases siguientes
- Mantén una narrativa consistente a través del proyecto`,

  userCentered: `
ENFOQUE CENTRADO EN EL USUARIO (CRÍTICO):
- TODO debe partir del PROBLEMA que el USUARIO experimenta, no de "tu hipótesis" o "tu startup"
- Escribe pensando en el USUARIO que SUFRE el problema, no como observador externo
- Usa lenguaje que pone al USUARIO y su PROBLEMA en el centro: "el USUARIO necesita", "el problema del USUARIO"
- Evita lenguaje centrado en el emprendedor: NO "tu MVP", "tu validación" → SÍ "cómo el USUARIO resuelve su problema"
- Basa todo en COMPORTAMIENTO REAL del usuario, no en suposiciones o lo que DICEN
- Valida TODO con usuarios reales que tienen el problema`
};

module.exports = { COHERENCE_INSTRUCTIONS };