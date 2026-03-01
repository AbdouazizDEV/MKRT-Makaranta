/**
 * Page de gestion des messages (admin)
 */

'use client';

import { useMessages } from '@/hooks/useMessages';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { formatDate } from '@/lib/utils';
import { Mail, Trash2, Check } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

export default function AdminMessagesPage() {
  const { messages, loading, markAsRead, remove } = useMessages();
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

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
      <h1 className="text-3xl font-display font-bold text-[#0D1B2A] mb-8">
        Messages reçus
      </h1>

      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-xl font-semibold text-[#0D1B2A]">
                      {message.subject || 'Sans sujet'}
                    </h2>
                    {!message.read && (
                      <Badge variant="danger">Non lu</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    <strong>{message.name}</strong> ({message.email})
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(message.created_at)}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!message.read && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => markAsRead(message.id)}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setDeleteModal(message.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{message.body}</p>
            </CardContent>
          </Card>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aucun message pour le moment</p>
          </div>
        )}
      </div>

      {deleteModal && (
        <Modal
          isOpen={!!deleteModal}
          onClose={() => setDeleteModal(null)}
          title="Confirmer la suppression"
        >
          <p className="mb-4">Êtes-vous sûr de vouloir supprimer ce message ?</p>
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => setDeleteModal(null)}>
              Annuler
            </Button>
            <Button variant="primary" onClick={() => handleDelete(deleteModal)}>
              Supprimer
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
