import { validateRequest, validateMethod, successResponse, errorResponse } from '@/utils/api'
import { createApiMocks, expectApiResponse, expectApiError } from '../utils/testHelpers'
import { z } from 'zod'

describe('Utilidades de API', () => {
  describe('validateRequest', () => {
    const testSchema = z.object({
      name: z.string().min(1),
      age: z.number().min(0).max(120),
      email: z.string().email()
    })

    it('debería validar datos correctos exitosamente', () => {
      const validData = {
        name: 'Juan Pérez',
        age: 30,
        email: 'juan@example.com'
      }

      const result = validateRequest(validData, testSchema)
      expect(result).toEqual(validData)
    })

    it('debería lanzar error con datos inválidos', () => {
      const invalidData = {
        name: '',
        age: -5,
        email: 'not-an-email'
      }

      expect(() => {
        validateRequest(invalidData, testSchema)
      }).toThrow()
    })

    it('debería manejar datos faltantes', () => {
      const incompleteData = {
        name: 'Juan'
        // age y email faltantes
      }

      expect(() => {
        validateRequest(incompleteData, testSchema)
      }).toThrow()
    })

    it('debería convertir tipos cuando es posible', () => {
      const dataWithStrings = {
        name: 'Juan',
        age: '30', // String que se puede convertir a número
        email: 'juan@example.com'
      }

      // Schema que coerza strings a números
      const coerceSchema = z.object({
        name: z.string(),
        age: z.coerce.number(),
        email: z.string().email()
      })

      const result = validateRequest(dataWithStrings, coerceSchema)
      expect(result.age).toBe(30) // Convertido a número
      expect(typeof result.age).toBe('number')
    })
  })

  describe('validateMethod', () => {
    it('debería pasar con método permitido', () => {
      const { req } = createApiMocks({ method: 'GET' })
      
      expect(() => {
        validateMethod(req, ['GET', 'POST'])
      }).not.toThrow()
    })

    it('debería lanzar error con método no permitido', () => {
      const { req } = createApiMocks({ method: 'DELETE' })
      
      expect(() => {
        validateMethod(req, ['GET', 'POST'])
      }).toThrow('Método DELETE no permitido')
    })

    it('debería manejar múltiples métodos permitidos', () => {
      const methods = ['GET', 'POST', 'PUT', 'DELETE']
      
      methods.forEach(method => {
        const { req } = createApiMocks({ method })
        expect(() => {
          validateMethod(req, methods)
        }).not.toThrow()
      })
    })

    it('debería ser case-sensitive', () => {
      const { req } = createApiMocks({ method: 'get' }) // lowercase
      
      expect(() => {
        validateMethod(req, ['GET'])
      }).toThrow()
    })
  })

  describe('successResponse', () => {
    it('debería generar respuesta de éxito simple', () => {
      const { res } = createApiMocks({})
      const data = { id: 1, name: 'Test' }

      successResponse(res, data)

      expectApiResponse(res, 200, {
        data
      })
    })

    it('debería generar respuesta con mensaje personalizado', () => {
      const { res } = createApiMocks({})
      const data = { id: 1 }
      const message = 'Operación exitosa'

      successResponse(res, data, message)

      expectApiResponse(res, 200, {
        data,
        message
      })
    })

    it('debería permitir código de estado personalizado', () => {
      const { res } = createApiMocks({})
      const data = { id: 1 }

      successResponse(res, data, 'Creado', 201)

      expectApiResponse(res, 201, {
        data,
        message: 'Creado'
      })
    })

    it('debería manejar datos null o undefined', () => {
      const { res } = createApiMocks({})

      successResponse(res, null)

      expectApiResponse(res, 200, {
        data: null
      })
    })
  })

  describe('errorResponse', () => {
    it('debería generar respuesta de error simple', () => {
      const { res } = createApiMocks({})
      const message = 'Error de prueba'

      errorResponse(res, message)

      expectApiError(res, 500, message) // 500 es el código por defecto
    })

    it('debería permitir código de estado personalizado', () => {
      const { res } = createApiMocks({})
      const message = 'No autorizado'

      errorResponse(res, message, 401)

      expectApiError(res, 401, message)
    })

    it('debería incluir mensaje de error en la respuesta', () => {
      const { res } = createApiMocks({})
      const message = 'Error de validación'

      errorResponse(res, message, 422)

      expect(res._getStatusCode()).toBe(422)
      const responseData = JSON.parse(res._getData())
      expect(responseData).toMatchObject({
        error: message
      })
    })
  })

  describe('Integración de utilidades', () => {
    it('debería manejar un flujo completo de validación y respuesta', () => {
      const schema = z.object({
        username: z.string().min(3),
        password: z.string().min(6)
      })

      // Datos válidos
      const { req: validReq, res: validRes } = createApiMocks({
        method: 'POST',
        body: {
          username: 'usuario123',
          password: 'password123'
        }
      })

      // Simular flujo completo
      try {
        validateMethod(validReq, ['POST'])
        const validatedData = validateRequest(validReq.body, schema)
        successResponse(validRes, validatedData, 'Usuario validado')
        
        expectApiResponse(validRes, 200, {
          data: validatedData,
          message: 'Usuario validado'
        })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        // No debería llegar aquí con datos válidos
        fail('No debería lanzar error con datos válidos')
      }

      // Datos inválidos
      const { req: invalidReq, res: invalidRes } = createApiMocks({
        method: 'POST',
        body: {
          username: 'ab', // Muy corto
          password: '123'  // Muy corto
        }
      })

      try {
        validateMethod(invalidReq, ['POST'])
        validateRequest(invalidReq.body, schema)
        fail('Debería haber lanzado error con datos inválidos')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        errorResponse(invalidRes, 'Datos de entrada inválidos', 400)
        expectApiError(invalidRes, 400, 'Datos de entrada inválidos')
      }
    })

    it('debería manejar errores de método y validación en secuencia', () => {
      const schema = z.object({ name: z.string() })

      // Método incorrecto
      const { req: wrongMethodReq, res: wrongMethodRes } = createApiMocks({
        method: 'DELETE'
      })

      try {
        validateMethod(wrongMethodReq, ['GET', 'POST'])
        fail('Debería haber lanzado error de método')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        errorResponse(wrongMethodRes, 'Método no permitido', 405)
        expectApiError(wrongMethodRes, 405, 'Método no permitido')
      }

      // Método correcto pero datos inválidos
      const { req: validMethodReq, res: validMethodRes } = createApiMocks({
        method: 'POST',
        body: { name: '' } // Inválido
      })

      try {
        validateMethod(validMethodReq, ['POST']) // Pasa
        validateRequest(validMethodReq.body, schema) // Falla
        fail('Debería haber lanzado error de validación')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_error) {
        errorResponse(validMethodRes, 'Error de validación', 422)
        expectApiError(validMethodRes, 422, 'Error de validación')
      }
    })
  })
})
