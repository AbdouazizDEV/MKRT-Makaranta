/**
 * Repository pour les activités
 * Gère uniquement l'accès aux données (requêtes SQL)
 * Respect du principe Single Responsibility
 */

import { Pool } from 'pg';
import { Activite, CreateActiviteDTO, UpdateActiviteDTO } from './activites.types';

export interface IActiviteRepository {
  findAll(): Promise<Activite[]>;
  findById(id: string): Promise<Activite | null>;
  findPublished(): Promise<Activite[]>;
  create(data: CreateActiviteDTO): Promise<Activite>;
  update(id: string, data: UpdateActiviteDTO): Promise<Activite>;
  delete(id: string): Promise<void>;
}

export class ActiviteRepository implements IActiviteRepository {
  constructor(private db: Pool) {}

  async findAll(): Promise<Activite[]> {
    const result = await this.db.query<Activite>(
      'SELECT * FROM activites ORDER BY date DESC, created_at DESC'
    );
    return result.rows;
  }

  async findById(id: string): Promise<Activite | null> {
    const result = await this.db.query<Activite>(
      'SELECT * FROM activites WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async findPublished(): Promise<Activite[]> {
    const result = await this.db.query<Activite>(
      'SELECT * FROM activites WHERE published = true ORDER BY date DESC, created_at DESC'
    );
    return result.rows;
  }

  async create(data: CreateActiviteDTO): Promise<Activite> {
    const { title, description, image_url, image_alt, date, published = false } = data;
    
    const result = await this.db.query<Activite>(
      `INSERT INTO activites (title, description, image_url, image_alt, date, published)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description || null, image_url || null, image_alt || null, date, published]
    );
    
    return result.rows[0];
  }

  async update(id: string, data: UpdateActiviteDTO): Promise<Activite> {
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(data.title);
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(data.description || null);
    }
    if (data.image_url !== undefined) {
      updates.push(`image_url = $${paramIndex++}`);
      values.push(data.image_url || null);
    }
    if (data.image_alt !== undefined) {
      updates.push(`image_alt = $${paramIndex++}`);
      values.push(data.image_alt || null);
    }
    if (data.date !== undefined) {
      updates.push(`date = $${paramIndex++}`);
      values.push(data.date);
    }
    if (data.published !== undefined) {
      updates.push(`published = $${paramIndex++}`);
      values.push(data.published);
    }

    if (updates.length === 0) {
      const existing = await this.findById(id);
      if (!existing) {
        throw new Error('Activité non trouvée');
      }
      return existing;
    }

    updates.push(`updated_at = NOW()`);
    values.push(id);

    const result = await this.db.query<Activite>(
      `UPDATE activites SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      throw new Error('Activité non trouvée');
    }

    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    const result = await this.db.query(
      'DELETE FROM activites WHERE id = $1',
      [id]
    );
    
    if (result.rowCount === 0) {
      throw new Error('Activité non trouvée');
    }
  }
}
