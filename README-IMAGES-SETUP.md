# 📸 Configuración de Imágenes - Directorio SENA

## Configuración del Storage Bucket en Supabase

Para que la funcionalidad de imágenes funcione correctamente, necesitas crear un bucket de almacenamiento en Supabase.

### Pasos para configurar el Storage:

1. **Ir a Storage en Supabase Dashboard**
   - Abre tu proyecto en [https://supabase.com](https://supabase.com)
   - Ve a la sección "Storage" en el menú lateral

2. **Crear nuevo bucket**
   - Haz clic en "New Bucket"
   - Nombre del bucket: `company-images`
   - Configura como **público** (Public bucket: ✓)
   - Haz clic en "Create bucket"

3. **Configurar políticas de acceso (RLS)**

   Ejecuta estos comandos SQL en el SQL Editor:

   ```sql
   -- Política para que cualquiera pueda ver las imágenes (público)
   CREATE POLICY "Las imágenes son visibles públicamente"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'company-images');

   -- Política para que usuarios autenticados puedan subir imágenes
   CREATE POLICY "Los usuarios autenticados pueden subir imágenes"
   ON storage.objects FOR INSERT
   WITH CHECK (
     bucket_id = 'company-images' 
     AND auth.role() = 'authenticated'
   );

   -- Política para que usuarios puedan actualizar sus propias imágenes
   CREATE POLICY "Los usuarios pueden actualizar sus imágenes"
   ON storage.objects FOR UPDATE
   USING (
     bucket_id = 'company-images' 
     AND auth.role() = 'authenticated'
   );

   -- Política para que usuarios puedan eliminar sus propias imágenes
   CREATE POLICY "Los usuarios pueden eliminar sus imágenes"
   ON storage.objects FOR DELETE
   USING (
     bucket_id = 'company-images' 
     AND auth.role() = 'authenticated'
   );
   ```

## Estructura de la funcionalidad

### Tipos de imágenes soportadas:

1. **Logo** (400x400px recomendado)
   - Imagen cuadrada que representa la empresa
   - Fondo transparente preferiblemente
   - Formatos: PNG, JPG, WebP

2. **Portada** (1920x480px recomendado)
   - Imagen panorámica principal del perfil
   - Debe ser impactante y representativa
   - Formatos: JPG, PNG, WebP

3. **Galería** (cualquier tamaño)
   - Múltiples imágenes adicionales
   - Máximo 5MB por imagen
   - Formatos: JPG, PNG, WebP

### Almacenamiento

Las imágenes se almacenan en:
- **Supabase Storage**: Bucket `company-images`
- **Base de datos**: Tabla `company_images` con referencias

Estructura de carpetas en el bucket:
```
company-images/
  ├── {company_id}/
  │   ├── logo-{timestamp}.{ext}
  │   ├── cover-{timestamp}.{ext}
  │   └── gallery-{timestamp}.{ext}
```

## Uso en el Admin Dashboard

1. **Acceder a la sección de Imágenes**
   - Ve a `/admin`
   - Haz clic en "Imágenes" en el menú lateral

2. **Subir Logo**
   - Haz clic en "Subir Logo"
   - Selecciona una imagen (máx 5MB)
   - Espera a que se suba
   - Puedes cambiar o eliminar después

3. **Subir Portada**
   - Haz clic en "Subir Portada"
   - Selecciona una imagen panorámica
   - La imagen se mostrará en la parte superior de tu ficha

4. **Agregar a Galería**
   - Haz clic en "Agregar Imagen"
   - Selecciona imágenes de tu trabajo/productos
   - Puedes agregar múltiples imágenes
   - Para eliminar, haz hover sobre la imagen y clic en el icono de basura

## Validaciones

- **Tipo de archivo**: Solo imágenes (JPG, PNG, WebP)
- **Tamaño máximo**: 5MB por imagen
- **Formatos recomendados**: 
  - Logo: 400x400px (1:1)
  - Portada: 1920x480px (4:1)
  - Galería: Variable

## Visualización

Las imágenes subidas se verán reflejadas en:
- Tu ficha pública (`/{slug}`)
- El carrusel de imágenes (portada + galería)
- El logo en el header
- La galería en la sección de fotos

## Troubleshooting

### Error: "Error al subir la imagen"
- Verifica que el bucket `company-images` existe
- Verifica que las políticas RLS están configuradas
- Verifica el tamaño del archivo (máx 5MB)

### Las imágenes no se muestran
- Verifica que el bucket es público
- Verifica que las URLs son correctas
- Revisa la consola del navegador para errores

### No puedo eliminar imágenes
- Verifica que las políticas de DELETE están configuradas
- Verifica que eres el propietario de la empresa

## Seguridad

- Solo usuarios autenticados pueden subir/modificar/eliminar imágenes
- Las imágenes son públicas para visualización
- Cada empresa solo puede gestionar sus propias imágenes
- Validación de tipo y tamaño de archivo en el frontend

## Próximas mejoras

- [ ] Recorte de imágenes antes de subir
- [ ] Optimización automática de imágenes
- [ ] Soporte para múltiples tamaños (thumbnails)
- [ ] Drag & drop para ordenar galería
- [ ] Watermark automático opcional
