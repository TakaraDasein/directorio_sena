-- ============================================
-- DIRECTORIO SENA - SCHEMA SQL
-- Sistema de Gestión de Empresas con URLs Personalizadas
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: companies
-- Almacena toda la información de las empresas
-- ============================================
CREATE TABLE companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Datos básicos
  slug VARCHAR(100) UNIQUE NOT NULL, -- URL personalizada (ej: "vitro")
  company_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL, -- 'egresado', 'empresa', 'instructor'
  
  -- Información de contacto
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  website VARCHAR(255),
  
  -- Ubicación
  address TEXT,
  city VARCHAR(100),
  department VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Colombia',
  
  -- Descripción
  description TEXT,
  short_description VARCHAR(500),
  
  -- Información adicional
  year_founded INTEGER,
  employee_count VARCHAR(50), -- '1-10', '11-50', '51-200', '200+'
  industry VARCHAR(100),
  
  -- Estado y visibilidad
  is_active BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  visibility VARCHAR(20) DEFAULT 'public', -- 'public', 'private', 'draft'
  
  -- Metadatos
  views_count INTEGER DEFAULT 0,
  profile_completeness INTEGER DEFAULT 0, -- 0-100%
  
  -- Personalización de ficha
  theme_color VARCHAR(7) DEFAULT '#2F4D2A', -- Color principal en formato HEX
  theme_style VARCHAR(20) DEFAULT 'modern', -- 'modern', 'classic', 'minimal', 'bold', 'elegant'
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Constraints
  CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$'),
  CONSTRAINT slug_length CHECK (LENGTH(slug) >= 3 AND LENGTH(slug) <= 100)
);

-- Índices para optimizar búsquedas
CREATE INDEX idx_companies_slug ON companies(slug);
CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_companies_category ON companies(category);
CREATE INDEX idx_companies_city ON companies(city);
CREATE INDEX idx_companies_is_active ON companies(is_active);
CREATE INDEX idx_companies_created_at ON companies(created_at DESC);

-- ============================================
-- TABLA: social_links
-- Almacena los enlaces a redes sociales de cada empresa
-- ============================================
CREATE TABLE social_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  
  -- Información del enlace
  platform VARCHAR(50) NOT NULL, -- 'instagram', 'whatsapp', 'tiktok', etc.
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Constraint para evitar duplicados
  UNIQUE(company_id, platform)
);

-- Índices
CREATE INDEX idx_social_links_company_id ON social_links(company_id);
CREATE INDEX idx_social_links_platform ON social_links(platform);

-- ============================================
-- TABLA: company_images
-- Almacena referencias a las imágenes (logo, portada, galería)
-- ============================================
CREATE TABLE company_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  
  -- Información de la imagen
  image_type VARCHAR(20) NOT NULL, -- 'logo', 'cover', 'gallery'
  image_url TEXT NOT NULL,
  storage_path TEXT NOT NULL, -- Path en Supabase Storage
  
  -- Metadatos
  alt_text VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Constraints
  CONSTRAINT image_type_check CHECK (image_type IN ('logo', 'cover', 'gallery'))
);

-- Índices
CREATE INDEX idx_company_images_company_id ON company_images(company_id);
CREATE INDEX idx_company_images_type ON company_images(image_type);

-- ============================================
-- TABLA: company_stats
-- Estadísticas y métricas de cada empresa
-- ============================================
CREATE TABLE company_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Métricas
  total_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  profile_shares INTEGER DEFAULT 0,
  contact_clicks INTEGER DEFAULT 0,
  
  -- Timestamps
  last_view_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índice
CREATE INDEX idx_company_stats_company_id ON company_stats(company_id);

-- ============================================
-- TABLA: slug_history
-- Mantiene un historial de slugs para redirecciones
-- ============================================
CREATE TABLE slug_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  old_slug VARCHAR(100) NOT NULL,
  new_slug VARCHAR(100) NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índice
CREATE INDEX idx_slug_history_old_slug ON slug_history(old_slug);
CREATE INDEX idx_slug_history_company_id ON slug_history(company_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE slug_history ENABLE ROW LEVEL SECURITY;

-- Políticas para companies
-- Lectura pública para empresas activas
CREATE POLICY "Companies are viewable by everyone when active" 
ON companies FOR SELECT 
USING (is_active = true AND visibility = 'public');

-- Los usuarios pueden ver sus propias empresas
CREATE POLICY "Users can view own companies" 
ON companies FOR SELECT 
USING (auth.uid() = user_id);

-- Los usuarios pueden crear sus propias empresas
CREATE POLICY "Users can create own companies" 
ON companies FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden actualizar sus propias empresas
CREATE POLICY "Users can update own companies" 
ON companies FOR UPDATE 
USING (auth.uid() = user_id);

-- Los usuarios pueden eliminar sus propias empresas
CREATE POLICY "Users can delete own companies" 
ON companies FOR DELETE 
USING (auth.uid() = user_id);

-- Políticas para social_links
CREATE POLICY "Social links are viewable by everyone" 
ON social_links FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM companies 
    WHERE companies.id = social_links.company_id 
    AND companies.is_active = true 
    AND companies.visibility = 'public'
  )
);

