// scripts/generateRequerimientosDoc.js
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, HeadingLevel } = require('docx');
const fs = require('fs');
const path = require('path');

// Configuración de estilos
const FONT = "Arial";
const COLORS = {
  primary: "1a5f7a",
  success: "28a745",
  header: "2c3e50",
  tableHeader: "34495e",
  lightGray: "f8f9fa"
};

// Función para crear celda de tabla
const createCell = (text, isHeader = false, width = 25) => {
  return new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    shading: isHeader ? { fill: COLORS.tableHeader } : undefined,
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: text,
            bold: isHeader,
            color: isHeader ? "FFFFFF" : "000000",
            font: FONT,
            size: 20
          })
        ],
        spacing: { before: 50, after: 50 }
      })
    ]
  });
};

// Función para crear fila de tabla
const createRow = (cells, isHeader = false) => {
  return new TableRow({
    children: cells.map((cell, index) => {
      const widths = cells.length === 4 ? [10, 40, 25, 25] : [15, 45, 40];
      return createCell(cell, isHeader, widths[index] || 25);
    })
  });
};

// Función para crear sección con título
const createSection = (title, level = HeadingLevel.HEADING_1) => {
  return new Paragraph({
    text: title,
    heading: level,
    spacing: { before: 300, after: 150 },
    children: [
      new TextRun({
        text: title,
        bold: true,
        font: FONT,
        size: level === HeadingLevel.HEADING_1 ? 28 : level === HeadingLevel.HEADING_2 ? 24 : 22,
        color: COLORS.header
      })
    ]
  });
};

// Datos de requerimientos funcionales
const reqFuncionales = {
  autenticacion: [
    { id: "RF-A01", desc: "Registro de usuarios con validación de email y contraseña segura", ubicacion: "authController.js, authValidators.js" },
    { id: "RF-A02", desc: "Inicio de sesión con autenticación JWT", ubicacion: "authController.js:login()" },
    { id: "RF-A03", desc: "Recuperación de contraseña por email", ubicacion: "authController.js:forgotPassword()" },
    { id: "RF-A04", desc: "Restablecimiento de contraseña con token seguro", ubicacion: "authController.js:resetPassword()" },
    { id: "RF-A05", desc: "Obtener información del usuario autenticado", ubicacion: "authController.js:getMe()" }
  ],
  usuario: [
    { id: "RF-U01", desc: "Consultar perfil del usuario", ubicacion: "userController.js:getProfile()" },
    { id: "RF-U02", desc: "Actualizar datos del perfil (nombre, email, contraseña)", ubicacion: "userController.js:updateProfile()" },
    { id: "RF-U03", desc: "Eliminar cuenta de usuario y datos asociados", ubicacion: "userController.js:deleteAccount()" }
  ],
  hipotesis: [
    { id: "RF-H01", desc: "Crear hipótesis con problema, solución, segmento y propuesta de valor", ubicacion: "hypothesisController.js:createHypothesis()" },
    { id: "RF-H02", desc: "Listar todas las hipótesis del usuario", ubicacion: "hypothesisController.js:getHypotheses()" },
    { id: "RF-H03", desc: "Obtener detalle de una hipótesis con sus artefactos", ubicacion: "hypothesisController.js:getHypothesisById()" },
    { id: "RF-H04", desc: "Actualizar hipótesis existente", ubicacion: "hypothesisController.js:updateHypothesis()" },
    { id: "RF-H05", desc: "Eliminar hipótesis y artefactos asociados", ubicacion: "hypothesisController.js:deleteHypothesis()" },
    { id: "RF-H06", desc: "Generar hipótesis automáticamente desde un problema usando IA", ubicacion: "aiController.js:generateHypothesisFromProblem()" }
  ],
  artefactos: [
    { id: "RF-AR01", desc: "Crear artefactos asociados a una hipótesis", ubicacion: "artifactController.js:createArtifact()" },
    { id: "RF-AR02", desc: "Listar artefactos por hipótesis", ubicacion: "artifactController.js:getArtifactsByHypothesis()" },
    { id: "RF-AR03", desc: "Actualizar artefacto existente", ubicacion: "artifactController.js:updateArtifact()" },
    { id: "RF-AR04", desc: "Eliminar artefacto", ubicacion: "artifactController.js:deleteArtifact()" },
    { id: "RF-AR05", desc: "Generar artefactos por fase (construir, medir, aprender, pivotar, iterar)", ubicacion: "artifactController.js:generateArtifacts()" },
    { id: "RF-AR06", desc: "Generar artefactos con IA según fase Lean Startup", ubicacion: "aiController.js:generateArtifactWithAI()" },
    { id: "RF-AR07", desc: "Mejorar artefacto individual con IA", ubicacion: "aiController.js:improveArtifactWithAI()" },
    { id: "RF-AR08", desc: "Mejorar todos los artefactos de una fase con IA", ubicacion: "aiController.js:improveAllArtifactsWithAI()" }
  ],
  contexto: [
    { id: "RF-C01", desc: "Almacenar contexto vectorial de artefactos (ChromaDB)", ubicacion: "vectorContextService.js" },
    { id: "RF-C02", desc: "Recuperar contexto relevante para generación coherente", ubicacion: "retrieval.js:getRelevantContext()" },
    { id: "RF-C03", desc: "Estadísticas de contexto por hipótesis", ubicacion: "aiController.js:getContextStats()" }
  ],
  privacidad: [
    { id: "RF-P01", desc: "Interfaz de consentimiento informado antes del registro", ubicacion: "Frontend" },
    { id: "RF-P02", desc: "Registro de fecha/hora del consentimiento", ubicacion: "Frontend" },
    { id: "RF-P03", desc: "Modificación de datos personales en perfil", ubicacion: "userController.js:updateProfile()" },
    { id: "RF-P04", desc: "Eliminación de cuenta y todos los datos asociados", ubicacion: "userController.js:deleteAccount()" }
  ]
};

