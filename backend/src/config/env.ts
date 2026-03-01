/**
 * Configuration et validation des variables d'environnement
 * Utilise Zod pour valider toutes les variables au démarrage
 */

import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().transform(Number).pipe(z.number().int().positive()),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET doit contenir au moins 32 caractères'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
});

type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Erreur de validation des variables d\'environnement:');
    error.errors.forEach((err) => {
      console.error(`   - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

export default env;
