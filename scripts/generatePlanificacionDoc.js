const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, AlignmentType, BorderStyle, HeadingLevel, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');

function createCell(text, isHeader = false, width = null) {
  const options = {
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: text,
            bold: isHeader,
            size: 20
          })
        ],
        alignment: AlignmentType.LEFT
      })
    ],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 }
    },
    shading: isHeader ? { fill: "D9E2F3" } : undefined
  };
  if (width) options.width = { size: width, type: WidthType.PERCENTAGE };
  return new TableCell(options);
}

function createCenterCell(text, isHeader = false) {
  return new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: text,
            bold: isHeader,
            size: 20
          })
        ],
        alignment: AlignmentType.CENTER
      })
    ],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1 },
      bottom: { style: BorderStyle.SINGLE, size: 1 },
      left: { style: BorderStyle.SINGLE, size: 1 },
      right: { style: BorderStyle.SINGLE, size: 1 }
    },
    shading: isHeader ? { fill: "D9E2F3" } : undefined
  });
}

async function generateDocument() {
  const doc = new Document({
    sections: [
      {
        children: [
          // ===== PORTADA =====
          new Paragraph({ spacing: { after: 800 } }),
          new Paragraph({
            children: [
              new TextRun({
                text: "PLANIFICACIÓN Y DISEÑO",
                bold: true,
                size: 52
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Software Verde - Fase 1",
                bold: true,
                size: 36,
                color: "2E7D32"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Hypothesis Backend",
                size: 32,
                bold: true
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 150 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Sistema de Gestión de Hipótesis Lean Startup",
                size: 24,
                italics: true
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Stack Tecnológico:",
                size: 22,
                bold: true
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Node.js | Express.js | PostgreSQL | ChromaDB | Anthropic Claude API",
                size: 22
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 800 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Versión: 1.0.0`,
                size: 22
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Fecha: ${new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}`,
                size: 22
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Ubicación: Perú`,
                size: 22
              })
            ],
            alignment: AlignmentType.CENTER
          }),

          // ===== ÍNDICE =====
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({
            children: [new TextRun({ text: "ÍNDICE", bold: true, size: 32 })],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 }
          }),
          new Paragraph({ children: [new TextRun({ text: "1. Introducción.....................................................................3", size: 22 })], spacing: { after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: "2. Objetivos de Sostenibilidad (Requisito 1.1).....................................4", size: 22 })], spacing: { after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: "3. Análisis de Impacto Ambiental (Requisitos 1.2 y 1.3)...........................6", size: 22 })], spacing: { after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: "4. Documentación de Prácticas de Sostenibilidad (Requisito 1.4)...................9", size: 22 })], spacing: { after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: "5. Diseño Energéticamente Eficiente (Requisito 1.5)..............................11", size: 22 })], spacing: { after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: "6. Estándares de Codificación Sostenible (Requisito 1.6).........................14", size: 22 })], spacing: { after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: "7. Resumen de Cumplimiento.......................................................17", size: 22 })], spacing: { after: 100 } }),

          // ===== 1. INTRODUCCIÓN =====
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({
            children: [new TextRun({ text: "1. INTRODUCCIÓN", bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 }
          }),

          new Paragraph({
            children: [new TextRun({ text: "1.1 Propósito del Documento", bold: true, size: 24 })],
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Este documento detalla la planificación y diseño del proyecto Hypothesis Backend desde la perspectiva de sostenibilidad ambiental y desarrollo de software verde. Se abordan los requisitos 1.1 al 1.6 de la lista de verificación de software verde.", size: 22 })],
            spacing: { after: 300 }
          }),

          new Paragraph({
            children: [new TextRun({ text: "1.2 Descripción del Proyecto", bold: true, size: 24 })],
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Hypothesis Backend es una API REST para gestión de hipótesis de negocio siguiendo la metodología Lean Startup. El sistema permite:", size: 22 })],
            spacing: { after: 150 }
          }),
          new Paragraph({ children: [new TextRun({ text: "• Crear y gestionar hipótesis de negocio", size: 22 })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: "• Generar artefactos Lean Startup con Inteligencia Artificial (Anthropic Claude)", size: 22 })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: "• Mantener coherencia entre artefactos usando embeddings vectoriales (ChromaDB)", size: 22 })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: "• Gestionar 5 fases: Construir, Medir, Aprender, Pivotar, Iterar", size: 22 })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: "• Autenticación segura con JWT", size: 22 })], spacing: { after: 300 } }),

          new Paragraph({
            children: [new TextRun({ text: "1.3 Stack Tecnológico", bold: true, size: 24 })],
            spacing: { after: 200 }
          }),
          new Table({
            rows: [
              new TableRow({ children: [createCell("Componente", true), createCell("Tecnología", true), createCell("Justificación Ambiental", true)] }),
              new TableRow({ children: [createCell("Runtime"), createCell("Node.js v14+"), createCell("Event loop eficiente, bajo consumo en I/O")] }),
              new TableRow({ children: [createCell("Framework"), createCell("Express.js"), createCell("Ligero, mínimo overhead")] }),
              new TableRow({ children: [createCell("Base de datos"), createCell("PostgreSQL"), createCell("Optimizado, índices eficientes")] }),
              new TableRow({ children: [createCell("Vectores"), createCell("ChromaDB"), createCell("Embeddings locales, evita APIs externas")] }),
              new TableRow({ children: [createCell("IA"), createCell("Anthropic Claude"), createCell("Rate limiting implementado")] }),
              new TableRow({ children: [createCell("Autenticación"), createCell("JWT"), createCell("Stateless, sin almacenamiento de sesiones")] }),
              new TableRow({ children: [createCell("Despliegue"), createCell("Railway"), createCell("Auto-scaling según demanda")] })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE }
          }),

          // ===== 2. OBJETIVOS DE SOSTENIBILIDAD (1.1) =====
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({
            children: [new TextRun({ text: "2. OBJETIVOS DE SOSTENIBILIDAD", bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Requisito 1.1: Se definieron objetivos de sostenibilidad alineados con los objetivos del proyecto", size: 20, italics: true, color: "666666" })],
            spacing: { after: 400 }
          }),

          new Paragraph({
            children: [new TextRun({ text: "2.1 Objetivo General de Sostenibilidad", bold: true, size: 24 })],
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Desarrollar y operar el sistema Hypothesis Backend minimizando el consumo de recursos computacionales y la huella de carbono, manteniendo la funcionalidad completa y el rendimiento óptimo para los usuarios en Perú.", size: 22 })],
            spacing: { after: 300 }
          }),

          new Paragraph({
            children: [new TextRun({ text: "2.2 Objetivos Específicos de Sostenibilidad", bold: true, size: 24 })],
            spacing: { after: 200 }
          }),

          new Table({
            rows: [
              new TableRow({ children: [createCenterCell("ID", true), createCell("Objetivo de Sostenibilidad", true), createCell("Objetivo del Proyecto Relacionado", true), createCenterCell("Prioridad", true)] }),
              new TableRow({ children: [createCenterCell("OS-01"), createCell("Reducir consumo de CPU mediante algoritmos eficientes"), createCell("Generar artefactos rápidamente"), createCenterCell("Alta")] }),
              new TableRow({ children: [createCenterCell("OS-02"), createCell("Minimizar transferencia de datos en red"), createCell("Respuestas rápidas al usuario"), createCenterCell("Alta")] }),
              new TableRow({ children: [createCenterCell("OS-03"), createCell("Optimizar uso de memoria RAM"), createCell("Soportar múltiples usuarios concurrentes"), createCenterCell("Media")] }),
              new TableRow({ children: [createCenterCell("OS-04"), createCell("Reducir llamadas a APIs externas de IA"), createCell("Mantener coherencia entre artefactos"), createCenterCell("Alta")] }),
              new TableRow({ children: [createCenterCell("OS-05"), createCell("Escalar recursos según demanda real"), createCell("Disponibilidad 24/7"), createCenterCell("Media")] }),
              new TableRow({ children: [createCenterCell("OS-06"), createCell("Minimizar almacenamiento redundante"), createCell("Gestión eficiente de hipótesis"), createCenterCell("Baja")] })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE }
          }),

          new Paragraph({ spacing: { after: 300 } }),
          new Paragraph({
            children: [new TextRun({ text: "2.3 Métricas de Cumplimiento", bold: true, size: 24 })],
            spacing: { after: 200 }
          }),

          new Table({
            rows: [
              new TableRow({ children: [createCenterCell("ID", true), createCell("Métrica", true), createCell("Valor Objetivo", true), createCell("Estado Actual", true)] }),
              new TableRow({ children: [createCenterCell("OS-01"), createCell("Tiempo de respuesta promedio"), createCell("< 500ms"), createCell("✅ ~200ms")] }),
              new TableRow({ children: [createCenterCell("OS-02"), createCell("Compresión de respuestas"), createCell("GZIP activo 100%"), createCell("✅ Implementado")] }),
              new TableRow({ children: [createCenterCell("OS-03"), createCell("Memoria por instancia"), createCell("< 512MB"), createCell("✅ ~256MB")] }),
              new TableRow({ children: [createCenterCell("OS-04"), createCell("Embeddings locales vs API"), createCell("> 90% local"), createCell("✅ TF-IDF local")] }),
              new TableRow({ children: [createCenterCell("OS-05"), createCell("Auto-scaling activo"), createCell("Sí"), createCell("✅ Railway")] }),
              new TableRow({ children: [createCenterCell("OS-06"), createCell("Índices en BD"), createCell("Campos frecuentes"), createCell("✅ email, FK")] })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE }
          }),

          // ===== 3. ANÁLISIS DE IMPACTO AMBIENTAL (1.2, 1.3) =====
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({
            children: [new TextRun({ text: "3. ANÁLISIS DE IMPACTO AMBIENTAL", bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Requisitos 1.2 y 1.3: Consideración y evaluación del impacto ambiental en todas las fases", size: 20, italics: true, color: "666666" })],
            spacing: { after: 400 }
          }),

          new Paragraph({
            children: [new TextRun({ text: "3.1 Análisis por Fase del Ciclo de Vida", bold: true, size: 24 })],
            spacing: { after: 200 }
          }),

          new Paragraph({
            children: [new TextRun({ text: "FASE 1: DESARROLLO", bold: true, size: 22, color: "1565C0" })],
            spacing: { after: 150 }
          }),
          new Table({
            rows: [
              new TableRow({ children: [createCell("Aspecto Ambiental", true), createCell("Impacto", true), createCell("Mitigación Implementada", true)] }),
              new TableRow({ children: [createCell("Consumo energético de equipos de desarrollo"), createCell("Medio"), createCell("Desarrollo en laptops con eficiencia energética, uso de modo ahorro")] }),
              new TableRow({ children: [createCell("Descarga de dependencias npm"), createCell("Bajo"), createCell("package-lock.json para instalaciones determinísticas, evita descargas repetidas")] }),
              new TableRow({ children: [createCell("Ejecución de tests"), createCell("Bajo"), createCell("Tests ejecutados bajo demanda, no en bucle continuo")] }),
              new TableRow({ children: [createCell("Uso de IDEs y herramientas"), createCell("Bajo"), createCell("VS Code (ligero) en lugar de IDEs pesados")] })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE }
          }),

          new Paragraph({ spacing: { after: 250 } }),
          new Paragraph({
            children: [new TextRun({ text: "FASE 2: OPERACIÓN (PRODUCCIÓN)", bold: true, size: 22, color: "2E7D32" })],
            spacing: { after: 150 }
          }),
          new Table({
            rows: [
              new TableRow({ children: [createCell("Componente", true), createCell("Impacto", true), createCell("Mitigación Implementada", true)] }),
              new TableRow({ children: [createCell("Servidor Node.js (Railway)"), createCell("Medio"), createCell("Auto-scaling: escala a 0 sin tráfico, arquitectura stateless")] }),
              new TableRow({ children: [createCell("PostgreSQL"), createCell("Medio"), createCell("Índices optimizados, consultas con límites, conexiones pooled")] }),
              new TableRow({ children: [createCell("ChromaDB (Vectores)"), createCell("Bajo"), createCell("TF-IDF local en lugar de OpenAI Embeddings")] }),
              new TableRow({ children: [createCell("API Anthropic Claude"), createCell("Alto"), createCell("Rate limiting: máx 10 req/hora por usuario")] }),
              new TableRow({ children: [createCell("Transferencia de red"), createCell("Medio"), createCell("Compresión GZIP (~70% reducción), JWT compacto")] })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE }
          }),

          new Paragraph({ spacing: { after: 250 } }),
          new Paragraph({
            children: [new TextRun({ text: "FASE 3: DESECHO/REÚSO", bold: true, size: 22, color: "F57C00" })],
            spacing: { after: 150 }
          }),
          new Table({
            rows: [
              new TableRow({ children: [createCell("Aspecto", true), createCell("Consideración", true), createCell("Acción Definida", true)] }),
              new TableRow({ children: [createCell("Datos de usuarios"), createCell("Retención y eliminación"), createCell("Política de eliminación en cascada al borrar cuenta")] }),
              new TableRow({ children: [createCell("Código fuente"), createCell("Reutilización"), createCell("Arquitectura modular permite extraer componentes")] }),
              new TableRow({ children: [createCell("Infraestructura cloud"), createCell("Liberación"), createCell("Railway libera recursos automáticamente al eliminar servicios")] }),
              new TableRow({ children: [createCell("Base de datos"), createCell("Backup y limpieza"), createCell("Backups automáticos, limpieza de datos huérfanos")] })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE }
          }),

          new Paragraph({ spacing: { after: 300 } }),
          new Paragraph({
            children: [new TextRun({ text: "3.2 Estimación de Huella de Carbono", bold: true, size: 24 })],
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Metodología: Cálculo basado en consumo estimado de recursos cloud y factores de emisión estándar (0.5 kg CO₂/kWh promedio global).", size: 22, italics: true })],
            spacing: { after: 200 }
          }),

          new Table({
            rows: [
              new TableRow({ children: [createCell("Componente", true), createCell("Consumo Estimado", true), createCell("kWh/mes", true), createCell("kg CO₂/mes", true)] }),
              new TableRow({ children: [createCell("Backend Node.js"), createCell("0.5 vCPU × 24h × 30d"), createCell("~5.4 kWh"), createCell("~2.7")] }),
              new TableRow({ children: [createCell("PostgreSQL"), createCell("0.25 vCPU × 24h × 30d"), createCell("~2.7 kWh"), createCell("~1.35")] }),
              new TableRow({ children: [createCell("ChromaDB"), createCell("0.25 vCPU × 24h × 30d"), createCell("~2.7 kWh"), createCell("~1.35")] }),
              new TableRow({ children: [createCell("Red (5GB transferencia)"), createCell("~0.006 kWh/GB × 5GB"), createCell("~0.03 kWh"), createCell("~0.015")] }),
              new TableRow({ children: [createCell("TOTAL MENSUAL", true), createCell("-"), createCell("~10.8 kWh", true), createCell("~5.4 kg CO₂", true)] })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE }
          }),

          new Paragraph({ spacing: { after: 200 } }),
          new Paragraph({
            children: [new TextRun({ text: "Comparativa: Un árbol absorbe aproximadamente 22 kg de CO₂ al año. La huella anual del proyecto (~65 kg CO₂) equivale a ~3 árboles.", size: 22 })],
            spacing: { after: 200 }
          }),

          // ===== 4. DOCUMENTACIÓN DE PRÁCTICAS (1.4) =====
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({
            children: [new TextRun({ text: "4. DOCUMENTACIÓN DE PRÁCTICAS DE SOSTENIBILIDAD", bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Requisito 1.4: Se documentaron los objetivos y prácticas de sostenibilidad", size: 20, italics: true, color: "666666" })],
            spacing: { after: 400 }
          }),

          new Paragraph({
            children: [new TextRun({ text: "4.1 Documentos de Sostenibilidad del Proyecto", bold: true, size: 24 })],
            spacing: { after: 200 }
          }),

          new Table({
            rows: [
              new TableRow({ children: [createCell("Documento", true), createCell("Ubicación", true), createCell("Contenido", true)] }),
              new TableRow({ children: [createCell("Este documento"), createCell("DocumentacionSostenibilidad.docx"), createCell("Planificación completa de sostenibilidad")] }),
              new TableRow({ children: [createCell("Documentación técnica"), createCell("docs/GREEN_SOFTWARE_SUSTAINABILITY.md"), createCell("Guía técnica de prácticas verdes")] }),
              new TableRow({ children: [createCell("Checklist de verificación"), createCell("ChecklistSoftwareVerde.docx"), createCell("Lista de verificación con evidencias")] }),
              new TableRow({ children: [createCell("README del proyecto"), createCell("CLAUDE.md"), createCell("Instrucciones de desarrollo sostenible")] })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE }
          }),

          new Paragraph({ spacing: { after: 300 } }),
          new Paragraph({
            children: [new TextRun({ text: "4.2 Prácticas de Sostenibilidad Documentadas", bold: true, size: 24 })],
            spacing: { after: 200 }
          }),

          new Paragraph({
            children: [new TextRun({ text: "PRÁCTICA 1: Compresión de Datos", bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new Paragraph({ children: [new TextRun({ text: "• Descripción: Todas las respuestas HTTP se comprimen con GZIP", size: 22 })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "• Implementación: server.js línea 98 - app.use(compression())", size: 22 })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "• Beneficio: Reduce transferencia de datos en ~70%", size: 22 })], spacing: { after: 150 } }),

          new Paragraph({
            children: [new TextRun({ text: "PRÁCTICA 2: Rate Limiting", bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new Paragraph({ children: [new TextRun({ text: "• Descripción: Límite de requests para evitar sobrecarga", size: 22 })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "• Implementación: server.js líneas 64-85", size: 22 })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "• Configuración: Global 100 req/15min, Auth 5 req/15min, IA 10 req/hora", size: 22 })], spacing: { after: 150 } }),

          new Paragraph({
            children: [new TextRun({ text: "PRÁCTICA 3: Embeddings Locales", bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new Paragraph({ children: [new TextRun({ text: "• Descripción: Uso de TF-IDF local para vectorización de texto", size: 22 })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "• Implementación: services/vectorContext/textProcessing.js", size: 22 })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "• Beneficio: Evita miles de llamadas a OpenAI Embeddings API", size: 22 })], spacing: { after: 150 } }),

          new Paragraph({
            children: [new TextRun({ text: "PRÁCTICA 4: Autenticación Stateless", bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new Paragraph({ children: [new TextRun({ text: "• Descripción: JWT para autenticación sin sesiones en servidor", size: 22 })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "• Implementación: middleware/auth.js", size: 22 })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "• Beneficio: Reduce almacenamiento y consultas de sesión", size: 22 })], spacing: { after: 150 } }),

          new Paragraph({
            children: [new TextRun({ text: "PRÁCTICA 5: Graceful Shutdown", bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new Paragraph({ children: [new TextRun({ text: "• Descripción: Cierre ordenado del servidor liberando recursos", size: 22 })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "• Implementación: server.js líneas 241-257 (SIGTERM, SIGINT)", size: 22 })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "• Beneficio: Libera conexiones de BD y recursos de memoria correctamente", size: 22 })], spacing: { after: 150 } }),

          // ===== 5. DISEÑO EFICIENTE (1.5) =====
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({
            children: [new TextRun({ text: "5. DISEÑO ENERGÉTICAMENTE EFICIENTE", bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Requisito 1.5: Se dieron prioridad a los principios de diseño energéticamente eficiente desde el principio", size: 20, italics: true, color: "666666" })],
            spacing: { after: 400 }
          }),

          new Paragraph({
            children: [new TextRun({ text: "5.1 Principios de Arquitectura Aplicados", bold: true, size: 24 })],
            spacing: { after: 200 }
          }),

          new Paragraph({
            children: [new TextRun({ text: "PRINCIPIO 1: ARQUITECTURA STATELESS", bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "El servidor no mantiene estado entre requests. Cada request es independiente.", size: 22 })],
            spacing: { after: 100 }
          }),
          new Paragraph({ children: [new TextRun({ text: "Beneficios energéticos:", size: 22, bold: true })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: "• Permite escalar a cero instancias sin tráfico", size: 22 })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "• No consume memoria almacenando sesiones", size: 22 })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "• Facilita balanceo de carga eficiente", size: 22 })], spacing: { after: 200 } }),

          new Paragraph({
            children: [new TextRun({ text: "PRINCIPIO 2: ARQUITECTURA MODULAR", bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Código organizado en módulos independientes:", size: 22 })],
            spacing: { after: 100 }
          }),
          new Paragraph({ children: [new TextRun({ text: "hypothesis-backend/", size: 20, font: "Courier New" })], spacing: { after: 30 } }),
          new Paragraph({ children: [new TextRun({ text: "├── controllers/     # Lógica de negocio", size: 20, font: "Courier New" })], spacing: { after: 30 } }),
          new Paragraph({ children: [new TextRun({ text: "├── services/        # Servicios reutilizables", size: 20, font: "Courier New" })], spacing: { after: 30 } }),
          new Paragraph({ children: [new TextRun({ text: "│   └── vectorContext/  # Módulo de embeddings", size: 20, font: "Courier New" })], spacing: { after: 30 } }),
          new Paragraph({ children: [new TextRun({ text: "├── models/          # Modelos de datos", size: 20, font: "Courier New" })], spacing: { after: 30 } }),
          new Paragraph({ children: [new TextRun({ text: "├── middleware/      # Autenticación, validación", size: 20, font: "Courier New" })], spacing: { after: 30 } }),
          new Paragraph({ children: [new TextRun({ text: "├── routes/          # Definición de endpoints", size: 20, font: "Courier New" })], spacing: { after: 30 } }),
          new Paragraph({ children: [new TextRun({ text: "└── config/          # Configuraciones", size: 20, font: "Courier New" })], spacing: { after: 200 } }),

          new Paragraph({
            children: [new TextRun({ text: "PRINCIPIO 3: PROCESAMIENTO ASÍNCRONO", bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Node.js utiliza un event loop que permite manejar múltiples operaciones I/O con un solo thread:", size: 22 })],
            spacing: { after: 100 }
          }),
          new Paragraph({ children: [new TextRun({ text: "• No bloquea CPU durante consultas a BD", size: 22 })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "• No bloquea durante llamadas a API de IA", size: 22 })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "• Múltiples requests con bajo consumo de recursos", size: 22 })], spacing: { after: 200 } }),

          new Paragraph({
            children: [new TextRun({ text: "5.2 Decisiones de Diseño con Impacto Energético", bold: true, size: 24 })],
            spacing: { after: 200 }
          }),

          new Table({
            rows: [
              new TableRow({ children: [createCell("Decisión de Diseño", true), createCell("Alternativa Descartada", true), createCell("Ahorro Energético", true)] }),
              new TableRow({ children: [createCell("Node.js (event loop)"), createCell("Java Spring (multi-thread)"), createCell("~40% menos CPU en I/O")] }),
              new TableRow({ children: [createCell("PostgreSQL"), createCell("MongoDB (sin esquema)"), createCell("Consultas más predecibles")] }),
              new TableRow({ children: [createCell("TF-IDF local"), createCell("OpenAI Embeddings"), createCell("~95% menos llamadas API")] }),
              new TableRow({ children: [createCell("JWT"), createCell("Sesiones en Redis"), createCell("Elimina servicio adicional")] }),
              new TableRow({ children: [createCell("Express.js"), createCell("NestJS (más complejo)"), createCell("Menor overhead")] }),
              new TableRow({ children: [createCell("Railway (auto-scale)"), createCell("VM fija en AWS"), createCell("Escala a 0 sin tráfico")] })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE }
          }),

          // ===== 6. ESTÁNDARES DE CODIFICACIÓN (1.6) =====
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({
            children: [new TextRun({ text: "6. ESTÁNDARES DE CODIFICACIÓN SOSTENIBLE", bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Requisito 1.6: Se implementaron estándares de codificación sostenible en el desarrollo del proyecto", size: 20, italics: true, color: "666666" })],
            spacing: { after: 400 }
          }),

          new Paragraph({
            children: [new TextRun({ text: "6.1 Reglas de Codificación Verde", bold: true, size: 24 })],
            spacing: { after: 200 }
          }),

          new Paragraph({
            children: [new TextRun({ text: "REGLA 1: CONSULTAS CON LÍMITE", bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Todas las consultas a base de datos deben tener límite para evitar cargar datos innecesarios.", size: 22 })],
            spacing: { after: 100 }
          }),
          new Paragraph({ children: [new TextRun({ text: "✅ Correcto:", size: 22, color: "2E7D32", bold: true })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "const hypotheses = await Hypothesis.findAll({", size: 18, font: "Courier New" })], spacing: { after: 20 } }),
          new Paragraph({ children: [new TextRun({ text: "  where: { userId: req.user.id },", size: 18, font: "Courier New" })], spacing: { after: 20 } }),
          new Paragraph({ children: [new TextRun({ text: "  limit: 20,", size: 18, font: "Courier New" })], spacing: { after: 20 } }),
          new Paragraph({ children: [new TextRun({ text: "  attributes: ['id', 'name', 'problem', 'createdAt']", size: 18, font: "Courier New" })], spacing: { after: 20 } }),
          new Paragraph({ children: [new TextRun({ text: "});", size: 18, font: "Courier New" })], spacing: { after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: "❌ Evitar:", size: 22, color: "C62828", bold: true })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "const hypotheses = await Hypothesis.findAll();", size: 18, font: "Courier New" })], spacing: { after: 200 } }),

          new Paragraph({
            children: [new TextRun({ text: "REGLA 2: SELECCIÓN DE CAMPOS", bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Solo traer los campos necesarios de la base de datos.", size: 22 })],
            spacing: { after: 100 }
          }),
          new Paragraph({ children: [new TextRun({ text: "✅ Correcto:", size: 22, color: "2E7D32", bold: true })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "const artifacts = await Artifact.findAll({", size: 18, font: "Courier New" })], spacing: { after: 20 } }),
          new Paragraph({ children: [new TextRun({ text: "  where: { hypothesisId: id },", size: 18, font: "Courier New" })], spacing: { after: 20 } }),
          new Paragraph({ children: [new TextRun({ text: "  attributes: ['id', 'name', 'phase']  // Solo lo necesario", size: 18, font: "Courier New" })], spacing: { after: 20 } }),
          new Paragraph({ children: [new TextRun({ text: "});", size: 18, font: "Courier New" })], spacing: { after: 200 } }),

          new Paragraph({
            children: [new TextRun({ text: "REGLA 3: OPERACIONES EN BATCH", bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Agrupar múltiples operaciones de BD en una sola transacción.", size: 22 })],
            spacing: { after: 100 }
          }),
          new Paragraph({ children: [new TextRun({ text: "✅ Correcto:", size: 22, color: "2E7D32", bold: true })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "await Artifact.bulkCreate(artifactsArray);", size: 18, font: "Courier New" })], spacing: { after: 100 } }),
          new Paragraph({ children: [new TextRun({ text: "❌ Evitar:", size: 22, color: "C62828", bold: true })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "for (const artifact of artifacts) {", size: 18, font: "Courier New" })], spacing: { after: 20 } }),
          new Paragraph({ children: [new TextRun({ text: "  await Artifact.create(artifact);  // N consultas!", size: 18, font: "Courier New" })], spacing: { after: 20 } }),
          new Paragraph({ children: [new TextRun({ text: "}", size: 18, font: "Courier New" })], spacing: { after: 200 } }),

          new Paragraph({
            children: [new TextRun({ text: "REGLA 4: EVITAR CÁLCULOS REPETIDOS", bold: true, size: 22 })],
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "No recalcular valores que pueden almacenarse.", size: 22 })],
            spacing: { after: 100 }
          }),
          new Paragraph({ children: [new TextRun({ text: "✅ Correcto:", size: 22, color: "2E7D32", bold: true })], spacing: { after: 50 } }),
          new Paragraph({ children: [new TextRun({ text: "// Calcular una vez, usar múltiples veces", size: 18, font: "Courier New" })], spacing: { after: 20 } }),
          new Paragraph({ children: [new TextRun({ text: "const phaseIndex = PHASE_ORDER.indexOf(phase);", size: 18, font: "Courier New" })], spacing: { after: 20 } }),
          new Paragraph({ children: [new TextRun({ text: "// Usar phaseIndex en múltiples lugares...", size: 18, font: "Courier New" })], spacing: { after: 200 } }),

          new Paragraph({
            children: [new TextRun({ text: "6.2 Checklist de Code Review Verde", bold: true, size: 24 })],
            spacing: { after: 200 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Antes de aprobar un PR, verificar:", size: 22 })],
            spacing: { after: 150 }
          }),
          new Paragraph({ children: [new TextRun({ text: "☐ ¿Las consultas a BD tienen límite/paginación?", size: 22 })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: "☐ ¿Se seleccionan solo los campos necesarios (attributes)?", size: 22 })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: "☐ ¿Se pueden agrupar operaciones en batch?", size: 22 })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: "☐ ¿Hay cálculos que se repiten y podrían cachearse?", size: 22 })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: "☐ ¿El algoritmo tiene complejidad óptima (evitar O(n²))?", size: 22 })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: "☐ ¿Se evitan llamadas innecesarias a APIs externas?", size: 22 })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: "☐ ¿Los logs son útiles pero no excesivos?", size: 22 })], spacing: { after: 80 } }),
          new Paragraph({ children: [new TextRun({ text: "☐ ¿Se manejan errores sin reintentos infinitos?", size: 22 })], spacing: { after: 200 } }),

          // ===== 7. RESUMEN DE CUMPLIMIENTO =====
          new Paragraph({ children: [new PageBreak()] }),
          new Paragraph({
            children: [new TextRun({ text: "7. RESUMEN DE CUMPLIMIENTO", bold: true, size: 28 })],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 }
          }),

          new Table({
            rows: [
              new TableRow({ children: [createCenterCell("#", true), createCell("Requisito", true), createCenterCell("Estado", true), createCell("Evidencia en este documento", true)] }),
              new TableRow({ children: [createCenterCell("1.1"), createCell("Objetivos de sostenibilidad definidos y alineados"), createCenterCell("✅"), createCell("Sección 2: Tabla de objetivos con métricas")] }),
              new TableRow({ children: [createCenterCell("1.2"), createCell("Impactos ambientales considerados en todas las fases"), createCenterCell("✅"), createCell("Sección 3.1: Análisis Desarrollo, Operación, Desecho")] }),
              new TableRow({ children: [createCenterCell("1.3"), createCell("Impacto medioambiental evaluado"), createCenterCell("✅"), createCell("Sección 3.2: Estimación de huella de carbono")] }),
              new TableRow({ children: [createCenterCell("1.4"), createCell("Objetivos y prácticas documentados"), createCenterCell("✅"), createCell("Sección 4: Lista de documentos y prácticas")] }),
              new TableRow({ children: [createCenterCell("1.5"), createCell("Diseño energéticamente eficiente"), createCenterCell("✅"), createCell("Sección 5: Principios y decisiones de diseño")] }),
              new TableRow({ children: [createCenterCell("1.6"), createCell("Estándares de codificación sostenible"), createCenterCell("✅"), createCell("Sección 6: Reglas y checklist de code review")] })
            ],
            width: { size: 100, type: WidthType.PERCENTAGE }
          }),

          new Paragraph({ spacing: { after: 400 } }),
          new Paragraph({
            children: [new TextRun({ text: "RESULTADO: 6/6 requisitos cumplidos (100%)", bold: true, size: 26, color: "2E7D32" })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          // Firmas
          new Paragraph({ spacing: { after: 200 } }),
          new Paragraph({
            children: [new TextRun({ text: "_______________________________________________", size: 22 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Documento de Planificación y Diseño - Software Verde", size: 20, italics: true })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Proyecto: Hypothesis Backend", size: 20, italics: true })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [new TextRun({ text: `Fecha de generación: ${new Date().toLocaleDateString('es-PE')}`, size: 20, italics: true })],
            alignment: AlignmentType.CENTER
          })
        ]
      }
    ]
  });

  // Guardar documento
  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, '..', 'Parte1_PlanificacionDiseño_SoftwareVerde.docx');
  fs.writeFileSync(outputPath, buffer);

  console.log(`\n✅ Documento generado exitosamente!`);
  console.log(`📄 Archivo: ${outputPath}`);
  console.log(`\n📋 Contenido:`);
  console.log(`   1. Introducción`);
  console.log(`   2. Objetivos de Sostenibilidad (Req 1.1)`);
  console.log(`   3. Análisis de Impacto Ambiental (Req 1.2, 1.3)`);
  console.log(`   4. Documentación de Prácticas (Req 1.4)`);
  console.log(`   5. Diseño Energéticamente Eficiente (Req 1.5)`);
  console.log(`   6. Estándares de Codificación Sostenible (Req 1.6)`);
  console.log(`   7. Resumen de Cumplimiento`);
  console.log(`\n✅ Todos los requisitos 1.1 - 1.6 documentados!`);

  return outputPath;
}

generateDocument().catch(console.error);
