// ===== phases/aprender.js - Prompts para la fase de Aprender =====

const { COHERENCE_INSTRUCTIONS } = require('../coherenceInstructions');

const aprenderPrompts = {
  'Framework de Análisis': `
    ${COHERENCE_INSTRUCTIONS.general}
    ${COHERENCE_INSTRUCTIONS.crossPhase}

    Para el "Framework de Análisis", desarrolla:

    ENFOQUE CRÍTICO: Analizar los datos DESDE LA PERSPECTIVA DEL USUARIO y su problema, no solo métricas.

    1. PROCESO DE ANÁLISIS:

       | Paso | Actividad | Input | Output | Responsable |
       |------|-----------|-------|--------|-------------|
       | 1 | Recolectar datos cuantitativos | Analytics, métricas | Dashboard actualizado | [Rol] |
       | 2 | Recolectar datos cualitativos | Feedback, entrevistas | Resumen de insights | [Rol] |
       | 3 | Cruzar datos | Cuanti + Cuali | Hipótesis de por qué | [Rol] |
       | 4 | Priorizar acciones | Hipótesis validadas | Backlog priorizado | [Rol] |

       Preguntas guía para cada análisis:
       - ¿Los USUARIOS están resolviendo su PROBLEMA? (métrica North Star)
       - ¿DÓNDE abandonan antes de resolver? (funnel)
       - ¿QUÉ DICEN sobre su experiencia? (feedback)
       - ¿Por qué hay diferencia entre lo que dicen y hacen? (análisis)

    2. TEMPLATE DE INSIGHT CARD:

       Para cada insight descubierto, documenta:

       | Campo | Contenido |
       |-------|-----------|
       | Insight ID | INS-001 |
       | Observación | "X% de usuarios hacen [comportamiento]" |
       | Interpretación | "Esto sugiere que el USUARIO [hipótesis]" |
       | Evidencia | [Datos que soportan: analytics, quotes, etc.] |
       | Confianza | Alta/Media/Baja |
       | Acción sugerida | [Qué hacer al respecto] |
       | Impacto esperado | [Cómo mejora la resolución del problema del USUARIO] |

       Categorías de insights:
       - ✅ VALIDACIÓN: Confirmamos que [hipótesis sobre el usuario]
       - ❌ REFUTACIÓN: Descubrimos que NO es cierto que [asunción]
       - 💡 DESCUBRIMIENTO: Nuevo hallazgo sobre el USUARIO: [insight]

    3. MATRIZ DE PRIORIZACIÓN DE ACCIONES:

       | Acción | Usuarios impactados | Mejora esperada | Esfuerzo | Score | Prioridad |
       |--------|--------------------|--------------------|----------|-------|-----------|
       | [Acción 1] | [X usuarios] | [+Y% en métrica] | [días] | [R×I/E] | P1 |

       Criterios de priorización:
       - Reach: ¿Cuántos USUARIOS se benefician?
       - Impact: ¿Cuánto mejora su capacidad de resolver el problema?
       - Effort: ¿Cuánto cuesta implementar?

       Score = (Reach × Impact) / Effort

    FORMATO DE RESPUESTA:
    - Usa tablas para proceso, insights y priorización
    - Incluye template de Insight Card completo
    - Define roles y responsables
    - Extensión: 800-1100 palabras

    IMPORTANTE: Analiza los datos de la fase de medición DESDE LA PERSPECTIVA del USUARIO resolviendo su PROBLEMA.`,

  'Matriz de Aprendizajes': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para la "Matriz de Aprendizajes", estructura:

    ENFOQUE CRÍTICO: Cada aprendizaje debe relacionarse con el PROBLEMA del USUARIO.

    1. APRENDIZAJES POR CATEGORÍA:

       **Sobre el PROBLEMA del usuario:**
       | ID | Aprendizaje | Evidencia | Confianza | Implicación |
       |-----|-------------|-----------|-----------|-------------|
       | P-01 | "El problema es [más/menos] intenso de lo que pensábamos" | [Datos] | Alta/Media/Baja | [Qué cambia] |

       **Sobre la SOLUCIÓN:**
       | ID | Aprendizaje | Evidencia | Confianza | Implicación |
       |-----|-------------|-----------|-----------|-------------|
       | S-01 | "La feature [X] sí/no resuelve el dolor [Y]" | [Datos] | Alta/Media/Baja | [Qué cambia] |

       **Sobre el CLIENTE/USUARIO:**
       | ID | Aprendizaje | Evidencia | Confianza | Implicación |
       |-----|-------------|-----------|-----------|-------------|
       | C-01 | "El usuario realmente valora [X] más que [Y]" | [Datos] | Alta/Media/Baja | [Qué cambia] |

       **Sobre el MODELO de negocio:**
       | ID | Aprendizaje | Evidencia | Confianza | Implicación |
       |-----|-------------|-----------|-----------|-------------|
       | M-01 | "Los usuarios sí/no pagarían por [X]" | [Datos] | Alta/Media/Baja | [Qué cambia] |

    2. ESCALA DE CONFIANZA:

       | Nivel | Criterio | Ejemplo |
       |-------|----------|---------|
       | 🟢 Alta (8-10) | >50 usuarios + comportamiento consistente + múltiples fuentes | "85% de usuarios completaron la acción Y volvieron en 7 días" |
       | 🟡 Media (5-7) | 20-50 usuarios O comportamiento mixto | "60% dicen que les gusta, pero solo 30% lo usan regularmente" |
       | 🔴 Baja (1-4) | <20 usuarios O solo feedback verbal | "5 usuarios dijeron que pagarían, pero no testeamos pago real" |

       Para cada aprendizaje, indica:
       - Tamaño de muestra: [N usuarios]
       - Tipo de evidencia: Comportamiento / Declaración / Ambos
       - Consistencia: ¿Datos cuanti y cuali dicen lo mismo?

    3. IMPLICACIONES Y PRÓXIMOS PASOS:

       | Aprendizaje | Implicación | Acción requerida | Prioridad |
       |-------------|-------------|------------------|-----------|
       | [P-01] | [Qué significa para el producto] | [Qué hacer] | Alta/Media/Baja |

       Decisiones clave basadas en aprendizajes:
       - ¿Seguimos con la misma estrategia? → Si [condiciones]
       - ¿Pivotamos parcialmente? → Si [condiciones]
       - ¿Necesitamos más datos? → Diseñar experimento [X]

    FORMATO DE RESPUESTA:
    - Usa tablas separadas por categoría
    - Incluye IDs para trazabilidad (P-01, S-01, etc.)
    - Especifica nivel de confianza con escala numérica
    - Extensión: 700-1000 palabras

    ${COHERENCE_INSTRUCTIONS.samePhase}`,

  'Validación de Hipótesis': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para la "Validación de Hipótesis", evalúa:

    ENFOQUE CRÍTICO: La validación debe basarse en COMPORTAMIENTO REAL del USUARIO, no en lo que DICEN.

    1. HIPÓTESIS PRINCIPAL:

       | Aspecto | Detalle |
       |---------|---------|
       | Hipótesis original | "Creemos que [segmento] tiene el problema de [X] y pagaría por [solución]" |
       | Estado | ✅ Validada / ⚠️ Parcialmente validada / ❌ Refutada |
       | Evidencia de comportamiento | [Qué HICIERON los usuarios - no qué dijeron] |
       | Tamaño de muestra | [N usuarios] |
       | Nivel de confianza | [1-10] |

       Desglose de la hipótesis:
       | Componente | Asunción | Resultado | Evidencia |
       |------------|----------|-----------|-----------|
       | Problema | "El usuario sufre [X]" | ✅/⚠️/❌ | [Datos] |
       | Segmento | "[Tipo de usuario] tiene este problema" | ✅/⚠️/❌ | [Datos] |
       | Solución | "Nuestra solución resuelve [X]" | ✅/⚠️/❌ | [Datos] |
       | Modelo | "El usuario pagaría/usaría esto" | ✅/⚠️/❌ | [Datos] |

    2. HIPÓTESIS SECUNDARIAS:

       | # | Hipótesis | Resultado | Evidencia | Impacto |
       |---|-----------|-----------|-----------|---------|
       | 1 | "Los usuarios prefieren [A] sobre [B]" | ✅/❌ | [Comportamiento observado] | [Cómo afecta el producto] |
       | 2 | "El trigger principal es [X]" | ✅/❌ | [Datos de analytics] | [Cómo afecta adquisición] |
       | 3 | "Los usuarios abandonan por [razón]" | ✅/❌ | [Funnel + feedback] | [Cómo afecta retención] |

       Para cada hipótesis, distinguir:
       - Lo que usuarios DIJERON vs lo que HICIERON
       - Si hay discrepancia, confiar en el COMPORTAMIENTO

    3. DECISIÓN ESTRATÉGICA:

       | Escenario | Condición | Decisión | Siguiente paso |
       |-----------|-----------|----------|----------------|
       | 🚀 Perseverar | >70% hipótesis validadas + métricas creciendo | Escalar | Aumentar inversión en [X] |
       | 🔄 Pivotar parcial | Problema validado pero solución no óptima | Iterar solución | Rediseñar [componente] |
       | ↩️ Pivotar completo | Problema no validado o segmento incorrecto | Cambiar dirección | Explorar [nueva hipótesis] |
       | ⏹️ Abandonar | <30% validación + sin tracción después de 3 pivotes | Cerrar | Documentar aprendizajes |

       Decisión recomendada: [PERSEVERAR/PIVOTAR/ABANDONAR]
       Justificación: [Basada en datos de usuarios]

    FORMATO DE RESPUESTA:
    - Usa tablas para hipótesis y decisiones
    - Distingue claramente entre dicen vs hacen
    - Incluye recomendación final con justificación
    - Extensión: 800-1100 palabras

    ${COHERENCE_INSTRUCTIONS.crossPhase}`,

  'Identificación de Patrones': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para la "Identificación de Patrones", analiza:

    ENFOQUE CRÍTICO: Buscar patrones en CÓMO el USUARIO interactúa con el MVP para resolver su PROBLEMA.

    1. PATRONES DE COMPORTAMIENTO:

       **Segmentación por comportamiento:**
       | Segmento | % usuarios | Comportamiento típico | Valor para ellos | Acción recomendada |
       |----------|------------|----------------------|------------------|-------------------|
       | Power Users | [X%] | [Usan feature A y B diariamente] | [Alto - resuelven problema] | Programa de referidos |
       | Casual Users | [X%] | [Usan solo feature A semanalmente] | [Medio] | Mejorar activación |
       | Churned | [X%] | [Abandonaron en paso Y] | [No obtuvieron valor] | Investigar por qué |

       Patrones de uso identificados:
       | Patrón | Descripción | Frecuencia | Correlación con éxito |
       |--------|-------------|------------|----------------------|
       | [Patrón 1] | "Usuarios que hacen [X] tienden a [Y]" | [X% de usuarios] | [Alta/Media/Baja] |

    2. PATRONES EN EL JOURNEY:

       Registro -> [85%] -> Primer uso -> [60%] -> Accion core -> [40%] -> Valor -> [25%] -> Retencion
                    |                      |                       |                  |
                    +-- 15% abandonan      +-- 40% abandonan       +-- 60% no         +-- 75% no
                        aqui                   aqui                    completan          regresan

       | Punto del journey | Patrón observado | Hipótesis de por qué | Experimento para validar |
       |-------------------|------------------|---------------------|-------------------------|
       | Registro → Primer uso | [X% no completan onboarding] | [El usuario no entiende qué hacer] | [Simplificar a 2 pasos] |
       | Acción core → Valor | [Solo Y% perciben valor] | [La acción core es muy compleja] | [Guía paso a paso] |

    3. PATRONES EN FEEDBACK:

       | Tema | Frecuencia | Sentimiento | Quotes representativas | Acción |
       |------|------------|-------------|----------------------|--------|
       | [Tema 1] | [X menciones] | 😊/😐/😞 | "..." "..." | [Qué hacer] |
       | [Tema 2] | [X menciones] | 😊/😐/😞 | "..." "..." | [Qué hacer] |

       Nube de palabras (temas más mencionados):
       - [Palabra 1]: X menciones - contexto: [positivo/negativo]
       - [Palabra 2]: X menciones - contexto: [positivo/negativo]

       Solicitudes más frecuentes:
       | Solicitud | Veces pedida | % usuarios que la piden | Prioridad |
       |-----------|--------------|------------------------|-----------|
       | "[Feature pedida]" | [X] | [Y%] | Alta/Media/Baja |

    FORMATO DE RESPUESTA:
    - Incluye visualización ASCII del journey
    - Usa tablas para segmentos y patrones
    - Incluye quotes reales de usuarios
    - Extensión: 700-1000 palabras

    ${COHERENCE_INSTRUCTIONS.samePhase}`,

  'Guía de Entrevistas': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para la "Guía de Entrevistas", prepara:

    ENFOQUE CRÍTICO: Entrevistas deben descubrir CÓMO el USUARIO experimenta su PROBLEMA, no validar nuestras ideas.

    1. PREPARACIÓN:

       | Aspecto | Detalle |
       |---------|---------|
       | Objetivo | Entender cómo el USUARIO experimenta [problema específico] |
       | Perfil del entrevistado | [Características del usuario ideal] |
       | Duración | 20-30 minutos |
       | Formato | Video llamada / Presencial / Teléfono |
       | Incentivo | [Compensación si aplica] |
       | Muestra objetivo | 10-15 usuarios |

       Antes de la entrevista:
       - Revisar datos del usuario en analytics (si es usuario existente)
       - Preparar contexto: "He visto que [comportamiento observado]..."
       - Tener listo: grabadora (con permiso), notas, guía de preguntas

    2. SCRIPT DE ENTREVISTA:

       **Apertura (2-3 min):**
       "Gracias por tu tiempo. Estoy investigando cómo personas como tú manejan [problema].
       No hay respuestas correctas o incorrectas, solo quiero entender tu experiencia.
       ¿Puedo grabar para no perder detalles? Tu información es confidencial."

       **Preguntas sobre el PROBLEMA (10-15 min):**

       | # | Pregunta | Por qué la hacemos | Profundización |
       |---|----------|-------------------|----------------|
       | 1 | "Cuéntame sobre la última vez que enfrentaste [problema]" | Contexto real, no hipotético | "¿Qué pasó después?" |
       | 2 | "¿Con qué frecuencia te ocurre esto?" | Intensidad del problema | "¿Puedes darme un ejemplo reciente?" |
       | 3 | "¿Qué haces actualmente para manejarlo?" | Alternativas actuales | "¿Qué tan bien funciona eso?" |
       | 4 | "¿Qué es lo más frustrante de esta situación?" | Dolor emocional | "¿Cómo te hace sentir?" |
       | 5 | "Si pudieras resolver esto mágicamente, ¿cómo sería?" | Solución ideal | "¿Qué cambiaría en tu día a día?" |

       **Preguntas sobre la SOLUCIÓN (5-10 min) - solo si ya usan el MVP:**

       | # | Pregunta | Objetivo |
       |---|----------|----------|
       | 6 | "¿Cómo conociste [MVP]?" | Canal de adquisición |
       | 7 | "¿Qué esperabas que hiciera por ti?" | Expectativas |
       | 8 | "¿Qué tan bien cumplió esas expectativas?" | Satisfacción |
       | 9 | "¿Qué fue lo más útil? ¿Lo más frustrante?" | Fortalezas/debilidades |
       | 10 | "¿Lo recomendarías? ¿Por qué sí/no?" | NPS cualitativo |

       **Cierre (2-3 min):**
       "Muchas gracias por compartir. ¿Hay algo más que quieras agregar sobre [problema]?
       ¿Conoces a alguien más que enfrente esto y quisiera conversar conmigo?"

    3. PREGUNTAS A EVITAR:

       | ❌ NO preguntar | ✅ SÍ preguntar | Por qué |
       |-----------------|-----------------|---------|
       | "¿Te gustaría una app que...?" | "¿Cómo resuelves esto hoy?" | Evita sesgo de confirmación |
       | "¿Pagarías $X por esto?" | "¿Cuánto gastas hoy intentando resolver esto?" | Comportamiento real > intención |
       | "¿Qué features te gustarían?" | "¿Qué es lo más difícil de [problema]?" | Problema > Solución |
       | "¿Verdad que esto es frustrante?" | "¿Cómo te afecta esto?" | No liderar la respuesta |

    4. ANÁLISIS POST-ENTREVISTA:

       Template de síntesis (completar dentro de 24h):

       | Campo | Contenido |
       |-------|-----------|
       | Entrevistado | [Nombre/ID], [Perfil] |
       | Fecha | [Fecha] |
       | Problema principal | [En sus palabras] |
       | Intensidad (1-10) | [Score] |
       | Solución actual | [Qué hace hoy] |
       | Quote memorable | "[Cita textual]" |
       | Insights clave | 1. [Insight] 2. [Insight] |
       | Sorpresas | [Algo que no esperábamos] |

    FORMATO DE RESPUESTA:
    - Incluye script completo listo para usar
    - Usa tablas para preguntas y análisis
    - Incluye ejemplos de qué evitar
    - Extensión: 900-1200 palabras

    ${COHERENCE_INSTRUCTIONS.samePhase}`,

  'Plan de Iteración': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para el "Plan de Iteración", define:

    ENFOQUE CRÍTICO: Iterar basado en FEEDBACK REAL del USUARIO sobre cómo resolver mejor su PROBLEMA.

    1. PRIORIDADES DE ITERACIÓN:

       | # | Mejora | Problema que resuelve | Usuarios impactados | Evidencia | Esfuerzo | Prioridad |
       |---|--------|----------------------|--------------------|-----------|---------|-----------|
       | 1 | [Mejora 1] | [Dolor específico del usuario] | [X usuarios/% base] | [Datos/quotes] | [S/M/L] | P1 |
       | 2 | [Mejora 2] | [Dolor] | [X] | [Evidencia] | [S/M/L] | P1 |
       | 3 | [Mejora 3] | [Dolor] | [X] | [Evidencia] | [S/M/L] | P2 |
       | 4 | [Mejora 4] | [Dolor] | [X] | [Evidencia] | [S/M/L] | P2 |
       | 5 | [Mejora 5] | [Dolor] | [X] | [Evidencia] | [S/M/L] | P3 |

       Criterios de priorización:
       - P1: Afecta >50% usuarios Y bloquea resolución del problema
       - P2: Afecta 20-50% usuarios O mejora significativamente la experiencia
       - P3: Nice-to-have, <20% usuarios impactados

    2. PLAN DE SPRINTS:

       **Sprint 1 (Semanas 1-2): [Nombre/Tema]**
       | Objetivo | Métrica de éxito | Entregables |
       |----------|------------------|-------------|
       | [Objetivo enfocado en usuario] | [Mejora X% en métrica Y] | [Lista de entregables] |

       User stories incluidas:
       - US-XX: [Historia]
       - US-XX: [Historia]

       **Sprint 2 (Semanas 3-4): [Nombre/Tema]**
       | Objetivo | Métrica de éxito | Entregables |
       |----------|------------------|-------------|
       | [Objetivo] | [Métrica] | [Entregables] |

       **Sprint 3 (Semanas 5-6): [Nombre/Tema]**
       | Objetivo | Métrica de éxito | Entregables |
       |----------|------------------|-------------|
       | [Objetivo] | [Métrica] | [Entregables] |

       Dependencias entre sprints:
       - Sprint 2 depende de: [Qué del Sprint 1]
       - Sprint 3 depende de: [Qué del Sprint 2]

    3. PROCESO DE VALIDACIÓN:

       | Fase | Actividad | Participantes | Criterio de éxito |
       |------|-----------|---------------|-------------------|
       | Pre-release | Test interno | Equipo | 0 bugs críticos |
       | Beta | Test con 5-10 usuarios | Early adopters | >70% completan tarea |
       | Release | Rollout gradual (10% → 50% → 100%) | Todos | Métricas no empeoran |

       Criterios de rollback:
       - 🔴 Rollback inmediato: Métrica core cae >20%
       - 🟡 Pausar rollout: Feedback negativo de >30% usuarios beta
       - 🟢 Continuar: Métricas estables o mejoran

       Documentación requerida:
       - Antes: Hipótesis de qué mejorará para el usuario
       - Durante: Métricas en tiempo real
       - Después: Retro - ¿Usuarios confirman mejora?

    FORMATO DE RESPUESTA:
    - Usa tablas para prioridades y sprints
    - Define métricas de éxito específicas
    - Incluye criterios de rollback claros
    - Extensión: 800-1100 palabras

    ${COHERENCE_INSTRUCTIONS.crossPhase}`
};

module.exports = { aprenderPrompts };