CREATE POLICY "Users can manage own social links" 
ON social_links FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM companies 
    WHERE companies.id = social_links.company_id 
    AND companies.user_id = auth.uid()
  )
);

-- Políticas para company_images
CREATE POLICY "Images are viewable by everyone" 
ON company_images FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM companies 
    WHERE companies.id = company_images.company_id 
    AND companies.is_active = true 
    AND companies.visibility = 'public'
  )
);

CREATE POLICY "Users can manage own images" 
ON company_images FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM companies 
    WHERE companies.id = company_images.company_id 
    AND companies.user_id = auth.uid()
  )
);

-- Políticas para company_stats
CREATE POLICY "Stats are viewable by company owner" 
ON company_stats FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM companies 
    WHERE companies.id = company_stats.company_id 
    AND companies.user_id = auth.uid()
  )
);

CREATE POLICY "Stats can be updated by anyone (for view counting)" 
ON company_stats FOR UPDATE 
USING (true);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at BEFORE UPDATE ON social_links
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Función para verificar slug único
CREATE OR REPLACE FUNCTION check_slug_availability(slug_to_check VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM companies WHERE slug = slug_to_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para generar slug desde nombre de empresa
CREATE OR REPLACE FUNCTION generate_slug_from_name(company_name_input VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
  base_slug VARCHAR;
  final_slug VARCHAR;
  counter INTEGER := 1;
BEGIN
  -- Convertir a minúsculas, reemplazar espacios y caracteres especiales
  base_slug := LOWER(REGEXP_REPLACE(company_name_input, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := TRIM(BOTH '-' FROM base_slug);
  
  -- Limitar longitud
  base_slug := SUBSTRING(base_slug, 1, 80);
  
  final_slug := base_slug;
  
  -- Si ya existe, agregar número
  WHILE NOT check_slug_availability(final_slug) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Función para registrar cambio de slug
CREATE OR REPLACE FUNCTION log_slug_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.slug IS DISTINCT FROM NEW.slug THEN
    INSERT INTO slug_history (company_id, old_slug, new_slug)
    VALUES (NEW.id, OLD.slug, NEW.slug);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para registrar cambios de slug
CREATE TRIGGER track_slug_changes
AFTER UPDATE ON companies
FOR EACH ROW
WHEN (OLD.slug IS DISTINCT FROM NEW.slug)
EXECUTE FUNCTION log_slug_change();

-- Función para incrementar vistas
CREATE OR REPLACE FUNCTION increment_company_views(company_slug VARCHAR)
RETURNS void AS $$
DECLARE
  company_uuid UUID;
BEGIN
  -- Obtener el ID de la empresa
  SELECT id INTO company_uuid FROM companies WHERE slug = company_slug;
  
  IF company_uuid IS NOT NULL THEN
    -- Actualizar contador en companies
    UPDATE companies 
    SET views_count = views_count + 1 
    WHERE id = company_uuid;
    
    -- Actualizar o insertar en company_stats
    INSERT INTO company_stats (company_id, total_views, last_view_at)
    VALUES (company_uuid, 1, NOW())
    ON CONFLICT (company_id) 
    DO UPDATE SET 
      total_views = company_stats.total_views + 1,
      last_view_at = NOW();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STORAGE BUCKET CONFIGURATION
-- Ejecutar estos comandos en el dashboard de Supabase Storage
-- ============================================

-- Crear bucket principal (ejecutar desde el dashboard de Supabase):
-- Nombre del bucket: "directorio_sena" (público)

-- Estructura de carpetas dentro del bucket:
-- directorio_sena/
-- ├── logos/
-- ├── covers/
-- └── gallery/

-- Políticas de storage para el bucket "directorio_sena":

-- Lectura pública:
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT 
-- USING (bucket_id = 'directorio_sena');

-- Escritura solo para usuarios autenticados:
-- CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT 
-- WITH CHECK (bucket_id = 'directorio_sena' AND auth.role() = 'authenticated');

-- Actualización solo del propietario:
-- CREATE POLICY "Users can update own files" ON storage.objects FOR UPDATE 
-- USING (bucket_id = 'directorio_sena' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Eliminación solo del propietario:
-- CREATE POLICY "Users can delete own files" ON storage.objects FOR DELETE 
-- USING (bucket_id = 'directorio_sena' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ============================================

-- Insertar categorías de ejemplo
-- Puedes crear una tabla adicional para categorías si lo deseas

-- ============================================
-- ÍNDICES ADICIONALES PARA BÚSQUEDA
-- ============================================

-- Índice para búsqueda de texto completo
CREATE INDEX idx_companies_search ON companies 
USING gin(to_tsvector('spanish', company_name || ' ' || COALESCE(description, '')));

-- Función de búsqueda
CREATE OR REPLACE FUNCTION search_companies(search_query TEXT)
RETURNS TABLE (
  id UUID,
  slug VARCHAR,
  company_name VARCHAR,
  category VARCHAR,
  short_description VARCHAR,
  city VARCHAR,
  relevance REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.slug,
    c.company_name,
    c.category,
    c.short_description,
    c.city,
    ts_rank(to_tsvector('spanish', c.company_name || ' ' || COALESCE(c.description, '')), 
            plainto_tsquery('spanish', search_query)) AS relevance
  FROM companies c
  WHERE 
    c.is_active = true 
    AND c.visibility = 'public'
    AND to_tsvector('spanish', c.company_name || ' ' || COALESCE(c.description, '')) 
        @@ plainto_tsquery('spanish', search_query)
  ORDER BY relevance DESC
  LIMIT 50;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TABLA: business_hours
-- Horarios de atención de cada empresa
-- ============================================
CREATE TABLE business_hours (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  
  -- Día de la semana (0 = Domingo, 6 = Sábado)
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  
  -- Horarios
  opens_at TIME, -- NULL = cerrado ese día
  closes_at TIME,
  
  -- Flags
  is_closed BOOLEAN DEFAULT false, -- true = cerrado ese día
  is_24_hours BOOLEAN DEFAULT false, -- true = abierto 24 horas
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  
  -- Constraint: un solo horario por día por empresa
  UNIQUE(company_id, day_of_week)
);

-- Índice
CREATE INDEX idx_business_hours_company_id ON business_hours(company_id);

-- RLS para business_hours
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business hours are viewable by everyone" 
ON business_hours FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM companies 
    WHERE companies.id = business_hours.company_id 
    AND companies.is_active = true 
    AND companies.visibility = 'public'
  )
);

CREATE POLICY "Users can manage own business hours" 
ON business_hours FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM companies 
    WHERE companies.id = business_hours.company_id 
    AND companies.user_id = auth.uid()
  )
);

-- Trigger para updated_at
CREATE TRIGGER update_business_hours_updated_at BEFORE UPDATE ON business_hours
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ============================================
-- TABLA: reviews
-- Reseñas y calificaciones de empresas
-- ============================================
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- NULL = reseña anónima
  
  -- Información de la reseña
  author_name VARCHAR(100) NOT NULL,
  author_email VARCHAR(255) NOT NULL,
  
  -- Contenido
  title VARCHAR(200) NOT NULL,
  comment TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  
  -- Estado
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  
  -- Respuesta del propietario
  owner_response TEXT,
  owner_response_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadatos
  helpful_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices
CREATE INDEX idx_reviews_company_id ON reviews(company_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_is_approved ON reviews(is_approved);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- RLS para reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Ver reseñas aprobadas
CREATE POLICY "Approved reviews are viewable by everyone" 
ON reviews FOR SELECT 
USING (is_approved = true);

-- Ver propias reseñas
CREATE POLICY "Users can view own reviews" 
ON reviews FOR SELECT 
USING (auth.uid() = user_id);

-- Crear reseñas (autenticados)
CREATE POLICY "Authenticated users can create reviews" 
ON reviews FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Actualizar propias reseñas
CREATE POLICY "Users can update own reviews" 
ON reviews FOR UPDATE 
USING (auth.uid() = user_id);

-- Propietarios de empresas pueden responder
CREATE POLICY "Company owners can respond to reviews" 
ON reviews FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM companies 
    WHERE companies.id = reviews.company_id 
    AND companies.user_id = auth.uid()
  )
);

-- Trigger para updated_at
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Función para calcular promedio de calificación
CREATE OR REPLACE FUNCTION calculate_company_rating(company_uuid UUID)
RETURNS TABLE (
  average_rating NUMERIC,
  total_reviews BIGINT,
  rating_distribution JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ROUND(AVG(rating), 1) as average_rating,
    COUNT(*) as total_reviews,
    jsonb_build_object(
      '5', COUNT(*) FILTER (WHERE rating = 5),
      '4', COUNT(*) FILTER (WHERE rating = 4),
      '3', COUNT(*) FILTER (WHERE rating = 3),
      '2', COUNT(*) FILTER (WHERE rating = 2),
      '1', COUNT(*) FILTER (WHERE rating = 1)
    ) as rating_distribution
  FROM reviews
  WHERE company_id = company_uuid AND is_approved = true;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TABLA: review_reports
-- Reportes de reseñas inapropiadas
-- ============================================
CREATE TABLE review_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE NOT NULL,
  reporter_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Información del reporte
  reason VARCHAR(50) NOT NULL, -- 'spam', 'inappropriate', 'fake', 'offensive'
  comment TEXT,
  
  -- Estado
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'reviewed', 'dismissed'
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraint: un usuario solo puede reportar una reseña una vez
  UNIQUE(review_id, reporter_user_id)
);

-- Índice
CREATE INDEX idx_review_reports_review_id ON review_reports(review_id);
CREATE INDEX idx_review_reports_status ON review_reports(status);

-- RLS para review_reports
ALTER TABLE review_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create review reports" 
ON review_reports FOR INSERT 
WITH CHECK (auth.uid() = reporter_user_id);

