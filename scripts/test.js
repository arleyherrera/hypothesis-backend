#!/usr/bin/env node

/**
 * Script para ejecutar tests con configuración específica
 */

const { execSync } = require('child_process');
const path = require('path');

// Configurar variables de entorno para testing
process.env.NODE_ENV = 'test';

const commands = {
  // Ejecutar todos los tests
  all: 'npx jest',
  
  // Ejecutar tests con watch mode
  watch: 'npx jest --watch',
  
  // Ejecutar tests con coverage
  coverage: 'npx jest --coverage',
  
  // Ejecutar solo tests unitarios
  unit: 'npx jest tests/controllers tests/middleware tests/helpers',
  
  // Ejecutar solo tests de integración
  integration: 'npx jest tests/integration',
  
  // Ejecutar tests específicos
  specific: (pattern) => `npx jest ${pattern}`,
  
  // Limpiar cache de Jest
  clear: 'npx jest --clearCache'
};

// Obtener el comando de los argumentos
const command = process.argv[2] || 'all';
const pattern = process.argv[3];

try {
  let cmd;
  
  switch (command) {
    case 'unit':
      cmd = commands.unit;
      break;
    case 'integration':
      cmd = commands.integration;
      break;
    case 'watch':
      cmd = commands.watch;
      break;
    case 'coverage':
      cmd = commands.coverage;
      break;
    case 'clear':
      cmd = commands.clear;
      break;
    case 'specific':
      if (!pattern) {
        console.error('Debe especificar un patrón para tests específicos');
        process.exit(1);
      }
      cmd = commands.specific(pattern);
      break;
    default:
      cmd = commands.all;
  }
  
  console.log(`Ejecutando: ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
  
} catch (error) {
  console.error('Error al ejecutar tests:', error.message);
  process.exit(1);
}