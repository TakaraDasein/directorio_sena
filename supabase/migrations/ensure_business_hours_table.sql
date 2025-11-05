-- Migración: Asegurar que exista la tabla business_hours
-- Fecha: 2025-11-05
-- Descripción: Crea la tabla business_hours solo si no existe

-- Crear tabla business_hours si no existe
CREATE TABLE IF NOT EXISTS business_hours (
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

-- Crear índice si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_business_hours_company_id'
  ) THEN
    CREATE INDEX idx_business_hours_company_id ON business_hours(company_id);
  END IF;
END $$;

-- Habilitar RLS
ALTER TABLE business_hours ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen
DROP POLICY IF EXISTS "Business hours are viewable by everyone" ON business_hours;
DROP POLICY IF EXISTS "Users can manage own business hours" ON business_hours;

-- Crear política para visualización pública
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

-- Crear política para gestión por propietario
CREATE POLICY "Users can manage own business hours" 
ON business_hours FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM companies 
    WHERE companies.id = business_hours.company_id 
    AND companies.user_id = auth.uid()
  )
);

-- Crear trigger para updated_at si no existe
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_business_hours_updated_at'
  ) THEN
    CREATE TRIGGER update_business_hours_updated_at 
    BEFORE UPDATE ON business_hours
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();
  END IF;
END $$;

-- Comentarios
COMMENT ON TABLE business_hours IS 'Horarios de atención de cada empresa';
COMMENT ON COLUMN business_hours.day_of_week IS 'Día de la semana: 0=Domingo, 1=Lunes, ..., 6=Sábado';
COMMENT ON COLUMN business_hours.is_closed IS 'true si el negocio está cerrado ese día';
COMMENT ON COLUMN business_hours.is_24_hours IS 'true si el negocio está abierto 24 horas ese día';
