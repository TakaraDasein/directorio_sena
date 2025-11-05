-- ============================================
-- FIX: Arreglar políticas RLS de company_reviews
-- Ejecuta esto si tienes error 403 al crear reviews
-- ============================================

-- Eliminar todas las políticas existentes
DROP POLICY IF EXISTS "Los reviews aprobados son visibles públicamente" ON company_reviews;
DROP POLICY IF EXISTS "Cualquiera puede crear un review" ON company_reviews;
DROP POLICY IF EXISTS "Solo admins pueden actualizar reviews" ON company_reviews;
DROP POLICY IF EXISTS "Solo admins pueden eliminar reviews" ON company_reviews;

-- Crear políticas correctas que permitan acceso anónimo

-- 1. Todos pueden ver reviews aprobados (sin necesidad de autenticación)
CREATE POLICY "Ver reviews aprobados"
  ON company_reviews
  FOR SELECT
  USING (is_approved = true);

-- 2. Cualquiera puede insertar reviews (incluyendo usuarios no autenticados)
CREATE POLICY "Crear reviews sin autenticación"
  ON company_reviews
  FOR INSERT
  WITH CHECK (true);

-- 3. Nadie puede actualizar reviews (solo desde el dashboard de Supabase)
CREATE POLICY "Actualizar reviews bloqueado"
  ON company_reviews
  FOR UPDATE
  USING (false);

-- 4. Nadie puede eliminar reviews (solo desde el dashboard de Supabase)
CREATE POLICY "Eliminar reviews bloqueado"
  ON company_reviews
  FOR DELETE
  USING (false);

-- Verificar que RLS está habilitado
ALTER TABLE company_reviews ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ALTERNATIVA: Si sigue sin funcionar, desactiva RLS temporalmente
-- ============================================
-- Descomenta la siguiente línea solo para desarrollo/pruebas:
-- ALTER TABLE company_reviews DISABLE ROW LEVEL SECURITY;
