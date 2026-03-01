/**
 * Types pour le module activités
 */

export interface Activite {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  image_alt: string | null;
  date: Date;
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateActiviteDTO {
  title: string;
  description?: string;
  image_url?: string;
  image_alt?: string;
  date: string; // Format ISO date
  published?: boolean;
}

export interface UpdateActiviteDTO {
  title?: string;
  description?: string;
  image_url?: string;
  image_alt?: string;
  date?: string;
  published?: boolean;
}
