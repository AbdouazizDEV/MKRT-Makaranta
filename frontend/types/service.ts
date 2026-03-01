/**
 * Types pour les services
 */

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string | null;
  order_index: number;
  published: boolean;
  created_at: string;
  updated_at: string;
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
