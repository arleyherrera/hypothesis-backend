# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Lean Startup hypothesis management backend built with Node.js, Express.js, PostgreSQL, and Sequelize ORM. The system allows users to create, manage, and test business hypotheses using AI-assisted artifact generation.

## Development Commands

### Core Operations
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run all tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

### Database Operations
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration  
- `npm run migrate:undo:all` - Undo all migrations
- `npm run seed` - Run database seeders
- `npm run seed:undo` - Undo all seeders
- `sequelize-cli db:migrate` - Alternative migration command
- `sequelize-cli db:seed:all` - Alternative seed command

### Advanced Testing
- `npm run test:detailed` - Run detailed controller tests with custom runner
- `npm run test:auth` - Run authentication-specific tests (tags-based)
- `npm run test:hypothesis` - Run hypothesis lifecycle scenario tests
- `npm run test:complete` - Run comprehensive test suite with custom runner
- `npm run test:scenario` - Run scenario-based tests with ScenarioRunner
- `npm run test:all` - Run comprehensive test execution via MainRunner
- `npm run test:artifacts` - Run artifact generation tests
- `npm run test:metrics` - Run metrics validation tests
- `npm run test:security` - Run security-focused tests
- `npm run test:performance` - Run performance tests
- `npm run validate:all` - Run all validation tests
- `npm run validate:coherence` - Validate AI coherence
- `npm run validate:generation` - Validate artifact generation

### Documentation
- `npm run docs:generate` - Generate API documentation using Swagger

## Architecture

### Core Models (Sequelize ORM)
- **User**: Authentication and user management
- **Hypothesis**: Business hypothesis with problem, solution, customer segment, and value proposition
- **Artifact**: Generated documents/artifacts linked to hypotheses (AI-generated content)
- **ArtifactContext**: Vector storage context for AI operations

### Controllers
- **authController**: JWT-based authentication, registration, login
- **hypothesisController**: CRUD operations for hypotheses with user association
- **artifactController**: AI-powered artifact generation and management
- **aiController**: OpenAI integration for hypothesis and artifact generation

### Key Services  
- **vectorContextService**: ChromaDB integration for AI context management
- **authService**: Centralized authentication logic and user management
- **hypothesisService**: Business logic for hypothesis operations
- **artifactService**: Artifact creation and management operations
- **validationService**: Input validation and data sanitization

### Routes Structure
- `/api/auth/*` - Authentication endpoints with rate limiting
- `/api/hypotheses/*` - Hypothesis management (protected routes)
- `/api/artifacts/*` - Artifact generation and management with AI rate limiting
- `/api-docs` - Swagger documentation
- `/health` - Basic health check
- `/api/health` - Comprehensive health check with DB status

## Environment Configuration

The project uses multiple environment files:
- `.env` - Main environment variables
- `.env.test` - Test environment configuration
- `.env.example` - Environment template

### Required Environment Variables
- `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_HOST` - PostgreSQL connection
- `JWT_SECRET`, `JWT_EXPIRES_IN` - Authentication configuration
- `OPENAI_API_KEY` - AI integration
- `FRONTEND_URL` - CORS configuration
- `NODE_ENV` - Environment mode

## Security Features

- **Helmet**: Security headers
- **Rate Limiting**: Global (100 req/15min), Auth (5 req/15min), AI (10 req/hour)
- **CORS**: Configured for frontend integration
- **JWT Authentication**: Token-based auth with 30-day expiration
- **Input Sanitization**: MongoDB injection prevention
- **Request Size Limits**: 10MB limit for JSON/URL-encoded data

## Testing Framework

### Test Structure
- `tests/controllers/` - Unit tests for controllers
- `tests/integration/` - Integration tests with real database
- `tests/execution/` - Custom test execution framework
- `tests/scenarios/` - End-to-end scenario tests
- `tests/validation/` - Validation and metrics tests

### Test Configuration
- **Framework**: Jest with Supertest
- **Environment**: Node.js with custom setup in `tests/setup.js`
- **Coverage Threshold**: 70% for branches, functions, lines, statements
- **Database**: Uses test database with isolated transactions

### Custom Test Runners
- `MainRunner.js` - Comprehensive test execution
- `ScenarioRunner.js` - Scenario-based testing
- `DetailedConsoleRunner.js` - Detailed console output
- `ArtifactTestRunner.js` - Artifact generation testing

## AI Integration

The system integrates with OpenAI's API for:
- **Hypothesis Generation**: AI-assisted hypothesis creation
- **Artifact Generation**: Automatic generation of lean startup artifacts
- **Content Improvement**: AI-powered content enhancement

Rate limiting is specifically applied to AI endpoints to manage API costs and usage.

## Database Schema

### Key Relationships
- Users have many Hypotheses (1:N)
- Hypotheses have many Artifacts (1:N)
- Artifacts have ArtifactContext for vector operations

### Migration Management
- Migrations are stored in `migrations/` directory
- Sequelize CLI is configured via `.sequelizerc`
- Database configuration supports development, test, and production environments

## Development Notes

- **Server Entry Point**: `server.js` with comprehensive error handling and graceful shutdown
- **Model Loading**: Automatic model discovery and association setup in `models/index.js`
- **Middleware Chain**: Security → CORS → Parsing → Sanitization → Rate Limiting → Routes
- **Error Handling**: Centralized error handling with environment-specific responses
- **Health Checks**: Multiple health check endpoints for monitoring
- **Constants Management**: Centralized configuration in `config/constants.js` including validation rules, rate limits, and error messages
- **AI Phase System**: Structured phases for lean startup methodology: construir, medir, aprender, pivotar, iterar