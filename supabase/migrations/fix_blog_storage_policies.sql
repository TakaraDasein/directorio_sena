-- Fix blog storage policies
-- Ejecutar esto en Supabase SQL Editor

-- Primero, eliminar las políticas existentes si existen
DROP POLICY IF EXISTS "Anyone can view blog content" ON storage.objects;
DROP POLICY IF EXISTS "Company owners can upload blog content" ON storage.objects;
DROP POLICY IF EXISTS "Company owners can update blog content" ON storage.objects;
DROP POLICY IF EXISTS "Company owners can delete blog content" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload blog content" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update blog content" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete blog content" ON storage.objects;

-- Crear políticas correctas
CREATE POLICY "Anyone can view blog content"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-content');

CREATE POLICY "Authenticated users can upload blog content"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'blog-content' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update blog content"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'blog-content' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can delete blog content"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'blog-content' AND
    auth.role() = 'authenticated'
  );
