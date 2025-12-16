# 📋 TODO Backend - Uniclima Vendure

**Desarrollador:** Backend  
**Última actualización:** 16/12/2025

> 🔗 = Punto de confluencia con Frontend (sincronizar antes de continuar)

---

## ✅ COMPLETADO

### Fase 1: Configuración Base
- [x] Instalar Vendure 3.5.1
- [x] Configurar PostgreSQL
- [x] Configurar Docker Compose (desarrollo)
- [x] Dashboard Admin funcionando
- [x] GraphiQL Plugin habilitado

### Fase 2: Datos del Producto
- [x] Custom Fields HVAC (compatibilidades, erroresSintomas) 🔗
- [x] Facets (6 facets, 39 valores) 🔗
- [x] Collections (42 categorías) 🔗

### Fase 3: E-commerce
- [x] Zona España configurada
- [x] IVA 21% configurado
- [x] Métodos de envío (4 métodos) 🔗
  - Envío Estándar: 50€
  - Envío Express: 100€
  - Recogida en Tienda: Gratis
  - Envío Gratis: pedidos > 1.000€
- [x] Dummy Payment configurado (desarrollo)

### Fase 4: Productos
- [x] Productos HVAC de ejemplo 🔗
- [x] Script seed-products-hvac.ts creado
- [x] Facets asignados a productos

### Fase 5: Email (Parcial)
- [x] Email Plugin configurado
- [x] Remitente: "Uniclima Solutions" <pedidos@uniclimasolutions.com>
- [x] URLs de frontend configuradas
- [x] SMTP Google Workspace configurado en .env
- [x] Script test-email-smtp.ts para pruebas

---

## 🔴 CRÍTICO - PENDIENTE PARA PRODUCCIÓN

### 1. 💳 Integración Stripe (PRIORIDAD ALTA)
El paquete `@vendure/payments-plugin` está instalado pero **NO está activado**.

**Estado actual:**
- ❌ `stripePaymentMethodHandler` está COMENTADO en [`vendure-config.ts`](../../backend/src/vendure-config.ts:16)
- ✅ Frontend tiene mutations preparadas ([`stripe.ts`](../../frontend/lib/vendure/mutations/stripe.ts))
- ✅ Frontend tiene config de Stripe Elements ([`config.ts`](../../frontend/lib/stripe/config.ts))

**Tareas pendientes:**
| Tarea | Prioridad | Estado |
|-------|-----------|--------|
| Descomentar y configurar stripePaymentMethodHandler | Alta | ⏳ |
| Configurar STRIPE_SECRET_KEY en .env | Alta | ⏳ |
| Crear método de pago "Stripe" en Dashboard | Alta | ⏳ |
| Configurar webhook endpoint | Alta | ⏳ |
| Probar flujo de pago completo | Alta | ⏳ |

### 2. 📧 Plantillas de Email (PRIORIDAD MEDIA)
**Estado actual:**
- ❌ Directorio `static/email/templates/` está VACÍO
- ✅ Email Plugin usa plantillas por defecto de Vendure

**Tareas pendientes:**
| Tarea | Prioridad | Estado |
|-------|-----------|--------|
| Crear plantilla order-confirmation | Media | ⏳ |
| Crear plantilla email-verification | Media | ⏳ |
| Crear plantilla password-reset | Media | ⏳ |
| Crear plantilla email-address-change | Media | ⏳ |
| Personalizar con logo/branding Uniclima | Baja | ⏳ |

### 3. 🐳 Deployment Producción (PRIORIDAD ALTA)
**Estado actual:**
- ❌ No existe docker-compose.production.yml
- ❌ No hay Dockerfile de producción
- ❌ No hay configuración CI/CD

**Tareas pendientes:**
| Tarea | Prioridad | Estado |
|-------|-----------|--------|
| Crear Dockerfile producción | Alta | ⏳ |
| Crear docker-compose.production.yml | Alta | ⏳ |
| Configurar variables entorno producción | Alta | ⏳ |
| Configurar SSL/HTTPS | Alta | ⏳ |
| Configurar backups automáticos BD | Alta | ⏳ |
| Configurar CI/CD (GitHub Actions) | Media | ⏳ |
| Configurar CDN para assets | Media | ⏳ |
| Health checks | Media | ⏳ |