// Datos de requerimientos no funcionales
const reqNoFuncionales = {
  seguridad: [
    { id: "RNF-S01", desc: "Autenticación mediante JWT con expiración de 30 días", ubicacion: "middleware/auth.js", tecnologia: "jsonwebtoken" },
    { id: "RNF-S02", desc: "Encriptación de contraseñas con bcrypt (12 rounds)", ubicacion: "models/user.js", tecnologia: "bcryptjs" },
    { id: "RNF-S03", desc: "Headers de seguridad HTTP (XSS, CSP, etc.)", ubicacion: "server.js", tecnologia: "helmet" },
    { id: "RNF-S04", desc: "Rate limiting global (100 req/15min)", ubicacion: "server.js:64-70", tecnologia: "express-rate-limit" },
    { id: "RNF-S05", desc: "Rate limiting autenticación (5 intentos/15min)", ubicacion: "server.js:73-78", tecnologia: "express-rate-limit" },
    { id: "RNF-S06", desc: "Rate limiting IA (10 generaciones/hora)", ubicacion: "server.js:81-85", tecnologia: "express-rate-limit" },
    { id: "RNF-S07", desc: "Sanitización de inputs contra XSS", ubicacion: "middleware/sanitize.js", tecnologia: "validator" },
    { id: "RNF-S08", desc: "Protección contra NoSQL injection", ubicacion: "server.js", tecnologia: "express-mongo-sanitize" },
    { id: "RNF-S09", desc: "Validación de emails con bloqueo de emails temporales", ubicacion: "validators/authValidators.js", tecnologia: "express-validator" },
    { id: "RNF-S10", desc: "Validación de contraseñas (mayúscula, minúscula, número, especial)", ubicacion: "validators/authValidators.js", tecnologia: "express-validator" }
  ],
  proteccion: [
    { id: "RNF-P01", desc: "Aislamiento de datos por usuario (filtro userId)", ubicacion: "Todos los controllers", tecnologia: "Sequelize WHERE" },
    { id: "RNF-P02", desc: "Eliminación en cascada de datos relacionados", ubicacion: "models/user.js, models/hypothesis.js", tecnologia: "Sequelize CASCADE" },
    { id: "RNF-P03", desc: "No exposición de errores en producción", ubicacion: "server.js:192-206", tecnologia: "Error handler" },
    { id: "RNF-P04", desc: "Límite de tamaño de request (10MB)", ubicacion: "server.js:101-102", tecnologia: "express.json" }
  ],
  rendimiento: [
    { id: "RNF-R01", desc: "Compresión GZIP de respuestas (~70% reducción)", ubicacion: "server.js:98", tecnologia: "compression" },
    { id: "RNF-R02", desc: "Operaciones asíncronas no bloqueantes", ubicacion: "Todos los controllers", tecnologia: "async/await" },
    { id: "RNF-R03", desc: "Índices en base de datos (email único)", ubicacion: "models/user.js:165-170", tecnologia: "Sequelize indexes" },
    { id: "RNF-R04", desc: "Selección de campos específicos en consultas", ubicacion: "userController.js, authController.js", tecnologia: "Sequelize attributes" },
    { id: "RNF-R05", desc: "TF-IDF local para embeddings (sin GPU externa)", ubicacion: "vectorContext/textProcessing.js", tecnologia: "Algoritmo TF-IDF" }
  ],
  disponibilidad: [
    { id: "RNF-D01", desc: "Health check básico", ubicacion: "server.js:119-126 (/health)", tecnologia: "Express endpoint" },
    { id: "RNF-D02", desc: "Health check con estado de BD", ubicacion: "server.js:128-148 (/api/health)", tecnologia: "Sequelize authenticate" },
    { id: "RNF-D03", desc: "Graceful shutdown (SIGTERM/SIGINT)", ubicacion: "server.js:241-257", tecnologia: "Process signals" },
    { id: "RNF-D04", desc: "Manejo de errores no capturados", ubicacion: "server.js:266-277", tecnologia: "Process handlers" },
    { id: "RNF-D05", desc: "Auto-scaling según demanda", ubicacion: "Railway config", tecnologia: "Railway Platform" }
  ],
  portabilidad: [
    { id: "RNF-PO01", desc: "Configuración por variables de entorno", ubicacion: ".env, utils/validateEnv.js", tecnologia: "dotenv" },
    { id: "RNF-PO02", desc: "Soporte multi-ambiente (dev, test, production)", ubicacion: "config/database.js", tecnologia: "NODE_ENV" },
    { id: "RNF-PO03", desc: "Compatibilidad Node.js >= 14.0.0", ubicacion: "package.json:engines", tecnologia: "Node.js" },
    { id: "RNF-PO04", desc: "Base de datos PostgreSQL portable", ubicacion: "migrations/", tecnologia: "Sequelize CLI" },
    { id: "RNF-PO05", desc: "Despliegue en Railway (PaaS)", ubicacion: "railway.json", tecnologia: "Railway" }
  ],
  usabilidad: [
    { id: "RNF-US01", desc: "API RESTful con convenciones estándar", ubicacion: "routes/", tecnologia: "Express Router" },
    { id: "RNF-US02", desc: "Documentación Swagger/OpenAPI interactiva", ubicacion: "/api-docs", tecnologia: "swagger-ui-express" },
    { id: "RNF-US03", desc: "Mensajes de error descriptivos en español", ubicacion: "Todos los controllers", tecnologia: "Validaciones custom" },
    { id: "RNF-US04", desc: "Respuestas JSON estructuradas y consistentes", ubicacion: "Todos los endpoints", tecnologia: "Express JSON" },
    { id: "RNF-US05", desc: "CORS configurado para frontend", ubicacion: "server.js:89-95", tecnologia: "cors" }
  ],
  mantenibilidad: [
    { id: "RNF-M01", desc: "Arquitectura modular por capas (routes, controllers, models, services)", ubicacion: "Estructura del proyecto", tecnologia: "Node.js/Express" },
    { id: "RNF-M02", desc: "Separación de validadores en módulos", ubicacion: "routes/validators/", tecnologia: "express-validator" },
    { id: "RNF-M03", desc: "Helpers centralizados", ubicacion: "helpers/controllerUtils.js", tecnologia: "Módulos Node.js" },
    { id: "RNF-M04", desc: "Suite de tests automatizados", ubicacion: "tests/", tecnologia: "Jest + Supertest" },
    { id: "RNF-M05", desc: "Logging de operaciones", ubicacion: "helpers/controllerUtils.js:logOperation()", tecnologia: "Console + Morgan" }
  ],
  sostenibilidad: [
    { id: "RNF-SOS01", desc: "Compresión de respuestas para reducir transferencia", ubicacion: "server.js:98", tecnologia: "compression" },
    { id: "RNF-SOS02", desc: "Rate limiting para evitar sobrecarga", ubicacion: "server.js:64-85", tecnologia: "express-rate-limit" },
    { id: "RNF-SOS03", desc: "TF-IDF local evita llamadas a APIs externas costosas", ubicacion: "vectorContext/textProcessing.js", tecnologia: "Algoritmo local" },
    { id: "RNF-SOS04", desc: "Backend stateless permite escalar horizontalmente", ubicacion: "Arquitectura JWT", tecnologia: "Stateless design" },
    { id: "RNF-SOS05", desc: "Graceful shutdown evita pérdida de recursos", ubicacion: "server.js:241-257", tecnologia: "Process signals" }
  ]
};

