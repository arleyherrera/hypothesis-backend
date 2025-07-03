/**
 * @swagger
 * tags:
 *   name: Artifacts
 *   description: Artifact management and AI generation
 */

/**
 * @swagger
 * /artifacts/{hypothesisId}:
 *   get:
 *     summary: Get all artifacts for a hypothesis
 *     tags: [Artifacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hypothesisId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of artifacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Artifact'
 */

/**
 * @swagger
 * /artifacts/{hypothesisId}/generate/{phase}:
 *   post:
 *     summary: Generate template artifacts for a phase
 *     tags: [Artifacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hypothesisId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: phase
 *         required: true
 *         schema:
 *           type: string
 *           enum: [construir, medir, aprender, pivotar, iterar]
 *     responses:
 *       201:
 *         description: Artifacts generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "6 artefactos generados para construir"
 *                 artifacts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Artifact'
 */

/**
 * @swagger
 * /artifacts/{hypothesisId}/generate-ai/{phase}:
 *   post:
 *     summary: Generate AI-powered artifacts for a phase
 *     tags: [Artifacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hypothesisId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: phase
 *         required: true
 *         schema:
 *           type: string
 *           enum: [construir, medir, aprender, pivotar, iterar]
 *     responses:
 *       201:
 *         description: AI artifacts generated with coherence analysis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 artifacts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Artifact'
 *                 coherenceAnalysis:
 *                   type: object
 *                   properties:
 *                     score:
 *                       type: number
 *                     recommendation:
 *                       type: string
 */

/**
 * @swagger
 * /artifacts/{id}/improve:
 *   post:
 *     summary: Improve single artifact with AI
 *     tags: [Artifacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: Custom improvement prompt
 *     responses:
 *       200:
 *         description: Artifact improved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 artifact:
 *                   $ref: '#/components/schemas/Artifact'
 *                 coherenceImprovement:
 *                   type: object
 *                   properties:
 *                     before:
 *                       type: number
 *                     after:
 *                       type: number
 *                     improvement:
 *                       type: number
 */

/**
 * @swagger
 * /artifacts/{hypothesisId}/improve-all/{phase}:
 *   post:
 *     summary: Improve all artifacts of a phase with AI
 *     tags: [Artifacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hypothesisId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: phase
 *         required: true
 *         schema:
 *           type: string
 *           enum: [construir, medir, aprender, pivotar, iterar]
 *     responses:
 *       200:
 *         description: All artifacts improved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "5 artefactos mejorados exitosamente"
 *                 artifacts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Artifact'
 *                 phase:
 *                   type: string
 */

/**
 * @swagger
 * /artifacts/{hypothesisId}/context-stats:
 *   get:
 *     summary: Get context coherence statistics
 *     tags: [Artifacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: hypothesisId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Context statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 hypothesisId:
 *                   type: integer
 *                 contextStats:
 *                   type: object
 *                   properties:
 *                     totalContexts:
 *                       type: integer
 *                     phaseDistribution:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           phase:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     phaseCoherence:
 *                       type: object
 *                     globalCoherence:
 *                       type: object
 *                       properties:
 *                         score:
 *                           type: number
 *                         transitions:
 *                           type: object
 *                         recommendation:
 *                           type: string
 */