const { Hypothesis, Artifact } = require('../models');
const { handleError, validateRequiredFields, logOperation } = require('../helpers/controllerUtils');

const findUserHypothesis = async (id, userId, includeArtifacts = false) => {
  const options = { where: { id, userId } };
  if (includeArtifacts) options.include = [{ model: Artifact, as: 'artifacts' }];
  return Hypothesis.findOne(options);
};

// CAMBIO: Problema primero en el orden de campos
const hypothesisFields = ['problem', 'name', 'solution', 'customerSegment', 'valueProposition'];

exports.getHypotheses = async (req, res) => {
  try {
    logOperation('Obteniendo hipótesis', { userId: req.user.id });
    
    const hypotheses = await Hypothesis.findAll({
      where: { userId: req.user.id },
      include: [{ model: Artifact, as: 'artifacts' }]
    });
    
    res.json(hypotheses || []);
  } catch (error) {
    handleError(res, error, 'Error al obtener hipótesis');
  }
};

exports.getHypothesisById = async (req, res) => {
  try {
    const { id } = req.params;
    logOperation('Obteniendo hipótesis', { id });
    
    const hypothesis = await findUserHypothesis(id, req.user.id, true);
    if (!hypothesis) return res.status(404).json({ message: 'Hipótesis no encontrada' });
    
    res.json(hypothesis);
  } catch (error) {
    handleError(res, error, 'Error al obtener hipótesis');
  }
};

exports.createHypothesis = async (req, res) => {
  try {
    // CAMBIO: Log enfocado en el problema
    logOperation('Creando hipótesis para problema', { 
      problem: req.body.problem ? req.body.problem.substring(0, 50) + '...' : 'No especificado',
      userId: req.user.id 
    });
    
    const validation = validateRequiredFields(req.body, hypothesisFields);
    if (!validation.isValid) {
      return res.status(400).json({ 
        message: 'Campos requeridos faltantes',
        missingFields: validation.missingFields 
      });
    }
    
    // CAMBIO: Validación adicional del problema
    if (req.body.problem && req.body.problem.length < 20) {
      return res.status(400).json({ 
        message: 'El problema debe tener al menos 20 caracteres para ser suficientemente específico' 
      });
    }
    
    const hypothesis = await Hypothesis.create({
      userId: req.user.id,
      ...req.body
    });
    
    res.status(201).json(hypothesis);
  } catch (error) {
    handleError(res, error, 'Error al crear hipótesis');
  }
};

exports.updateHypothesis = async (req, res) => {
  try {
    const { id } = req.params;
    logOperation('Actualizando hipótesis', { id });
    
    const hypothesis = await findUserHypothesis(id, req.user.id);
    if (!hypothesis) return res.status(404).json({ message: 'Hipótesis no encontrada' });
    
    // CAMBIO: Validar problema si se está actualizando
    if (req.body.problem && req.body.problem.length < 20) {
      return res.status(400).json({ 
        message: 'El problema debe tener al menos 20 caracteres' 
      });
    }
    
    await hypothesis.update(req.body);
    res.json(hypothesis);
  } catch (error) {
    handleError(res, error, 'Error al actualizar hipótesis');
  }
};

exports.deleteHypothesis = async (req, res) => {
  try {
    const { id } = req.params;
    logOperation('Eliminando hipótesis', { id });
    
    const hypothesis = await findUserHypothesis(id, req.user.id);
    if (!hypothesis) return res.status(404).json({ message: 'Hipótesis no encontrada' });
    
    // IMPORTANTE: Eliminar en el orden correcto para evitar violaciones de FK
    
    // 1. Primero obtener todos los artifactIds de esta hipótesis
    const artifacts = await Artifact.findAll({
      where: { hypothesisId: id },
      attributes: ['id']
    });
    
    const artifactIds = artifacts.map(a => a.id);
    logOperation('Artefactos a eliminar', { count: artifactIds.length, ids: artifactIds });
    
    // 2. Eliminar ArtifactContexts que referencian estos artifacts
    if (artifactIds.length > 0) {
      try {
        const { ArtifactContext } = require('../models');
        if (ArtifactContext) {
          const deletedContexts = await ArtifactContext.destroy({
            where: { 
              artifactId: artifactIds 
            }
          });
          logOperation('Contextos de artefactos eliminados', { count: deletedContexts });
        }
      } catch (e) {
        console.log('ArtifactContext no encontrado o error al eliminar:', e.message);
      }
    }
    
    // 3. Ahora sí eliminar los Artifacts
    const deletedArtifacts = await Artifact.destroy({
      where: { hypothesisId: id }
    });
    logOperation('Artefactos eliminados', { count: deletedArtifacts });
    
    // 4. Finalmente eliminar la hipótesis
    await hypothesis.destroy();
    
    res.json({ message: 'Hipótesis eliminada correctamente' });
  } catch (error) {
    handleError(res, error, 'Error al eliminar hipótesis');
  }
};