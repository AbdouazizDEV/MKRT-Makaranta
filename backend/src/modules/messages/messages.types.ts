/**
 * Types pour le module messages
 */

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  read: boolean;
  created_at: Date;
}

export interface CreateMessageDTO {
  name: string;
  email: string;
  subject?: string;
  body: string;
}
