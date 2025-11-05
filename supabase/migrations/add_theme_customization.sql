-- ============================================
-- MIGRACIÓN: Agregar personalización de temas
-- ============================================

-- Agregar columna para color personalizado si no existe
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS custom_color VARCHAR(7) DEFAULT '#2F4D2A';

-- Agregar columna para tema seleccionado si no existe
ALTER TABLE companies 
ADD COLUMN IF NOT EXISTS selected_theme VARCHAR(50) DEFAULT 'sena-green';

-- Actualizar empresas existentes con valores por defecto
UPDATE companies 
SET custom_color = '#2F4D2A', selected_theme = 'sena-green'
WHERE custom_color IS NULL OR selected_theme IS NULL;
