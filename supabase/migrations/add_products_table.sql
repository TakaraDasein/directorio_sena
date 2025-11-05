-- ============================================
-- MIGRACIÓN: Agregar tabla de productos para tienda
-- ============================================

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  
  -- Información del producto
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'COP',
  
  -- Imágenes
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb, -- Array de URLs de imágenes adicionales
  
  -- Categorización
  category VARCHAR(100),
  tags TEXT[], -- Array de tags
  
  -- Inventario
  stock_quantity INTEGER DEFAULT 0,
  sku VARCHAR(100),
  
  -- Estado
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- Opciones
  has_variations BOOLEAN DEFAULT false,
  variations JSONB DEFAULT '[]'::jsonb, -- Ej: [{"name": "Talla", "options": ["S", "M", "L"]}]
  
  -- Métricas
  views_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  
  -- Ordenamiento
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_products_company_id ON products(company_id);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order);

-- Habilitar RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Productos activos son públicos" ON products;
DROP POLICY IF EXISTS "Usuarios gestionan sus productos" ON products;

-- Política: Los usuarios pueden ver productos activos de cualquier empresa
CREATE POLICY "Productos activos son públicos"
  ON products FOR SELECT
  USING (is_active = true);

-- Política: Los usuarios solo pueden gestionar sus propios productos
CREATE POLICY "Usuarios gestionan sus productos"
  ON products FOR ALL
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_products_updated_at_trigger
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_products_updated_at();
