// Configuración del entorno para tests
require('dotenv').config({ path: '.env.test' })

// Variables de entorno específicas para testing
process.env.NODE_ENV = 'test'
process.env.NEXTAUTH_URL = 'http://localhost:3000'

// Mock de Supabase para tests
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'

// Configuración de base de datos de pruebas
process.env.DATABASE_URL = 'postgresql://postgres:password@localhost:54322/postgres'
