'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('🔄 Iniciando migración para agregar CASCADE DELETE...');
    
    try {
      // 1. Eliminar la restricción existente de Artifacts
      console.log('Eliminando restricción existente de Artifacts...');
      await queryInterface.removeConstraint('Artifacts', 'Artifacts_hypothesisId_fkey');
      console.log('✅ Restricción de Artifacts eliminada');
      
      // 2. Agregar la nueva restricción con CASCADE para Artifacts
      console.log('Agregando nueva restricción con CASCADE para Artifacts...');
      await queryInterface.addConstraint('Artifacts', {
        fields: ['hypothesisId'],
        type: 'foreign key',
        name: 'Artifacts_hypothesisId_fkey',
        references: {
          table: 'Hypotheses',
          field: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
      console.log('✅ Nueva restricción de Artifacts agregada con CASCADE');

      // 3. Intentar hacer lo mismo con ArtifactContexts si existe
      try {
        console.log('Verificando si existe la tabla ArtifactContexts...');
        const tables = await queryInterface.showAllTables();
        
        if (tables.includes('ArtifactContexts')) {
          console.log('Tabla ArtifactContexts encontrada, actualizando restricciones...');
          
          // Eliminar restricción de hypothesisId
          try {
            await queryInterface.removeConstraint('ArtifactContexts', 'ArtifactContexts_hypothesisId_fkey');
            console.log('✅ Restricción de hypothesisId eliminada de ArtifactContexts');
          } catch (e) {
            console.log('⚠️  No se pudo eliminar restricción de hypothesisId (puede que no exista)');
          }
          
          // Agregar nueva restricción con CASCADE
          await queryInterface.addConstraint('ArtifactContexts', {
            fields: ['hypothesisId'],
            type: 'foreign key',
            name: 'ArtifactContexts_hypothesisId_fkey',
            references: {
              table: 'Hypotheses',
              field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          });
          console.log('✅ Nueva restricción de hypothesisId agregada con CASCADE en ArtifactContexts');
          
          // También actualizar la restricción de artifactId si existe
          try {
            await queryInterface.removeConstraint('ArtifactContexts', 'ArtifactContexts_artifactId_fkey');
            await queryInterface.addConstraint('ArtifactContexts', {
              fields: ['artifactId'],
              type: 'foreign key',
              name: 'ArtifactContexts_artifactId_fkey',
              references: {
                table: 'Artifacts',
                field: 'id'
              },
              onDelete: 'CASCADE',
              onUpdate: 'CASCADE'
            });
            console.log('✅ Restricción de artifactId también actualizada con CASCADE');
          } catch (e) {
            console.log('⚠️  No se pudo actualizar restricción de artifactId');
          }
        } else {
          console.log('ℹ️  Tabla ArtifactContexts no encontrada, omitiendo...');
        }
      } catch (error) {
        console.log('⚠️  Error al procesar ArtifactContexts:', error.message);
      }

      console.log('✅ Migración completada exitosamente!');
    } catch (error) {
      console.error('❌ Error durante la migración:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log('🔄 Revirtiendo migración...');
    
    try {
      // Revertir Artifacts a restricción sin CASCADE
      await queryInterface.removeConstraint('Artifacts', 'Artifacts_hypothesisId_fkey');
      await queryInterface.addConstraint('Artifacts', {
        fields: ['hypothesisId'],
        type: 'foreign key',
        name: 'Artifacts_hypothesisId_fkey',
        references: {
          table: 'Hypotheses',
          field: 'id'
        }
        // Sin onDelete: 'CASCADE'
      });
      
      // Revertir ArtifactContexts si existe
      const tables = await queryInterface.showAllTables();
      if (tables.includes('ArtifactContexts')) {
        try {
          await queryInterface.removeConstraint('ArtifactContexts', 'ArtifactContexts_hypothesisId_fkey');
          await queryInterface.addConstraint('ArtifactContexts', {
            fields: ['hypothesisId'],
            type: 'foreign key',
            name: 'ArtifactContexts_hypothesisId_fkey',
            references: {
              table: 'Hypotheses',
              field: 'id'
            }
          });
        } catch (e) {
          console.log('Error revirtiendo ArtifactContexts:', e.message);
        }
      }
      
      console.log('✅ Migración revertida');
    } catch (error) {
      console.error('❌ Error al revertir:', error);
      throw error;
    }
  }
};