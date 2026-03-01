/**
 * Classe d'erreur personnalisée pour l'API
 * Permet de standardiser les erreurs HTTP
 */

export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string): ApiError {
    return new ApiError(400, message);
  }

  static unauthorized(message = 'Non autorisé'): ApiError {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Accès interdit'): ApiError {
    return new ApiError(403, message);
  }

  static notFound(message = 'Ressource non trouvée'): ApiError {
    return new ApiError(404, message);
  }

  static conflict(message: string): ApiError {
    return new ApiError(409, message);
  }

  static internal(message = 'Erreur interne du serveur'): ApiError {
    return new ApiError(500, message, false);
  }
}
