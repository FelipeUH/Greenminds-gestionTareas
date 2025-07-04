const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Proporciona la ruta a tu aplicación Next.js para cargar next.config.js y archivos .env en tu entorno de pruebas
  dir: './',
})

// Configuración personalizada de Jest
const customJestConfig = {
  // Configurar archivos de configuración antes de ejecutar tests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Patrones para encontrar archivos de test
  testMatch: [
    '<rootDir>/tests/**/*.test.{js,ts}',
    '<rootDir>/**/__tests__/**/*.{js,ts}'
  ],
  
  // Entorno de testing
  testEnvironment: 'node',
  
  // Mapeo de módulos para paths absolutos
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // Archivos a ignorar
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/tests/fixtures/'
  ],
  
  // Configuración de cobertura
  collectCoverageFrom: [
    'pages/api/**/*.{js,ts}',
    'services/**/*.{js,ts}',
    'utils/**/*.{js,ts}',
    'validators/**/*.{js,ts}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**'
  ],
  
  // Umbrales de cobertura
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Reportes de cobertura
  coverageReporters: [
    'text',
    'lcov',
    'html'
  ],
  
  // Variables de entorno para tests
  setupFiles: ['<rootDir>/tests/setup/env.setup.js'],
  
  // Tiempo máximo por test (30 segundos)
  testTimeout: 30000,
  
  // Ejecutar tests en serie para evitar conflictos de base de datos
  maxWorkers: 1,
  
  // Verbose output
  verbose: true
}

// Crear la configuración Jest que puede manejar archivos Next.js
module.exports = createJestConfig(customJestConfig)
