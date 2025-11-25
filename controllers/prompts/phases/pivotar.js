// ===== phases/pivotar.js - Prompts para la fase de Pivotar =====

const { COHERENCE_INSTRUCTIONS } = require('../coherenceInstructions');

const pivotarPrompts = {
  'Matriz de Decisión': `
    ${COHERENCE_INSTRUCTIONS.general}
    ${COHERENCE_INSTRUCTIONS.crossPhase}

    Para la "Matriz de Decisión", evalúa:

    ENFOQUE CRÍTICO: Pivotar significa cambiar CUÁL problema del USUARIO resolver o CÓMO resolverlo, basado en lo que aprendimos de USUARIOS reales.

    1. RESUMEN DE SEÑALES QUE INDICAN NECESIDAD DE PIVOTAR:

       Presenta una tabla de señales detectadas:
       | Señal | Evidencia de USUARIOS | Gravedad (1-10) | Fuente |
       |-------|----------------------|-----------------|--------|
       | [Ej: Baja retención] | [X% usuarios abandonan en semana 2] | [8] | [Analytics + entrevistas] |

       Indicadores críticos a evaluar:
       - % de usuarios que NO resuelven su problema con el MVP actual
       - Feedback recurrente: "Esto no es lo que necesito porque..."
       - Métricas de engagement por debajo del umbral esperado

    2. OPCIONES DE PIVOTE BASADAS EN FEEDBACK DEL USUARIO:

       | Opción | Tipo de Pivote | Problema del USUARIO | Evidencia (# usuarios) | Esfuerzo |
       |--------|---------------|---------------------|----------------------|----------|
       | A | [Zoom-in/Zoom-out/Segmento/etc] | [Nuevo problema a resolver] | [15 usuarios mencionaron] | [Alto/Medio/Bajo] |
       | B | [Tipo] | [Problema] | [# usuarios] | [Esfuerzo] |
       | C | [Tipo] | [Problema] | [# usuarios] | [Esfuerzo] |

       Tipos de pivote a considerar:
       - **Zoom-in**: Una feature se convierte en el producto completo
       - **Zoom-out**: El producto se convierte en una feature de algo más grande
       - **Segmento de cliente**: Mismo problema, diferente USUARIO
       - **Necesidad del cliente**: Mismo USUARIO, diferente problema
       - **Plataforma**: De aplicación a plataforma o viceversa
       - **Arquitectura de negocio**: B2B ↔ B2C
       - **Canal**: Cambiar cómo llegamos al USUARIO
       - **Tecnología**: Misma solución, diferente tecnología

    3. MATRIZ DE EVALUACIÓN PONDERADA:

       | Criterio | Peso | Opción A | Opción B | Opción C |
       |----------|------|----------|----------|----------|
       | Tamaño de mercado (# usuarios con problema) | 25% | [1-10] | [1-10] | [1-10] |
       | Intensidad del dolor | 25% | [1-10] | [1-10] | [1-10] |
       | Disposición a pagar/usar | 20% | [1-10] | [1-10] | [1-10] |
       | Facilidad de alcanzar usuarios | 15% | [1-10] | [1-10] | [1-10] |
       | Confianza en evidencia | 15% | [1-10] | [1-10] | [1-10] |
       | **SCORE PONDERADO** | 100% | [X.X] | [X.X] | [X.X] |

       Fórmula: Score = Σ(Criterio × Peso)

    4. RECOMENDACIÓN Y PLAN DE ACCIÓN:

       **Opción Recomendada**: [Opción X] con score de [X.X]

       Justificación basada en USUARIOS:
       - "Elegimos esta opción porque [Y] usuarios nos dijeron que..."
       - Riesgo principal: [Descripción]
       - Mitigación: [Cómo validaremos antes de comprometernos]

       **Plan B**: [Opción Y] - Activar si después de [4 semanas] no validamos con [20+] usuarios

       Criterios GO/NO-GO para el pivote:
       - GO: >60% de nuevos usuarios confirman que tienen el problema
       - NO-GO: <30% confirman → explorar otra opción

    FORMATO DE RESPUESTA:
    - Usa todas las tablas indicadas
    - Incluye scores numéricos específicos
    - Justifica con citas de usuarios reales
    - Extensión: 800-1100 palabras`,

  'Análisis de Oportunidades': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para el "Análisis de Oportunidades", investiga:

    ENFOQUE CRÍTICO: Buscar NUEVOS usuarios con problemas MÁS dolorosos, o NUEVAS maneras de resolver el problema actual.

    1. NUEVOS SEGMENTOS DE USUARIOS CON PROBLEMAS DOLOROSOS:

       | Segmento | Problema específico | Intensidad (1-10) | Tamaño estimado | Evidencia |
       |----------|--------------------|--------------------|-----------------|-----------|
       | [Segmento A] | [Qué problema sufren] | [8] | [X usuarios potenciales] | [Cómo lo sabemos] |
       | [Segmento B] | [Problema] | [7] | [X usuarios] | [Evidencia] |
       | [Segmento C] | [Problema] | [9] | [X usuarios] | [Evidencia] |

       Para el segmento más prometedor, desarrolla:
       - **Perfil del usuario**: Quién es, qué hace, contexto
       - **Momento del dolor**: Cuándo exactamente sufre el problema
       - **Alternativas actuales**: Cómo lo resuelve hoy (aunque sea mal)
       - **Cita representativa**: "Lo que más me frustra es..."

    2. NUEVAS SOLUCIONES AL PROBLEMA DEL USUARIO:

       | Solución alternativa | Cómo resuelve el problema | Diferenciador | Complejidad | Riesgo |
       |---------------------|--------------------------|---------------|-------------|--------|
       | [Solución 1] | [Mecanismo] | [Por qué es mejor] | [Alta/Media/Baja] | [Descripción] |
       | [Solución 2] | [Mecanismo] | [Diferenciador] | [Complejidad] | [Riesgo] |
       | [Solución 3] | [Mecanismo] | [Diferenciador] | [Complejidad] | [Riesgo] |

       Análisis de tecnologías emergentes:
       - ¿Qué nuevas herramientas podrían resolver el problema 10x mejor?
       - ¿Qué tendencias tecnológicas podemos aprovechar?
       - ¿Qué hacen competidores indirectos que podríamos adaptar?

    3. NUEVOS MODELOS DE NEGOCIO:

       | Modelo | Cómo el USUARIO obtiene valor | Monetización | Ejemplo similar |
       |--------|------------------------------|--------------|-----------------|
       | [Modelo 1] | [Propuesta de valor] | [Cómo pagamos las cuentas] | [Empresa referencia] |
       | [Modelo 2] | [Propuesta] | [Monetización] | [Referencia] |

       Canales de distribución alternativos:
       | Canal | Dónde están los USUARIOS | Costo estimado | Potencial |
       |-------|-------------------------|----------------|-----------|
       | [Canal 1] | [Descripción] | [$X/usuario] | [Alto/Medio/Bajo] |
       | [Canal 2] | [Descripción] | [$X/usuario] | [Potencial] |

    4. MATRIZ DE OPORTUNIDADES:

       Visualización (Alto impacto arriba, baja complejidad a la derecha):

       IMPACTO
       Alto   | [Oportunidad C]     | [Oportunidad A] ← PRIORIZAR
              |---------------------|------------------
       Bajo   | [Oportunidad D]     | [Oportunidad B]
              |_____________________|__________________
                    Alta                 Baja         COMPLEJIDAD

       **Top 3 oportunidades a explorar**:
       1. [Oportunidad]: Por qué es prometedora + siguiente paso para validar
       2. [Oportunidad]: Razón + siguiente paso
       3. [Oportunidad]: Razón + siguiente paso

    FORMATO DE RESPUESTA:
    - Usa tablas para cada sección
    - Incluye datos cuantitativos donde sea posible
    - Prioriza por potencial de resolver problemas de usuarios
    - Extensión: 700-1000 palabras

    ${COHERENCE_INSTRUCTIONS.samePhase}`,

  'Plan de Transición': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para el "Plan de Transición", detalla:

    ENFOQUE CRÍTICO: La transición debe minimizar disruption para USUARIOS actuales mientras exploramos nuevo problema/solución.

    1. FASE 1 - PREPARACIÓN (Semanas 1-2):

       | Actividad | Responsable | Entregable | Fecha límite |
       |-----------|-------------|------------|--------------|
       | Comunicar decisión al equipo | [Rol] | Documento de pivote | Día 1 |
       | Mapear usuarios actuales afectados | [Rol] | Lista segmentada | Día 3 |
       | Preparar mensaje para usuarios | [Rol] | Templates de comunicación | Día 5 |
       | Identificar 20+ usuarios del nuevo segmento | [Rol] | Lista de contactos | Día 10 |

       Comunicación a usuarios actuales:
       - **Mensaje principal**: "Gracias a tu feedback, descubrimos [insight]. Estamos evolucionando para resolver mejor [nuevo enfoque del problema]"
       - **Qué pasa con usuarios actuales**: [Mantener acceso / Migrar / Sunset plan]
       - **Timeline de cambios**: [Fechas específicas]

       Reorganización del equipo:
       | Rol actual | Nueva responsabilidad | % tiempo en pivote |
       |------------|----------------------|-------------------|
       | [Rol 1] | [Nueva responsabilidad] | [80%] |
       | [Rol 2] | [Responsabilidad] | [50%] |

    2. FASE 2 - VALIDACIÓN CON USUARIOS (Semanas 3-8):

       | Semana | Objetivo | Métrica de éxito | Decisión si no se cumple |
       |--------|----------|------------------|-------------------------|
       | 3-4 | Validar problema con 20 usuarios | >70% confirman dolor | Revisar segmento |
       | 5-6 | Testear prototipo con 10 usuarios | >50% lo usarían | Iterar solución |
       | 7-8 | Validar disposición a pagar/usar | >30% se registran | Revisar propuesta de valor |

       Experimentos de validación:

       **Experimento 1: Problem Interview**
       - Muestra: 20 usuarios del nuevo segmento
       - Pregunta clave: "¿Cuándo fue la última vez que enfrentaste [problema]?"
       - Éxito: 70%+ tienen el problema con frecuencia semanal+

       **Experimento 2: Solution Test**
       - Muestra: 10 usuarios que confirmaron el problema
       - Método: Prototipo clickeable / Concierge MVP
       - Éxito: 60%+ completan flujo principal sin ayuda

       **Experimento 3: Commitment Test**
       - Muestra: 50+ usuarios via landing page
       - CTA: Pre-registro / Waitlist / Pago anticipado
       - Éxito: >5% conversión a registro

    3. FASE 3 - ESTABILIZACIÓN (Semanas 9-12):

       | Actividad | Criterio para iniciar | Métrica objetivo | Owner |
       |-----------|----------------------|------------------|-------|
       | Desarrollo MVP v2 | Validación exitosa semana 8 | MVP funcional | [Equipo] |
       | Migración usuarios beta | MVP v2 estable | 80% migrados sin quejas | [Equipo] |
       | Optimización onboarding | 50+ usuarios en nuevo MVP | >40% activación día 1 | [Equipo] |
       | Escalar adquisición | Retención semana 1 >60% | 100 nuevos usuarios/semana | [Equipo] |

       Criterios GO/NO-GO para cada fase:

       | Fase | GO (continuar) | PIVOT (cambiar approach) | STOP (abandonar) |
       |------|----------------|-------------------------|------------------|
       | Validación problema | >70% confirman | 40-70% confirman | <40% confirman |
       | Validación solución | >50% la usarían | 25-50% la usarían | <25% la usarían |
       | Validación negocio | >5% conversión | 2-5% conversión | <2% conversión |

    4. PLAN DE CONTINGENCIA:

       Si el pivote falla en semana [X]:
       - **Plan B**: [Descripción de alternativa]
       - **Recursos necesarios**: [Qué reasignar]
       - **Timeline Plan B**: [Semanas adicionales]

    FORMATO DE RESPUESTA:
    - Usa tablas con fechas y responsables específicos
    - Incluye criterios GO/NO-GO numéricos
    - Define entregables concretos por semana
    - Extensión: 800-1100 palabras

    ${COHERENCE_INSTRUCTIONS.crossPhase}`,

  'Comunicación de Cambios': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para la "Comunicación de Cambios", prepara:

    ENFOQUE CRÍTICO: La comunicación debe enfocarse en QUÉ problema del USUARIO resolver ahora y POR QUÉ.

    1. MATRIZ DE STAKEHOLDERS Y MENSAJES:

       | Stakeholder | Preocupación principal | Mensaje clave | Canal | Timing |
       |-------------|----------------------|---------------|-------|--------|
       | Equipo interno | "¿Mi trabajo cambia?" | "Evolucionamos para resolver [X]. Tu rol será [Y]" | Reunión + doc | Día 1 |
       | Inversores | "¿Están perdiendo foco?" | "Datos de [N] usuarios muestran que [nuevo problema] es 3x más doloroso" | Email + call | Día 2-3 |
       | Usuarios actuales | "¿Pierdo lo que tengo?" | "Gracias a tu feedback, mejoramos. Aquí está tu plan de transición" | Email + in-app | Día 5 |
       | Usuarios potenciales | "¿Qué resuelven?" | "[Nueva propuesta de valor centrada en su dolor]" | Landing + social | Día 7+ |
       | Partners | "¿Sigue siendo relevante?" | "Ahora resolvemos [X], ¿tus usuarios tienen este problema?" | Email + call | Día 7 |

    2. TEMPLATES DE COMUNICACIÓN:

       **Para el equipo interno:**
       ---
       Asunto: Evolución de [Producto] - Lo que aprendimos de nuestros usuarios

       Equipo,

       Después de hablar con [N] usuarios y analizar [métricas], descubrimos que:
       - [Insight 1 sobre el problema del usuario]
       - [Insight 2]
       - [Insight 3]

       Por esto, estamos pivotando de [enfoque anterior] a [nuevo enfoque].

       Qué cambia:
       - [Cambio 1 con impacto en el equipo]
       - [Cambio 2]

       Qué NO cambia:
       - [Elemento que se mantiene]
       - Nuestro compromiso de resolver problemas reales de usuarios

       Próximos pasos: [Acciones inmediatas]
       ---

       **Para usuarios actuales:**
       ---
       Asunto: Cómo estamos mejorando [Producto] gracias a tu feedback

       Hola [Nombre],

       Gracias por ser parte de [Producto]. Tu feedback nos enseñó algo importante:
       "[Cita o insight de usuarios]"

       Basándonos en esto, estamos evolucionando para ayudarte mejor con [nuevo enfoque del problema].

       Qué significa para ti:
       - [Beneficio 1 para el usuario]
       - [Beneficio 2]
       - [Qué pasa con tu cuenta/datos actuales]

       Timeline:
       - [Fecha]: [Cambio 1]
       - [Fecha]: [Cambio 2]

       ¿Preguntas? Responde a este email - leemos todo.

       [Firma]
       ---

       **Para inversores:**
       ---
       Asunto: [Producto] - Actualización estratégica basada en validación con usuarios

       [Nombre],

       Resumen ejecutivo:
       Estamos pivotando de [A] a [B] basándonos en validación con [N] usuarios.

       Evidencia:
       | Métrica | Antes | Aprendizaje | Acción |
       |---------|-------|-------------|--------|
       | [Métrica 1] | [X%] | [Insight] | [Cambio] |
       | [Métrica 2] | [Y] | [Insight] | [Cambio] |

       Nueva oportunidad:
       - TAM: $[X]
       - Dolor validado: [Descripción]
       - Diferenciador: [Por qué ganaremos]

       Próximos 90 días:
       1. [Milestone 1 con fecha]
       2. [Milestone 2]
       3. [Milestone 3]

       ¿Disponible para call de 30 min esta semana?
       ---

    3. FAQ PARA CADA AUDIENCIA:

       | Pregunta frecuente | Respuesta | Quién pregunta |
       |-------------------|-----------|----------------|
       | "¿Por qué cambian?" | "Usuarios nos mostraron que [X] es más importante" | Todos |
       | "¿Qué pasa con [feature actual]?" | "[Se mantiene/migra/sunset] porque [razón]" | Usuarios |
       | "¿Esto afecta el timeline?" | "[Nuevo timeline] basado en validación" | Inversores |
       | "¿Mi rol cambia?" | "[Descripción de cambios]" | Equipo |

    4. TIMELINE DE COMUNICACIÓN:

       | Día | Audiencia | Canal | Mensaje | Responsable |
       |-----|-----------|-------|---------|-------------|
       | 1 | Equipo core | Reunión | Anuncio + Q&A | CEO/Founder |
       | 2-3 | Inversores | Email + Call | Update estratégico | CEO |
       | 5 | Usuarios beta | Email | Transición personalizada | Product |
       | 7 | Todos los usuarios | Email + in-app | Anuncio general | Marketing |
       | 7+ | Público | Blog + social | Nueva propuesta de valor | Marketing |

    FORMATO DE RESPUESTA:
    - Incluye templates listos para usar
    - Usa tablas para matrices y timelines
    - Personaliza mensajes por audiencia
    - Extensión: 800-1100 palabras

    ${COHERENCE_INSTRUCTIONS.samePhase}`,

  'Redefinición de Mercado': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para la "Redefinición de Mercado", analiza:

    ENFOQUE CRÍTICO: El mercado es el conjunto de USUARIOS con el NUEVO problema que queremos resolver.

    1. NUEVO TAM/SAM/SOM BASADO EN USUARIOS CON EL PROBLEMA:

       | Métrica | Definición | Cálculo | Valor estimado |
       |---------|-----------|---------|----------------|
       | TAM | Todos los usuarios en el mundo con [problema] | [Fuente] × [Asunción] | $[X] / [Y] usuarios |
       | SAM | Usuarios alcanzables con nuestros recursos | TAM × [% alcanzable] | $[X] / [Y] usuarios |
       | SOM | Usuarios que podemos convertir en 12 meses | SAM × [% conversión realista] | $[X] / [Y] usuarios |

       Visualización del mercado:

       +-------------------------------------------+
       |              TAM: $[X]M                   |
       |    +-----------------------------+        |
       |    |       SAM: $[X]M            |        |
       |    |   +-----------------+       |        |
       |    |   |  SOM: $[X]M     |       |        |
       |    |   |  [Y] usuarios   |       |        |
       |    |   +-----------------+       |        |
       |    +-----------------------------+        |
       +-------------------------------------------+

       Fuentes para estimar:
       - [Fuente 1]: Qué dato aporta
       - [Fuente 2]: Qué dato aporta
       - Validación propia: [N] usuarios entrevistados confirman [X]

    2. ANÁLISIS COMPETITIVO CENTRADO EN EL USUARIO:

       | Competidor | Cómo resuelve el problema | Fortaleza | Debilidad | Precio |
       |------------|--------------------------|-----------|-----------|--------|
       | [Competidor 1] | [Approach] | [Fortaleza] | [Debilidad] | $[X]/mes |
       | [Competidor 2] | [Approach] | [Fortaleza] | [Debilidad] | $[X]/mes |
       | [Sustituto 1] | [Cómo usuarios resuelven hoy] | [Por qué lo usan] | [Por qué no es suficiente] | [Costo] |
       | Nosotros | [Nuestro approach] | [Diferenciador] | [Debilidad honesta] | $[X]/mes |

       Mapa de posicionamiento:

                        ESPECIALIZADO
                             |
                    [Comp B] | [NOSOTROS]
                             |
       BAJO PRECIO ----------+---------- PREMIUM
                             |
                    [Comp A] | [Comp C]
                             |
                        GENERICO

       **Ventaja competitiva sostenible**:
       - Por qué usuarios elegirían nuestra solución: [Razón 1], [Razón 2]
       - Barreras de entrada: [Qué nos protege]
       - Riesgo competitivo: [Qué podría cambiar]

    3. NUEVO POSICIONAMIENTO:

       **Propuesta de valor (formato: Para-Que-Es-A diferencia de-Nosotros)**:

       Para [USUARIO específico]
       Que [tiene problema/necesidad específica]
       [Producto] es [categoría]
       Que [beneficio principal que resuelve el problema]
       A diferencia de [alternativa principal]
       Nuestro producto [diferenciador clave]

       **Mensajes por canal**:
       | Canal | Mensaje (enfocado en dolor del usuario) | CTA |
       |-------|----------------------------------------|-----|
       | Landing page | "¿[Problema en forma de pregunta]?" | [CTA] |
       | Social ads | "[Dolor del usuario en 1 línea]" | [CTA] |
       | Email frío | "Vi que [señal de que tienen el problema]..." | [CTA] |
       | Referral | "Ayudó a [persona] con [problema]. ¿Tú también lo tienes?" | [CTA] |

    4. ESTRATEGIA GO-TO-MARKET:

       | Fase | Objetivo | Canal principal | Métrica de éxito | Budget |
       |------|----------|-----------------|------------------|--------|
       | Mes 1-2 | Validar mensajes | Outreach manual | 10% response rate | $[X] |
       | Mes 3-4 | Primeros 100 usuarios | [Canal] | CAC < $[X] | $[X] |
       | Mes 5-6 | Product-market fit | [Canal] | 40%+ "muy decepcionado" | $[X] |

       Canales priorizados:
       1. **[Canal 1]**: Donde usuarios [buscan solución/hablan del problema]. Tácticas: [X]
       2. **[Canal 2]**: Donde usuarios [actividad relacionada]. Tácticas: [X]
       3. **[Canal 3]**: [Descripción]. Tácticas: [X]

    FORMATO DE RESPUESTA:
    - Usa tablas para TAM/SAM/SOM y análisis competitivo
    - Incluye visualizaciones ASCII
    - Propuesta de valor en formato estructurado
    - Extensión: 800-1100 palabras

    ${COHERENCE_INSTRUCTIONS.samePhase}`,

  'Validación Rápida': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para la "Validación Rápida", diseña:

    ENFOQUE CRÍTICO: Validar CON usuarios REALES que el pivote resuelve un problema REAL antes de construir.

    1. EXPERIMENTO 1: SMOKE TEST (Semana 1-2)

       | Aspecto | Detalle |
       |---------|---------|
       | Objetivo | Validar que usuarios BUSCAN solución al nuevo problema |
       | Hipótesis | "[X]% de [segmento] harán clic/se registrarán cuando vean [propuesta de valor]" |
       | Método | Landing page con CTA claro |
       | Tráfico | $[X] en ads → [Y] visitas esperadas |
       | Duración | 2 semanas |
       | Métrica principal | % conversión a registro/waitlist |
       | Éxito | >5% conversión |
       | Fracaso | <2% conversión → revisar mensaje o segmento |

       Elementos de la landing page:
       - **Headline**: [Problema en forma de pregunta que el usuario se hace]
       - **Subheadline**: [Cómo lo resolvemos en 1 línea]
       - **Social proof**: [Número de usuarios o testimonial]
       - **CTA**: [Acción específica: Únete a beta / Reserva tu lugar / etc.]

       Variantes A/B a testear:
       | Variante | Qué cambia | Hipótesis |
       |----------|-----------|-----------|
       | A (Control) | [Mensaje original] | Baseline |
       | B | [Headline diferente] | [Por qué podría funcionar mejor] |
       | C | [CTA diferente] | [Por qué podría funcionar mejor] |

    2. EXPERIMENTO 2: CONCIERGE MVP (Semana 2-4)

       | Aspecto | Detalle |
       |---------|---------|
       | Objetivo | Validar que la SOLUCIÓN resuelve el problema del usuario |
       | Hipótesis | "[X]% de usuarios completarán [acción core] con asistencia manual" |
       | Método | Resolver el problema del usuario manualmente (sin software) |
       | Muestra | 10-15 usuarios que se registraron en smoke test |
       | Duración | 2 semanas |
       | Métrica | % que confirman "esto resolvió mi problema" |
       | Éxito | >60% satisfacción |
       | Fracaso | <40% → iterar solución antes de construir |

       Proceso del concierge:
       1. Usuario solicita [servicio] via [canal]
       2. Equipo responde en <[X] horas] con [entregable]
       3. Usuario confirma si resolvió su problema
       4. Documentar: ¿Qué funcionó? ¿Qué faltó?

       Preguntas post-servicio:
       - "Del 1-10, ¿qué tan bien resolvimos tu problema?"
       - "¿Qué faltó para que fuera un 10?"
       - "¿Pagarías $[X] por esto cada [frecuencia]?"

    3. EXPERIMENTO 3: WIZARD OF OZ (Semana 3-4)

       | Aspecto | Detalle |
       |---------|---------|
       | Objetivo | Validar UX y flujo del producto con backend manual |
       | Hipótesis | "[X]% de usuarios completarán el flujo sin ayuda" |
       | Método | Frontend funcional, procesos manuales detrás |
       | Muestra | 15-20 usuarios |
       | Duración | 1-2 semanas |
       | Métrica | % completion rate + tiempo promedio |
       | Éxito | >50% completan sin ayuda, <[X] minutos promedio |
       | Fracaso | >50% abandonan en paso [Y] → rediseñar ese paso |

       Puntos de observación:
       | Paso del flujo | Qué observar | Señal de problema |
       |----------------|--------------|-------------------|
       | [Paso 1] | [Comportamiento esperado] | [Señal de fricción] |
       | [Paso 2] | [Comportamiento] | [Señal] |
       | [Paso 3] | [Comportamiento] | [Señal] |

    4. TABLERO DE DECISIÓN FINAL:

       | Experimento | Métrica objetivo | Resultado | Status |
       |-------------|------------------|-----------|--------|
       | Smoke test | >5% conversión | [X]% | / |
       | Concierge | >60% satisfacción | [X]% | / |
       | Wizard of Oz | >50% completion | [X]% | / |

       Criterios GO/NO-GO:

       **GO (Construir MVP completo)**:
       - 3/3 experimentos exitosos, O
       - 2/3 exitosos + insights claros para mejorar el tercero

       **ITERATE (Ajustar y re-testear)**:
       - 1-2/3 experimentos exitosos
       - Tiempo adicional: 2 semanas para iterar

       **PIVOT AGAIN (Cambiar dirección)**:
       - 0/3 experimentos exitosos
       - <30% de usuarios confirman que tienen el problema
       - Acción: Volver a Análisis de Oportunidades

       **Timeline total**: 4 semanas de validación
       **Presupuesto estimado**: $[X] (ads) + [Y] horas equipo

    FORMATO DE RESPUESTA:
    - Usa tablas para cada experimento
    - Incluye métricas específicas de éxito/fracaso
    - Define criterios GO/NO-GO claros
    - Extensión: 800-1100 palabras

    ${COHERENCE_INSTRUCTIONS.crossPhase}`
};

module.exports = { pivotarPrompts };
