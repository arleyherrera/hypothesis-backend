// ===== vectorContextService.js - Versión mejorada con fallback automático =====

require('dotenv').config();

// Intentar importar la versión completa, si falla usar fallback
let VectorContextService;

async function initializeService() {
  const useChroma = process.env.CHROMADB_URL && process.env.CHROMADB_URL !== 'http://localhost:8000';
  
  if (useChroma) {
    try {
      // Verificar si ChromaDB está disponible
      const { ChromaClient } = require('chromadb');
      const client = new ChromaClient({
        path: process.env.CHROMADB_URL
      });
      
      // Test rápido de conexión con timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 3000)
      );
      
      await Promise.race([
        client.heartbeat(),
        timeoutPromise
      ]);
      
      console.log('✅ ChromaDB conectado:', process.env.CHROMADB_URL);
      VectorContextService = require('./vectorContext');
    } catch (error) {
      console.log('⚠️  ChromaDB no disponible, usando almacenamiento en base de datos');
      VectorContextService = require('./vectorContextFallback');
    }
  } else {
    console.log('ℹ️  ChromaDB no configurado, usando almacenamiento en base de datos');
    VectorContextService = require('./vectorContextFallback');
  }
}

// Clase proxy que delega al servicio apropiado
class VectorContextServiceProxy {
  constructor() {
    this.servicePromise = initializeService();
    this.service = null;
  }

  async ensureService() {
    if (!this.service) {
      await this.servicePromise;
      this.service = new VectorContextService();
    }
    return this.service;
  }

  // Proxy todos los métodos
  async storeArtifactContext(...args) {
    const service = await this.ensureService();
    return service.storeArtifactContext(...args);
  }

  async updateArtifactContext(...args) {
    const service = await this.ensureService();
    return service.updateArtifactContext(...args);
  }

  async deleteArtifactContext(...args) {
    const service = await this.ensureService();
    return service.deleteArtifactContext(...args);
  }

  async getRelevantContext(...args) {
    const service = await this.ensureService();
    return service.getRelevantContext(...args);
  }

  async getContextStats(...args) {
    const service = await this.ensureService();
    return service.getContextStats(...args);
  }

  async generateEmbedding(...args) {
    const service = await this.ensureService();
    return service.generateEmbedding(...args);
  }

  preprocessText(...args) {
    // Método síncrono, podemos implementarlo directamente
    if (this.service) {
      return this.service.preprocessText(...args);
    }
    // Implementación básica mientras se carga
    return args[0].toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
  }

  extractKeywords(...args) {
    if (this.service) {
      return this.service.extractKeywords(...args);
    }
    // Implementación básica
    const words = this.preprocessText(args[0]);
    return words.slice(0, 10).join(', ');
  }
}

// Exportar instancia única
module.exports = new VectorContextServiceProxy();