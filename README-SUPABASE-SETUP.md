# 🚀 Configuración de Supabase - Directorio SENA

## 📋 Pasos de Configuración

### 1. Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y crea una cuenta
2. Crea un nuevo proyecto
3. Guarda las credenciales que se te proporcionan:
   - **Project URL**
   - **anon (public) key**
   - **service_role key** (solo para servidor)

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# Email Configuration (opcional por ahora)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_password
SMTP_FROM=noreply@directoriosena.com
```

### 3. Ejecutar el Schema SQL

1. Ve a tu proyecto de Supabase
2. Navega a **SQL Editor** en el panel lateral
3. Copia todo el contenido de `supabase/schema.sql`
4. Pégalo en el editor y ejecuta el script
5. Verifica que todas las tablas se hayan creado correctamente

### 4. Configurar Storage Bucket

En Supabase Dashboard:

1. Ve a **Storage** en el panel lateral
2. Crea un bucket llamado **`directorio_sena`** (público)
3. Estructura de carpetas dentro del bucket:
   ```
   directorio_sena/
   ├── logos/
   ├── covers/
   └── gallery/
   ```

4. Configura las políticas de acceso para el bucket:

#### Políticas de Lectura:
```sql
-- Permitir lectura pública
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'directorio_sena');
```

#### Políticas de Escritura (para usuarios autenticados):
```sql
-- Permitir subida de archivos a usuarios autenticados
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'directorio_sena' 
  AND auth.role() = 'authenticated'
);

-- Permitir actualización de archivos propios
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'directorio_sena' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Permitir eliminación de archivos propios
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'directorio_sena' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 5. Configurar Autenticación

En Supabase Dashboard:

1. Ve a **Authentication** > **Settings**
2. En **Email Auth**:
   - ✅ Habilitar Email Confirmations
   - Configura las URLs de redirección:
     - Site URL: `http://localhost:3000` (desarrollo)
     - Redirect URLs: 
       - `http://localhost:3000/auth/callback`
       - `https://tu-dominio.com/auth/callback` (producción)

3. Personaliza los templates de email en **Email Templates** (opcional)

### 6. Verificar RLS (Row Level Security)

Las políticas RLS ya están incluidas en el schema.sql. Verifica que estén activas:

```sql
-- Verificar que RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename IN ('companies', 'social_links', 'company_images', 'company_stats');
```

### 7. Probar las Funciones de la Base de Datos

Ejecuta estas queries para verificar que todo funciona:

```sql
-- Test 1: Verificar disponibilidad de slug
SELECT check_slug_availability('test-empresa');

-- Test 2: Generar slug desde nombre
SELECT generate_slug_from_name('Mi Empresa de Prueba SAS');

-- Test 3: Búsqueda de empresas (después de insertar datos)
SELECT * FROM search_companies('tecnología');
```

## 🧪 Datos de Prueba (Opcional)

Para probar la aplicación, puedes insertar datos de ejemplo:

```sql
-- Insertar una empresa de prueba (debes tener un usuario registrado)
INSERT INTO companies (
  user_id, 
  slug, 
  company_name, 
  category, 
  email, 
  phone,
  city,
  department,
  description,
  short_description,
  industry
) VALUES (
  'tu-user-id-aqui', -- Obtén esto de auth.users
  'vitro-tech',
  'Vitro Tecnología SAS',
  'empresa',
  'contacto@vitrotech.com',
  '+57 300 123 4567',
  'Cali',
  'Valle del Cauca',
  'Empresa de desarrollo de software especializada en soluciones innovadoras para empresas del Valle del Cauca.',
  'Desarrollo de software innovador',
  'Tecnología'
);
```

## 📝 Estructura de las Tablas

### companies
Tabla principal con toda la información de las empresas.

### social_links
Enlaces a redes sociales de cada empresa.

### company_images
Referencias a imágenes (logo, portada, galería).

### company_stats
Estadísticas y métricas de visualizaciones.

### slug_history
Historial de cambios de slug para redirecciones.

## 🔐 Seguridad

El schema incluye:
- ✅ Row Level Security (RLS) en todas las tablas
- ✅ Políticas de acceso basadas en usuario
- ✅ Validaciones a nivel de base de datos
- ✅ Constraints para integridad de datos

## 🚀 Próximos Pasos

Una vez completada la configuración:

1. Ejecuta el proyecto: `pnpm dev`
2. Navega a `/auth` para registrar un usuario
3. Completa el flujo de creación de empresa
4. Tu empresa estará disponible en `/[tu-slug]`

## ❓ Solución de Problemas

### Error: "relation does not exist"
- Verifica que ejecutaste el schema.sql completo
- Revisa que estás conectado al proyecto correcto

### Error: "permission denied for schema public"
- Verifica que las políticas RLS estén correctamente aplicadas
- Asegúrate de estar autenticado al intentar crear/actualizar datos

### Los archivos no se suben a Storage
- Verifica que los buckets existan y sean públicos
- Revisa las políticas de Storage

## 📞 Soporte

Si encuentras problemas, revisa:
- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)

---

## ✅ Checklist de Configuración

- [ ] Proyecto de Supabase creado
- [ ] Variables de entorno configuradas en `.env.local`
- [ ] Schema SQL ejecutado exitosamente
- [ ] Bucket `directorio_sena` creado en Storage
- [ ] Carpetas `logos/`, `covers/`, `gallery/` creadas dentro del bucket
- [ ] Políticas de Storage configuradas
- [ ] Autenticación por email habilitada
- [ ] URLs de redirección configuradas
- [ ] Funciones de base de datos verificadas
- [ ] Proyecto ejecutándose con `pnpm dev`
- [ ] Registro de usuario funcional
- [ ] Creación de empresa funcional
