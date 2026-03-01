/**
 * Types pour les messages
 */

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  read: boolean;
  created_at: string;
}

export interface CreateMessageDTO {
  name: string;
  email: string;
  subject?: string;
  body: string;
}
