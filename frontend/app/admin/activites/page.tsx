/**
 * Page de gestion des activités (admin)
 */

'use client';

import Link from 'next/link';
import { useActivites } from '@/hooks/useActivites';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { formatDateShort } from '@/lib/utils';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

export default function AdminActivitesPage() {
  const { activites, loading, remove } = useActivites(true);
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
          Gestion des Activités
        </h1>
        <Link href="/admin/activites/new">
          <Button variant="primary">
            <Plus className="w-5 h-5 mr-2" />
            Nouvelle activité
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activites.map((activite) => (
          <Card key={activite.id}>
            {activite.image_url && (
              <img
                src={activite.image_url}
                alt={activite.image_alt || activite.title}
                className="w-full h-48 object-cover"
              />
            )}
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-xl font-semibold text-[#0D1B2A]">
                  {activite.title}
                </h2>
                <Badge variant={activite.published ? 'success' : 'warning'}>
                  {activite.published ? 'Publié' : 'Brouillon'}
                </Badge>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                {formatDateShort(activite.date)}
              </p>
              <div className="flex gap-2">
                <Link href={`/admin/activites/new?id=${activite.id}`}>
                  <Button size="sm" variant="outline">
                    <Edit className="w-4 h-4" />
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDeleteModal({ id: activite.id, title: activite.title })}
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
            Êtes-vous sûr de vouloir supprimer l'activité "{deleteModal.title}" ?
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
