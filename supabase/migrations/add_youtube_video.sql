-- Agregar columna para video de YouTube en companies
ALTER TABLE companies
ADD COLUMN youtube_video_url TEXT;

-- Agregar comentario para documentar
COMMENT ON COLUMN companies.youtube_video_url IS 'URL completa del video de YouTube para mostrar en la ficha pública';
