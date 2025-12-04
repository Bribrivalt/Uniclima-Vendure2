# 📋 TODO Frontend - Uniclima Vendure

**Desarrollador:** Frontend
**Última actualización:** 04/12/2025

> 🔗 = Punto de confluencia con Backend (necesitas datos del backend)

---

## ✅ COMPLETADO

### Fase 1: Configuración Base
- [x] Next.js 14.2 configurado
- [x] Apollo Client configurado
- [x] TypeScript configurado
- [x] CSS Modules configurado

### Fase 2: Sistema de Diseño
- [x] Design Tokens (tokens.css)
- [x] Tema default
- [x] Variables CSS (colores, tipografía, espaciados)

### Fase 3: Componentes Core
- [x] Button (variantes: primary, secondary, outline, ghost)
- [x] Input (tipos: text, email, password, number)
- [x] Card
- [x] Alert
- [x] Modal
- [x] Dropdown
- [x] Tabs
- [x] Skeleton/Loading
- [x] Toast (notificaciones)

### Fase 4: Componentes de Producto
- [x] ProductCard (con specs HVAC: clase energética, potencia, WiFi)
- [x] ProductSearch
- [x] ProductSort
- [x] ProductPagination
- [x] ProductFilters (con facets dinámicos de Vendure)
- [x] ProductButton (compra directa / solicitar presupuesto)
- [x] QuoteModal

### Fase 5: Componentes de Carrito
- [x] CartItem (con enlace a producto, variantes)
- [x] CartSummary

### Fase 6: Componentes de Checkout
- [x] CheckoutSteps
- [x] ShippingForm
- [x] OrderSummary

### Fase 7: Componentes de Auth
- [x] ProtectedRoute

### Fase 8: Layout
- [x] Header (con dropdown de categorías desde Collections)
- [x] Footer
- [x] TopBar

### Fase 9: Páginas Básicas
- [x] Home (/)
- [x] Login (/login)
- [x] Registro (/registro)
- [x] Cuenta (/cuenta)
- [x] Carrito (/carrito)
- [x] Checkout (/checkout)
- [x] Contacto (/contacto)

### Fase 10: Páginas Legales
- [x] Privacidad (/privacidad)
- [x] Términos (/terminos)
- [x] Cookies (/cookies)

### Fase 11: Integración GraphQL
- [x] Queries de auth
- [x] Queries de cart (GET_ACTIVE_ORDER)
- [x] Queries de products (GET_PRODUCTS, GET_PRODUCT_BY_SLUG, GET_FACETS, GET_COLLECTIONS) 🔗
- [x] Mutations de auth
- [x] Mutations de cart (ADD_ITEM_TO_ORDER, ADJUST_ORDER_LINE, REMOVE_ORDER_LINE)
- [x] Mutations de order

### Fase 12: Hooks y Utilidades
- [x] useMediaQuery
- [x] useFocusTrap
- [x] Metadata SEO utils

### Fase 13: Catálogo de Productos 🔗
- [x] Página catálogo (/productos) con datos reales de Vendure
- [x] Detalle de producto (/productos/[slug]) con todos los custom fields
- [x] Mostrar Custom Fields HVAC (specs técnicas completas)
- [x] Filtros por Facets funcionando (dinámicos desde Vendure)
- [x] Navegación por Collections (dropdown en Header)
- [x] Botón de filtros para móvil con drawer

### Fase 14: Funcionalidad de Carrito 🔗
- [x] Añadir al carrito funcional (desde ProductCard y detalle)
- [x] Modificar cantidades (página /carrito)
- [x] Eliminar del carrito (página /carrito)
- [x] Contador en Header (usando GET_ACTIVE_ORDER)
- [ ] MiniCart drawer opcional
- [ ] Persistencia de sesión (cookies/tokens)

---

## 📝 PENDIENTE

### Fase 15: Checkout Completo 🔗
| Tarea | Prioridad | Dependencia Backend |
|-------|-----------|---------------------|
| Formulario de dirección funcional | Alta | - |
| Selector de método de envío | Alta | Envíos configurados ✅ |
| Integración Stripe | Alta | Stripe configurado (pendiente) |
| Página de confirmación | Alta | - |

### Fase 16: Área de Cliente
| Tarea | Prioridad |
|-------|-----------|
| Historial de pedidos | Media |
| Detalle de pedido | Media |
| Libro de direcciones | Media |
| Editar perfil | Baja |
| Cambiar contraseña | Baja |