async function generateDocument() {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Portada
        new Paragraph({
          children: [
            new TextRun({ text: "\n\n\n\n", font: FONT })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "DOCUMENTACIÓN DE REQUERIMIENTOS",
              bold: true,
              font: FONT,
              size: 48,
              color: COLORS.primary
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
          children: [
            new TextRun({
              text: "Hypothesis Backend",
              bold: true,
              font: FONT,
              size: 36,
              color: COLORS.header
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100 },
          children: [
            new TextRun({
              text: "Lean Startup Assistant API",
              font: FONT,
              size: 28,
              italics: true
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
          children: [
            new TextRun({
              text: `Fecha: ${new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}`,
              font: FONT,
              size: 24
            })
          ]
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 100 },
          children: [
            new TextRun({
              text: "Versión: 1.0.0",
              font: FONT,
              size: 24
            })
          ]
        }),

        // Salto de página
        new Paragraph({
          children: [new TextRun({ text: "", break: 1 })],
          pageBreakBefore: true
        }),

        // Índice
        createSection("ÍNDICE"),
        new Paragraph({ children: [new TextRun({ text: "1. Introducción", font: FONT, size: 22 })], spacing: { after: 80 } }),
        new Paragraph({ children: [new TextRun({ text: "2. Requerimientos Funcionales", font: FONT, size: 22 })], spacing: { after: 80 } }),
        new Paragraph({ children: [new TextRun({ text: "   2.1 Autenticación", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "   2.2 Gestión de Usuario", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "   2.3 Gestión de Hipótesis", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "   2.4 Gestión de Artefactos", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "   2.5 Contexto Vectorial", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "   2.6 Privacidad de Datos", font: FONT, size: 20 })], spacing: { after: 80 } }),
        new Paragraph({ children: [new TextRun({ text: "3. Requerimientos No Funcionales", font: FONT, size: 22 })], spacing: { after: 80 } }),
        new Paragraph({ children: [new TextRun({ text: "   3.1 Seguridad", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "   3.2 Protección de Datos", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "   3.3 Rendimiento", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "   3.4 Disponibilidad", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "   3.5 Portabilidad", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "   3.6 Usabilidad", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "   3.7 Mantenibilidad", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "   3.8 Sostenibilidad", font: FONT, size: 20 })], spacing: { after: 80 } }),
        new Paragraph({ children: [new TextRun({ text: "4. Resumen de Tecnologías", font: FONT, size: 22 })], spacing: { after: 80 } }),

        // Salto de página
        new Paragraph({ children: [new TextRun({ text: "", break: 1 })], pageBreakBefore: true }),

        // 1. Introducción
        createSection("1. INTRODUCCIÓN"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Este documento presenta los requerimientos funcionales y no funcionales implementados en el sistema Hypothesis Backend, una API RESTful para la gestión de hipótesis siguiendo la metodología Lean Startup.",
              font: FONT,
              size: 22
            })
          ],
          spacing: { after: 150 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "El sistema permite a los usuarios crear, gestionar y validar hipótesis de negocio, generando artefactos automáticamente mediante Inteligencia Artificial (Claude/Anthropic) para cada fase del ciclo Lean Startup: Construir, Medir, Aprender, Pivotar e Iterar.",
              font: FONT,
              size: 22
            })
          ],
          spacing: { after: 200 }
        }),

        // 2. Requerimientos Funcionales
        new Paragraph({ children: [new TextRun({ text: "", break: 1 })], pageBreakBefore: true }),
        createSection("2. REQUERIMIENTOS FUNCIONALES"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Los requerimientos funcionales describen las funcionalidades específicas que el sistema debe proporcionar.",
              font: FONT,
              size: 22
            })
          ],
          spacing: { after: 200 }
        }),

        // 2.1 Autenticación
        createSection("2.1 Autenticación", HeadingLevel.HEADING_2),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            createRow(["ID", "Descripción", "Ubicación en Código"], true),
            ...reqFuncionales.autenticacion.map(r => createRow([r.id, r.desc, r.ubicacion]))
          ]
        }),

        // 2.2 Usuario
        new Paragraph({ spacing: { before: 300 } }),
        createSection("2.2 Gestión de Usuario", HeadingLevel.HEADING_2),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            createRow(["ID", "Descripción", "Ubicación en Código"], true),
            ...reqFuncionales.usuario.map(r => createRow([r.id, r.desc, r.ubicacion]))
          ]
        }),

        // 2.3 Hipótesis
        new Paragraph({ spacing: { before: 300 } }),
        createSection("2.3 Gestión de Hipótesis", HeadingLevel.HEADING_2),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            createRow(["ID", "Descripción", "Ubicación en Código"], true),
            ...reqFuncionales.hipotesis.map(r => createRow([r.id, r.desc, r.ubicacion]))
          ]
        }),

        // 2.4 Artefactos
        new Paragraph({ children: [new TextRun({ text: "", break: 1 })], pageBreakBefore: true }),
        createSection("2.4 Gestión de Artefactos", HeadingLevel.HEADING_2),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            createRow(["ID", "Descripción", "Ubicación en Código"], true),
            ...reqFuncionales.artefactos.map(r => createRow([r.id, r.desc, r.ubicacion]))
          ]
        }),

        // 2.5 Contexto
        new Paragraph({ spacing: { before: 300 } }),
        createSection("2.5 Contexto Vectorial (IA)", HeadingLevel.HEADING_2),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            createRow(["ID", "Descripción", "Ubicación en Código"], true),
            ...reqFuncionales.contexto.map(r => createRow([r.id, r.desc, r.ubicacion]))
          ]
        }),

        // 2.6 Privacidad
        new Paragraph({ spacing: { before: 300 } }),
        createSection("2.6 Privacidad de Datos", HeadingLevel.HEADING_2),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            createRow(["ID", "Descripción", "Ubicación en Código"], true),
            ...reqFuncionales.privacidad.map(r => createRow([r.id, r.desc, r.ubicacion]))
          ]
        }),

        // 3. Requerimientos No Funcionales
        new Paragraph({ children: [new TextRun({ text: "", break: 1 })], pageBreakBefore: true }),
        createSection("3. REQUERIMIENTOS NO FUNCIONALES"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Los requerimientos no funcionales describen las características de calidad del sistema.",
              font: FONT,
              size: 22
            })
          ],
          spacing: { after: 200 }
        }),

        // 3.1 Seguridad
        createSection("3.1 Seguridad", HeadingLevel.HEADING_2),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            createRow(["ID", "Descripción", "Ubicación", "Tecnología"], true),
            ...reqNoFuncionales.seguridad.map(r => createRow([r.id, r.desc, r.ubicacion, r.tecnologia]))
          ]
        }),

        // 3.2 Protección
        new Paragraph({ children: [new TextRun({ text: "", break: 1 })], pageBreakBefore: true }),
        createSection("3.2 Protección de Datos", HeadingLevel.HEADING_2),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            createRow(["ID", "Descripción", "Ubicación", "Tecnología"], true),
            ...reqNoFuncionales.proteccion.map(r => createRow([r.id, r.desc, r.ubicacion, r.tecnologia]))
          ]
        }),

        // 3.3 Rendimiento
        new Paragraph({ spacing: { before: 300 } }),
        createSection("3.3 Rendimiento", HeadingLevel.HEADING_2),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            createRow(["ID", "Descripción", "Ubicación", "Tecnología"], true),
            ...reqNoFuncionales.rendimiento.map(r => createRow([r.id, r.desc, r.ubicacion, r.tecnologia]))
          ]
        }),

        // 3.4 Disponibilidad
        new Paragraph({ spacing: { before: 300 } }),
        createSection("3.4 Disponibilidad", HeadingLevel.HEADING_2),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            createRow(["ID", "Descripción", "Ubicación", "Tecnología"], true),
            ...reqNoFuncionales.disponibilidad.map(r => createRow([r.id, r.desc, r.ubicacion, r.tecnologia]))
          ]
        }),

        // 3.5 Portabilidad
        new Paragraph({ children: [new TextRun({ text: "", break: 1 })], pageBreakBefore: true }),
        createSection("3.5 Portabilidad", HeadingLevel.HEADING_2),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            createRow(["ID", "Descripción", "Ubicación", "Tecnología"], true),
            ...reqNoFuncionales.portabilidad.map(r => createRow([r.id, r.desc, r.ubicacion, r.tecnologia]))
          ]
        }),

        // 3.6 Usabilidad
        new Paragraph({ spacing: { before: 300 } }),
        createSection("3.6 Usabilidad", HeadingLevel.HEADING_2),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            createRow(["ID", "Descripción", "Ubicación", "Tecnología"], true),
            ...reqNoFuncionales.usabilidad.map(r => createRow([r.id, r.desc, r.ubicacion, r.tecnologia]))
          ]
        }),

        // 3.7 Mantenibilidad
        new Paragraph({ spacing: { before: 300 } }),
        createSection("3.7 Mantenibilidad", HeadingLevel.HEADING_2),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            createRow(["ID", "Descripción", "Ubicación", "Tecnología"], true),
            ...reqNoFuncionales.mantenibilidad.map(r => createRow([r.id, r.desc, r.ubicacion, r.tecnologia]))
          ]
        }),

        // 3.8 Sostenibilidad
        new Paragraph({ children: [new TextRun({ text: "", break: 1 })], pageBreakBefore: true }),
        createSection("3.8 Sostenibilidad (Software Verde)", HeadingLevel.HEADING_2),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            createRow(["ID", "Descripción", "Ubicación", "Tecnología"], true),
            ...reqNoFuncionales.sostenibilidad.map(r => createRow([r.id, r.desc, r.ubicacion, r.tecnologia]))
          ]
        }),

        // 4. Resumen de Tecnologías
        new Paragraph({ spacing: { before: 300 } }),
        createSection("4. RESUMEN DE TECNOLOGÍAS"),
        new Paragraph({
          children: [
            new TextRun({
              text: "Stack Tecnológico Principal:",
              bold: true,
              font: FONT,
              size: 22
            })
          ],
          spacing: { after: 100 }
        }),
        new Paragraph({ children: [new TextRun({ text: "• Runtime: Node.js >= 14.0.0", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "• Framework: Express.js 4.21", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "• Base de Datos: PostgreSQL con Sequelize ORM", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "• Vectores: ChromaDB con TF-IDF local", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "• IA: Anthropic Claude API", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "• Autenticación: JWT (jsonwebtoken)", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "• Seguridad: helmet, bcryptjs, express-rate-limit", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "• Testing: Jest + Supertest", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "• Documentación: Swagger/OpenAPI 3.0", font: FONT, size: 20 })], spacing: { after: 60 } }),
        new Paragraph({ children: [new TextRun({ text: "• Despliegue: Railway (PaaS)", font: FONT, size: 20 })], spacing: { after: 150 } }),

        // Resumen final
        new Paragraph({
          children: [
            new TextRun({
              text: "Resumen de Requerimientos Implementados:",
              bold: true,
              font: FONT,
              size: 22
            })
          ],
          spacing: { before: 200, after: 100 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            createRow(["Categoría", "Cantidad", "Estado"], true),
            createRow(["Requerimientos Funcionales", "26", "100% Implementados"]),
            createRow(["RNF - Seguridad", "10", "100% Implementados"]),
            createRow(["RNF - Protección", "4", "100% Implementados"]),
            createRow(["RNF - Rendimiento", "5", "100% Implementados"]),
            createRow(["RNF - Disponibilidad", "5", "100% Implementados"]),
            createRow(["RNF - Portabilidad", "5", "100% Implementados"]),
            createRow(["RNF - Usabilidad", "5", "100% Implementados"]),
            createRow(["RNF - Mantenibilidad", "5", "100% Implementados"]),
            createRow(["RNF - Sostenibilidad", "5", "100% Implementados"]),
            createRow(["TOTAL", "70", "100% Implementados"])
          ]
        }),

        // Pie de documento
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
          children: [
            new TextRun({
              text: "— Fin del Documento —",
              font: FONT,
              size: 20,
              italics: true,
              color: "666666"
            })
          ]
        })
      ]
    }]
  });

  // Guardar documento
  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, '..', 'docs', 'Requerimientos_Implementados.docx');

  // Crear directorio docs si no existe
  const docsDir = path.dirname(outputPath);
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Documento generado: ${outputPath}`);

  // Mostrar resumen
  const totalRF = Object.values(reqFuncionales).reduce((sum, arr) => sum + arr.length, 0);
  const totalRNF = Object.values(reqNoFuncionales).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`\n📊 Resumen:`);
  console.log(`   - Requerimientos Funcionales: ${totalRF}`);
  console.log(`   - Requerimientos No Funcionales: ${totalRNF}`);
  console.log(`   - Total: ${totalRF + totalRNF} requerimientos documentados`);
}

generateDocument().catch(console.error);
