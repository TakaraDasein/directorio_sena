# Configuración de Recuperación de Contraseña

## 📧 Configuración en Supabase Dashboard

Para que la recuperación de contraseña funcione correctamente con tu dominio `https://www.directoriosena.com/`, necesitas configurar las siguientes opciones en Supabase:

### 1. URL de Redirección del Sitio

Ve a **Authentication → URL Configuration** en tu proyecto de Supabase:

**Site URL:**
```
https://www.directoriosena.com
```

### 2. URLs de Redirección Permitidas

En **Redirect URLs**, agrega las siguientes URLs:

```
https://www.directoriosena.com/auth/callback
https://www.directoriosena.com/auth/reset-password
https://www.directoriosena.com/**
```

### 3. Plantilla de Email de Recuperación

Ve a **Authentication → Email Templates → Reset Password**

Actualiza la plantilla para que el link apunte a tu dominio:

```html
<h2>Restablecer tu contraseña</h2>

<p>Hola,</p>

<p>Has solicitado restablecer tu contraseña en Directorio SENA.</p>

<p>Haz clic en el siguiente enlace para continuar:</p>

<p><a href="https://www.directoriosena.com/auth/reset-password?token={{ .Token }}">Restablecer Contraseña</a></p>

<p>O copia y pega esta URL en tu navegador:</p>
<p>https://www.directoriosena.com/auth/reset-password?token={{ .Token }}</p>

<p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo.</p>

<p>Este enlace expirará en 1 hora.</p>

<p>Saludos,<br>
Equipo de Directorio SENA</p>
```

### 4. Plantilla de Email de Confirmación

Ve a **Authentication → Email Templates → Confirm Signup**

Actualiza la plantilla para confirmar el email:

```html
<h2>Confirma tu correo electrónico</h2>

<p>Hola,</p>

<p>¡Gracias por registrarte en Directorio SENA!</p>

<p>Haz clic en el siguiente enlace para confirmar tu correo electrónico:</p>

<p><a href="https://www.directoriosena.com/auth/callback?token={{ .Token }}&type=signup">Confirmar Email</a></p>

<p>O copia y pega esta URL en tu navegador:</p>
<p>https://www.directoriosena.com/auth/callback?token={{ .Token }}&type=signup</p>

<p>Si no creaste esta cuenta, puedes ignorar este correo.</p>

<p>Saludos,<br>
Equipo de Directorio SENA</p>
```

## 🔧 Funcionalidades Implementadas

### 1. Recuperación de Contraseña
- ✅ Link "¿Olvidaste tu contraseña?" en página de login
- ✅ Formulario para solicitar recuperación
- ✅ Envío de email con instrucciones
- ✅ Página de restablecimiento de contraseña
- ✅ Validación de contraseñas (mínimo 6 caracteres)
- ✅ Confirmación de contraseñas
- ✅ Redirección automática después de cambiar contraseña

### 2. Confirmación de Email
- ✅ Email de confirmación al registrarse
- ✅ Callback automático después de confirmar
- ✅ Redirección al flujo de creación de empresa

### 3. URLs Configuradas
- ✅ Registro: `https://www.directoriosena.com/auth/callback`
- ✅ Reset: `https://www.directoriosena.com/auth/reset-password`
- ✅ Callback maneja ambos tipos (signup y recovery)

## 🔐 Flujo de Recuperación de Contraseña

1. Usuario hace clic en "¿Olvidaste tu contraseña?" en `/auth`
2. Ingresa su email y recibe un correo con el link de recuperación
3. Link redirige a `/auth/reset-password` con token de sesión
4. Usuario ingresa nueva contraseña (con confirmación)
5. Contraseña se actualiza en Supabase
6. Redirección automática a `/auth` para iniciar sesión

## 🔗 Flujo de Confirmación de Email

1. Usuario se registra en `/auth`
2. Recibe email de confirmación con link
3. Link redirige a `/auth/callback` con código de confirmación
4. Callback verifica si usuario tiene empresa:
   - **SÍ tiene empresa:** Redirige a `/admin`
   - **NO tiene empresa:** Redirige a `/company-name`

## ⚠️ Notas Importantes

1. **Dominio en Producción:** Asegúrate de que todas las URLs usen `https://www.directoriosena.com/`
2. **Variables de Entorno:** Verifica que `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` estén configuradas
3. **CORS:** Supabase debe tener tu dominio en la lista blanca
4. **SSL:** El dominio debe tener certificado SSL válido (https)

## 📝 Archivos Modificados

- `components/inicio_sesion/login-register.tsx` - Formulario de recuperación
- `app/auth/reset-password/page.tsx` - Nueva página de reset
- `app/auth/callback/route.ts` - Manejo de callbacks mejorado

## 🧪 Pruebas

1. **Probar Recuperación:**
   - Ir a `/auth`
   - Click en "¿Olvidaste tu contraseña?"
   - Ingresar email
   - Revisar correo electrónico
   - Seguir link y cambiar contraseña

2. **Probar Registro:**
   - Registrar nuevo usuario
   - Confirmar email
   - Verificar redirección correcta

## 🐛 Solución de Problemas

**Error: "Email not confirmed"**
- Asegúrate de confirmar el email desde el correo recibido

**Error: "Invalid redirect URL"**
- Verifica que la URL esté en la lista de Redirect URLs en Supabase

**No llega el correo:**
- Revisa la carpeta de spam
- Verifica configuración SMTP en Supabase
- Chequea los logs en Supabase Dashboard

**Link de reset expira:**
- Los links expiran en 1 hora
- Solicita uno nuevo si expiró
