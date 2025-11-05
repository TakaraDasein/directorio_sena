-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  author TEXT NOT NULL,
  cover_image TEXT,
  content_path TEXT NOT NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  UNIQUE(company_id, slug)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_blogs_company_id ON blogs(company_id);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(is_published, published_at DESC);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view published blogs
CREATE POLICY "Anyone can view published blogs"
  ON blogs
  FOR SELECT
  USING (is_published = true);

-- Policy: Company owners can view their own blogs
CREATE POLICY "Company owners can view own blogs"
  ON blogs
  FOR SELECT
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

-- Policy: Company owners can insert their own blogs
CREATE POLICY "Company owners can insert own blogs"
  ON blogs
  FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

-- Policy: Company owners can update their own blogs
CREATE POLICY "Company owners can update own blogs"
  ON blogs
  FOR UPDATE
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

-- Policy: Company owners can delete their own blogs
CREATE POLICY "Company owners can delete own blogs"
  ON blogs
  FOR DELETE
  USING (
    company_id IN (
      SELECT id FROM companies WHERE user_id = auth.uid()
    )
  );

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_blogs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blogs_updated_at
  BEFORE UPDATE ON blogs
  FOR EACH ROW
  EXECUTE FUNCTION update_blogs_updated_at();

-- Create storage bucket for blog content
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-content', 'blog-content', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for blog content
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
