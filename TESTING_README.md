# 🧪 Tests del Backend - GreenMinds

Esta documentación explica cómo ejecutar y mantener la suite de tests del backend de GreenMinds.

## 📋 Índice

- [Configuración](#configuración)
- [Estructura de Tests](#estructura-de-tests)
- [Tipos de Tests](#tipos-de-tests)
- [Comandos Disponibles](#comandos-disponibles)
- [Configuración del Entorno](#configuración-del-entorno)
- [Escribir Nuevos Tests](#escribir-nuevos-tests)
- [Mocks y Utilidades](#mocks-y-utilidades)
- [Coverage y Reportes](#coverage-y-reportes)

## ⚙️ Configuración

### Dependencias de Testing

El proyecto utiliza las siguientes herramientas para testing:

```json
{
  "@types/jest": "^29.5.14",
  "@types/supertest": "^6.0.2",
  "jest": "^29.7.0",
  "jest-environment-node": "^29.7.0",
  "jest-fetch-mock": "^3.0.3",
  "node-mocks-http": "^1.16.1",
  "supertest": "^7.0.0",
  "ts-jest": "^29.2.5"
}
```

### Instalación

```bash
npm install
```

## 📁 Estructura de Tests

```
tests/
├── setup/                 # Configuración del entorno de tests
│   └── env.setup.js       # Variables de entorno para testing
├── utils/                 # Utilidades y helpers para tests
│   └── testHelpers.ts     # Mocks, helpers y datos de prueba
├── api/                   # Tests de rutas API
│   ├── auth/              # Tests de autenticación
│   │   └── login.test.ts
│   ├── projects/          # Tests de proyectos
│   │   └── index.test.ts
│   └── tasks/             # Tests de tareas
├── services/              # Tests de servicios
│   ├── userService.test.ts
│   ├── projectService.test.ts
│   └── taskService.test.ts
├── utils/                 # Tests de utilidades
│   └── api.test.ts
├── validators/            # Tests de validadores
│   └── schemas.test.ts
└── integration/           # Tests de integración
    └── apiFlows.test.ts
```

## 🧪 Tipos de Tests

### 1. Tests Unitarios

- **Servicios**: Prueban la lógica de negocio aislada
- **Validadores**: Verifican esquemas Zod y validaciones
- **Utilidades**: Prueban funciones helper y middlewares

### 2. Tests de API

- **Rutas**: Prueban endpoints individuales
- **Autenticación**: Verifican flujos de login/registro
- **Autorización**: Comprueban permisos y accesos

### 3. Tests de Integración

- **Flujos completos**: Prueban interacciones entre múltiples componentes
- **Escenarios reales**: Simulan casos de uso del usuario final

## 🚀 Comandos Disponibles

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (desarrollo)
npm run test:watch

# Ejecutar tests con reporte de cobertura
npm run test:coverage

# Ejecutar tests para CI (sin watch)
npm run test:ci
```

### Comandos Específicos

```bash
# Ejecutar solo tests de servicios
npm test -- services

# Ejecutar solo tests de API
npm test -- api

# Ejecutar un archivo específico
npm test -- userService.test.ts

# Ejecutar con verbose output
npm test -- --verbose

# Ejecutar tests que matcheen un patrón
npm test -- --testNamePattern="login"
```

## 🌍 Configuración del Entorno

### Variables de Entorno para Tests

El archivo `.env.test` contiene la configuración para testing:

```env
NODE_ENV=test
NEXTAUTH_URL=http://localhost:3000

# Supabase configuración de pruebas (local)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=test-anon-key
SUPABASE_SERVICE_ROLE_KEY=test-service-role-key

# Base de datos de pruebas
DATABASE_URL=postgresql://postgres:postgres@localhost:54322/postgres
```

### Configuración de Supabase Local (Opcional)

Para tests más realistas, puedes usar Supabase local:

```bash
# Instalar Supabase CLI
npm install -g @supabase/cli

# Iniciar Supabase local
supabase start

# Los tests usarán la instancia local automáticamente
```

## ✍️ Escribir Nuevos Tests

### Test de Servicio

```typescript
import { UserService } from "@/services/userService";
import { mockUser, mockSupabaseClient } from "../utils/testHelpers";

jest.mock("@/lib/supabase", () => ({
  supabase: mockSupabaseClient,
}));

describe("UserService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("debería obtener usuario por ID", async () => {
    // Configurar mock
    mockSupabaseClient.from().select().eq().single.mockResolvedValue({
      data: mockUser,
      error: null,
    });

    // Ejecutar
    const result = await UserService.getUserById("test-id");

    // Verificar
    expect(result).toEqual(mockUser);
    expect(mockSupabaseClient.from).toHaveBeenCalledWith("profiles");
  });
});
```

### Test de API

```typescript
import handler from "@/pages/api/projects/index";
import {
  createApiMocks,
  expectApiResponse,
  mockUser,
} from "../utils/testHelpers";

describe("/api/projects", () => {
  it("debería crear proyecto exitosamente", async () => {
    const projectData = {
      name: "Nuevo Proyecto",
      description: "Descripción",
    };

    const { req, res } = createApiMocks({
      method: "POST",
      body: projectData,
      user: mockUser,
    });

    await handler(req, res);

    expectApiResponse(res, 201, {
      success: true,
      message: "Proyecto creado exitosamente",
    });
  });
});
```

### Test de Validador

```typescript
import { loginSchema } from "@/validators/schemas";

describe("loginSchema", () => {
  it("debería validar credenciales correctas", () => {
    const validData = {
      email: "test@example.com",
      password: "password123",
    };

    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});
```

## 🛠️ Mocks y Utilidades

### TestHelpers Disponibles

```typescript
// Datos mock
import {
  mockUser,
  mockProject,
  mockTask,
  testData,
} from "@/tests/utils/testHelpers";

// Crear mocks de API
const { req, res } = createApiMocks({
  method: "POST",
  body: { name: "test" },
  user: mockUser,
});

// Verificar respuestas
expectApiResponse(res, 200, expectedData);
expectApiError(res, 400, "Error message");

// Mock de Supabase
mockSupabaseClient.from().select().eq().mockResolvedValue({
  data: mockUser,
  error: null,
});
```

### Patrones Comunes

```typescript
// Setup y teardown
beforeEach(() => {
  jest.clearAllMocks();
});

// Mock de módulos
jest.mock("@/lib/supabase", () => ({
  supabase: mockSupabaseClient,
}));

// Test de errores
await expect(service.method()).rejects.toThrow("Error esperado");

// Test asíncrono
it("should handle async operation", async () => {
  const result = await asyncFunction();
  expect(result).toBeDefined();
});
```

## 📊 Coverage y Reportes

### Configuración de Coverage

```javascript
// jest.config.js
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70
  }
}
```

### Archivos Incluidos en Coverage

- `pages/api/**/*.{js,ts}` - Rutas API
- `services/**/*.{js,ts}` - Servicios de negocio
- `utils/**/*.{js,ts}` - Utilidades
- `validators/**/*.{js,ts}` - Validadores

### Reportes

```bash
# Generar reporte HTML
npm run test:coverage

# Ver reporte en navegador
open coverage/lcov-report/index.html
```

## 🚨 Solución de Problemas

### Error: Cannot find module

```bash
# Limpiar cache de Jest
npm test -- --clearCache

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Tests que fallan por timeout

```javascript
// Aumentar timeout en test específico
it("test con operación lenta", async () => {
  // test code
}, 30000); // 30 segundos

// O globalmente en jest.config.js
testTimeout: 30000;
```

### Problemas con mocks

```typescript
// Resetear todos los mocks
beforeEach(() => {
  jest.resetAllMocks();
});

// Mock específico por test
jest.mockImplementationOnce(() => Promise.resolve(mockData));
```

## 📝 Mejores Prácticas

### 1. Nomenclatura

- Usar `describe` para agrupar tests relacionados
- Usar `it` con descripciones claras en español
- Nombres descriptivos para archivos de test

### 2. Organización

- Un archivo de test por módulo/archivo fuente
- Agrupar tests por funcionalidad
- Setup y teardown apropiados

### 3. Assertions

- Una assertion principal por test
- Verificar tanto el resultado como los efectos secundarios
- Usar matchers específicos de Jest

### 4. Mocks

- Mockear dependencias externas
- Usar mocks mínimos necesarios
- Resetear mocks entre tests

### 5. Datos de Prueba

- Usar datos realistas pero simples
- Centralizar datos de prueba en testHelpers
- Evitar datos hardcodeados en tests

## 🔗 Referencias

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Next.js Testing](https://nextjs.org/docs/pages/building-your-application/optimizing/testing)
- [Supabase Testing](https://supabase.com/docs/guides/cli/local-development)

---

**Nota**: Mantén siempre los tests actualizados cuando modifiques el código. Los tests son documentación viva del comportamiento esperado del sistema.
