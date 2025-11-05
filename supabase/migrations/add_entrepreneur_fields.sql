-- ============================================
-- Agregar campos para información del emprendedor
-- ============================================

-- Agregar columnas para información del emprendedor
ALTER TABLE companies
ADD COLUMN entrepreneur_name VARCHAR(255),
ADD COLUMN entrepreneur_image_url TEXT;

-- Crear comentarios para documentación
COMMENT ON COLUMN companies.entrepreneur_name IS 'Nombre del emprendedor o fundador de la empresa';
COMMENT ON COLUMN companies.entrepreneur_image_url IS 'URL de la imagen del emprendedor almacenada en Supabase Storage';
