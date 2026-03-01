-- Migration 003: Création de la table services
-- Table pour gérer les services offerts par l'ONG

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(100),
  order_index INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_services_published ON services(published);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(order_index);

-- Commentaires
COMMENT ON TABLE services IS 'Table des services offerts par l''ONG LUMINA';
COMMENT ON COLUMN services.order_index IS 'Ordre d''affichage des services';
COMMENT ON COLUMN services.icon IS 'Nom de l''icône (ex: BookOpen, GraduationCap)';
