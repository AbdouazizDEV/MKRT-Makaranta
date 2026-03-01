/**
 * Repository pour les services
 */

import { Pool } from 'pg';
import { Service, CreateServiceDTO, UpdateServiceDTO } from './services.types';

export interface IServiceRepository {
  findAll(): Promise<Service[]>;
  findById(id: string): Promise<Service | null>;
  findPublished(): Promise<Service[]>;
  create(data: CreateServiceDTO): Promise<Service>;
  update(id: string, data: UpdateServiceDTO): Promise<Service>;
  delete(id: string): Promise<void>;
}

export class ServiceRepository implements IServiceRepository {
  constructor(private db: Pool) {}

  async findAll(): Promise<Service[]> {
    const result = await this.db.query<Service>(
      'SELECT * FROM services ORDER BY order_index ASC, created_at ASC'
    );
    return result.rows;
  }

  async findById(id: string): Promise<Service | null> {
    const result = await this.db.query<Service>(
      'SELECT * FROM services WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findPublished(): Promise<Service[]> {
    const result = await this.db.query<Service>(
      'SELECT * FROM services WHERE published = true ORDER BY order_index ASC, created_at ASC'
    );
    return result.rows;
  }

  async create(data: CreateServiceDTO): Promise<Service> {
    const { title, description, icon, order_index = 0, published = true } = data;
    
    const result = await this.db.query<Service>(
      `INSERT INTO services (title, description, icon, order_index, published)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, description, icon || null, order_index, published]
    );
    
    return result.rows[0];
  }

  async update(id: string, data: UpdateServiceDTO): Promise<Service> {
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(data.title);
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(data.description);
    }
    if (data.icon !== undefined) {
      updates.push(`icon = $${paramIndex++}`);
      values.push(data.icon || null);
    }
    if (data.order_index !== undefined) {
      updates.push(`order_index = $${paramIndex++}`);
      values.push(data.order_index);
    }
    if (data.published !== undefined) {
      updates.push(`published = $${paramIndex++}`);
      values.push(data.published);
    }

    if (updates.length === 0) {
      const existing = await this.findById(id);
      if (!existing) {
        throw new Error('Service non trouvé');
      }
      return existing;
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await this.db.query<Service>(
      `UPDATE services SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error('Service non trouvé');
    }

    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    const result = await this.db.query(
      'DELETE FROM services WHERE id = $1',
      [id]
    );
    
    if (result.rowCount === 0) {
      throw new Error('Service non trouvé');
    }
  }
}
