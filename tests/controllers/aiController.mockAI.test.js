const aiController = require('../../controllers/aiController');
const { Hypothesis, Artifact } = require('../../models');
const axios = require('axios');
const vectorContextService = require('../../services/vectorContextService');

// IMPORTANTE: Mockeamos axios para NO hacer llamadas reales a la IA
jest.mock('axios');
jest.mock('../../models');
jest.mock('../../services/vectorContextService');

describe('AIController - Tests con IA Mockeada', () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: 1 }, params: {}, body: {} };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    
    // Configurar API key para que el controlador piense que puede usar IA
    process.env.AI_API_KEY = 'test-api-key';
    
    jest.clearAllMocks();
  });

  describe('GENERACIÓN DE ARTEFACTOS CON IA', () => {
    it('Caso real: Generar MVP con IA para restaurante', async () => {
      // ENTRADA: Hipótesis real de un restaurante
      const hypothesis = {
        id: 1,
        name: 'Sistema de Reservas para Restaurantes',
        problem: 'Los restaurantes pequeños pierden 30% de clientes potenciales por no tener sistema de reservas online accesible',
        solution: 'Aplicación web simple sin comisiones que permite reservas con confirmación automática por WhatsApp',
        customerSegment: 'Restaurantes familiares con 20-50 mesas en ciudades medianas de LATAM',
        valueProposition: 'Aumenta tu ocupación 25% con reservas online sin pagar comisiones',
        userId: 1
      };

      req.params = { hypothesisId: 1, phase: 'construir' };
      
      // Mock de base de datos
      Hypothesis.findOne.mockResolvedValue(hypothesis);
      
      // MOCK DE RESPUESTA DE IA: Simulamos lo que DeepSeek devolvería
      const mockAIResponses = {
        'MVP Personalizado': `# MVP Personalizado para Sistema de Reservas

## Análisis del Problema Central
El problema identificado: "Los restaurantes pequeños pierden 30% de clientes potenciales por no tener sistema de reservas online accesible" requiere una solución que sea:
- Económicamente viable para negocios pequeños
- Técnicamente simple de implementar
- Fácil de usar para clientes no técnicos

## Características Críticas del MVP

### 1. Sistema de Reservas Básico (MUST HAVE)
**Funcionalidad**: Formulario web responsive para realizar reservas
**Componentes**:
- Selección de fecha con calendario visual
- Selección de hora con slots de 30 minutos
- Número de comensales (1-20)
- Datos básicos: nombre, teléfono
**Por qué es crítico**: Es la funcionalidad core que resuelve directamente el problema de pérdida de clientes

### 2. Confirmación Automática por WhatsApp (MUST HAVE)
**Funcionalidad**: Envío automático de confirmación al cliente
**Componentes**:
- Integración con API de WhatsApp Business
- Mensaje personalizado con detalles de la reserva
- Botón de cancelación con link único
**Por qué es crítico**: WhatsApp tiene 90% de penetración en LATAM, garantiza que el cliente reciba la confirmación

### 3. Panel de Gestión Simple (MUST HAVE)
**Funcionalidad**: Dashboard para el restaurante
**Componentes**:
- Vista de calendario con reservas del día
- Lista de reservas pendientes
- Capacidad de confirmar/rechazar manualmente
**Por qué es crítico**: El restaurante necesita visibilidad total de sus reservas

### 4. Configuración de Disponibilidad (SHOULD HAVE)
**Funcionalidad**: Definir horarios y capacidad
**Componentes**:
- Horarios de apertura/cierre por día
- Número máximo de reservas por slot
- Bloqueo de fechas especiales
**Por qué es crítico**: Evita sobreventa y conflictos de reservas

## Plan de Desarrollo - 4 Semanas

### Semana 1: Setup y Backend Básico
- Configurar infraestructura en Railway/Vercel (gratis primer mes)
- API REST con Node.js + PostgreSQL
- Modelos: Restaurant, Reservation, TimeSlot
- Endpoints básicos CRUD

### Semana 2: Frontend de Reservas
- Landing page con React/Next.js
- Formulario de reserva responsive
- Integración con backend
- Testing con 5 usuarios reales

### Semana 3: WhatsApp y Panel Admin
- Integración WhatsApp Business API
- Panel de administración básico
- Sistema de notificaciones
- Testing con 3 restaurantes piloto

### Semana 4: Polish y Lanzamiento
- Corrección de bugs
- Mejoras UX basadas en feedback
- Documentación para restaurantes
- Despliegue en producción

## Experimentos de Validación

### Experimento 1: Validación de Demanda
**Hipótesis**: Los restaurantes están dispuestos a pagar $20-30 USD/mes por el servicio
**Método**: Landing page con formulario de pre-registro
**Métrica**: 30% de conversión de visita a registro
**Duración**: 1 semana

### Experimento 2: Validación de Uso
**Hipótesis**: Los clientes preferirán reservar online vs llamar
**Método**: A/B test con 5 restaurantes mostrando ambas opciones
**Métrica**: 40% de reservas deben ser online en primera semana
**Duración**: 2 semanas

### Experimento 3: Validación de Retención  
**Hipótesis**: 70% de clientes que reservan online volverán a hacerlo
**Método**: Tracking de usuarios recurrentes
**Métrica**: 70% de re-reserva en 30 días
**Duración**: 1 mes

## Stack Tecnológico Recomendado
- **Frontend**: Next.js (SEO + performance)
- **Backend**: Node.js + Express
- **Base de datos**: PostgreSQL (Supabase tier gratis)
- **WhatsApp**: Twilio API para WhatsApp
- **Hosting**: Vercel (frontend) + Railway (backend)
- **Costo estimado**: <$50 USD/mes inicialmente`,

        'Mapa de Empatía Personalizado': `# Mapa de Empatía - Dueño de Restaurante Familiar

## ¿Qué PIENSA y SIENTE?

### Preocupaciones principales:
- "Pierdo clientes porque no contesto el teléfono durante horas pico"
- "Las comisiones de apps como UberEats me matan el margen"
- "Mi competencia ya tiene reservas online y yo sigo con libreta"
- "¿Y si invierto en tecnología y no la sé usar?"

### Aspiraciones:
- Quiere modernizar su negocio sin perder la esencia familiar
- Sueña con llenar el restaurante todos los días
- Desea más tiempo para enfocarse en la cocina y menos en administración

## ¿Qué OYE?

### De sus clientes:
- "¿Tienen WhatsApp para reservar?"
- "Llamé 5 veces y no contestaron"
- "En el restaurante X puedo reservar por Internet"

### De su entorno:
- Otros dueños hablan de apps caras y complicadas
- Proveedores le ofrecen soluciones "todo en uno" costosas
- Su hijo/sobrino le dice que necesita "digitalizarse"

## ¿Qué VE?

### En su negocio:
- Mesas vacías en horarios valle
- El teléfono sonando sin parar en horas pico
- Clientes que se van cuando ven el local lleno (sin saber que hay mesas por desocupar)

### En la competencia:
- Restaurantes nuevos con tablets y sistemas modernos
- Cadenas grandes con apps propias
- Competidores locales empezando a usar Instagram para reservas

## ¿Qué DICE y HACE?

### Comportamiento público:
- Anota reservas en una libreta o Excel
- Pide a su mesero de confianza que atienda el teléfono
- Publica fotos de sus platos en Facebook
- Se disculpa cuando pierde reservas por desorganización

### Actitud:
- Orgulloso de su negocio familiar
- Cauteloso con inversiones en tecnología
- Prefiere soluciones simples y probadas

## Puntos de Dolor Específicos

1. **Pérdida directa de ingresos**: 30% de clientes potenciales = $3,000-5,000 USD/mes perdidos
2. **Sobrecarga operativa**: 2-3 horas diarias gestionando reservas manualmente
3. **No-shows**: 20% de reservas telefónicas no llegan, sin forma de confirmar
4. **Falta de datos**: No sabe cuáles son sus horas pico reales ni patrones de reserva
5. **Imagen desactualizada**: Clientes jóvenes esperan reservar online
6. **Dependencia del personal**: Si falta quien maneja las reservas, caos total
7. **Conflictos de reservas**: Dobles reservas, mesas mal asignadas

## Ganancias Deseadas

### ¿Qué desea lograr?
1. **Llenar el restaurante** en horarios valle con promociones targeted
2. **Cero comisiones** - maximizar ganancia por cada cliente
3. **Dormir tranquilo** sabiendo que no perderá reservas
4. **Profesionalizar la imagen** sin perder el toque personal
5. **Datos para decisiones** - saber qué días/horas necesita más personal

### ¿Cómo mediría el éxito?
- Aumento de 25% en ocupación total
- Reducción de 90% en tiempo dedicado a gestionar reservas
- 0% de dobles reservas o conflictos
- Clientes felices que recomiendan el restaurante
- ROI positivo desde el primer mes`,

        // Agregar más respuestas mockeadas para otros artefactos...
      };

      // Mock de llamadas a IA para cada artefacto
      let callCount = 0;
      const artifactNames = [
        'MVP Personalizado',
        'Mapa de Empatía Personalizado',
        'Backlog de Funcionalidades',
        'Experimentos de Validación',
        'Plan de Recursos',
        'Estrategia de Early Adopters'
      ];

      axios.post.mockImplementation((url, data) => {
        const artifactName = artifactNames[callCount++];
        const aiContent = mockAIResponses[artifactName] || `# ${artifactName}\n\nContenido generado por IA...`;
        
        return Promise.resolve({
          data: {
            choices: [{
              message: {
                content: aiContent
              }
            }]
          }
        });
      });

      // Mock de vector context
      vectorContextService.storeArtifactContext.mockResolvedValue(true);
      vectorContextService.getRelevantContext.mockResolvedValue({
        contexts: [],
        coherenceGuidelines: { terminology: [] }
      });
      vectorContextService.getContextStats.mockResolvedValue({
        phaseDistribution: [],
        globalCoherence: { score: 0.8 }
      });

      // Mock de Artifact.create
      Artifact.create.mockImplementation((data) => Promise.resolve({
        id: Date.now(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      // EJECUTAR
      await aiController.generateArtifactWithAI(req, res);

      // VERIFICAR SALIDA
      console.log('\n📤 SALIDA ESPERADA:');
      console.log('- Status: 201');
      console.log('- 6 artefactos generados con contenido de IA');
      console.log('- Cada artefacto debe contener análisis específico del problema del restaurante');

      expect(res.status).toHaveBeenCalledWith(201);
      
      const response = res.json.mock.calls[0][0];
      expect(response.message).toContain('6 artefactos generados con IA');
      expect(response.artifacts).toHaveLength(6);
      
      // Verificar que el contenido es específico para el problema
      const mvpArtifact = response.artifacts.find(a => a.name === 'MVP Personalizado (IA)');
      expect(mvpArtifact.content).toContain('30% de clientes potenciales');
      expect(mvpArtifact.content).toContain('WhatsApp');
      expect(mvpArtifact.content).toContain('confirmación automática');
      
      // Verificar que se llamó a la IA 6 veces
      expect(axios.post).toHaveBeenCalledTimes(6);
      
      // Verificar que se almacenó el contexto vectorial
      expect(vectorContextService.storeArtifactContext).toHaveBeenCalledTimes(6);
    });

    it('Caso real: Mejorar artefacto existente con IA', async () => {
      // ENTRADA: Artefacto existente que queremos mejorar
      const existingArtifact = {
        id: 123,
        name: 'Plan de Marketing Digital',
        phase: 'medir',
        content: `# Plan de Marketing Digital

## Estrategia General
Usar redes sociales para promocionar el restaurante.

## Canales
- Facebook
- Instagram
- WhatsApp Business

## Presupuesto
$100 USD mensuales en publicidad.`,
        hypothesisId: 1,
        hypothesis: {
          userId: 1,
          problem: 'Los restaurantes pequeños pierden 30% de clientes potenciales por no tener sistema de reservas online'
        },
        update: jest.fn()
      };

      req.params = { id: 123 };
      req.body = {
        prompt: 'Mejora este plan agregando métricas específicas, estrategias de contenido y calendario de publicaciones'
      };

      // Mocks
      Artifact.findByPk.mockResolvedValue(existingArtifact);
      
      // Mock de respuesta de IA mejorada
      axios.post.mockResolvedValue({
        data: {
          choices: [{
            message: {
              content: `# Plan de Marketing Digital - Versión Mejorada

## Estrategia General
Posicionar el restaurante como la opción preferida para comidas familiares mediante contenido que resalte la facilidad de reservar online y la experiencia gastronómica única.

## Objetivos SMART
1. **Awareness**: Alcanzar 10,000 personas únicas/mes en 3 meses
2. **Engagement**: Lograr 5% de tasa de interacción promedio
3. **Conversión**: Generar 200 reservas online/mes vía redes sociales
4. **Retención**: 40% de clientes repiten reserva en 60 días

## Canales y Estrategia Específica

### Facebook (40% del presupuesto)
**Objetivo**: Alcanzar decisores de compra (35-55 años)
**Contenido**:
- Lunes: Plato de la semana (foto profesional + historia)
- Miércoles: Testimonio de cliente satisfecho
- Viernes: Promoción weekend (10% dto reservando online)
**Métricas clave**: 
- Alcance: 5,000 personas/semana
- CTR a reservas: >3%

### Instagram (40% del presupuesto)
**Objetivo**: Atraer público joven (25-40 años)
**Contenido**:
- Diario: Stories del especial del día
- 3x semana: Reels de preparación de platos
- Semanal: Post colaborativo con influencer local
**Métricas clave**:
- Crecimiento followers: 10%/mes
- Story views: 500+/día
- Saves: 50+/post

### WhatsApp Business (20% del presupuesto)
**Objetivo**: Canal directo de conversión
**Estrategia**:
- Lista de difusión: 500 clientes VIP
- Mensaje semanal: Menú especial + link reserva
- Respuesta automática con menú y disponibilidad
**Métricas clave**:
- Tasa apertura: >70%
- Conversión a reserva: >15%

## Calendario de Contenido - Mes 1

### Semana 1: Lanzamiento
- Lun: Anuncio sistema de reservas online (todos los canales)
- Mar: Tutorial en video "Cómo reservar en 3 clicks"
- Mié: Historia del restaurante (contenido emocional)
- Jue: Behind the scenes cocina
- Vie: Promo apertura: 20% dto primeras 50 reservas online

### Semana 2-4: Ritmo constante
- 15 posts/semana distribuidos
- 2 campañas pagadas/semana
- 1 colaboración influencer/semana

## Presupuesto Detallado ($100 USD/mes)
- Facebook Ads: $40 (targeting local, 5km radio)
- Instagram Ads: $30 (stories + reels promocionados)
- Influencer micro local: $20 (2 posts/mes)
- Herramientas (Canva Pro): $10

## KPIs y Medición
- **Semanal**: Reservas desde RRSS, engagement rate, alcance
- **Mensual**: ROI (ingresos por reservas RRSS / inversión)
- **Trimestral**: Customer lifetime value de clientes RRSS

## Optimización Continua
- A/B test de copys cada 2 semanas
- Análisis de mejores horarios de publicación
- Ajuste de presupuesto según canal más efectivo`
            }
          }]
        }
      });

      vectorContextService.getRelevantContext.mockResolvedValue({
        contexts: [],
        coherenceGuidelines: {}
      });
      vectorContextService.updateArtifactContext.mockResolvedValue(true);
      vectorContextService.getContextStats.mockResolvedValue({
        phaseCoherence: { medir: 0.75 }
      });

      existingArtifact.update.mockResolvedValue(true);

      // EJECUTAR
      await aiController.improveArtifactWithAI(req, res);

      // VERIFICAR
      console.log('\n📤 MEJORA ESPERADA:');
      console.log('- El plan básico se transforma en uno profesional');
      console.log('- Agrega métricas SMART específicas');
      console.log('- Incluye calendario detallado');
      console.log('- Presupuesto desglosado con ROI esperado');

      expect(res.json).toHaveBeenCalledWith({
        message: 'Artefacto mejorado con IA',
        artifact: expect.objectContaining({
          name: expect.stringContaining('(Mejorado)')
        }),
        coherenceImprovement: expect.objectContaining({
          before: 0.75,
          after: 0.75,
          improvement: 0
        })
      });

      // Verificar que se actualizó con el contenido mejorado
      expect(existingArtifact.update).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.stringContaining('Objetivos SMART'),
          name: expect.stringContaining('(Mejorado)')
        })
      );
    });
  });
});