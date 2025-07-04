#!/bin/bash

# Script para configurar el entorno de testing del backend GreenMinds
# Este script instala dependencias y configura el entorno para ejecutar tests

echo "🧪 Configurando entorno de testing para GreenMinds Backend..."

# Verificar que Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado. Por favor instala Node.js v18 o superior."
    exit 1
fi

# Verificar versión de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Error: Se requiere Node.js v18 o superior. Versión actual: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detectado"

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error instalando dependencias"
        exit 1
    fi
    echo "✅ Dependencias instaladas"
else
    echo "✅ Dependencias ya instaladas"
fi

# Verificar que Jest está instalado
if ! npx jest --version &> /dev/null; then
    echo "❌ Error: Jest no está instalado correctamente"
    exit 1
fi

echo "✅ Jest $(npx jest --version) configurado"

# Crear archivo .env.test si no existe
if [ ! -f ".env.test" ]; then
    echo "📝 Creando archivo .env.test..."
    cat > .env.test << EOF
# Variables de entorno para testing
NODE_ENV=test
NEXTAUTH_URL=http://localhost:3000

# Supabase configuración de pruebas
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# Base de datos de pruebas (Supabase local)
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
EOF
    echo "✅ Archivo .env.test creado"
else
    echo "✅ Archivo .env.test ya existe"
fi

# Verificar estructura de directorios de tests
echo "📁 Verificando estructura de tests..."

REQUIRED_DIRS=(
    "tests"
    "tests/setup"
    "tests/utils"
    "tests/api"
    "tests/services"
    "tests/validators"
    "tests/integration"
)

for dir in "${REQUIRED_DIRS[@]}"; do
    if [ ! -d "$dir" ]; then
        mkdir -p "$dir"
        echo "  ✅ Creado directorio: $dir"
    fi
done

# Ejecutar test de verificación
echo "🔍 Ejecutando test de verificación..."
npm test -- --testPathPattern="testHelpers" --passWithNoTests

if [ $? -eq 0 ]; then
    echo "✅ Configuración de testing completada exitosamente"
    echo ""
    echo "📋 Comandos disponibles:"
    echo "  npm test              - Ejecutar todos los tests"
    echo "  npm run test:watch    - Ejecutar tests en modo watch"
    echo "  npm run test:coverage - Ejecutar tests con cobertura"
    echo "  npm run test:ci       - Ejecutar tests para CI"
    echo ""
    echo "📚 Para más información, consulta TESTING_README.md"
else
    echo "❌ Error en la configuración de testing"
    exit 1
fi
