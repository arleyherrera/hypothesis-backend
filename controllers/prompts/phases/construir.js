// ===== phases/construir.js - Prompts para la fase de Construir =====

const { COHERENCE_INSTRUCTIONS } = require('../coherenceInstructions');

const construirPrompts = {
  'MVP Personalizado': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para el artefacto "MVP Personalizado", desarrolla los siguientes puntos específicos:

    ENFOQUE CRÍTICO: Todo debe partir del PROBLEMA que sufre el USUARIO, no de "tu hipótesis" o "tu MVP".

    1. CARACTERÍSTICAS QUE EL USUARIO NECESITA PARA RESOLVER SU PROBLEMA:

       Presenta una tabla de priorización MoSCoW:
       | Característica | Descripción | Prioridad | Dolor que resuelve |
       |----------------|-------------|-----------|-------------------|
       | [Nombre] | [Qué hace] | Must/Should/Could/Won't | [Qué dolor del USUARIO alivia] |

       - Identifica 3-7 características esenciales que el USUARIO necesita para aliviar su dolor
       - Para cada característica MUST-HAVE, describe:
         * Escenario: "Cuando el USUARIO enfrenta [situación], usa [característica] para [resultado]"
         * Criterio de éxito: ¿Cómo sabe el USUARIO que funcionó?
         * Riesgo si falta: ¿Qué pasa si el MVP no tiene esto?

    2. CÓMO EL USUARIO USARÍA EL MVP PARA RESOLVER SU PROBLEMA:
       - Describe un día típico del USUARIO donde el problema ocurre (narrativa de 3-5 pasos)
       - User journey: Paso a paso cómo el USUARIO interactúa con el MVP
         * Paso 1: El USUARIO descubre el MVP cuando [trigger]
         * Paso 2: El USUARIO intenta resolver [aspecto del problema]
         * Paso 3: El USUARIO obtiene [resultado esperado]
       - Cronograma de desarrollo (semanas 1-4, 5-8, 9-12) con entregables específicos
       - Stack tecnológico recomendado justificado por velocidad de validación

    3. EXPERIMENTOS PARA VALIDAR QUE ESTAMOS RESOLVIENDO EL PROBLEMA DEL USUARIO:

       Para cada experimento, usa este formato:
       | Experimento | Hipótesis | Método | Muestra | Criterio de éxito |
       |-------------|-----------|--------|---------|-------------------|

       - Experimento 1: Validar que el PROBLEMA existe (mínimo 10-15 usuarios)
       - Experimento 2: Validar que la SOLUCIÓN resuelve el problema (mínimo 5-10 usuarios)
       - Experimento 3: Validar disposición a pagar/usar (mínimo 20 usuarios)

       Criterios GO/NO-GO:
       - GO: Si >70% de usuarios confirman el problema Y >50% usarían la solución
       - NO-GO: Si <40% confirman el problema → pivotar

    FORMATO DE RESPUESTA:
    - Usa tablas donde se indique
    - Incluye números específicos (no rangos vagos)
    - Extensión: 800-1200 palabras

    ${COHERENCE_INSTRUCTIONS.samePhase}`,
  
  'Mapa de Empatía Personalizado': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para el "Mapa de Empatía Personalizado", desarrolla:

    ENFOQUE CRÍTICO: Crea un USUARIO REAL (con nombre, edad, contexto) que SUFRE el PROBLEMA descrito en la hipótesis.
    Escribe desde la PERSPECTIVA de ese usuario, no como observador externo.

    1. PERFIL DETALLADO DEL USUARIO (PERSONA):

       Crea un perfil con este formato:
       | Atributo | Detalle |
       |----------|---------|
       | Nombre | [Nombre ficticio realista] |
       | Edad | [Rango de edad] |
       | Ocupación | [Trabajo/rol] |
       | Contexto | [Situación de vida relevante al problema] |
       | Frase característica | "[Cita textual de cómo expresa su frustración]" |

       Desarrolla el mapa de empatía:
       - PIENSA y SIENTE: Sus frustraciones ("Me frustra que..."), aspiraciones ("Quisiera poder..."), miedos ("Me preocupa que...")
       - OYE: Lo que escucha de colegas, familia, medios sobre el PROBLEMA
       - VE: Su entorno cuando el PROBLEMA ocurre, alternativas que ha probado sin éxito
       - DICE y HACE: Cómo expresa su frustración, qué hace actualmente para "sobrevivir" el problema

    2. DOLORES ESPECÍFICOS DEL USUARIO:

       Presenta en tabla priorizada:
       | # | Dolor | Intensidad (1-10) | Frecuencia | Impacto en su vida |
       |---|-------|-------------------|------------|-------------------|
       | 1 | [Dolor más intenso] | [8-10] | [Diario/Semanal] | [Cómo afecta] |

       - Lista 5-7 dolores ordenados de mayor a menor intensidad
       - Incluye citas del usuario: "Lo peor es cuando..." "Me hace sentir..."

    3. GANANCIAS QUE EL USUARIO DESEA:

       | Ganancia | Cómo mediría el éxito | Qué le permitiría hacer |
       |----------|----------------------|------------------------|
       | [Ganancia 1] | [Métrica personal] | [Nueva capacidad] |

       - ¿Qué diría el usuario si el problema se resolviera? "[Cita de alivio]"
       - ¿Cómo cambiaría su día a día? (antes vs después)

    FORMATO DE RESPUESTA:
    - Incluye citas textuales del usuario entre comillas
    - Usa tablas para organizar información
    - El perfil debe sentirse como una persona REAL, no genérica
    - Extensión: 600-900 palabras

    ${COHERENCE_INSTRUCTIONS.samePhase}`,
  
  'Backlog de Funcionalidades': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para el "Backlog de Funcionalidades", estructura:

    ENFOQUE CRÍTICO: Cada funcionalidad debe resolver un aspecto específico del PROBLEMA que sufre el USUARIO.
    Prioriza por "dolor del usuario" no por "facilidad técnica".

    1. ÉPICAS BASADAS EN LOS DOLORES DEL USUARIO:

       | Épica | Dolor que resuelve | Impacto para el USUARIO | Sprint objetivo |
       |-------|-------------------|------------------------|-----------------|
       | [Nombre épica] | [Dolor específico] | [Cómo mejora su vida] | Sprint [#] |

       - Define 3-5 épicas donde cada una representa un aspecto del PROBLEMA
       - Ordena por: Mayor dolor del USUARIO primero

    2. USER STORIES PRIORIZADAS:

       | ID | User Story | Puntos | Prioridad | Épica |
       |----|------------|--------|-----------|-------|
       | US-01 | Como [usuario], quiero [acción], para [resolver dolor] | [1-8] | Must/Should/Could | [Épica] |

       - Escribe 10-15 user stories en formato estándar
       - Puntos de historia: 1 (trivial), 2 (simple), 3 (medio), 5 (complejo), 8 (muy complejo)
       - Prioridad basada en: ¿Sin esto, el USUARIO sigue sufriendo? → Must-have

    3. CRITERIOS DE ACEPTACIÓN (para las 5 historias Must-have):

       Para cada historia, usa formato Given/When/Then:

       **US-01: [Nombre]**
       - GIVEN: [Contexto - El usuario está en X situación con el problema]
       - WHEN: [Acción - El usuario hace Y]
       - THEN: [Resultado - El usuario obtiene Z que resuelve su dolor]

       Casos edge a considerar:
       - ¿Qué pasa si [situación inesperada]?
       - ¿Cómo sabe el USUARIO que funcionó?

    FORMATO DE RESPUESTA:
    - Usa tablas para épicas y user stories
    - Incluye IDs para trazabilidad (US-01, US-02...)
    - Criterios de aceptación en formato Given/When/Then
    - Extensión: 700-1000 palabras

    ${COHERENCE_INSTRUCTIONS.samePhase}`,
  
  'Experimentos de Validación': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para "Experimentos de Validación", diseña:

    ENFOQUE CRÍTICO: Todos los experimentos deben validar CON usuarios REALES, no con suposiciones.
    Observa QUÉ HACEN los usuarios, no solo qué DICEN.

    1. EXPERIMENTO 1: VALIDAR QUE EL PROBLEMA EXISTE

       | Aspecto | Detalle |
       |---------|---------|
       | Hipótesis | "X% de [segmento] experimentan [problema] al menos [frecuencia]" |
       | Método | Entrevistas de descubrimiento (NO vender, solo escuchar) |
       | Muestra | Mínimo 10-15 usuarios del segmento |
       | Duración | 2-3 semanas |
       | Criterio de éxito | >70% confirman el problema con ejemplos concretos |
       | Criterio de fracaso | <40% tienen el problema → pivotar segmento |

       Preguntas clave (abiertas, no sesgadas):
       - "Cuéntame sobre la última vez que enfrentaste [situación del problema]"
       - "¿Qué hiciste para resolverlo? ¿Funcionó?"
       - "¿Con qué frecuencia te ocurre esto?"

       EVITAR preguntar: "¿Te gustaría una app que...?" (sesgo de confirmación)

    2. EXPERIMENTO 2: VALIDAR QUE LA SOLUCIÓN FUNCIONA

       | Aspecto | Detalle |
       |---------|---------|
       | Hipótesis | "Usuarios logran [resultado] usando el prototipo en menos de [tiempo]" |
       | Método | Test de usabilidad con prototipo/MVP mínimo |
       | Muestra | 5-10 usuarios que confirmaron el problema |
       | Duración | 1-2 semanas |
       | Criterio de éxito | >60% completan la tarea sin ayuda |
       | Criterio de fracaso | <30% completan → rediseñar solución |

       Métricas a observar:
       - Tiempo para completar tarea principal
       - Puntos de confusión/abandono
       - Expresiones del usuario ("Ah, esto es lo que necesitaba")

    3. EXPERIMENTO 3: VALIDAR DISPOSICIÓN A PAGAR/USAR

       | Aspecto | Detalle |
       |---------|---------|
       | Hipótesis | "X% de usuarios se registrarían/pagarían por resolver este problema" |
       | Método | Landing page + CTA (registro, pre-orden, waitlist) |
       | Muestra | Mínimo 100-200 visitas para significancia |
       | Duración | 2-4 semanas |
       | Criterio de éxito | >5% conversión a registro, >2% a pago |
       | Criterio de fracaso | <1% conversión → replantear propuesta de valor |

       Canales para encontrar usuarios:
       - [Canal 1]: Donde usuarios hablan del problema
       - [Canal 2]: Comunidades del segmento
       - Presupuesto estimado: $[X] para ads de prueba

    FORMATO DE RESPUESTA:
    - Usa tablas para cada experimento
    - Incluye números específicos (no "algunos usuarios")
    - Define criterios GO/NO-GO claros
    - Extensión: 800-1100 palabras

    ${COHERENCE_INSTRUCTIONS.crossPhase}`,
  
  'Plan de Recursos': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para el "Plan de Recursos", detalla:

    ENFOQUE CRÍTICO: Cada recurso debe justificarse por su capacidad de ayudar a entender/resolver el PROBLEMA del USUARIO.
    Minimiza gastos hasta VALIDAR con usuarios reales.

    1. RECURSOS HUMANOS:

       | Rol | Responsabilidad | Cuándo incorporar | Costo estimado |
       |-----|-----------------|-------------------|----------------|
       | [Rol 1] | [Qué hace para resolver el problema del USUARIO] | Fase [X] | $[rango]/mes |

       Equipo mínimo para validar (Fase 1):
       - [Rol esencial 1]: Para [contribución al problema del usuario]
       - [Rol esencial 2]: Para [contribución]

       Equipo para escalar (Fase 2 - solo después de validar):
       - [Rol adicional]: Incorporar cuando [métrica de validación] se cumpla

    2. RECURSOS TÉCNICOS:

       | Categoría | Herramienta | Propósito | Costo/mes |
       |-----------|-------------|-----------|-----------|
       | Desarrollo | [Tool] | Construir MVP rápido | $[X] |
       | Analytics | [Tool] | Medir si usuarios resuelven su problema | $[X] |
       | Comunicación | [Tool] | Hablar con usuarios | $[X] |

       Stack recomendado justificado por velocidad:
       - Frontend: [Tecnología] - porque permite [validar rápido]
       - Backend: [Tecnología] - porque [razón]
       - Hosting: [Servicio] - tier gratuito suficiente para validación

    3. RECURSOS FINANCIEROS:

       | Período | Presupuesto | Objetivo | Hito de validación |
       |---------|-------------|----------|-------------------|
       | Mes 1-2 | $[X] | Validar problema | 15+ entrevistas, >70% confirman problema |
       | Mes 3-4 | $[X] | Validar solución | MVP en manos de 20+ usuarios |
       | Mes 5-6 | $[X] | Validar negocio | Primeros usuarios pagando/activos |

       Burn rate mensual: $[X]
       Runway actual: [X] meses
       Trigger para buscar funding: Cuando [métrica de validación específica]

       REGLA: No gastar en escalar hasta validar con usuarios reales.

    FORMATO DE RESPUESTA:
    - Usa tablas para organizar recursos
    - Incluye costos estimados en rangos (bajo: $X-Y, medio: $Y-Z)
    - Justifica cada gasto por su contribución a validar con usuarios
    - Extensión: 600-900 palabras

    ${COHERENCE_INSTRUCTIONS.samePhase}`,
  
  'Estrategia de Early Adopters': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para la "Estrategia de Early Adopters", desarrolla:

    ENFOQUE CRÍTICO: Early adopters son USUARIOS que SUFREN el PROBLEMA intensamente y necesitan solución YA.
    Búscalos donde HABLAN del problema, no donde hablan de tecnología.

    1. PERFIL DEL EARLY ADOPTER IDEAL:

       | Atributo | Descripción |
       |----------|-------------|
       | Quién es | [Descripción específica del usuario que MÁS sufre el problema] |
       | Por qué sufre más | [Razón por la que el problema es más intenso para ellos] |
       | Qué ha intentado | [Soluciones que ya probó sin éxito] |
       | Señales de identificación | [Cómo reconocerlos: qué dicen, dónde están, qué buscan] |

       Características del early adopter ideal:
       - Tiene el problema con frecuencia [diaria/semanal]
       - Ya gasta [tiempo/dinero] intentando resolverlo
       - Está activamente buscando soluciones (no pasivo)

    2. CANALES PARA ENCONTRAR EARLY ADOPTERS:

       | Canal | Por qué están ahí | Mensaje clave | Costo estimado |
       |-------|-------------------|---------------|----------------|
       | [Canal 1] | [Hablan del problema aquí] | "[Mensaje empático sobre el dolor]" | $[X] |
       | [Canal 2] | [Buscan soluciones aquí] | "[Mensaje]" | $[X] |
       | [Canal 3] | [Comunidad del segmento] | "[Mensaje]" | $[X] |

       Ejemplos de mensajes (enfocados en DOLOR, no features):
       - ❌ MAL: "Nuestra app tiene IA para organizar tareas"
       - ✅ BIEN: "¿Pierdes horas buscando información que ya guardaste?"

       Script de primer contacto:
       "Hola [nombre], vi que mencionaste [problema]. Estamos investigando cómo resolver esto. ¿Tendrías 15 min para contarme tu experiencia?"

    3. ONBOARDING Y ACTIVACIÓN:

       | Paso | Tiempo | Objetivo | Métrica de éxito |
       |------|--------|----------|------------------|
       | 1. Registro | <1 min | Capturar usuario | % que completa registro |
       | 2. Primera acción | <2 min | Experimentar valor | % que completa acción core |
       | 3. "Momento aha" | <5 min | Resolver un dolor | % que dice "esto me sirve" |

       Incentivos para early adopters:
       - Acceso gratuito durante beta
       - Acceso directo al equipo para dar feedback
       - Descuento de por vida si ayudan a mejorar el producto

       Programa de referidos:
       - Trigger: Después de que el usuario resuelve su problema exitosamente
       - Mensaje: "¿Conoces a alguien más con este problema?"
       - Incentivo: [Beneficio para quien refiere y referido]

    FORMATO DE RESPUESTA:
    - Usa tablas para perfiles, canales y onboarding
    - Incluye ejemplos de mensajes concretos
    - Scripts de contacto listos para usar
    - Extensión: 700-1000 palabras

    ${COHERENCE_INSTRUCTIONS.samePhase}`
};

module.exports = { construirPrompts };