---

## 📝 PENDIENTE - MEJORAS

### Fase 6: Más Productos
| Tarea | Prioridad | Notas |
|-------|-----------|-------|
| Subir imágenes reales de productos | Media | Desde Dashboard |
| Crear 20-30 productos adicionales | Media | Usar script import-products-excel.ts |
| Verificar precios y stock | Baja | Script verify-prices-stock.ts |

### Fase 7: Configuración Avanzada
| Tarea | Prioridad | Notas |
|-------|-----------|-------|
| Zonas Baleares/Canarias | Baja | Precios especiales de envío |
| Restricciones de envío por producto | Baja | Equipos pesados |
| Pago por transferencia | Baja | Método adicional |

---

## 🛠️ SCRIPTS DISPONIBLES

```bash
cd Uniclima-Vendure2/backend

# Configuración inicial
npx tsx scripts/seed-tax-config.ts      # ✅ Zona España + IVA 21%
npx tsx scripts/seed-countries.ts       # Países disponibles
npx tsx scripts/seed-facets.ts          # ✅ Facets de productos
npx tsx scripts/seed-collections.ts     # ✅ Categorías
npx tsx scripts/seed-shipping-methods.ts # ✅ Métodos de envío

# Productos
npx tsx scripts/seed-products-hvac.ts   # Productos ejemplo
npx tsx scripts/import-products-excel.ts # Importar desde Excel
npx tsx scripts/verify-prices-stock.ts  # Verificar precios

# Utilidades
npx tsx scripts/cleanup-duplicate-facets.ts
npx tsx scripts/assign-facets-to-products.ts
npx tsx scripts/assign-placeholder-images.ts
npx tsx scripts/enable-all-products.ts
npx tsx scripts/reset-products.ts

# Email
npx tsx scripts/test-email-smtp.ts [email] # Probar SMTP
```

---

## 📊 ARQUITECTURA ACTUAL

```
backend/
├── src/
│   ├── vendure-config.ts    # Configuración principal
│   ├── index.ts             # Entry point servidor
│   ├── index-worker.ts      # Entry point worker
│   └── gql/                  # Tipos GraphQL generados
├── scripts/                  # Scripts de seed/utilidad (17)
├── static/
│   ├── assets/              # Imágenes subidas
│   └── email/
│       ├── templates/       # 📧 VACÍO - crear plantillas
│       └── test-emails/     # Emails de desarrollo
└── .env                      # Variables de entorno
```

---

## 🔗 PUNTOS DE CONFLUENCIA CON FRONTEND

### Ya Completados
| Item | Estado | Frontend necesita |
|------|--------|-------------------|
| Custom Fields HVAC | ✅ | Mostrar specs en detalle producto |
| Facets | ✅ | Filtros en catálogo |
| Collections | ✅ | Navegación por categorías |
| Métodos de envío | ✅ | Selector en checkout |
| Productos ejemplo | ✅ | Datos para desarrollo |

### Pendientes de Backend
| Item | Estado | Frontend necesita | Cuándo |
|------|--------|-------------------|--------|
| Stripe habilitado | ⏳ | Procesar pagos reales | CRÍTICO |
| Más productos | ⏳ | Más datos para mostrar | Antes de producción |
| Plantillas email | ⏳ | N/A (backend only) | Antes de producción |

---

## 🚀 PRÓXIMOS PASOS RECOMENDADOS

### Inmediato (Esta semana)
1. **Habilitar Stripe** - Descomentar handler y configurar
2. **Probar flujo de pago** - Crear pedido completo de prueba
3. **Verificar emails** - Ejecutar test-email-smtp.ts

### Antes de Producción
1. Crear docker-compose.production.yml
2. Configurar SSL/HTTPS
3. Configurar backups de BD
4. Crear plantillas de email personalizadas

---

*Última actualización: 16/12/2025*