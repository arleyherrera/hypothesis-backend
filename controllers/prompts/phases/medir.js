// ===== phases/medir.js - Prompts para la fase de Medir =====

const { COHERENCE_INSTRUCTIONS } = require('../coherenceInstructions');

const medirPrompts = {
  'Framework de KPIs Personalizado': `
    ${COHERENCE_INSTRUCTIONS.general}
    ${COHERENCE_INSTRUCTIONS.crossPhase}

    Para el "Framework de KPIs Personalizado", establece:

    ENFOQUE CRÍTICO: Las métricas deben medir si estamos RESOLVIENDO el PROBLEMA del USUARIO, no vanity metrics.

    1. MÉTRICA NORTH STAR:

       | Aspecto | Definición |
       |---------|------------|
       | Métrica | [Nombre de la métrica que indica valor para el USUARIO] |
       | Fórmula | [Cómo se calcula exactamente] |
       | Frecuencia | [Diaria/Semanal/Mensual] |
       | Objetivo inicial | [Número específico a alcanzar en 3 meses] |
       | Por qué importa | [Cómo indica que el USUARIO resuelve su problema] |

       Ejemplo de North Star (NO vanity):
       - ❌ MAL: "Usuarios registrados" (no indica valor)
       - ✅ BIEN: "Usuarios que completan [acción que resuelve problema] semanalmente"

    2. MÉTRICAS SECUNDARIAS (5-7 KPIs):

       | KPI | Fórmula | Meta | Frecuencia | Indica qué |
       |-----|---------|------|------------|------------|
       | Activación | % usuarios que [acción core] en primeras 24h | >40% | Diaria | Usuario encontró valor inicial |
       | Retención D7 | % usuarios que regresan día 7 | >25% | Semanal | El MVP sigue resolviendo el problema |
       | Engagement | [Acciones por usuario activo] | >X/semana | Semanal | Intensidad de uso |
       | Time to value | Tiempo hasta [primera resolución del problema] | <X min | Diaria | Facilidad de obtener valor |
       | NPS | Net Promoter Score | >30 | Mensual | Satisfacción del usuario |

    3. MÉTRICAS DE ALERTA (Red Flags):

       | Métrica de alerta | Umbral crítico | Acción si se cruza |
       |-------------------|----------------|-------------------|
       | Churn semanal | >15% | Investigar por qué usuarios abandonan |
       | Tasa de completado | <30% | Simplificar flujo core |
       | Tickets de soporte | >X/100 usuarios | Mejorar UX o documentación |

       Umbrales GO/NO-GO:
       - GO (seguir): North Star crece >10% mensual
       - ALERTA: North Star estancado por 2+ semanas → investigar
       - NO-GO (pivotar): North Star cae >20% → problema serio

    FORMATO DE RESPUESTA:
    - Usa tablas para todas las métricas
    - Incluye fórmulas específicas de cálculo
    - Define umbrales numéricos concretos
    - Extensión: 700-1000 palabras

    IMPORTANTE: Las métricas deben medir el éxito del MVP construido en la fase anterior DESDE LA PERSPECTIVA DEL USUARIO.`,

  'Plan de Analítica': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para el "Plan de Analítica", especifica:

    ENFOQUE CRÍTICO: Trackear CÓMO el USUARIO interactúa con el MVP para resolver su PROBLEMA.

    1. EVENTOS A TRACKEAR:

       | Evento | Nombre técnico | Propiedades | Por qué importa |
       |--------|---------------|-------------|-----------------|
       | Usuario inicia sesión | user_login | device, source | Actividad básica |
       | Usuario intenta resolver problema | problem_attempt_started | problem_type | Intención de uso |
       | Usuario completa acción core | core_action_completed | duration, success | Valor entregado |
       | Usuario abandona flujo | flow_abandoned | step, reason | Fricción detectada |
       | Usuario da feedback | feedback_submitted | rating, category | Satisfacción |

       Propiedades del usuario a capturar:
       - user_segment: [Segmento al que pertenece]
       - problem_intensity: [1-10, qué tan intenso es su problema]
       - signup_date: [Para calcular cohortes]
       - acquisition_channel: [De dónde vino]

    2. DASHBOARDS:

       **Dashboard Ejecutivo** (revisión semanal):
       | Métrica | Visualización | Objetivo |
       |---------|---------------|----------|
       | Usuarios activos semanales | Línea de tendencia | Crecimiento >5%/semana |
       | % usuarios que resuelven problema | Gauge | >50% |
       | NPS | Número grande | >30 |

       **Dashboard Operacional** (revisión diaria):
       | Métrica | Visualización | Alerta si |
       |---------|---------------|-----------|
       | Usuarios activos hoy | Número | <X |
       | Acciones completadas | Contador | Cae >20% |
       | Errores reportados | Lista | >5/día |

       **Dashboard de Producto** (revisión semanal):
       | Métrica | Visualización | Acción |
       |---------|---------------|--------|
       | Funnel de conversión | Embudo | Optimizar etapa con mayor caída |
       | Tiempo en cada paso | Barras | Simplificar pasos >2 min |
       | Features más usadas | Ranking | Potenciar las top 3 |

    3. PROCESOS DE ANÁLISIS:

       | Frecuencia | Actividad | Responsable | Output |
       |------------|-----------|-------------|--------|
       | Diaria | Revisar alertas y métricas críticas | [Rol] | Acción si hay anomalía |
       | Semanal | Análisis de cohortes y retención | [Rol] | Reporte de tendencias |
       | Mensual | Deep dive en comportamiento de usuarios | [Rol] | Insights para roadmap |

       Herramientas recomendadas:
       - Analytics: [Mixpanel/Amplitude/PostHog] - porque [razón]
       - Sesiones: [Hotjar/FullStory] - para ver comportamiento real
       - Surveys: [Typeform/SurveyMonkey] - para feedback cualitativo

    FORMATO DE RESPUESTA:
    - Usa tablas para eventos, dashboards y procesos
    - Incluye nombres técnicos de eventos
    - Especifica frecuencias y responsables
    - Extensión: 700-1000 palabras

    ${COHERENCE_INSTRUCTIONS.samePhase}`,

  'Diseño de Tests A/B': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para el "Diseño de Tests A/B", estructura:

    ENFOQUE CRÍTICO: Cada test debe mejorar CÓMO el USUARIO resuelve su PROBLEMA, no solo optimizar conversión.

    1. BACKLOG DE TESTS PRIORIZADO:

       | # | Test | Hipótesis | Impacto esperado | Esfuerzo | Prioridad |
       |---|------|-----------|------------------|----------|-----------|
       | 1 | [Nombre del test] | "Si [cambio], entonces [resultado para usuario]" | Alto/Medio/Bajo | [días] | P1 |
       | 2 | ... | ... | ... | ... | P2 |

       Lista 8-10 tests ordenados por: Impacto en resolución del problema del USUARIO

       Para los TOP 3 tests, detalla:
       - ¿Qué dolor del USUARIO aborda?
       - ¿Cómo sabemos que es un problema? (datos actuales)
       - ¿Qué esperamos que mejore para el USUARIO?

    2. DISEÑO ESTADÍSTICO (para cada test prioritario):

       **Test 1: [Nombre]**
       | Parámetro | Valor |
       |-----------|-------|
       | Hipótesis nula | No hay diferencia entre A y B |
       | Métrica primaria | [Qué medimos - relacionado a resolver problema] |
       | Baseline actual | [X%] |
       | Mejora mínima detectable | [+Y%] |
       | Nivel de confianza | 95% |
       | Tamaño de muestra | [N usuarios por variante] |
       | Duración estimada | [X días/semanas] |

       Variantes:
       - Control (A): [Descripción de la experiencia actual]
       - Tratamiento (B): [Descripción del cambio propuesto]

       Criterios de decisión:
       - Implementar B si: p-value <0.05 Y mejora >Y%
       - Mantener A si: No hay diferencia significativa
       - Investigar más si: Resultados mixtos

    3. PLAN DE IMPLEMENTACIÓN:

       | Semana | Test | Fase | Responsable |
       |--------|------|------|-------------|
       | 1-2 | Test 1 | Setup + QA | [Rol] |
       | 2-4 | Test 1 | Ejecución | [Rol] |
       | 4 | Test 1 | Análisis | [Rol] |
       | 5-6 | Test 2 | Setup + Ejecución | [Rol] |

       Herramientas recomendadas:
       - [Optimizely/VWO/Google Optimize] para implementar tests
       - Calculadora de tamaño de muestra: [link o herramienta]

       REGLAS:
       - NO terminar test antes de alcanzar tamaño de muestra
       - NO mirar resultados diariamente (sesgo)
       - SÍ documentar aprendizajes aunque el test "falle"

    FORMATO DE RESPUESTA:
    - Usa tablas para backlog y diseño estadístico
    - Incluye números específicos (tamaño muestra, duración)
    - Define criterios de decisión claros
    - Extensión: 800-1100 palabras

    ${COHERENCE_INSTRUCTIONS.samePhase}`,

  'Embudo de Conversión': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para el "Embudo de Conversión", detalla:

    ENFOQUE CRÍTICO: El embudo muestra el VIAJE del USUARIO desde descubrir el MVP hasta resolver su PROBLEMA.

    1. ETAPAS DEL EMBUDO:

       | Etapa | Acción del usuario | Tasa objetivo | Métrica |
       |-------|-------------------|---------------|---------|
       | Awareness | Usuario descubre el MVP | 100% (base) | Visitantes únicos |
       | Interés | Usuario explora cómo funciona | >60% | Páginas vistas >2 |
       | Registro | Usuario crea cuenta | >15% | Registros completados |
       | Activación | Usuario completa acción core | >40% | Primera [acción] completada |
       | Valor | Usuario resuelve su problema | >25% | [Métrica de valor] |
       | Retención | Usuario regresa | >20% | Usuarios activos D7 |
       | Referral | Usuario recomienda | >5% | Invitaciones enviadas |

       Visualizacion del embudo:

       Awareness (1000) --------------------------------- 100%
           |
       Interes (600) ---------------------------- 60%
           |
       Registro (150) ------------------- 15%
           |
       Activacion (60) ------------ 40% de registros
           |
       Valor (15) ------- 25% de activados

    2. ANÁLISIS DE FRICCIÓN:

       | Punto de caída | Tasa actual | Tasa objetivo | Hipótesis de por qué abandonan |
       |----------------|-------------|---------------|-------------------------------|
       | Interés → Registro | [X%] | 15% | [Razón probable] |
       | Registro → Activación | [X%] | 40% | [Razón probable] |
       | Activación → Valor | [X%] | 25% | [Razón probable] |

       Para cada punto de fricción TOP 3:
       - ¿Qué datos tenemos? (analytics, feedback, sesiones grabadas)
       - ¿Por qué el USUARIO se rinde? (hipótesis basada en datos)
       - ¿Cómo validamos esta hipótesis? (experimento propuesto)

    3. PLAN DE OPTIMIZACIÓN:

       **Quick Wins (implementar en <1 semana):**
       | Mejora | Etapa afectada | Impacto esperado | Esfuerzo |
       |--------|---------------|------------------|----------|
       | [Mejora 1] | [Etapa] | +X% conversión | [días] |

       **Iniciativas mediano plazo (1-4 semanas):**
       | Iniciativa | Etapa | Impacto | Dependencias |
       |------------|-------|---------|--------------|
       | [Iniciativa 1] | [Etapa] | +X% | [Qué necesita] |

       **Rediseños mayores (solo si necesario):**
       - Trigger para rediseño: Si conversión de [etapa] es <X% después de 3 optimizaciones
       - Alcance: [Qué se rediseñaría]
       - Validación: A/B test antes de rollout completo

    FORMATO DE RESPUESTA:
    - Incluye visualización ASCII del embudo
    - Usa tablas para cada sección
    - Especifica tasas objetivo numéricas
    - Extensión: 800-1100 palabras

    ${COHERENCE_INSTRUCTIONS.crossPhase}`,

  'Sistema de Retroalimentación': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para el "Sistema de Retroalimentación", diseña:

    ENFOQUE CRÍTICO: Escuchar al USUARIO sobre si el MVP realmente resuelve su PROBLEMA.

    1. CANALES DE FEEDBACK:

       | Canal | Cuándo activar | Pregunta clave | Tasa respuesta esperada |
       |-------|---------------|----------------|------------------------|
       | In-app (post-acción) | Después de completar acción core | "¿Lograste [resolver problema]?" | >15% |
       | In-app (NPS) | Día 7 después de registro | "¿Qué tan probable es que recomiendes?" | >10% |
       | Email (churned) | 3 días sin actividad | "¿Por qué dejaste de usar [MVP]?" | >5% |
       | Entrevistas | Usuarios power + usuarios churned | Conversación profunda 20-30 min | N/A |

       Preguntas específicas por canal:

       **In-app (micro-surveys):**
       - Después de éxito: "¿Qué tan fácil fue [resolver problema]?" (1-5)
       - Después de abandono: "¿Qué te impidió completar [acción]?" (opciones múltiples)

       **Email (seguimiento):**
       - "Notamos que no has usado [MVP] en X días. ¿Hay algo que podamos mejorar?"
       - "¿El problema de [X] sigue siendo relevante para ti?"

       **Entrevistas (script básico):**
       - "Cuéntame sobre tu experiencia usando [MVP] para [resolver problema]"
       - "¿Qué fue lo más frustrante?" / "¿Qué fue lo más útil?"
       - "Si pudieras cambiar UNA cosa, ¿cuál sería?"

    2. PROCESAMIENTO DEL FEEDBACK:

       | Categoría | Criterio | Acción | SLA |
       |-----------|----------|--------|-----|
       | Bug crítico | Usuario no puede completar acción core | Escalar inmediatamente | <4 horas |
       | Problema UX | Usuario confundido/frustrado | Agregar al backlog P1 | <1 semana |
       | Feature request | Usuario pide nueva funcionalidad | Evaluar vs roadmap | <2 semanas |
       | Positivo | Usuario satisfecho | Pedir testimonial/referral | <1 semana |

       Proceso de categorización:
       1. Todo feedback entra a [herramienta: Intercom/Zendesk/Notion]
       2. Clasificar por: Tipo (bug/UX/feature/positivo) + Urgencia (alta/media/baja)
       3. Agrupar por tema para identificar patrones
       4. Revisar semanalmente en reunión de producto

    3. CIERRE DEL LOOP:

       | Situación | Respuesta al usuario | Tiempo |
       |-----------|---------------------|--------|
       | Bug reportado y resuelto | "¡Gracias por reportar! Ya está corregido." | Mismo día |
       | Sugerencia implementada | "Implementamos tu sugerencia. ¿Quieres probarla?" | Cuando esté lista |
       | Sugerencia en backlog | "Gran idea, la agregamos a nuestro roadmap." | <1 semana |
       | No implementaremos | "Gracias por la sugerencia. Por ahora nos enfocamos en [X]." | <2 semanas |

       Programa de Beta Testers:
       - Criterios: Usuarios activos + han dado feedback útil antes
       - Beneficios: Acceso anticipado + canal directo con el equipo
       - Compromiso: Probar features nuevas + dar feedback en <48h

    FORMATO DE RESPUESTA:
    - Usa tablas para canales, categorización y respuestas
    - Incluye ejemplos de preguntas y mensajes
    - Define SLAs específicos
    - Extensión: 700-1000 palabras

    ${COHERENCE_INSTRUCTIONS.samePhase}`,

  'Dashboard de Métricas': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para el "Dashboard de Métricas", especifica:

    ENFOQUE CRÍTICO: El dashboard debe responder: "¿Los USUARIOS están resolviendo su PROBLEMA con el MVP?"

    1. SECCION: METRICAS EN TIEMPO REAL

       +-------------------------------------------------------------+
       |  USUARIOS ACTIVOS AHORA                                     |
       |  +---------+  +-----------------+  +---------------------+  |
       |  |   42    |  | Acciones/min: 8 |  | Status: OK Normal   |  |
       |  | activos |  |                 |  |                     |  |
       |  +---------+  +-----------------+  +---------------------+  |
       +-------------------------------------------------------------+

       | Métrica | Visualización | Alerta si |
       |---------|---------------|-----------|
       | Usuarios activos ahora | Número grande | Cae >50% vs promedio |
       | Acciones por minuto | Línea en tiempo real | <X acciones/min |
       | Errores en tiempo real | Contador rojo | >0 errores críticos |
       | Status del sistema | Semáforo | Amarillo/Rojo |

    2. SECCION: METRICAS DIARIAS

       +-------------------------------------------------------------+
       |  HOY vs AYER                                                |
       |  +-------------+  +-------------+  +---------------------+  |
       |  | Nuevos: 24  |  | Activos: 156|  | Completaron: 67%    |  |
       |  |    +12%     |  |     -3%     |  |      +5%            |  |
       |  +-------------+  +-------------+  +---------------------+  |
       +-------------------------------------------------------------+

       | Métrica | Fórmula | Comparación | Meta |
       |---------|---------|-------------|------|
       | Nuevos registros | Registros hoy | vs ayer, vs semana pasada | >X/día |
       | Usuarios activos | Usuarios con ≥1 acción hoy | vs ayer | Crecimiento >0% |
       | Tasa de completado | Usuarios que [resolvieron]/Activos | vs ayer | >50% |
       | Retención D1 | Usuarios día 1 que regresan | vs benchmark | >30% |

    3. SECCION: TENDENCIAS Y PROYECCIONES

       +-------------------------------------------------------------+
       |  ULTIMOS 30 DIAS                           Proyeccion 90d   |
       |  [Grafico] ---------------------------------> [Meta]        |
       |                                                             |
       |  North Star: 1,234 usuarios activos semanales (+15%)        |
       |  Proyeccion: 2,500 en 90 dias si mantenemos crecimiento     |
       +-------------------------------------------------------------+

       | Tendencia | Período | Visualización | Proyección |
       |-----------|---------|---------------|------------|
       | North Star | 30 días | Línea con tendencia | Extrapolación 90d |
       | Retención por cohorte | Semanas | Tabla de cohortes | Retención esperada |
       | Crecimiento WAU | 4 semanas | Barras comparativas | % crecimiento mensual |

       Sistema de alertas:
       | Alerta | Condición | Notificar a | Acción |
       |--------|-----------|-------------|--------|
       | 🔴 Crítica | North Star cae >20% | Todo el equipo | Reunión de emergencia |
       | 🟡 Warning | Métrica clave estancada 7+ días | PM + Eng | Investigar causa |
       | 🟢 Positiva | Meta alcanzada | Todo el equipo | Celebrar + siguiente meta |

    FORMATO DE RESPUESTA:
    - Incluye mockups ASCII del dashboard
    - Usa tablas para métricas y alertas
    - Define condiciones específicas para alertas
    - Extensión: 700-1000 palabras

    ${COHERENCE_INSTRUCTIONS.samePhase}`
};

module.exports = { medirPrompts };
