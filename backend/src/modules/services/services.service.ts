/**
 * Service pour les services
 */

import { IServiceRepository } from './services.repository';
import { CreateServiceDTO, UpdateServiceDTO, Service } from './services.types';
import { ApiError } from '../../shared/utils/ApiError';

export class ServiceService {
  constructor(private repository: IServiceRepository) {}

  async getAll(): Promise<Service[]> {
    return this.repository.findAll();
  }

  async getPublished(): Promise<Service[]> {
    return this.repository.findPublished();
  }

  async getById(id: string): Promise<Service> {
    const service = await this.repository.findById(id);
    if (!service) {
      throw ApiError.notFound('Service non trouvé');
    }
    return service;
  }

  async create(data: CreateServiceDTO): Promise<Service> {
    return this.repository.create(data);
  }

  async update(id: string, data: UpdateServiceDTO): Promise<Service> {
    await this.getById(id); // Vérifier l'existence
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id); // Vérifier l'existence
    return this.repository.delete(id);
  }
}
