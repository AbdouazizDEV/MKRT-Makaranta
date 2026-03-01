/**
 * Types pour les activités
 */

export interface Activite {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  image_alt: string | null;
  date: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateActiviteDTO {
  title: string;
  description?: string;
  image_alt?: string;
  date: string;
  published?: boolean;
  image?: File;
}

export interface UpdateActiviteDTO {
  title?: string;
  description?: string;
  image_alt?: string;
  date?: string;
  published?: boolean;
  image?: File;
}
