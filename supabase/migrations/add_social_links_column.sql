-- Agregar columna social_links como JSONB a la tabla companies
-- Esta columna almacenará los enlaces sociales directamente en el registro de la empresa

ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}'::jsonb;

-- Agregar columnas para imágenes que también faltan
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
ADD COLUMN IF NOT EXISTS theme VARCHAR(50) DEFAULT 'default';

-- Actualizar el comentario de la tabla
COMMENT ON COLUMN companies.social_links IS 'Enlaces a redes sociales en formato JSON: {"instagram": "url", "whatsapp": "url", ...}';
COMMENT ON COLUMN companies.logo_url IS 'URL del logo de la empresa';
COMMENT ON COLUMN companies.cover_image_url IS 'URL de la imagen de portada';
COMMENT ON COLUMN companies.theme IS 'Tema visual seleccionado para la ficha';

-- Agregar columna whatsapp si no existe
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(50);

COMMENT ON COLUMN companies.whatsapp IS 'Número de WhatsApp con código de país';
