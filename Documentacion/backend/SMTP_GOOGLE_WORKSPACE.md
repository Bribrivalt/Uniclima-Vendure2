# 📧 Configuración SMTP con Google Workspace

## Descripción

Este documento explica cómo configurar el envío de emails en Vendure usando Google Workspace (Gmail for Business).

## Configuración Actual

Actualmente el EmailPlugin está configurado en modo desarrollo (`devMode: true`), lo que significa que los emails se guardan como archivos HTML en:

```
backend/static/email/test-emails/
```

Para ver los emails en desarrollo, puedes acceder a:
- http://localhost:3001/mailbox (interfaz web de emails de prueba)

## Variables de Entorno para Producción

Añade estas variables a tu archivo `.env` o al entorno de producción:

```bash
# ═══════════════════════════════════════════════════════════════════════
# SMTP - Google Workspace
# ═══════════════════════════════════════════════════════════════════════

# Servidor SMTP de Google
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# Credenciales (usa una contraseña de aplicación, NO tu contraseña normal)
SMTP_USER=tu-email@tudominio.com
SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx

# Dirección "From" para los emails
SMTP_FROM_ADDRESS="Uniclima Solutions" <pedidos@uniclima.es>

# URL del frontend (para enlaces en emails)
FRONTEND_URL=https://uniclima.es
```

## Obtener Contraseña de Aplicación en Google

Google Workspace requiere usar "Contraseñas de aplicación" en lugar de tu contraseña normal:

### Paso 1: Habilitar Verificación en 2 Pasos
1. Ve a [Google Account Security](https://myaccount.google.com/security)
2. En "Inicio de sesión en Google", habilita "Verificación en 2 pasos"

### Paso 2: Generar Contraseña de Aplicación
1. En la misma página de seguridad, busca "Contraseñas de aplicación"
2. Selecciona "Otra (nombre personalizado)" y escribe "Vendure SMTP"
3. Haz clic en "Generar"
4. Copia la contraseña de 16 caracteres (formato: xxxx-xxxx-xxxx-xxxx)
5. Usa esta contraseña como `SMTP_PASSWORD`

## Configuración en vendure-config.ts para Producción

Para habilitar SMTP en producción, modifica el EmailPlugin en `backend/src/vendure-config.ts`:

```typescript
import { defaultEmailHandlers, EmailPlugin, FileBasedTemplateLoader } from '@vendure/email-plugin';

// En la sección de plugins:
EmailPlugin.init({
    // En producción, cambiar devMode a false
    devMode: process.env.APP_ENV === 'dev',
    outputPath: path.join(__dirname, '../static/email/test-emails'),
    route: 'mailbox',
    handlers: defaultEmailHandlers,
    templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../static/email/templates')),
    globalTemplateVars: {
        fromAddress: process.env.SMTP_FROM_ADDRESS || '"Uniclima Solutions" <pedidos@uniclima.es>',
        verifyEmailAddressUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cuenta/verificar-email`,
        passwordResetUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cuenta/resetear-password`,
        changeEmailAddressUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/cuenta/cambiar-email`
    },
    // Configuración SMTP para producción (cuando devMode: false)
    transport: {
        type: 'smtp',
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: +(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    },
}),
```

## Tipos de Emails que Envía Vendure

Los handlers por defecto (`defaultEmailHandlers`) envían:

| Evento | Descripción |
|--------|-------------|
| `order-confirmation` | Confirmación de pedido al cliente |
| `order-placed-notification` | Notificación de nuevo pedido (admin) |
| `email-verification` | Verificar email del cliente |
| `password-reset` | Resetear contraseña |
| `email-address-change` | Confirmar cambio de email |

## Personalizar Plantillas de Email

Las plantillas están en:
```
backend/static/email/templates/
```

Cada tipo de email tiene su propia carpeta con:
- `body.hbs` - Contenido HTML del email (Handlebars)
- `subject.hbs` - Asunto del email

## Probar Emails en Producción

1. Configura las variables de entorno
2. Cambia `APP_ENV=production` (o cualquier valor distinto de 'dev')
3. Reinicia Vendure
4. Crea un pedido de prueba o registra un usuario

## Troubleshooting

### Error: "Username and Password not accepted"
- Asegúrate de usar una Contraseña de Aplicación, no tu contraseña normal
- Verifica que la Verificación en 2 pasos esté habilitada

### Error: "ECONNREFUSED"
- Verifica que `SMTP_HOST` y `SMTP_PORT` sean correctos
- Asegúrate de que el firewall permite conexiones salientes al puerto 587

### Emails no llegan
- Revisa la carpeta de spam del destinatario
- Verifica que `SMTP_FROM_ADDRESS` use un dominio válido
- Considera configurar SPF y DKIM en tu dominio

## Alternativas a Google Workspace

Si prefieres usar otro servicio SMTP:

### SendGrid
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=tu-sendgrid-api-key
```

### AWS SES
```bash
SMTP_HOST=email-smtp.eu-west-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=tu-aws-access-key
SMTP_PASSWORD=tu-aws-secret-key
```

---

*Última actualización: 11/12/2025*