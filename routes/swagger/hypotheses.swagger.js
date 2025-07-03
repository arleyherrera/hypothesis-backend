/**
 * @swagger
 * tags:
 *   name: Hypotheses
 *   description: Hypothesis management endpoints
 */

/**
 * @swagger
 * /hypotheses:
 *   get:
 *     summary: Get all user hypotheses
 *     tags: [Hypotheses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of hypotheses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hypothesis'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /hypotheses/{id}:
 *   get:
 *     summary: Get hypothesis by ID
 *     tags: [Hypotheses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Hypothesis ID
 *     responses:
 *       200:
 *         description: Hypothesis found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hypothesis'
 *       404:
 *         description: Hypothesis not found
 */

/**
 * @swagger
 * /hypotheses:
 *   post:
 *     summary: Create new hypothesis
 *     tags: [Hypotheses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - problem
 *               - name
 *               - solution
 *               - customerSegment
 *               - valueProposition
 *             properties:
 *               problem:
 *                 type: string
 *                 minLength: 20
 *                 description: Problem description (min 20 chars)
 *                 example: "Los emprendedores pierden mucho tiempo validando ideas que no funcionan"
 *               name:
 *                 type: string
 *                 example: "Validación rápida de hipótesis"
 *               solution:
 *                 type: string
 *                 example: "Plataforma que automatiza la validación usando IA"
 *               customerSegment:
 *                 type: string
 *                 example: "Emprendedores tech con recursos limitados"
 *               valueProposition:
 *                 type: string
 *                 example: "Reduce el tiempo de validación de 3 meses a 2 semanas"
 *     responses:
 *       201:
 *         description: Hypothesis created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hypothesis'
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /hypotheses/{id}:
 *   put:
 *     summary: Update hypothesis
 *     tags: [Hypotheses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               problem:
 *                 type: string
 *                 minLength: 20
 *               name:
 *                 type: string
 *               solution:
 *                 type: string
 *               customerSegment:
 *                 type: string
 *               valueProposition:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hypothesis updated
 *       404:
 *         description: Hypothesis not found
 */

/**
 * @swagger
 * /hypotheses/{id}:
 *   delete:
 *     summary: Delete hypothesis
 *     tags: [Hypotheses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Hypothesis deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hipótesis eliminada correctamente"
 *       404:
 *         description: Hypothesis not found
 */

/**
 * @swagger
 * /hypotheses/generate-from-problem:
 *   post:
 *     summary: Generate hypothesis options from problem using AI
 *     tags: [Hypotheses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - problem
 *             properties:
 *               problem:
 *                 type: string
 *                 minLength: 20
 *                 description: Problem description
 *                 example: "Los restaurantes pierden 30% de ingresos por no gestionar reservas eficientemente"
 *     responses:
 *       200:
 *         description: AI generated 3 hypothesis options
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 problem:
 *                   type: string
 *                 options:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       solution:
 *                         type: string
 *                       customerSegment:
 *                         type: string
 *                       valueProposition:
 *                         type: string
 *       400:
 *         description: Problem too short
 *       500:
 *         description: AI service unavailable
 */