/**
 * Page de gestion des services (admin)
 */

'use client';

import Link from 'next/link';
import { useServices } from '@/hooks/useServices';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

export default function AdminServicesPage() {
  const { services, loading, remove } = useServices(true);
  const [deleteModal, setDeleteModal] = useState<{ id: string; title: string } | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      setDeleteModal(null);
    } catch (error) {
      // Erreur gérée par le hook
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-[#0D1B2A]">
          Gestion des Services
        </h1>
        <Link href="/admin/services/new">
          <Button variant="primary">
            <Plus className="w-5 h-5 mr-2" />
            Nouveau service
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-semibold text-[#0D1B2A]">
                  {service.title}
                </h2>
                <Badge variant={service.published ? 'success' : 'warning'}>
                  {service.published ? 'Publié' : 'Brouillon'}
                </Badge>
              </div>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex gap-2">
                <Link href={`/admin/services/new?id=${service.id}`}>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteModal({ id: service.id, title: service.title })}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {deleteModal && (
        <Modal
          isOpen={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          title="Confirmer la suppression"
        >
          <p className="mb-4">
            Êtes-vous sûr de vouloir supprimer le service "{deleteModal.title}" ?
          </p>
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => setDeleteModal(null)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={() => handleDelete(deleteModal.id)}>
              Supprimer
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
