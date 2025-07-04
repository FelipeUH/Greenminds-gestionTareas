// Configuración global para todos los tests

// Configuración de timeouts para tests asincrónicos
jest.setTimeout(30000)

// Limpieza después de cada test
afterEach(() => {
  jest.clearAllMocks()
})
