# Configuración del Sistema de Correos con Markdown

## Descripción
El componente `ContactRichEditor` ahora soporta el envío de correos electrónicos con el contenido convertido automáticamente a formato Markdown (.md). El sistema incluye validación de contenido, conversión HTML a Markdown y envío como archivo adjunto.

## Características Implementadas

### 1. Conversión HTML a Markdown
- **Encabezados**: `<h1>`, `<h2>`, `<h3>` → `#`, `##`, `###`
- **Formato de texto**: `<strong>`, `<b>` → `**texto**`
- **Cursiva**: `<em>`, `<i>` → `*texto*`
- **Subrayado**: `<u>` → `<u>texto</u>` (HTML preservado)
- **Listas**: `<ul>`, `<ol>`, `<li>` → formato Markdown
- **Citas**: `<blockquote>` → `> texto`
- **Código**: `<code>` → `` `código` ``
- **Enlaces**: `<a href="url">texto</a>` → `[texto](url)`

### 2. Validación de Contenido
- **Contenido vacío**: Verificación de contenido mínimo
- **Longitud**: Mínimo 10 caracteres, máximo 10,000
- **Seguridad**: Filtrado de scripts y contenido malicioso
- **Formato**: Limpieza de HTML y normalización de espacios

### 3. API Endpoint
- **Ruta**: `/api/send-email`
- **Método**: POST
- **Formato**: JSON con contenido Markdown
- **Adjunto**: Archivo `.md` automático
- **Plantilla**: Email HTML con diseño profesional

## Configuración Requerida

### Variables de Entorno (.env.local)
```env
# Configuración SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicación
SMTP_FROM=tu-email@gmail.com
```

### Para Gmail:
1. Habilitar autenticación de 2 factores
2. Generar una contraseña de aplicación
3. Usar la contraseña de aplicación como `SMTP_PASS`

### Para otros proveedores:
- **Outlook**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Personalizado**: Configurar según el proveedor

## Estructura del Email Enviado

### Contenido HTML
- Diseño profesional con colores del SENA
- Contenido convertido de Markdown a HTML
- Información de metadatos

### Archivo Adjunto
- **Nombre**: `mensaje.md`
- **Tipo**: `text/markdown`
- **Contenido**: Texto original convertido a Markdown

## Flujo de Funcionamiento

1. **Usuario escribe** contenido en el editor rich text
2. **Sistema convierte** HTML a Markdown automáticamente
3. **Validación** del contenido antes del envío
4. **API procesa** la solicitud y prepara el email
5. **Envío** con contenido HTML y archivo .md adjunto
6. **Confirmación** visual al usuario

## Dependencias Instaladas
```json
{
  "nodemailer": "^7.0.6",
  "@types/nodemailer": "^7.0.1"
}
```

## Archivos Modificados/Creados

### Componentes
- `components/contact-rich-editor.tsx` - Funcionalidad principal
- `app/api/send-email/route.ts` - API endpoint

### Configuración
- `.env.local` - Variables de entorno
- `README-email-setup.md` - Esta documentación

## Pruebas Recomendadas

1. **Contenido básico**: Texto simple sin formato
2. **Formato rico**: Encabezados, negritas, cursivas, listas
3. **Enlaces**: Verificar conversión correcta
4. **Validación**: Probar límites de caracteres
5. **Errores**: Simular fallos de SMTP

## Seguridad

- Validación de entrada contra XSS
- Filtrado de contenido malicioso
- Límites de longitud de contenido
- Variables de entorno para credenciales
- Manejo seguro de errores

## Notas Técnicas

- El sistema preserva el formato visual en HTML
- El archivo Markdown mantiene la estructura semántica
- Compatible con lectores de Markdown estándar
- Optimizado para rendimiento con validación previa