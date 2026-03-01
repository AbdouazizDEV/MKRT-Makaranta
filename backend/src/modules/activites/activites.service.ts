/**
 * Service pour les activités
 * Gère la logique métier (filtrage, validation, etc.)
 */

import { IActiviteRepository, ActiviteRepository } from './activites.repository';
import { CreateActiviteDTO, UpdateActiviteDTO } from './activites.types';
import { ApiError } from '../../shared/utils/ApiError';

export class ActiviteService {
  constructor(private repository: IActiviteRepository) {}

  /**
   * Récupère toutes les activités (admin uniquement)
   */
  async getAll(): Promise<Activite[]> {
    return this.repository.findAll();
  }

  /**
   * Récupère uniquement les activités publiées (public)
   */
  async getPublished(): Promise<Activite[]> {
    return this.repository.findPublished();
  }

  /**
   * Récupère une activité par son ID
   */
  async getById(id: string): Promise<Activite> {
    const activite = await this.repository.findById(id);
    if (!activite) {
      throw ApiError.notFound('Activité non trouvée');
    }
    return activite;
  }

  /**
   * Crée une nouvelle activité
   */
  async create(data: CreateActiviteDTO): Promise<Activite> {
    // Validation de la date
    const date = new Date(data.date);
    if (isNaN(date.getTime())) {
      throw ApiError.badRequest('Date invalide');
    }

    return this.repository.create(data);
  }

  /**
   * Met à jour une activité
   */
  async update(id: string, data: UpdateActiviteDTO): Promise<Activite> {
    // Vérifier que l'activité existe
    await this.getById(id);

    // Validation de la date si fournie
    if (data.date) {
      const date = new Date(data.date);
      if (isNaN(date.getTime())) {
        throw ApiError.badRequest('Date invalide');
      }
    }

    return this.repository.update(id, data);
  }

  /**
   * Supprime une activité
   */
  async delete(id: string): Promise<void> {
    await this.getById(id); // Vérifier l'existence
    return this.repository.delete(id);
  }
}
