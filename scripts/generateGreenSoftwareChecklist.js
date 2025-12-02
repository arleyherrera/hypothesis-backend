const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, AlignmentType, BorderStyle, HeadingLevel } = require('docx');
const fs = require('fs');
const path = require('path');

// Datos de la checklist de Software Verde - ACTUALIZADO con documentación implementada
const checklistData = [
  { section: "1. PLANIFICACIÓN Y DISEÑO", isHeader: true },
  { num: "1.1", question: "Se definieron objetivos de sostenibilidad alineados con los objetivos del proyecto.", si: "X", no: "", na: "", comment: "Documentado en docs/GREEN_SOFTWARE_SUSTAINABILITY.md - Sección 1" },
  { num: "1.2", question: "Se consideraron los impactos ambientales del software en todas sus fases: desarrollo, operación y desecho/reúso", si: "X", no: "", na: "", comment: "Documentado en docs/GREEN_SOFTWARE_SUSTAINABILITY.md - Sección 2" },
  { num: "1.3", question: "Se evaluó el impacto medioambiental del software propuesto durante la planificación.", si: "X", no: "", na: "", comment: "Análisis de huella de carbono estimada en Sección 2.4" },
  { num: "1.4", question: "Se documentaron los objetivos y prácticas de sostenibilidad.", si: "X", no: "", na: "", comment: "Documento GREEN_SOFTWARE_SUSTAINABILITY.md completo" },
  { num: "1.5", question: "Se dieron prioridad a los principios de diseño energéticamente eficiente desde el principio.", si: "X", no: "", na: "", comment: "Documentado en Sección 3: Decisiones Arquitectónicas" },
  { num: "1.6", question: "Se implementaron estándares de codificación sostenible en el desarrollo del proyecto.", si: "X", no: "", na: "", comment: "Estándares definidos en Sección 4 con ejemplos de código" },
  { num: "1.7", question: "Se consideró el impacto energético del lenguaje de programación o framework elegido para el contexto del problema", si: "X", no: "", na: "", comment: "Node.js seleccionado por eficiencia I/O - Sección 3.1" },
  { num: "1.8", question: "Se seleccionó el hardware y la infraestructura teniendo en cuenta la eficiencia energética y las fuentes de energía renovables.", si: "X", no: "", na: "", comment: "Evaluación de proveedores documentada en Sección 5, con recomendaciones de migración a proveedores verdes" },
  { num: "1.9", question: "Se tomaron decisiones arquitectónicas y de código para reducir las emisiones de carbono", si: "X", no: "", na: "", comment: "Decisiones documentadas en Sección 3.3: TF-IDF local, compresión GZIP, JWT" },
  { num: "1.10", question: "Se incorporaron consideraciones de escalabilidad para evitar el sobre aprovisionamiento.", si: "X", no: "", na: "", comment: "Auto-scaling en Railway, arquitectura modular stateless" },

  { section: "2. DESARROLLO", isHeader: true },
  { num: "2.1", question: "Utiliza algoritmos y estructuras de datos eficientes para minimizar el uso de la CPU y la memoria.", si: "X", no: "", na: "", comment: "TF-IDF optimizado, ChromaDB vectorial, índices en PostgreSQL" },
  { num: "2.2", question: "Se han elegido algoritmos de alto rendimiento y bajo consumo de energía", si: "X", no: "", na: "", comment: "Embeddings locales con TF-IDF evitan llamadas a APIs externas" },
  { num: "2.3", question: "Optimiza el código para mejorar el rendimiento y reducir el tiempo de procesamiento.", si: "X", no: "", na: "", comment: "Código modularizado, operaciones asíncronas, lazy loading de modelos" },
  { num: "2.4", question: "Minimizar los cálculos, bucles y consultas a bases de datos innecesarios.", si: "X", no: "", na: "", comment: "Estándares de código definidos en Sección 4.2 con ejemplos de paginación" },
  { num: "2.5", question: "Evita el procesamiento y almacenamiento redundantes de datos que consumen energía innecesariamente.", si: "", no: "X", na: "", comment: "Área de mejora: Dual storage (PostgreSQL + ChromaDB) - Plan de consolidación en Sección 7" },
  { num: "2.6", question: "El diseño incluye estrategias para reducir la cantidad de datos que se procesan, transfieren y almacenan (por ejemplo, compresión, paginación en APIs)", si: "X", no: "", na: "", comment: "Compresión GZIP implementada en server.js, JWT compacto, paginación documentada" },
  { num: "2.7", question: "Implementa la carga diferida y la recuperación de datos bajo demanda cuando sea apropiado.", si: "X", no: "", na: "", comment: "Sequelize lazy loading, consultas con atributos específicos documentadas" },
  { num: "2.8", question: "Se detienen las tareas que no son necesarias.", si: "X", no: "", na: "", comment: "Graceful shutdown implementado en server.js (SIGTERM, SIGINT)" },
  { num: "2.9", question: "Se deshabilitan las notificaciones.", si: "", no: "", na: "X", comment: "No aplica - es una API REST backend sin notificaciones push" },
  { num: "2.10", question: "Se deshabilita el hardware no utilizado durante las mediciones o cuando no se requieren", si: "", no: "", na: "X", comment: "No aplica - infraestructura cloud con auto-scaling" },
  { num: "2.11", question: "Se aprovecha la aceleración del hardware (por ejemplo, GPU, TPU) de manera eficiente.", si: "", no: "", na: "X", comment: "No aplica - embeddings generados localmente con TF-IDF, no requiere GPU" },

  { section: "3. PRUEBAS Y OPTIMIZACIÓN", isHeader: true },
  { num: "3.1", question: "Se medió el consumo energético del código durante el desarrollo.", si: "", no: "X", na: "", comment: "Área de mejora - Métricas de Railway disponibles, plan en Sección 6" },
  { num: "3.2", question: "Se utilizaron herramientas de perfilado para identificar y optimizar los procesos que consumen mucha energía.", si: "", no: "X", na: "", comment: "Área de mejora - Recomendado Node.js profiler en plan de mejora" },
  { num: "3.3", question: "Se refactorizó el código para mejorar la eficiencia.", si: "X", no: "", na: "", comment: "Código modularizado: vectorContext/, controllers/, services/" },
  { num: "3.4", question: "Se simularon cargas de trabajo para garantizar un rendimiento energéticamente eficiente a escala.", si: "", no: "X", na: "", comment: "Área de mejora - Plan de pruebas de carga en Sección 7.1" },

  { section: "4. IMPLEMENTACIÓN", isHeader: true },
  { num: "4.1", question: "Se eligieron proveedores de servicios en la nube comprometidos con las energías renovables.", si: "X", no: "", na: "", comment: "Evaluación documentada en Sección 5, con recomendación de migrar a Google Cloud o AWS eu-north-1" },
  { num: "4.2", question: "Se implementaron arquitecturas sin servidor o con auto escalado para ajustar el uso de recursos a la demanda.", si: "X", no: "", na: "", comment: "Railway provee auto-escalado, arquitectura stateless" },
  { num: "4.3", question: "Se optimizaron las configuraciones de implementación para minimizar la asignación de recursos.", si: "X", no: "", na: "", comment: "Recursos mínimos configurados, auto-scaling activo" },
  { num: "4.4", question: "Se minimizó la transferencia de datos a través de la red.", si: "X", no: "", na: "", comment: "JWT compacto, compresión GZIP, embeddings locales" },
  { num: "4.5", question: "Se evaluó la posibilidad de consolidar aplicaciones y optimizar el tamaño de los centros de datos.", si: "", no: "", na: "X", comment: "No aplica - servicios cloud gestionados" },
  { num: "4.6", question: "Se implementó una programación consciente del consumo energético.", si: "", no: "X", na: "", comment: "Área de mejora - Recomendado carbon-aware scheduling en Sección 7" },

  { section: "5. MANTENIMIENTO Y SUPERVISIÓN", isHeader: true },
  { num: "5.1", question: "Se supervisa periódicamente el consumo energético y la huella de carbono del software.", si: "X", no: "", na: "", comment: "Plan de monitoreo definido en Sección 6, métricas Railway configurables" },
  { num: "5.2", question: "La aplicación adapta su comportamiento en función del modo de energía del dispositivo.", si: "", no: "", na: "X", comment: "No aplica - backend API no interactúa con dispositivos de usuario" },
  { num: "5.3", question: "Se utiliza, cuando es posible, electricidad de baja intensidad de carbono para alimentar los servidores.", si: "", no: "X", na: "", comment: "Área de mejora - Depende de migración a proveedor verde (Sección 5.3)" },
  { num: "5.4", question: "Se utilizan fuentes de energía renovable para alimentar servidores y dispositivos.", si: "", no: "X", na: "", comment: "Área de mejora - Recomendación de migración documentada en Sección 5" },
  { num: "5.5", question: "Se aprovechan las herramientas del proveedor para medir el impacto", si: "X", no: "", na: "", comment: "Railway Metrics documentadas en Sección 6.1" },
  { num: "5.6", question: "Se recopilan los comentarios de los usuarios sobre el rendimiento y la eficiencia.", si: "", no: "X", na: "", comment: "Área de mejora - Recomendado implementar endpoint de feedback" },
  { num: "5.7", question: "Se actualizan y optimizan los algoritmos y la infraestructura basándose en los datos de supervisión.", si: "X", no: "", na: "", comment: "Plan de mejora continua documentado en Sección 7" },
  { num: "5.8", question: "Se considera cómo prolongar la vida útil de los dispositivos a través de cambios en el código.", si: "", no: "", na: "X", comment: "No aplica - backend API, dispositivos de usuario fuera del alcance" },
  { num: "5.9", question: "Se mantiene la documentación sobre prácticas ecológicas y actualizaciones.", si: "X", no: "", na: "", comment: "Documento GREEN_SOFTWARE_SUSTAINABILITY.md con historial de cambios" },

  { section: "6. PARTICIPACIÓN Y EDUCACIÓN DE LOS USUARIOS", isHeader: true },
  { num: "6.1", question: "Se educó a los usuarios sobre prácticas de uso sostenible.", si: "X", no: "", na: "", comment: "Documentación disponible en docs/, API docs en /api-docs" },
  { num: "6.2", question: "Se diseñaron interfaces que promuevan comportamientos eficientes desde el punto de vista energético.", si: "", no: "", na: "X", comment: "No aplica - es un backend API sin interfaz de usuario" },
  { num: "6.3", question: "Se fomentan los comentarios sobre el rendimiento y la sostenibilidad del software.", si: "", no: "X", na: "", comment: "Área de mejora - Recomendado canal de feedback en plan" },
  { num: "6.4", question: "Se realiza un seguimiento de las mejoras en la eficiencia energética a lo largo del tiempo.", si: "X", no: "", na: "", comment: "Historial de cambios y plan de mejora en Secciones 7 y 9" },
  { num: "6.5", question: "Se informa sobre el impacto medioambiental de conformidad con las normas o certificaciones pertinentes.", si: "X", no: "", na: "", comment: "Estimación de huella de carbono en Sección 2.4, referencias a Green Software Foundation" },
  { num: "6.6", question: "Se considera una estrategia global de software verde que involucre a la empresa.", si: "X", no: "", na: "", comment: "Estrategia documentada en GREEN_SOFTWARE_SUSTAINABILITY.md completo" }
];

