/**
 * Utilitaire pour l'upload d'images vers Cloudinary
 */

import { v2 as cloudinary } from 'cloudinary';
import env from '../../config/env';
import { Readable } from 'stream';

// Configuration Cloudinary
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
  url: string;
  public_id: string;
}

/**
 * Upload un fichier vers Cloudinary
 * @param file Buffer du fichier
 * @param folder Dossier de destination dans Cloudinary
 * @returns URL et public_id de l'image uploadée
 */
export async function uploadToCloudinary(
  file: Buffer,
  folder = 'lumina-activites'
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        } else {
          reject(new Error('Erreur lors de l\'upload'));
        }
      }
    );

    // Convertir le buffer en stream
    const bufferStream = new Readable();
    bufferStream.push(file);
    bufferStream.push(null);
    bufferStream.pipe(uploadStream);
  });
}

/**
 * Supprime une image de Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
