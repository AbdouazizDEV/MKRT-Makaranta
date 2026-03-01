-- Migration 004: Création de la table messages
-- Table pour gérer les messages reçus via le formulaire de contact

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  body TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Commentaires
COMMENT ON TABLE messages IS 'Table des messages reçus via le formulaire de contact';
COMMENT ON COLUMN messages.read IS 'Indique si le message a été lu par un administrateur';
