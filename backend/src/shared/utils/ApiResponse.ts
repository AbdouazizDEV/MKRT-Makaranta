/**
 * Format de réponse standardisé pour l'API
 * Toutes les réponses suivent ce format
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class ApiResponseBuilder {
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      data,
      ...(message && { message }),
    };
  }

  static error(message: string, error?: string): ApiResponse<never> {
    return {
      success: false,
      message,
      ...(error && { error }),
    };
  }
}
