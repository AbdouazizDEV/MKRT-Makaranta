/**
 * Configuration Multer pour l'upload d'images
 * Les images sont uploadées vers Cloudinary, pas stockées localement
 * Ce middleware valide uniquement le type et la taille du fichier
 */

import multer from 'multer';
import { Request } from 'express';
import { ApiError } from '../utils/ApiError';

// Types MIME autorisés pour les images
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

// Taille maximale : 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Configuration du stockage en mémoire (les fichiers seront envoyés à Cloudinary)
const storage = multer.memoryStorage();

// Filtre pour valider les fichiers
const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
): void => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        `Type de fichier non autorisé. Types acceptés: ${ALLOWED_MIME_TYPES.join(', ')}`
      )
    );
  }
};

// Configuration Multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

// Middleware pour un seul fichier (nom du champ: 'image')
export const uploadSingle = upload.single('image');
