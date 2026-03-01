-- Migration 002: Création de la table activites
-- Table pour gérer les activités de l'ONG

CREATE TABLE IF NOT EXISTS activites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  image_alt VARCHAR(255),
  date DATE NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_activites_published ON activites(published);
CREATE INDEX IF NOT EXISTS idx_activites_date ON activites(date DESC);

-- Commentaires
COMMENT ON TABLE activites IS 'Table des activités de l''ONG LUMINA';
COMMENT ON COLUMN activites.published IS 'Indique si l''activité est visible publiquement';
COMMENT ON COLUMN activites.image_url IS 'URL de l''image stockée sur Cloudinary';