### Fase 17: Mejoras de Catálogo
| Tarea | Prioridad |
|-------|-----------|
| Galería de imágenes con zoom | Media |
| Productos relacionados | Baja |
| Vistos recientemente | Baja |
| Comparador de productos | Baja |

### Fase 18: Home Page
| Tarea | Prioridad |
|-------|-----------|
| Hero banner | Media |
| Categorías destacadas | Media |
| Productos destacados | Media |
| Marcas carousel | Baja |

### Fase 19: Búsqueda
| Tarea | Prioridad |
|-------|-----------|
| Búsqueda con sugerencias | Media |
| Página de resultados | Media |
| Filtros en resultados | Media |

### Fase 20: SEO y Performance
| Tarea | Prioridad |
|-------|-----------|
| Meta tags dinámicos | Alta |
| Sitemap.xml | Media |
| robots.txt | Media |
| Lazy loading imágenes | Media |
| ISR para productos | Media |

### Fase 21: Accesibilidad
| Tarea | Prioridad |
|-------|-----------|
| ARIA labels completos | Media |
| Navegación por teclado | Media |
| Contraste WCAG AA | Media |
| Skip to content | Baja |

---

## 🔗 PUNTOS DE CONFLUENCIA CON BACKEND

### Datos que Ya Tienes Disponibles
| Item | Estado | Cómo usarlo |
|------|--------|-------------|
| Custom Fields HVAC | ✅ Backend listo | `product.customFields.potenciaKw` |
| Facets | ✅ Backend listo | Query `GET_FACETS` para filtros |
| Collections | ✅ Backend listo | Query `GET_COLLECTIONS` para menú |
| Métodos de envío | ✅ Backend listo | Query `eligibleShippingMethods` |
| Productos ejemplo | ✅ Backend listo | Query `GET_PRODUCTS` |

### Datos que Necesitas Esperar
| Item | Estado Backend | Impacto en Frontend |
|------|----------------|---------------------|
| Más productos | 🔄 En progreso | Más contenido para mostrar |
| Stripe configurado | ⏳ Pendiente | No puedes hacer pagos reales |
| Imágenes reales | 🔄 En progreso | Mejor presentación visual |

---

## 📊 PRIORIDADES SEMANALES

### Esta Semana
1. Conectar catálogo con datos reales del backend 🔗
2. Mostrar custom fields HVAC en detalle de producto
3. Implementar filtros por facets
4. Carrito funcional (añadir, modificar, eliminar)

### Próxima Semana
1. Checkout completo (hasta pago dummy)
2. Área de cliente básica
3. Persistencia de sesión

### Antes de Producción
1. Integrar Stripe cuando backend lo tenga listo 🔗
2. SEO completo
3. Testing E2E del flujo de compra

---

## 🛠️ QUERIES GRAPHQL QUE NECESITAS

### Productos
```graphql
query GetProducts($take: Int, $skip: Int) {
  products(options: { take: $take, skip: $skip }) {
    items {
      id
      name
      slug
      description
      featuredAsset { preview }
      variants {
        id
        priceWithTax
        sku
      }
      customFields {
        potenciaKw
        frigorias
        claseEnergetica
        refrigerante
        wifi
      }
      facetValues {
        name
        facet { name }
      }
    }
    totalItems
  }
}
```

### Collections (Categorías)
```graphql
query GetCollections {
  collections {
    items {
      id
      name
      slug
      parent { id name }
      children { id name slug }
    }
  }
}
```

### Métodos de Envío
```graphql
query GetShippingMethods {
  eligibleShippingMethods {
    id
    name
    price
    priceWithTax
  }
}
```

---

## 📞 COMUNICACIÓN CON BACKEND

Cuando necesites datos que no están disponibles:
1. Revisa si el backend ya lo tiene implementado (TODO_BACKEND.md)
2. Si está completado, pregunta el formato del query GraphQL
3. Si no está implementado, coordina prioridades con el desarrollador backend

---

## ⚠️ NOTAS IMPORTANTES

- **NO modificar** archivos del backend
- Usar siempre CSS Modules para estilos
- Mantener consistencia con design tokens
- Todos los textos visibles en español
- Mobile-first en todos los componentes

---

*Última actualización: 03/12/2025*