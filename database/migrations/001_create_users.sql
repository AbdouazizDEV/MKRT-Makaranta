-- Migration 001: Création de la table users
-- Table pour gérer les administrateurs de l'application

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances de recherche par email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Commentaires
COMMENT ON TABLE users IS 'Table des utilisateurs administrateurs de la plateforme LUMINA';
COMMENT ON COLUMN users.role IS 'Rôle de l''utilisateur (admin par défaut)';
