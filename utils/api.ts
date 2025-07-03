import { NextApiRequest, NextApiResponse } from 'next';
import { ZodSchema } from 'zod';
import { ApiResponse } from '@/types/database';

// Error classes
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Acceso prohibido') {
    super(message, 403, 'FORBIDDEN');
  }
}

// Response helpers
export function successResponse<T>(
  res: NextApiResponse,
  data: T,
  message?: string,
  statusCode: number = 200
): void {
  const response: ApiResponse<T> = {
    data,
    message,
  };
  res.status(statusCode).json(response);
}

export function errorResponse(
  res: NextApiResponse,
  error: string | Error,
  statusCode: number = 500
): void {
  const response: ApiResponse = {
    error: error instanceof Error ? error.message : error,
  };
  res.status(statusCode).json(response);
}

// Validation helper
export function validateRequest<T>(
  data: unknown,
  schema: ZodSchema<T>
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new ValidationError(
      result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
    );
  }
  return result.data;
}

// HTTP method validation
export function validateMethod(
  req: NextApiRequest,
  allowedMethods: string[]
): void {
  if (!req.method || !allowedMethods.includes(req.method)) {
    throw new AppError(
      `Método ${req.method} no permitido. Métodos permitidos: ${allowedMethods.join(', ')}`,
      405
    );
  }
}

// Error handler wrapper
export function withErrorHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      
      if (error instanceof AppError) {
        return errorResponse(res, error.message, error.statusCode);
      }
      
      // Handle Supabase errors
      if (error && typeof error === 'object' && 'message' in error) {
        return errorResponse(res, (error as Error).message, 400);
      }
      
      return errorResponse(res, 'Error interno del servidor', 500);
    }
  };
}

// Pagination helpers
export function getPaginationParams(
  page: number = 1,
  limit: number = 20
): { from: number; to: number } {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { from, to };
}

export function createPaginationResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Date helpers
export function formatDate(date: Date | string): string {
  return new Date(date).toISOString();
}

export function isValidDate(date: string): boolean {
  return !isNaN(Date.parse(date));
}

// File helpers
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function isValidFileType(filename: string, allowedTypes: string[]): boolean {
  const extension = getFileExtension(filename);
  return allowedTypes.includes(extension);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// String helpers
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function generateRandomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
