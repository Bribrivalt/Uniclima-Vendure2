# 📋 TODO Backend - Uniclima Vendure

**Desarrollador:** Backend  
**Última actualización:** 03/12/2025

> 🔗 = Punto de confluencia con Frontend (sincronizar antes de continuar)

---

## ✅ COMPLETADO

### Fase 1: Configuración Base
- [x] Instalar Vendure 3.5.1
- [x] Configurar PostgreSQL
- [x] Configurar Docker Compose
- [x] Dashboard Admin funcionando

### Fase 2: Datos del Producto
- [x] Custom Fields HVAC (19 campos) 🔗
- [x] Facets (6 facets, 39 valores) 🔗
- [x] Collections (42 categorías) 🔗

### Fase 3: E-commerce
- [x] Zona España configurada
- [x] IVA 21% configurado
- [x] Métodos de envío (4 métodos) 🔗
- [x] Dummy Payment configurado

### Fase 4: Productos
- [x] 9 productos HVAC de ejemplo 🔗
- [x] Facets asignados a productos
- [x] Imágenes de productos (parcial)

### Fase 5: Emails
- [x] Email Plugin configurado
- [x] Remitente: "Uniclima Solutions"
- [x] URLs de frontend configuradas

---

## 🔄 EN PROGRESO

### Fase 6: Completar Productos
- [ ] Subir imágenes reales de productos
- [ ] Crear 10-20 productos adicionales 🔗
- [ ] Verificar precios y stock
- [ ] Configurar filtros automáticos en Collections

### Fase 6.5: Enriquecimiento con IA (POC Completada ✅)
- [x] Script de enriquecimiento con Claude AI
- [x] Generación automática de descripciones, categorías, custom fields
- [ ] Integrar con importación masiva desde WooCommerce
- [ ] Escalar a +3000 productos del catálogo

---

## 📝 PENDIENTE

### Fase 7: Configuración Avanzada
| Tarea | Prioridad | Notas |
|-------|-----------|-------|
| Envío gratuito condicional (>1000€) | Alta | Ya existe el método, configurar regla |
| Zonas Baleares/Canarias | Media | Precios especiales |
| Restricciones de envío por producto | Media | Equipos pesados |

### Fase 8: Pagos Reales 🔗
| Tarea | Prioridad | Dependencia |
|-------|-----------|-------------|
| Integrar Stripe | Alta | Claves API de producción |
| Integrar PayPal | Media | Cuenta PayPal Business |
| Integrar Redsys | Baja | Contrato con banco |
| Pago por transferencia | Media | Datos bancarios |

### Fase 9: Emails Producción
| Tarea | Prioridad | Notas |
|-------|-----------|-------|
| Configurar SMTP real | Alta | SendGrid/AWS SES |
| Personalizar plantillas español | Media | |
| Añadir logo Uniclima | Baja | |
| Email carrito abandonado | Baja | |

### Fase 10: Seguridad y Performance
| Tarea | Prioridad |
|-------|-----------|
| Configurar HTTPS/SSL | Alta |
| Rate limiting | Media |
| Backups automáticos BD | Alta |
| Caché con Redis | Media |
| CDN para imágenes | Media |

### Fase 11: Deployment
| Tarea | Prioridad |
|-------|-----------|
| Dockerfile producción | Alta |
| Docker Compose producción | Alta |
| CI/CD GitHub Actions | Media |
| Health checks | Media |
| Monitorización | Media |

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

### Pendientes
| Item | Estado | Frontend necesita | Cuándo |
|------|--------|-------------------|--------|
| Más productos | 🔄 | Más datos para mostrar | Semana actual |
| Stripe configurado | ⏳ | Formulario de pago real | Antes de producción |
| SMTP configurado | ⏳ | Emails reales a clientes | Antes de producción |

---

## 📊 PRIORIDADES SEMANALES

### Esta Semana
1. ~~Métodos de envío~~ ✅
2. ~~Productos HVAC~~ ✅
3. ~~POC Enriquecimiento con IA~~ ✅
4. Subir imágenes reales (pendiente de catálogo)
5. Verificar que frontend puede consumir datos

### Próxima Semana
1. Configurar filtros automáticos en Collections
2. Crear más productos
3. Preparar Stripe (sandbox)

### Antes de Producción
1. Stripe producción
2. SMTP producción
3. SSL/HTTPS
4. Backups

---

## 🛠️ SCRIPTS DISPONIBLES

```bash
cd backend

# Ejecutar seeds
npx tsx scripts/seed-tax-config.ts
npx tsx scripts/seed-facets.ts
npx tsx scripts/seed-collections.ts
npx tsx scripts/seed-shipping-methods.ts
npx tsx scripts/seed-products-hvac.ts

# Utilidades
npx tsx scripts/cleanup-duplicate-facets.ts
npx tsx scripts/update-product-images.ts

# Enriquecimiento con IA (requiere ANTHROPIC_API_KEY en .env)
npx tsx scripts/enrich-products-ai.ts
```

---

## 📞 COMUNICACIÓN CON FRONTEND

Cuando completes una tarea marcada con 🔗:
1. Notifica al desarrollador frontend
2. Proporciona ejemplos de queries GraphQL si es necesario
3. Verifica que los datos se muestran correctamente en el frontend

---

*Última actualización: 03/12/2025*