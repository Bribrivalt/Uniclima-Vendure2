# 📧 Personalización de Emails - Uniclima

**Fecha**: 1 de diciembre de 2024  
**Archivo modificado**: `backend/src/vendure-config.ts`

---

## ✅ Cambios Realizados

### Configuración Anterior (Genérica)
```typescript
fromAddress: '"example" <noreply@example.com>',
verifyEmailAddressUrl: 'http://localhost:8080/verify',
passwordResetUrl: 'http://localhost:8080/password-reset',
changeEmailAddressUrl: 'http://localhost:8080/verify-email-address-change'
```

### Configuración Nueva (Uniclima)
```typescript
fromAddress: '"Uniclima Solutions" <pedidos@uniclima.es>',
verifyEmailAddressUrl: 'http://localhost:3000/cuenta/verificar-email',
passwordResetUrl: 'http://localhost:3000/cuenta/resetear-password',
changeEmailAddressUrl: 'http://localhost:3000/cuenta/cambiar-email'
```

---

## 📊 Detalles de los Cambios

### 1. Remitente del Email
**Antes**: `"example" <noreply@example.com>`  
**Ahora**: `"Uniclima Solutions" <pedidos@uniclima.es>`

**Beneficio**: Los clientes verán emails profesionales de "Uniclima Solutions" en lugar de "example"

### 2. URLs del Frontend

Actualizadas para apuntar al frontend de Next.js (puerto 3000):

| Tipo de Email | URL Anterior | URL Nueva |
|---------------|--------------|-----------|
| Verificación de email | `localhost:8080/verify` | `localhost:3000/cuenta/verificar-email` |
| Reseteo de contraseña | `localhost:8080/password-reset` | `localhost:3000/cuenta/resetear-password` |
| Cambio de email | `localhost:8080/verify-email-address-change` | `localhost:3000/cuenta/cambiar-email` |

**Beneficio**: Los links en los emails apuntarán correctamente al frontend de Uniclima

---

## 📧 Tipos de Emails que se Envían

Vendure envía automáticamente estos emails:

### 1. Email de Bienvenida
- **Cuándo**: Al registrarse un nuevo cliente
- **Contenido**: Link de verificación de email
- **Link**: `http://localhost:3000/cuenta/verificar-email?token=...`

### 2. Confirmación de Pedido
- **Cuándo**: Al completar una compra
- **Contenido**: 
  - Número de pedido
  - Productos comprados
  - Total pagado
  - Dirección de envío
  - Método de envío seleccionado

### 3. Actualización de Estado del Pedido
- **Cuándo**: Cuando cambia el estado (ej: enviado, entregado)
- **Contenido**: Nuevo estado del pedido

### 4. Reseteo de Contraseña
- **Cuándo**: Cliente solicita resetear contraseña
- **Contenido**: Link para crear nueva contraseña
- **Link**: `http://localhost:3000/cuenta/resetear-password?token=...`

### 5. Cambio de Email
- **Cuándo**: Cliente cambia su email
- **Contenido**: Link de verificación del nuevo email
- **Link**: `http://localhost:3000/cuenta/cambiar-email?token=...`

---

## 🧪 Cómo Probar los Emails

### En Desarrollo (Actual)

Los emails se guardan como archivos HTML en lugar de enviarse:

1. Ir a http://localhost:3001/mailbox
2. Ver todos los emails generados
3. Click en cualquier email para ver el HTML completo

### Ejemplo de Prueba

1. Crear un pedido (usando GraphQL o frontend)
2. Ir a http://localhost:3001/mailbox
3. Deberías ver un email de "Confirmación de pedido"
4. El remitente será: **Uniclima Solutions <pedidos@uniclima.es>**

---

## 🚀 Para Producción

### Paso 1: Configurar SMTP Real

Editar `backend/src/vendure-config.ts`:

```typescript
EmailPlugin.init({
    devMode: false,  // ← Cambiar a false
    transport: {
        type: 'smtp',
        host: 'smtp.gmail.com',  // O tu proveedor SMTP
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    },
    // ... resto de configuración
})
```

### Paso 2: Añadir Variables de Entorno

Crear archivo `backend/.env`:

```bash
SMTP_USER=pedidos@uniclima.es
SMTP_PASSWORD=tu_password_smtp
```

### Paso 3: Actualizar URLs a Producción

Cambiar en `globalTemplateVars`:

```typescript
fromAddress: '"Uniclima Solutions" <pedidos@uniclima.es>',
verifyEmailAddressUrl: 'https://uniclima.es/cuenta/verificar-email',
passwordResetUrl: 'https://uniclima.es/cuenta/resetear-password',
changeEmailAddressUrl: 'https://uniclima.es/cuenta/cambiar-email'
```

---

## 📋 Proveedores SMTP Recomendados

### Opción 1: Gmail (Gratis, límite 500/día)
```typescript
host: 'smtp.gmail.com',
port: 587,
```

### Opción 2: SendGrid (Gratis hasta 100/día)
```typescript
host: 'smtp.sendgrid.net',
port: 587,
```

### Opción 3: Mailgun (Gratis hasta 5000/mes)
```typescript
host: 'smtp.mailgun.org',
port: 587,
```

### Opción 4: Amazon SES (Muy barato)
```typescript
host: 'email-smtp.eu-west-1.amazonaws.com',
port: 587,
```

---

## ✅ Checklist de Emails

- [x] Remitente personalizado (Uniclima Solutions)
- [x] URLs del frontend actualizadas (localhost:3000)
- [x] Mailbox funcionando para desarrollo
- [ ] Configurar SMTP para producción
- [ ] Actualizar URLs a dominio real (uniclima.es)
- [ ] Personalizar templates HTML (opcional)
- [ ] Añadir logo de Uniclima (opcional)

---

## 🎨 Personalización Avanzada (Opcional)

### Añadir Logo de Uniclima

1. Subir logo a `backend/static/email/images/logo.png`
2. Editar templates en `backend/static/email/templates/`
3. Añadir en `globalTemplateVars`:
   ```typescript
   logoUrl: 'http://localhost:3001/assets/email/logo.png'
   ```

### Personalizar Colores

Añadir en `globalTemplateVars`:
```typescript
primaryColor: '#0066CC',  // Azul Uniclima
secondaryColor: '#FF6600',  // Naranja Uniclima
```

---

## 📊 Resumen

**Estado Actual**:
- ✅ Emails personalizados con nombre "Uniclima Solutions"
- ✅ URLs correctas del frontend (localhost:3000)
- ✅ Mailbox funcionando para testing
- ✅ Listo para desarrollo

**Para Producción**:
- ⏳ Configurar SMTP real
- ⏳ Actualizar URLs a dominio real
- ⏳ Opcional: Personalizar templates HTML

---

¡Los emails ahora se ven profesionales y tienen la información correcta de Uniclima! 🎉
