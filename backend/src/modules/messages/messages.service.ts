/**
 * Service pour les messages
 */

import { IMessageRepository } from './messages.repository';
import { CreateMessageDTO, Message } from './messages.types';
import { ApiError } from '../../shared/utils/ApiError';

export class MessageService {
  constructor(private repository: IMessageRepository) {}

  async getAll(): Promise<Message[]> {
    return this.repository.findAll();
  }

  async getUnread(): Promise<Message[]> {
    return this.repository.findUnread();
  }

  async getById(id: string): Promise<Message> {
    const message = await this.repository.findById(id);
    if (!message) {
      throw ApiError.notFound('Message non trouvé');
    }
    return message;
  }

  async create(data: CreateMessageDTO): Promise<Message> {
    return this.repository.create(data);
  }

  async markAsRead(id: string): Promise<Message> {
    await this.getById(id); // Vérifier l'existence
    return this.repository.markAsRead(id);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id); // Vérifier l'existence
    return this.repository.delete(id);
  }
}
