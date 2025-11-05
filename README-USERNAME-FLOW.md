# Flujo de Registro con Username Personalizado

## 📋 Descripción

El sistema ahora incluye un flujo de registro donde cada usuario elige su **username único** durante el registro, similar a Linktree. Este username se convierte en su URL personalizada en el directorio SENA.

## 🔗 Ejemplo de URL Personalizada

```
https://directorio.sena.edu.co/cristoferscalante
https://directorio.sena.edu.co/mi-empresa
https://directorio.sena.edu.co/juan-perez
```

## 🚀 Flujo de Registro

### 1. **Página de Registro** (`/auth`)

El usuario completa el formulario con:

- ✅ **Nombre completo**
- ✅ **Username** (slug personalizado)
  - Validación en tiempo real
  - Solo permite: letras minúsculas, números y guiones
  - Mínimo 3 caracteres
  - Máximo 50 caracteres
  - Verifica disponibilidad contra la base de datos
- ✅ **Correo electrónico**
- ✅ **Contraseña** (mínimo 6 caracteres)
- ✅ **Confirmar contraseña**

### 2. **Validación de Username**

El sistema realiza las siguientes validaciones:

```typescript
// Formato automático del username
- Convierte a minúsculas
- Reemplaza espacios por guiones
- Elimina acentos (á → a, é → e, etc.)
- Elimina caracteres especiales
- Permite solo: [a-z0-9-]

// Validación de disponibilidad
- Consulta la base de datos en tiempo real (debounce 500ms)
- Muestra ícono de validación:
  - ⏳ Verificando... (spinner)
  - ✓ Disponible (check verde)
  - ✗ No disponible (X roja)
```

### 3. **Registro en Supabase**

Al completar el registro:

```typescript
// Datos guardados en auth.users
{
  email: "usuario@email.com",
  user_metadata: {
    full_name: "Nombre Completo",
    username: "username-elegido" // ← Username personalizado
  }
}
```

### 4. **Confirmación de Email**

- El usuario recibe un correo de confirmación
- Mensaje de éxito muestra: "Tu URL será: https://directorio.sena.edu.co/[username]"

### 5. **Primera Sesión** (`/company/create`)

Después de confirmar el email e iniciar sesión:

1. El sistema carga automáticamente el **username** guardado
2. Pre-llena el campo "slug" en el formulario de registro de empresa
3. El usuario completa la información de su empresa
4. La empresa queda asociada a su URL personalizada

## 🎨 Características del UI

### Campo de Username

```tsx
<Input>
  directorio.sena.edu.co/[tu-nombre]
  
  Estados:
  - Normal: Borde gris
  - Verificando: Spinner animado
  - Disponible: Check verde + mensaje "✓ Disponible: https://..."
  - No disponible: X roja + mensaje de error
</Input>
```

### Mensajes de Ayuda

- **Placeholder**: "tu-nombre"
- **Ayuda**: "Solo letras minúsculas, números y guiones. Ej: juan-perez, mi-empresa"
- **Error**: "Este nombre de usuario ya está en uso"
- **Éxito**: "✓ Disponible: https://directorio.sena.edu.co/[username]"

## 🔧 Funciones Clave

### `formatSlug(text: string)`
```typescript
// Convierte cualquier texto a slug válido
"Cristofer Scalante" → "cristofer-scalante"
"Mi Empresa #1!" → "mi-empresa-1"
"Café García" → "cafe-garcia"
```

### `checkSlugAvailability(slug: string)`
```typescript
// Verifica disponibilidad en la base de datos
await supabase.rpc('check_slug_availability', {
  slug_to_check: slug
})
// Retorna: true (disponible) o false (ocupado)
```

### `handleUsernameChange(value: string)`
```typescript
// Maneja el cambio con debounce
1. Formatea el texto ingresado
2. Actualiza el estado
3. Espera 500ms de inactividad
4. Verifica disponibilidad en DB
```

## 📊 Base de Datos

### Tabla `companies`
```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  slug VARCHAR(100) UNIQUE NOT NULL, -- Username del usuario
  company_name VARCHAR(255),
  ...
)
```

### Función RPC
```sql
CREATE OR REPLACE FUNCTION check_slug_availability(slug_to_check VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM companies WHERE slug = slug_to_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## 🔐 Seguridad

- ✅ Username único por usuario
- ✅ Validación de formato en frontend y backend
- ✅ Verificación de disponibilidad en tiempo real
- ✅ Protección contra caracteres especiales/inyección
- ✅ Row Level Security (RLS) en Supabase

## 🎯 Ventajas

1. **URL Memorable**: Fácil de compartir y recordar
2. **Branding Personal**: Profesionaliza la presencia digital
3. **SEO Friendly**: URLs limpias y descriptivas
4. **Experiencia de Usuario**: Similar a plataformas conocidas (Linktree, Bio.fm)
5. **Escalabilidad**: Cada empresa tiene su espacio único

## 📝 Próximos Pasos

- [ ] Permitir cambio de username (con historial de redirecciones)
- [ ] Sistema de usernames premium/verificados
- [ ] Sugerencias de username si el deseado está ocupado
- [ ] Estadísticas de visitas por username
- [ ] Compartir URL con QR code

## 🐛 Notas de Desarrollo

### Actualización de Componentes

1. **`/app/auth/new-page.tsx`**
   - Campo de username con validación en tiempo real
   - Íconos de estado (check, X, spinner)
   - Mensajes de feedback

2. **`/components/company/steps/step-basic-info.tsx`**
   - Pre-carga del username desde user_metadata
   - Auto-fill del campo slug

3. **`/lib/types/database.types.ts`**
   - Tipos actualizados para incluir username

### Testing

```bash
# Probar formato de slug
formatSlug("Ábaco García #123") // → "abaco-garcia-123"

# Probar validación
checkSlugAvailability("juan-perez") // → true/false

# Probar registro completo
1. Ir a /auth
2. Pestaña "Registrarse"
3. Llenar formulario con username "test-user-123"
4. Verificar que muestre "✓ Disponible"
5. Completar registro
6. Verificar email de confirmación
7. Iniciar sesión y verificar redirección
```

## 📚 Referencias

- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [URL Slugs Best Practices](https://developers.google.com/search/docs/crawling-indexing/url-structure)
- [Linktree-style URLs](https://linktr.ee/)

---

**Última actualización**: Octubre 29, 2025
**Desarrollado para**: Directorio SENA - directorio.sena.edu.co
