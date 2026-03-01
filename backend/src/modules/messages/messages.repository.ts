/**
 * Repository pour les messages
 */

import { Pool } from 'pg';
import { Message, CreateMessageDTO } from './messages.types';

export interface IMessageRepository {
  findAll(): Promise<Message[]>;
  findById(id: string): Promise<Message | null>;
  findUnread(): Promise<Message[]>;
  create(data: CreateMessageDTO): Promise<Message>;
  markAsRead(id: string): Promise<Message>;
  delete(id: string): Promise<void>;
}

export class MessageRepository implements IMessageRepository {
  constructor(private db: Pool) {}

  async findAll(): Promise<Message[]> {
    const result = await this.db.query<Message>(
      'SELECT * FROM messages ORDER BY created_at DESC'
    );
    return result.rows;
  }

  async findById(id: string): Promise<Message | null> {
    const result = await this.db.query<Message>(
      'SELECT * FROM messages WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findUnread(): Promise<Message[]> {
    const result = await this.db.query<Message>(
      'SELECT * FROM messages WHERE read = false ORDER BY created_at DESC'
    );
    return result.rows;
  }

  async create(data: CreateMessageDTO): Promise<Message> {
    const { name, email, subject, body } = data;
    
    const result = await this.db.query<Message>(
      `INSERT INTO messages (name, email, subject, body)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, subject || null, body]
    );
    
    return result.rows[0];
  }

  async markAsRead(id: string): Promise<Message> {
    const result = await this.db.query<Message>(
      'UPDATE messages SET read = true WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      throw new Error('Message non trouvé');
    }

    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    const result = await this.db.query(
      'DELETE FROM messages WHERE id = $1',
      [id]
    );
    
    if (result.rowCount === 0) {
      throw new Error('Message non trouvé');
    }
  }
}
