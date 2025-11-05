# Configuración de Supabase Storage para Imágenes

## 📦 Bucket: directorio_sena

### 1. Crear el Bucket (Si no existe)

En el dashboard de Supabase:
1. Ve a **Storage** en el menú lateral
2. Click en **New bucket**
3. Nombre: `directorio_sena`
4. **Public bucket**: ✅ Marcar como público
5. Click en **Create bucket**

### 2. Estructura de Carpetas

El bucket debe tener esta estructura:

```
directorio_sena/
├── logos/           # Logos de empresas (cuadrados, 400x400px)
├── covers/          # Imágenes de portada (rectangulares, 1200x400px)
└── gallery/         # Galería de fotos (varias imágenes)
```

**Nota**: Las carpetas se crean automáticamente al subir el primer archivo en cada ruta.

### 3. Políticas de Storage (RLS)

Ejecutar estos SQL en **SQL Editor**:

```sql
-- Política 1: Lectura pública
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'directorio_sena');

-- Política 2: Upload para usuarios autenticados
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'directorio_sena' 
  AND auth.role() = 'authenticated'
);

-- Política 3: Actualización solo del propietario
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'directorio_sena' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política 4: Eliminación solo del propietario
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'directorio_sena' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 4. Configuración de Tamaños y Formatos

**Tamaños recomendados:**
- **Logo**: 400x400px (cuadrado)
- **Portada**: 1200x400px (ratio 3:1)
- **Galería**: 800x600px (flexible)

**Formatos permitidos:**
- JPG/JPEG
- PNG
- WebP (recomendado para mejor compresión)

**Tamaño máximo:**
- 5MB por archivo

### 5. Nomenclatura de Archivos

```
{user_id}/{company_slug}/{type}/{filename}
```

**Ejemplos:**
```
logos/
  ├── abc123-uuid/
      └── vitro/
          └── logo.webp

covers/
  ├── abc123-uuid/
      └── vitro/
          └── cover.webp

gallery/
  ├── abc123-uuid/
      └── vitro/
          ├── product-1.webp
          ├── product-2.webp
          └── office.webp
```

### 6. URLs de Acceso

Una vez subida la imagen, Supabase genera una URL pública:

```
https://dzyjoleccmwlzzmlvbdq.supabase.co/storage/v1/object/public/directorio_sena/logos/abc123-uuid/vitro/logo.webp
```

### 7. Verificar Configuración

**Checklist:**
- [ ] Bucket `directorio_sena` creado
- [ ] Bucket marcado como **público**
- [ ] Políticas RLS aplicadas (4 políticas)
- [ ] Subida de prueba exitosa
- [ ] URL pública accesible

### 8. Código de Ejemplo para Upload

```typescript
// Upload de logo
const uploadLogo = async (file: File, userId: string, companySlug: string) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${companySlug}/logo.${fileExt}`
  const filePath = `logos/${fileName}`

  const { data, error } = await supabase.storage
    .from('directorio_sena')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true // Reemplaza si ya existe
    })

  if (error) throw error

  // Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('directorio_sena')
    .getPublicUrl(filePath)

  return publicUrl
}
```

### 9. Optimización de Imágenes

**Recomendaciones:**
- Comprimir imágenes antes de subir
- Usar formato WebP para mejor compresión
- Implementar lazy loading en frontend
- Generar thumbnails para previews

**Herramientas:**
- [TinyPNG](https://tinypng.com/) - Compresión
- [Squoosh](https://squoosh.app/) - Conversión a WebP
- Sharp (Node.js) - Procesamiento server-side

### 10. Troubleshooting

**Error: "new row violates row-level security policy"**
- Verificar que las políticas RLS estén aplicadas
- Confirmar que el usuario está autenticado
- Revisar que el bucket_id sea correcto

**Error: "The resource already exists"**
- Usar `upsert: true` para sobrescribir
- O eliminar el archivo anterior primero

**Imagen no se muestra:**
- Verificar que el bucket sea público
- Confirmar que la URL sea correcta
- Revisar CORS en Supabase

---

**Última actualización**: Octubre 29, 2025
**Proyecto**: Directorio SENA