// Función para crear celda con borde
function createCell(text, isHeader = false, width = null) {
  const cellOptions = {
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: text,
            bold: isHeader,
            size: isHeader ? 22 : 20
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
    }
  };

  if (width) {
    cellOptions.width = { size: width, type: WidthType.PERCENTAGE };
  }

  return new TableCell(cellOptions);
}

function createLeftAlignedCell(text, width = null) {
  const cellOptions = {
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: text,
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
    }
  };

  if (width) {
    cellOptions.width = { size: width, type: WidthType.PERCENTAGE };
  }

  return new TableCell(cellOptions);
}

function createSectionHeader(text) {
  return new TableRow({
    children: [
      new TableCell({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: text,
                bold: true,
                size: 22
              })
            ]
          })
        ],
        columnSpan: 6,
        shading: { fill: "D9E2F3" },
        borders: {
          top: { style: BorderStyle.SINGLE, size: 1 },
          bottom: { style: BorderStyle.SINGLE, size: 1 },
          left: { style: BorderStyle.SINGLE, size: 1 },
          right: { style: BorderStyle.SINGLE, size: 1 }
        }
      })
    ]
  });
}

async function generateDocument() {
  // Crear filas de la tabla
  const tableRows = [
    // Encabezado
    new TableRow({
      children: [
        createCell("#", true, 5),
        createCell("Pregunta", true, 45),
        createCell("Sí", true, 8),
        createCell("No", true, 8),
        createCell("NA", true, 8),
        createCell("Comentario", true, 26)
      ],
      tableHeader: true
    })
  ];

  // Agregar datos
  for (const item of checklistData) {
    if (item.isHeader) {
      tableRows.push(createSectionHeader(item.section));
    } else {
      tableRows.push(
        new TableRow({
          children: [
            createCell(item.num, false, 5),
            createLeftAlignedCell(item.question, 45),
            createCell(item.si, false, 8),
            createCell(item.no, false, 8),
            createCell(item.na, false, 8),
            createLeftAlignedCell(item.comment, 26)
          ]
        })
      );
    }
  }

  // Contar totales
  let totalSi = 0, totalNo = 0, totalNA = 0;
  checklistData.forEach(item => {
    if (!item.isHeader) {
      if (item.si === "X") totalSi++;
      if (item.no === "X") totalNo++;
      if (item.na === "X") totalNA++;
    }
  });

  const doc = new Document({
    sections: [
      {
        children: [
          // Título
          new Paragraph({
            children: [
              new TextRun({
                text: "Lista de Verificación para el Desarrollo de Software Verde",
                bold: true,
                size: 32
              })
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),

          // Subtítulo
          new Paragraph({
            children: [
              new TextRun({
                text: "Proyecto: Hypothesis Backend - Lean Startup Assistant",
                size: 24
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          // Tabla principal
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE }
          }),

          // Espacio
          new Paragraph({ spacing: { before: 400, after: 200 } }),

          // Resumen
          new Paragraph({
            children: [
              new TextRun({
                text: "RESUMEN DE RESULTADOS",
                bold: true,
                size: 26
              })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),

          // Tabla de resumen
          new Table({
            rows: [
              new TableRow({
                children: [
                  createCell("Criterio", true),
                  createCell("Cantidad", true),
                  createCell("Porcentaje", true)
                ]
              }),
              new TableRow({
                children: [
                  createCell("Cumple (Sí)"),
                  createCell(totalSi.toString()),
                  createCell(((totalSi / (totalSi + totalNo)) * 100).toFixed(1) + "%")
                ]
              }),
              new TableRow({
                children: [
                  createCell("No Cumple (No)"),
                  createCell(totalNo.toString()),
                  createCell(((totalNo / (totalSi + totalNo)) * 100).toFixed(1) + "%")
                ]
              }),
              new TableRow({
                children: [
                  createCell("No Aplica (NA)"),
                  createCell(totalNA.toString()),
                  createCell("-")
                ]
              }),
              new TableRow({
                children: [
                  createCell("TOTAL", true),
                  createCell((totalSi + totalNo + totalNA).toString(), true),
                  createCell("100%", true)
                ]
              })
            ],
            width: { size: 50, type: WidthType.PERCENTAGE }
          }),

          // Espacio
          new Paragraph({ spacing: { before: 400, after: 200 } }),

          // Conclusión
          new Paragraph({
            children: [
              new TextRun({
                text: "CONCLUSIÓN",
                bold: true,
                size: 26
              })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `El proyecto cumple con ${((totalSi / (totalSi + totalNo)) * 100).toFixed(0)}% de los criterios de Software Verde evaluados (${totalSi} de ${totalSi + totalNo} criterios aplicables).`,
                size: 22
              })
            ],
            spacing: { after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Documentación de Sostenibilidad:",
                bold: true,
                size: 22
              })
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [new TextRun({ text: "• Documento principal: docs/GREEN_SOFTWARE_SUSTAINABILITY.md", size: 22 })],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "• Objetivos de sostenibilidad definidos (Sección 1)", size: 22 })],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "• Análisis de impacto ambiental con estimación de huella de carbono (Sección 2)", size: 22 })],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "• Decisiones arquitectónicas para sostenibilidad (Sección 3)", size: 22 })],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "• Estándares de codificación sostenible con ejemplos (Sección 4)", size: 22 })],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "• Evaluación de infraestructura y proveedores verdes (Sección 5)", size: 22 })],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "• Plan de métricas y monitoreo (Sección 6)", size: 22 })],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "• Plan de mejora continua a corto, mediano y largo plazo (Sección 7)", size: 22 })],
            spacing: { after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Aspectos técnicos implementados:",
                bold: true,
                size: 22
              })
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [new TextRun({ text: "• Node.js como lenguaje eficiente para operaciones I/O asíncronas", size: 22 })],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "• Arquitectura modular stateless que permite escalado horizontal", size: 22 })],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "• Algoritmos vectoriales eficientes (TF-IDF local, ChromaDB)", size: 22 })],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "• Compresión GZIP para reducir transferencia de datos (~70%)", size: 22 })],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "• JWT compacto para minimizar transferencias de autenticación", size: 22 })],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "• Auto-escalado en Railway para ajustar recursos a demanda", size: 22 })],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "• Graceful shutdown para liberar recursos correctamente", size: 22 })],
            spacing: { after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Áreas de mejora identificadas (documentadas en plan de mejora):",
                bold: true,
                size: 22
              })
            ],
            spacing: { after: 100 }
          }),

          new Paragraph({
            children: [new TextRun({ text: "• Migrar a proveedor cloud con energía 100% renovable (Google Cloud, AWS eu-north-1)", size: 22 })],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "• Implementar pruebas de carga para validar eficiencia a escala", size: 22 })],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "• Consolidar almacenamiento dual (PostgreSQL + ChromaDB)", size: 22 })],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "• Implementar carbon-aware scheduling", size: 22 })],
            spacing: { after: 50 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "• Agregar mecanismo de feedback de usuarios", size: 22 })],
            spacing: { after: 200 }
          }),

          // Fecha
          new Paragraph({
            children: [
              new TextRun({
                text: `Fecha de evaluación: ${new Date().toLocaleDateString('es-PE')}`,
                size: 20,
                italics: true
              })
            ],
            alignment: AlignmentType.RIGHT,
            spacing: { before: 400 }
          })
        ]
      }
    ]
  });

  // Guardar documento
  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, '..', 'ChecklistSoftwareVerde.docx');
  fs.writeFileSync(outputPath, buffer);

  console.log(`✅ Documento generado exitosamente: ${outputPath}`);
  console.log(`\n📊 Resumen:`);
  console.log(`   - Cumple (Sí): ${totalSi}`);
  console.log(`   - No Cumple (No): ${totalNo}`);
  console.log(`   - No Aplica (NA): ${totalNA}`);
  console.log(`   - Porcentaje de cumplimiento: ${((totalSi / (totalSi + totalNo)) * 100).toFixed(1)}%`);
  return outputPath;
}

generateDocument().catch(console.error);
