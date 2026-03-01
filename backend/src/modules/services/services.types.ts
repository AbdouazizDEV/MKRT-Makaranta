/**
 * Types pour le module services
 */

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  order_index: number;
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateServiceDTO {
  title: string;
  description: string;
  icon?: string;
  order_index?: number;
  published?: boolean;
}

export interface UpdateServiceDTO {
  title?: string;
  description?: string;
  icon?: string;
  order_index?: number;
  published?: boolean;
}
