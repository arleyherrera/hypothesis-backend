// ===== phases/iterar.js - Prompts para la fase de Iterar =====

const { COHERENCE_INSTRUCTIONS } = require('../coherenceInstructions');

const iterarPrompts = {
  'Plan de Optimización': `
    ${COHERENCE_INSTRUCTIONS.general}
    ${COHERENCE_INSTRUCTIONS.crossPhase}

    Para el "Plan de Optimización", detalla:

    ENFOQUE CRITICO: Optimizar significa ayudar a MAS usuarios a resolver MEJOR su problema, basado en feedback real.

    1. DIAGNOSTICO ACTUAL BASADO EN DATOS DE USUARIOS:

       | Area | Metrica actual | Benchmark objetivo | Gap | Prioridad |
       |------|---------------|-------------------|-----|-----------|
       | Activacion | [X]% usuarios completan onboarding | 40%+ | [Y]% | [Alta/Media/Baja] |
       | Retencion | [X]% usuarios activos semana 2 | 25%+ | [Y]% | [Prioridad] |
       | Conversion | [X]% usuarios pagan/usan core | 5%+ | [Y]% | [Prioridad] |
       | NPS/Satisfaccion | [X] score | 40+ | [Y] | [Prioridad] |

       Principales fricciones reportadas por USUARIOS:
       1. "[Friccion 1]" - Mencionada por [X] usuarios
       2. "[Friccion 2]" - Mencionada por [X] usuarios
       3. "[Friccion 3]" - Mencionada por [X] usuarios

    2. OPTIMIZACIONES PARA QUE EL USUARIO RESUELVA MEJOR SU PROBLEMA:

       | Optimizacion | Problema del USUARIO | Impacto esperado | Esfuerzo | Prioridad |
       |--------------|---------------------|------------------|----------|-----------|
       | [Opt 1: UX] | [Donde usuarios encuentran friccion] | +[X]% completion | [Dias] | [1-5] |
       | [Opt 2: Performance] | [Que frustra al usuario] | -[X]s tiempo carga | [Dias] | [1-5] |
       | [Opt 3: Feature] | [Que pidieron usuarios] | +[X]% satisfaccion | [Dias] | [1-5] |

       Detalle de Top 3 optimizaciones:

       **Optimizacion 1: [Nombre]**
       - Problema del USUARIO: "[Cita de usuario sobre la friccion]"
       - Solucion propuesta: [Descripcion]
       - Hipotesis: "Si [cambio], entonces [X]% mas usuarios [resultado]"
       - Metrica de exito: [Metrica] mejora de [X] a [Y]
       - Timeline: [X] dias

    3. OPTIMIZACIONES PARA QUE MAS USUARIOS DESCUBRAN LA SOLUCION:

       Analisis del funnel actual:
       | Etapa | Usuarios | Conversion | Problema detectado |
       |-------|----------|------------|-------------------|
       | Visita | [1000] | - | - |
       | Registro | [100] | 10% | [Por que abandonan] |
       | Activacion | [40] | 40% | [Por que no activan] |
       | Retencion D7 | [20] | 50% | [Por que no vuelven] |
       | Pago/Core | [5] | 25% | [Por que no convierten] |

       Mayor oportunidad: Etapa [X] con [Y]% drop-off

       Experimentos de optimizacion de funnel:
       | Experimento | Etapa | Hipotesis | Metrica | Duracion |
       |-------------|-------|-----------|---------|----------|
       | [Exp 1] | [Etapa] | "[Cambio] aumentara conversion [X]%" | [Metrica] | [2 semanas] |
       | [Exp 2] | [Etapa] | "[Hipotesis]" | [Metrica] | [Duracion] |

    4. OPTIMIZACIONES OPERACIONALES:

       | Area | Optimizacion | Ahorro/Beneficio | Sin afectar a USUARIOS |
       |------|-------------|------------------|----------------------|
       | Costos | [Reduccion X] | $[Y]/mes | [Como validamos que no afecta] |
       | Tiempo | [Automatizacion Y] | [X] horas/semana | [Validacion] |
       | Procesos | [Mejora Z] | [Beneficio] | [Validacion] |

    5. ROADMAP DE OPTIMIZACIONES:

       | Semana | Optimizaciones | Objetivo | Owner |
       |--------|---------------|----------|-------|
       | 1-2 | [Quick wins: Opt 1, 2] | +[X]% en [metrica] | [Equipo] |
       | 3-4 | [Opt 3, 4] | +[Y]% en [metrica] | [Equipo] |
       | 5-6 | [Opt 5, 6] | +[Z]% en [metrica] | [Equipo] |

    FORMATO DE RESPUESTA:
    - Usa tablas para diagnostico y roadmap
    - Incluye metricas especificas antes/despues
    - Prioriza por impacto en usuarios
    - Extension: 800-1100 palabras`,

  'Priorizacion RICE': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para la "Priorizacion RICE", evalua cada iniciativa:

    ENFOQUE CRITICO: RICE debe priorizar lo que ayuda a MAS usuarios a resolver MEJOR su problema.

    1. LISTA DE INICIATIVAS A EVALUAR:

       Basado en feedback de usuarios y metricas, estas son las iniciativas candidatas:
       | ID | Iniciativa | Origen | Usuarios que lo pidieron/necesitan |
       |----|-----------|--------|-----------------------------------|
       | I1 | [Iniciativa 1] | [Feedback/Metricas/Interno] | [X usuarios] |
       | I2 | [Iniciativa 2] | [Origen] | [X usuarios] |
       | I3 | [Iniciativa 3] | [Origen] | [X usuarios] |
       | I4 | [Iniciativa 4] | [Origen] | [X usuarios] |
       | I5 | [Iniciativa 5] | [Origen] | [X usuarios] |

    2. EVALUACION RICE DETALLADA:

       **REACH (Alcance) - Cuantos usuarios se benefician en [periodo]:**

       | Iniciativa | Usuarios impactados | Calculo | Score R |
       |------------|--------------------|---------|---------|
       | I1 | [X] usuarios/trimestre | [Base de calculo] | [X] |
       | I2 | [Y] usuarios/trimestre | [Base] | [Y] |
       | I3 | [Z] usuarios/trimestre | [Base] | [Z] |

       **IMPACT (Impacto) - Cuanto ayuda al USUARIO:**

       Escala: 3 = Masivo (10x mejor), 2 = Alto (3x mejor), 1 = Medio (50% mejor), 0.5 = Bajo (20% mejor), 0.25 = Minimo

       | Iniciativa | Impacto | Justificacion basada en USUARIOS |
       |------------|---------|----------------------------------|
       | I1 | [0.5-3] | "[Cita de usuario]" / [Evidencia] |
       | I2 | [0.5-3] | [Justificacion] |
       | I3 | [0.5-3] | [Justificacion] |

       **CONFIDENCE (Confianza) - Certeza basada en evidencia:**

       Escala: 100% = Datos solidos, 80% = Alta confianza, 50% = Media, 20% = Baja (apuesta)

       | Iniciativa | Confianza | Evidencia |
       |------------|-----------|-----------|
       | I1 | [X]% | [X] usuarios pidieron esto + [datos de uso] |
       | I2 | [X]% | [Evidencia disponible] |
       | I3 | [X]% | [Evidencia] |

       **EFFORT (Esfuerzo) - Costo en persona-semanas:**

       | Iniciativa | Esfuerzo | Desglose |
       |------------|----------|----------|
       | I1 | [X] persona-semanas | Dev: [X], Design: [Y], QA: [Z] |
       | I2 | [X] persona-semanas | [Desglose] |
       | I3 | [X] persona-semanas | [Desglose] |

    3. CALCULO Y RANKING RICE:

       Formula: RICE Score = (Reach x Impact x Confidence) / Effort

       | Rank | Iniciativa | R | I | C | E | RICE Score |
       |------|-----------|---|---|---|---|------------|
       | 1 | [Iniciativa X] | [R] | [I] | [C%] | [E] | [Score] |
       | 2 | [Iniciativa Y] | [R] | [I] | [C%] | [E] | [Score] |
       | 3 | [Iniciativa Z] | [R] | [I] | [C%] | [E] | [Score] |
       | 4 | [Iniciativa W] | [R] | [I] | [C%] | [E] | [Score] |
       | 5 | [Iniciativa V] | [R] | [I] | [C%] | [E] | [Score] |

    4. RECOMENDACION Y PLAN:

       **Hacer ahora (Score > [X]):**
       - [Iniciativa 1]: Por que es prioridad #1 para USUARIOS
       - [Iniciativa 2]: Justificacion

       **Hacer despues (Score [Y-X]):**
       - [Iniciativa 3]: Cuando hacerla y por que esperar

       **No hacer / Reevaluar (Score < [Y]):**
       - [Iniciativa 4]: Por que no priorizar ahora
       - [Iniciativa 5]: Que evidencia necesitamos para reconsiderar

       **Dependencias y riesgos:**
       - [Iniciativa X] depende de [Y]
       - Riesgo: [Descripcion] - Mitigacion: [Plan]

    FORMATO DE RESPUESTA:
    - Usa tablas para cada componente RICE
    - Incluye calculos explicitos
    - Justifica scores con evidencia de usuarios
    - Extension: 800-1100 palabras

    ${COHERENCE_INSTRUCTIONS.samePhase}`,

  'Roadmap de Iteracion': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para el "Roadmap de Iteracion", planifica:

    ENFOQUE CRITICO: El roadmap debe mostrar COMO iremos ayudando a USUARIOS a resolver mejor su problema.

    1. VISION Y OBJETIVOS DEL PERIODO:

       | Periodo | Objetivo principal | North Star Metric | Target |
       |---------|-------------------|-------------------|--------|
       | Mes 1 | [Objetivo] | [Metrica] | [Valor] |
       | Mes 2-3 | [Objetivo] | [Metrica] | [Valor] |
       | Mes 4-6 | [Objetivo] | [Metrica] | [Valor] |

       Pregunta guia: "Al final de [periodo], queremos que [X]% de usuarios puedan [resolver problema] en [tiempo/forma]"

    2. MES 1 - QUICK WINS PARA EL USUARIO:

       | Semana | Entregable | Problema del USUARIO que resuelve | Metrica de exito |
       |--------|-----------|----------------------------------|------------------|
       | 1 | [Quick win 1] | "[Dolor del usuario]" | [Metrica] +[X]% |
       | 1 | [Quick win 2] | "[Dolor]" | [Metrica] |
       | 2 | [Quick win 3] | "[Dolor]" | [Metrica] |
       | 3 | [Quick win 4] | "[Dolor]" | [Metrica] |
       | 4 | [Quick win 5] | "[Dolor]" | [Metrica] |

       Criterio de exito del mes:
       - [X]% de usuarios reportan mejora en [aspecto]
       - [Metrica clave] mejora de [A] a [B]

    3. MES 2-3 - MEJORAS SUSTANCIALES:

       | Iniciativa | Descripcion | Impacto para USUARIO | Esfuerzo | Semana |
       |------------|-------------|---------------------|----------|--------|
       | [Iniciativa 1] | [Que construimos] | [Como mejora su vida] | [X] semanas | 5-6 |
       | [Iniciativa 2] | [Descripcion] | [Impacto] | [X] semanas | 7-8 |
       | [Iniciativa 3] | [Descripcion] | [Impacto] | [X] semanas | 9-10 |
       | [Iniciativa 4] | [Descripcion] | [Impacto] | [X] semanas | 11-12 |

       Hitos de validacion:
       - Semana 6: Validar [Iniciativa 1] con [X] usuarios
       - Semana 8: Si [metrica] < [umbral], pivotar approach
       - Semana 12: Review de metricas clave

       Criterio de exito del periodo:
       - [X]% mas usuarios resuelven su problema
       - Retencion semana 4 mejora de [A]% a [B]%

    4. MES 4-6 - INNOVACION Y EXPANSION:

       | Apuesta | Hipotesis | Validacion necesaria | Inversion | Go/No-Go |
       |---------|-----------|---------------------|-----------|----------|
       | [Apuesta 1] | "Si [X], entonces [Y]% de usuarios [resultado]" | [Como validar] | [Esfuerzo] | Semana [X] |
       | [Apuesta 2] | "[Hipotesis]" | [Validacion] | [Esfuerzo] | Semana [X] |

       Expansion a nuevos problemas/segmentos:
       - [Problema/Segmento nuevo]: Basado en feedback de [X] usuarios
       - Validacion requerida antes de construir: [Experimento]

    5. DEPENDENCIAS Y RIESGOS:

       | Riesgo | Probabilidad | Impacto | Mitigacion | Trigger para actuar |
       |--------|--------------|---------|------------|---------------------|
       | [Riesgo 1] | [Alta/Media/Baja] | [Alto/Medio/Bajo] | [Plan B] | [Senal de alerta] |
       | [Riesgo 2] | [Probabilidad] | [Impacto] | [Mitigacion] | [Trigger] |

       Dependencias criticas:
       - [Iniciativa X] depende de [Iniciativa Y]
       - [Recurso/Tecnologia] necesaria para [Iniciativa Z]

    6. CALENDARIO VISUAL:

       Mes 1          Mes 2          Mes 3          Mes 4-6
       |--Quick wins--|--Iniciativa 1-|--Iniciativa 3-|--Apuesta 1---|
                      |--Iniciativa 2---------|       |--Apuesta 2---|
                                     |--Iniciativa 4--|

    FORMATO DE RESPUESTA:
    - Usa tablas para cada periodo
    - Incluye metricas de exito especificas
    - Define hitos de validacion con usuarios
    - Extension: 800-1100 palabras

    ${COHERENCE_INSTRUCTIONS.crossPhase}`,

  'Matriz de Impacto': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para la "Matriz de Impacto", mapea:

    ENFOQUE CRITICO: Impacto = Cuanto ayuda al USUARIO a resolver su problema. Esfuerzo = Tiempo para implementar.

    1. INVENTARIO DE INICIATIVAS:

       Lista todas las iniciativas pendientes con su origen:
       | ID | Iniciativa | Origen (feedback/metricas/interno) | Usuarios que lo pidieron |
       |----|-----------|-----------------------------------|-------------------------|
       | 1 | [Iniciativa 1] | [Feedback de X usuarios] | [X] |
       | 2 | [Iniciativa 2] | [Metricas muestran Y] | [Estimado] |
       | 3 | [Iniciativa 3] | [Origen] | [N usuarios] |
       | ... | ... | ... | ... |

    2. EVALUACION DE IMPACTO Y ESFUERZO:

       **Escala de Impacto (para el USUARIO):**
       - 5: Transformador - Usuario resuelve problema 10x mejor
       - 4: Alto - Usuario resuelve problema 3x mejor
       - 3: Medio - Usuario resuelve problema 50% mejor
       - 2: Bajo - Mejora menor pero perceptible
       - 1: Minimo - Mejora marginal

       **Escala de Esfuerzo:**
       - 1: Trivial - < 1 dia
       - 2: Pequeno - 1-3 dias
       - 3: Medio - 1-2 semanas
       - 4: Grande - 2-4 semanas
       - 5: Muy grande - > 1 mes

       | ID | Iniciativa | Impacto (1-5) | Esfuerzo (1-5) | Ratio I/E |
       |----|-----------|---------------|----------------|-----------|
       | 1 | [Iniciativa 1] | [X] | [Y] | [X/Y] |
       | 2 | [Iniciativa 2] | [X] | [Y] | [X/Y] |
       | 3 | [Iniciativa 3] | [X] | [Y] | [X/Y] |

    3. MATRIZ VISUAL 2x2:

                            IMPACTO PARA EL USUARIO
                            Bajo                Alto
                       +------------+------------+
                  Bajo | CONSIDERAR | HACER YA   |
       ESFUERZO        | [I5, I8]   | [I1, I3]   |
                       +------------+------------+
                  Alto | NO HACER   | PLANIFICAR |
                       | [I6, I9]   | [I2, I4]   |
                       +------------+------------+

    4. CUADRANTE 1: HACER YA (Alto Impacto + Bajo Esfuerzo)

       | Prioridad | Iniciativa | Por que alto impacto | Esfuerzo | Owner | Fecha |
       |-----------|-----------|---------------------|----------|-------|-------|
       | 1 | [Iniciativa X] | "[X] usuarios dijeron que..." | [Y dias] | [Nombre] | [Fecha] |
       | 2 | [Iniciativa Y] | [Justificacion] | [Y dias] | [Nombre] | [Fecha] |
       | 3 | [Iniciativa Z] | [Justificacion] | [Y dias] | [Nombre] | [Fecha] |

       Plan de ejecucion:
       - Semana 1: [Iniciativas a completar]
       - Semana 2: [Iniciativas a completar]

    5. CUADRANTE 2: PLANIFICAR (Alto Impacto + Alto Esfuerzo)

       | Iniciativa | Impacto para USUARIO | Esfuerzo | Como dividir | Validar antes |
       |-----------|---------------------|----------|--------------|---------------|
       | [Iniciativa A] | [Descripcion] | [X semanas] | [Fases] | [Experimento] |
       | [Iniciativa B] | [Descripcion] | [X semanas] | [Fases] | [Experimento] |

       Estrategia de validacion antes de construir:
       - [Iniciativa A]: Validar con [X] usuarios que [hipotesis] antes de invertir [Y] semanas
       - [Iniciativa B]: [Estrategia de validacion]

    6. CUADRANTE 3: CONSIDERAR (Bajo Impacto + Bajo Esfuerzo)

       | Iniciativa | Por que bajo impacto | Cuando hacer | Condicion |
       |-----------|---------------------|--------------|-----------|
       | [Iniciativa M] | [Pocos usuarios afectados] | [Si hay tiempo] | [Condicion] |
       | [Iniciativa N] | [Mejora marginal] | [Sprint de deuda] | [Condicion] |

    7. CUADRANTE 4: NO HACER (Bajo Impacto + Alto Esfuerzo)

       | Iniciativa | Por que no hacerla | Que cambiaria la decision |
       |-----------|-------------------|---------------------------|
       | [Iniciativa P] | [X usuarios afectados, Y semanas de trabajo] | [Si Z usuarios lo piden] |
       | [Iniciativa Q] | [Justificacion] | [Condicion para reconsiderar] |

    8. REVISION Y ACTUALIZACION:

       - Frecuencia de revision: [Semanal/Quincenal]
       - Criterio para mover iniciativas entre cuadrantes: [Nuevo feedback, cambio en metricas]
       - Owner de la matriz: [Nombre/Rol]

    FORMATO DE RESPUESTA:
    - Usa la matriz 2x2 visual
    - Incluye tablas detalladas por cuadrante
    - Justifica clasificacion con evidencia de usuarios
    - Extension: 800-1100 palabras

    ${COHERENCE_INSTRUCTIONS.samePhase}`,

  'Estrategia de Crecimiento': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para la "Estrategia de Crecimiento", define:

    ENFOQUE CRITICO: Crecimiento = MAS usuarios descubren y resuelven su problema con nosotros.

    1. DIAGNOSTICO DE CRECIMIENTO ACTUAL:

       Metricas actuales:
       | Metrica | Valor actual | Benchmark | Estado |
       |---------|--------------|-----------|--------|
       | Usuarios activos mensuales | [X] | [Y] | [Rojo/Amarillo/Verde] |
       | Tasa de crecimiento mensual | [X]% | 15%+ | [Estado] |
       | CAC (Costo Adquisicion) | $[X] | $[Y] | [Estado] |
       | LTV (Valor de Vida) | $[X] | $[Y] | [Estado] |
       | Ratio LTV/CAC | [X]:1 | 3:1+ | [Estado] |
       | Coeficiente viral | [X] | 1.0+ | [Estado] |
       | Tiempo al valor | [X dias] | [Y dias] | [Estado] |

       Analisis: [Resumen de donde estamos y principal oportunidad]

    2. MOTORES DE CRECIMIENTO:

       **Motor 1: Crecimiento Viral (usuarios traen usuarios)**

       | Metrica | Actual | Objetivo | Iniciativa para mejorar |
       |---------|--------|----------|------------------------|
       | % usuarios que refieren | [X]% | [Y]% | [Iniciativa] |
       | Invitaciones enviadas/usuario | [X] | [Y] | [Iniciativa] |
       | Tasa conversion referidos | [X]% | [Y]% | [Iniciativa] |
       | Coeficiente viral (K) | [X] | [Y] | [Resultado esperado] |

       Loop viral propuesto:
       1. Usuario resuelve su problema con [producto]
       2. Trigger: [Momento de satisfaccion/exito]
       3. Accion: Usuario comparte/invita porque [motivacion]
       4. Nuevo usuario llega y experimenta valor en [X tiempo]

       **Motor 2: Crecimiento Pagado (adquisicion)**

       | Canal | CAC actual | CAC objetivo | ROAS | Escalar? |
       |-------|-----------|--------------|------|----------|
       | [Canal 1: Ej. Google Ads] | $[X] | $[Y] | [Z]:1 | [Si/No/Testear] |
       | [Canal 2: Ej. Facebook] | $[X] | $[Y] | [Z]:1 | [Si/No/Testear] |
       | [Canal 3: Ej. LinkedIn] | $[X] | $[Y] | [Z]:1 | [Si/No/Testear] |

       Regla de escalamiento: Escalar canal cuando CAC < $[X] y ROAS > [Y]:1

       **Motor 3: Crecimiento Organico (contenido/SEO/comunidad)**

       | Canal | Trafico actual | Conversion | Iniciativa |
       |-------|---------------|------------|------------|
       | SEO | [X] visitas/mes | [Y]% | [Keywords/Contenido a crear] |
       | Contenido | [X] visitas/mes | [Y]% | [Tipo de contenido] |
       | Comunidad | [X] miembros | [Y]% conversion | [Estrategia comunidad] |

    3. EXPERIMENTOS DE CRECIMIENTO:

       | # | Experimento | Hipotesis | Metrica | Duracion | Costo | Prioridad |
       |---|-------------|-----------|---------|----------|-------|-----------|
       | 1 | [Exp 1] | "Si [cambio], [X]% mas usuarios [resultado]" | [Metrica] | [2 sem] | $[X] | [1-5] |
       | 2 | [Exp 2] | "[Hipotesis]" | [Metrica] | [Duracion] | $[X] | [1-5] |
       | 3 | [Exp 3] | "[Hipotesis]" | [Metrica] | [Duracion] | $[X] | [1-5] |
       | 4 | [Exp 4] | "[Hipotesis]" | [Metrica] | [Duracion] | $[X] | [1-5] |
       | 5 | [Exp 5] | "[Hipotesis]" | [Metrica] | [Duracion] | $[X] | [1-5] |

       Proceso de experimentacion:
       1. Lanzar experimento con [X]% de trafico/usuarios
       2. Correr por minimo [Y] dias o [Z] conversiones
       3. Criterio de exito: Mejora de [X]% con [Y]% confianza estadistica
       4. Si exitoso: Escalar a 100%. Si no: Documentar y siguiente experimento

    4. FLYWHEEL DE CRECIMIENTO:

       Representa el ciclo virtuoso donde cada elemento refuerza al siguiente:

       +---> Mas USUARIOS con el problema llegan
       |              |
       |              v
       |     USUARIOS resuelven su problema
       |              |
       |              v
       |     USUARIOS satisfechos refieren/resenan
       |              |
       |              v
       +---- Mejora reputacion y SEO

       Metricas del flywheel:
       - Velocidad: Tiempo promedio del ciclo completo = [X dias]
       - Friccion: Donde se pierde mas momentum = [Etapa]
       - Aceleradores: Que podemos hacer para acelerar = [Iniciativa]

    5. PLAN DE ESCALAMIENTO:

       | Trigger | Accion | Recursos necesarios |
       |---------|--------|---------------------|
       | Cuando CAC < $[X] en [canal] | Aumentar budget a $[Y]/mes | [Recursos] |
       | Cuando retencion D30 > [X]% | Invertir en adquisicion | $[Y] adicionales |
       | Cuando K > 0.5 | Lanzar programa de referidos formal | [Desarrollo + Marketing] |

       Umbrales de seguridad:
       - NO escalar si retencion D7 < [X]%
       - Pausar canal si CAC > [Y] por [Z] semanas
       - Revisar estrategia si crecimiento < [X]% por [Y] meses

    FORMATO DE RESPUESTA:
    - Usa tablas para metricas y experimentos
    - Incluye el diagrama del flywheel
    - Define triggers claros para escalar
    - Extension: 900-1200 palabras

    ${COHERENCE_INSTRUCTIONS.crossPhase}`,

  'Sistema de Feedback Loop': `
    ${COHERENCE_INSTRUCTIONS.general}

    Para el "Sistema de Feedback Loop", implementa:

    ENFOQUE CRITICO: Ciclo continuo de escuchar al USUARIO -> mejorar -> medir si ayudo al USUARIO.

    1. FUENTES DE FEEDBACK DEL USUARIO:

       | Fuente | Tipo | Frecuencia | Owner | Herramienta |
       |--------|------|------------|-------|-------------|
       | Encuesta in-app (NPS) | Cuantitativo | Post-accion clave | [Rol] | [Tool] |
       | Encuesta in-app (CSAT) | Cuantitativo | Semanal | [Rol] | [Tool] |
       | Entrevistas 1:1 | Cualitativo | [X]/mes | [Rol] | [Calendly/etc] |
       | Chat de soporte | Cualitativo | Continuo | [Rol] | [Tool] |
       | Reviews publicas | Cualitativo | Semanal | [Rol] | [Google/App Store] |
       | Comportamiento (analytics) | Cuantitativo | Continuo | [Rol] | [Tool] |
       | Feature requests | Cualitativo | Continuo | [Rol] | [Tool] |

       Cobertura objetivo: Feedback de al menos [X]% de usuarios activos cada [periodo]

    2. PUNTOS DE RECOLECCION EN EL JOURNEY:

       | Momento | Pregunta al USUARIO | Formato | Trigger |
       |---------|--------------------|---------|---------|
       | Post-onboarding | "Que tan facil fue empezar?" (1-5) | Rating | Completar onboarding |
       | Post-accion core | "Resolviste tu problema?" (Si/No + por que) | Binario + texto | Completar [accion] |
       | Dia 7 | "Que tan probable es que recomiendes?" (NPS) | 0-10 | 7 dias desde registro |
       | Post-soporte | "Te ayudamos a resolver tu problema?" | CSAT | Cerrar ticket |
       | Pre-churn | "Por que te vas?" (opciones) | Multiple choice | Intento de cancelar |

       Reglas de no-spam:
       - Maximo [X] encuestas por usuario por [periodo]
       - No preguntar si usuario ya respondio en ultimos [Y] dias
       - Priorizar feedback cualitativo de usuarios activos

    3. PROCESO DE ANALISIS SEMANAL:

       **Reunion de Feedback (60 min/semana)**

       Agenda:
       | Tiempo | Actividad | Output |
       |--------|-----------|--------|
       | 10 min | Review metricas cuantitativas (NPS, CSAT, retention) | Dashboard actualizado |
       | 20 min | Analisis feedback cualitativo (themes, quotes) | Top 5 temas |
       | 15 min | Priorizacion de insights | Lista priorizada |
       | 15 min | Asignacion de acciones | Owners + fechas |

       Template de Insight Card:
       +------------------------------------------+
       | INSIGHT #[N]: [Titulo descriptivo]       |
       |------------------------------------------|
       | Fuente: [X] usuarios via [canal]         |
       | Frecuencia: [X] menciones en [periodo]   |
       | Cita representativa: "[Quote]"           |
       | Impacto: [Alto/Medio/Bajo]               |
       | Accion propuesta: [Descripcion]          |
       | Owner: [Nombre] | Fecha: [DD/MM]         |
       +------------------------------------------+

    4. INTEGRACION CON DESARROLLO:

       Flujo de feedback a producto:

       Feedback --> Analisis --> Insight --> Backlog --> Sprint --> Release --> Medir
          |                        |                                              |
          +------------------------+----------------------------------------------+
                                      Loop de validacion

       | Etapa | SLA | Responsable | Output |
       |-------|-----|-------------|--------|
       | Feedback recibido | Mismo dia | Soporte | Ticket/registro |
       | Analisis inicial | 48 horas | Product | Insight card |
       | Priorizacion | Semanal | Product + Tech | Backlog ordenado |
       | Implementacion | Segun prioridad | Dev | Feature/fix |
       | Validacion | Post-release | Product | Metricas de impacto |

    5. COMUNICACION DE VUELTA AL USUARIO:

       **Cerrar el loop: Informar que escuchamos y actuamos**

       | Situacion | Mensaje al USUARIO | Canal | Timing |
       |-----------|-------------------|-------|--------|
       | Implementamos su sugerencia | "Gracias por tu feedback! Ahora puedes [X]" | Email + in-app | Post-release |
       | Sugerencia en backlog | "Recibimos tu idea. Esta en nuestro radar" | Email | 1 semana |
       | No implementaremos | "Gracias por [X]. Decidimos [Y] porque [razon]" | Email | Cuando decidimos |
       | Bug reportado y arreglado | "El problema que reportaste ya esta resuelto" | Email | Post-fix |

       Template de comunicacion:
       ---
       Asunto: Tu feedback importa - [Actualizacion/Nueva feature]

       Hola [Nombre],

       Hace [X tiempo] nos dijiste: "[Su feedback original]"

       Queríamos contarte que [accion tomada].

       [Detalle de que cambio y como le beneficia]

       Gracias por ayudarnos a mejorar.

       [Firma]
       ---

    6. METRICAS DEL SISTEMA DE FEEDBACK:

       | Metrica | Objetivo | Actual | Tendencia |
       |---------|----------|--------|-----------|
       | Tasa de respuesta a encuestas | >[X]% | [Y]% | [Subiendo/Bajando] |
       | Tiempo promedio de respuesta a feedback | <[X] dias | [Y] dias | [Tendencia] |
       | % feedback que resulta en accion | >[X]% | [Y]% | [Tendencia] |
       | NPS (evolucion) | >[X] | [Y] | [Tendencia] |
       | % usuarios que reciben cierre de loop | >[X]% | [Y]% | [Tendencia] |

    7. MEJORA CONTINUA DEL SISTEMA:

       Revision trimestral:
       - Que fuentes de feedback son mas valiosas?
       - Donde hay gaps en la cobertura?
       - El proceso es sostenible para el equipo?
       - Los usuarios sienten que los escuchamos?

    FORMATO DE RESPUESTA:
    - Usa tablas para fuentes, proceso y metricas
    - Incluye templates listos para usar
    - Define SLAs y responsables claros
    - Extension: 900-1200 palabras

    ${COHERENCE_INSTRUCTIONS.samePhase}`
};

module.exports = { iterarPrompts };
