# Testing Guide

Este proyecto utiliza **Jest** como framework de testing principal junto con **Supertest** para tests de integración.

## Estructura de Tests

```
tests/
├── setup.js                 # Configuración global de tests
├── helpers.js               # Utilidades para testing
├── controllers/             # Tests unitarios de controladores
├── middleware/              # Tests unitarios de middleware
├── helpers/                 # Tests unitarios de helpers
└── integration/            # Tests de integración
```

## Comandos Disponibles

### Comandos básicos
```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage
```

### Comandos avanzados usando el script personalizado
```bash
# Tests unitarios solamente
node scripts/test.js unit

# Tests de integración solamente
node scripts/test.js integration

# Tests específicos (por patrón)
node scripts/test.js specific "hypothesis"

# Limpiar cache de Jest
node scripts/test.js clear
```

## Configuración de Base de Datos para Tests

### Requisitos
1. PostgreSQL instalado y corriendo
2. Base de datos de test creada (`hypothesis_test`)
3. Usuario de test con permisos

### Configurar base de datos de test
```sql
-- Crear base de datos de test
CREATE DATABASE hypothesis_test;

-- Crear usuario de test (opcional)
CREATE USER test_user WITH PASSWORD 'test_password';
GRANT ALL PRIVILEGES ON DATABASE hypothesis_test TO test_user;
```

### Variables de entorno
Copia `.env.test.example` a `.env.test` y configura:
```env
DB_NAME=hypothesis_test
DB_USER=tu_usuario_test
DB_PASSWORD=tu_password_test
DB_HOST=localhost
DB_PORT=5432
```

## Tipos de Tests

### 1. Tests Unitarios
- **Controladores**: Prueban la lógica de negocio aislada
- **Middleware**: Prueban autenticación, validación, etc.
- **Helpers**: Prueban funciones utilitarias

### 2. Tests de Integración
- Prueban endpoints completos
- Incluyen base de datos real
- Verifican flujos completos

## Patrones de Testing

### Estructura básica de un test
```javascript
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup antes de cada test
  });

  afterEach(() => {
    // Cleanup después de cada test
  });

  it('debería hacer algo específico', () => {
    // Arrange - preparar datos
    // Act - ejecutar acción
    // Assert - verificar resultado
  });
});
```

### Mocking
```javascript
// Mock de modelos de Sequelize
jest.mock('../../models', () => ({
  User: {
    findByPk: jest.fn(),
    create: jest.fn()
  }
}));
```

### Tests de endpoints
```javascript
const response = await request(app)
  .post('/api/endpoint')
  .set('Authorization', `Bearer ${token}`)
  .send(data);

expect(response.status).toBe(201);
expect(response.body).toHaveProperty('id');
```

## Coverage Reports

El coverage se genera en `coverage/` e incluye:
- `coverage/lcov-report/index.html` - Reporte HTML
- `coverage/coverage-summary.json` - Resumen JSON

### Umbrales de Coverage
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

## Mejores Prácticas

### 1. Nomenclatura
- Usar `describe()` para agrupar tests relacionados
- Usar `it()` con descripciones claras en español
- Incluir casos positivos y negativos

### 2. Isolation
- Cada test debe ser independiente
- Usar `beforeEach` y `afterEach` para setup/cleanup
- No depender del orden de ejecución

### 3. Datos de Test
- Usar factories/helpers para crear datos
- Usar datos realistas pero simples
- Limpiar datos entre tests

### 4. Assertions
- Ser específico en las assertions
- Verificar tanto el happy path como edge cases
- Usar matchers apropiados de Jest

## Debugging Tests

### Ejecutar un test específico
```bash
npm test -- --testNamePattern="debería crear usuario"
```

### Debug con logs
```bash
npm test -- --verbose
```

### Ejecutar en modo debug
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## CI/CD Integration

Los tests se ejecutan automáticamente en CI/CD. Para configurar:

1. Asegurar que las variables de entorno estén configuradas
2. Configurar base de datos de test en el pipeline
3. Ejecutar `npm test` en el proceso de build

## Troubleshooting

### Problemas comunes

1. **Tests fallan por timeout**
   - Aumentar `testTimeout` en jest.config.js
   - Verificar conexiones de base de datos

2. **Mocks no funcionan**
   - Verificar que el mock esté antes del import
   - Usar `jest.clearAllMocks()` en beforeEach

3. **Tests de integración fallan**
   - Verificar configuración de base de datos
   - Asegurar que las migraciones se ejecuten

4. **Coverage incompleto**
   - Revisar archivos excluidos en jest.config.js
   - Agregar tests para funciones no cubiertas
