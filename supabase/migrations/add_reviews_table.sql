-- ============================================
-- TABLA: company_reviews
-- Almacena las calificaciones y comentarios de usuarios
-- ============================================

CREATE TABLE IF NOT EXISTS company_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  
  -- Información del review
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  
  -- Información del autor
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  
  -- Moderación
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  
  -- Metadatos
  helpful_count INTEGER DEFAULT 0,
  reported_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_company_reviews_company_id ON company_reviews(company_id);
CREATE INDEX idx_company_reviews_is_approved ON company_reviews(is_approved);
CREATE INDEX idx_company_reviews_rating ON company_reviews(rating);
CREATE INDEX idx_company_reviews_created_at ON company_reviews(created_at DESC);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_company_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_company_reviews_updated_at
  BEFORE UPDATE ON company_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_company_reviews_updated_at();

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS
ALTER TABLE company_reviews ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden ver reviews aprobados
CREATE POLICY "Los reviews aprobados son visibles públicamente"
  ON company_reviews
  FOR SELECT
  USING (is_approved = true);

-- Política: Cualquiera puede crear un review (incluyendo anónimos)
CREATE POLICY "Cualquiera puede crear un review"
  ON company_reviews
  FOR INSERT
  WITH CHECK (true);

-- NOTA: Si ya existe esta política, primero elimínala y vuelve a crearla
-- DROP POLICY IF EXISTS "Cualquiera puede crear un review" ON company_reviews;

-- Política: Solo admins pueden actualizar reviews
-- (Necesitarás ajustar esto según tu sistema de roles)
CREATE POLICY "Solo admins pueden actualizar reviews"
  ON company_reviews
  FOR UPDATE
  USING (false); -- Por ahora, nadie puede actualizar

-- Política: Solo admins pueden eliminar reviews
CREATE POLICY "Solo admins pueden eliminar reviews"
  ON company_reviews
  FOR DELETE
  USING (false); -- Por ahora, nadie puede eliminar

-- ============================================
-- FUNCIÓN: Calcular promedio de rating de una empresa
-- ============================================

CREATE OR REPLACE FUNCTION get_company_average_rating(company_uuid UUID)
RETURNS NUMERIC AS $$
  SELECT ROUND(AVG(rating)::numeric, 1)
  FROM company_reviews
  WHERE company_id = company_uuid AND is_approved = true;
$$ LANGUAGE sql STABLE;

-- ============================================
-- FUNCIÓN: Contar reviews aprobados de una empresa
-- ============================================

CREATE OR REPLACE FUNCTION get_company_reviews_count(company_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::integer
  FROM company_reviews
  WHERE company_id = company_uuid AND is_approved = true;
$$ LANGUAGE sql STABLE;
