-- ============================================
-- MIGRACIÓN: Actualizar valores de categorías
-- Cambiar categorías a nombres más descriptivos
-- ============================================

-- Actualizar categorías existentes
UPDATE companies
SET category = CASE
  WHEN category = 'egresado' THEN 'emprendimiento-egresado'
  WHEN category = 'empresa' THEN 'empresa-fe'
  WHEN category = 'instructor' THEN 'agente-digitalizador'
  ELSE category
END
WHERE category IN ('egresado', 'empresa', 'instructor');

-- Actualizar comentario de la columna
COMMENT ON COLUMN companies.category IS 'Categoría de la empresa: emprendimiento-egresado, empresa-fe, agente-digitalizador';
