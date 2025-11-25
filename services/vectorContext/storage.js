// ===== vectorContext/storage.js - Almacenamiento (Chroma y DB) =====

const { ChromaClient } = require('chromadb');
const { ArtifactContext } = require('../../models');
const config = require('./config');

class StorageModule {
  constructor(contextGenerator, vectorOps) {
    // Configuración para ChromaDB remoto (Railway)
    const chromaUrl = config.CHROMADB_URL;

    // Parsear la URL para extraer host y puerto
    let chromaConfig;
    if (chromaUrl.startsWith('http://') || chromaUrl.startsWith('https://')) {
      // URL remota (Railway, producción)
      chromaConfig = { path: chromaUrl };
    } else {
      // Localhost o path local
      chromaConfig = { path: chromaUrl };
    }

    this.chromaClient = new ChromaClient(chromaConfig);
    this.contextGenerator = contextGenerator;
    this.vectorOps = vectorOps;

    console.log(`ChromaDB conectando a: ${chromaUrl}`);
  }

  // Módulo de almacenamiento
  async storeArtifactContext(artifact) {
    try {
      console.log(`[ChromaDB] Iniciando almacenamiento para artefacto ${artifact.id}...`);

      const collection = await this.getOrCreateCollection(artifact.hypothesisId);
      console.log(`[ChromaDB] Colección obtenida/creada para hipótesis ${artifact.hypothesisId}`);

      const contextData = this.contextGenerator.generateArtifactContext(artifact);
      const embedding = await this.vectorOps.generateEmbedding(contextData);
      console.log(`[ChromaDB] Embedding generado, tamaño: ${embedding.length}`);

      await this.storeInChroma(collection, artifact, contextData, embedding);
      console.log(`[ChromaDB] Guardado en ChromaDB exitoso`);

      await this.storeInDatabase(artifact, contextData, embedding);
      console.log(`[ChromaDB] Guardado en PostgreSQL exitoso`);

      console.log(`[ChromaDB] Contexto almacenado completamente para artefacto ${artifact.id}`);
      return true;
    } catch (error) {
      console.error(`[ChromaDB] ERROR al almacenar contexto del artefacto ${artifact.id}:`);
      console.error(`[ChromaDB] Mensaje: ${error.message}`);
      console.error(`[ChromaDB] Stack: ${error.stack}`);
      return false;
    }
  }

  async getOrCreateCollection(hypothesisId) {
    const collectionName = `hypothesis_${hypothesisId}`;

    try {
      // Primero intentar obtener la colección existente
      const collection = await this.chromaClient.getOrCreateCollection({
        name: collectionName,
        metadata: { description: `Contexto de artefactos para hipótesis ${hypothesisId}` }
      });
      console.log(`[ChromaDB] Colección '${collectionName}' lista`);
      return collection;
    } catch (error) {
      console.error(`[ChromaDB] Error al obtener/crear colección '${collectionName}':`, error.message);
      throw error;
    }
  }

  async storeInChroma(collection, artifact, contextData, embedding) {
    const documentId = `artifact_${artifact.id}`;
    const metadata = this.contextGenerator.createChromaMetadata(artifact);
    
    await collection.add({
      ids: [documentId],
      embeddings: [embedding],
      metadatas: [metadata],
      documents: [contextData]
    });
  }

  async storeInDatabase(artifact, contextData, embedding) {
    await ArtifactContext.create({
      hypothesisId: artifact.hypothesisId,
      artifactId: artifact.id,
      contextData: contextData,
      embedding: JSON.stringify(embedding),
      phase: artifact.phase,
      phaseIndex: config.PHASE_ORDER.indexOf(artifact.phase)
    });
  }

  // Módulo de actualización y eliminación
  async updateArtifactContext(artifact) {
    try {
      await this.deleteArtifactContext(artifact.id);
      await this.storeArtifactContext(artifact);
      return true;
    } catch (error) {
      console.error(`Error al actualizar contexto del artefacto ${artifact.id}:`, error);
      return false;
    }
  }

  async deleteArtifactContext(artifactId) {
    try {
      const artifactContext = await this.findArtifactContext(artifactId);
      if (!artifactContext) return true;
      
      await this.deleteFromChroma(artifactContext.hypothesisId, artifactId);
      await this.deleteFromDatabase(artifactId);
      
      console.log(`Contexto eliminado para artefacto ${artifactId}`);
      return true;
    } catch (error) {
      console.error(`Error al eliminar contexto del artefacto ${artifactId}:`, error);
      return false;
    }
  }

  async findArtifactContext(artifactId) {
    return await ArtifactContext.findOne({
      where: { artifactId }
    });
  }

  async deleteFromChroma(hypothesisId, artifactId) {
    const collectionName = `hypothesis_${hypothesisId}`;
    
    try {
      const collection = await this.chromaClient.getCollection({ name: collectionName });
      const documentId = `artifact_${artifactId}`;
      
      await collection.delete({
        ids: [documentId]
      });
    } catch (error) {
      console.log(`Error al eliminar de ChromaDB: ${error.message}`);
    }
  }

  async deleteFromDatabase(artifactId) {
    await ArtifactContext.destroy({
      where: { artifactId }
    });
  }

  // Acceso a colecciones
  async getCollectionIfExists(hypothesisId) {
    const collectionName = `hypothesis_${hypothesisId}`;
    
    try {
      return await this.chromaClient.getCollection({ name: collectionName });
    } catch (error) {
      console.log(`No hay contexto previo para hipótesis ${hypothesisId}`);
      return null;
    }
  }
}

module.exports = StorageModule;