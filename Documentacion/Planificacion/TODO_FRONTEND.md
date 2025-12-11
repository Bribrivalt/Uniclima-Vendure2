# 📋 TODO Frontend - Uniclima Vendure

**Desarrollador:** Frontend
**Última actualización:** 11/12/2025 11:38

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
- [x] ProductSearch (con sugerencias en tiempo real)
- [x] ProductSort
- [x] ProductPagination
- [x] ProductFilters (con facets dinámicos de Vendure)
- [x] ProductButton (compra directa / solicitar presupuesto)
- [x] QuoteModal
- [x] ProductGallery (galería con zoom)
- [x] RelatedProducts (productos relacionados)
- [x] CompareButton (botón para añadir a comparación)

### Fase 5: Componentes de Carrito
- [x] CartItem (con enlace a producto, variantes)
- [x] CartSummary
- [x] CartDrawer (mini carrito)
- [x] CartEmpty

### Fase 6: Componentes de Checkout
- [x] CheckoutSteps
- [x] ShippingForm
- [x] AddressForm (con autocompletado y accesibilidad)
- [x] ShippingMethodSelector
- [x] PaymentMethodSelector
- [x] OrderSummary
- [x] OrderReview
- [x] StripePaymentForm (Stripe Elements integrado)

### Fase 7: Componentes de Auth
- [x] ProtectedRoute
- [x] LoginForm (con ARIA labels)
- [x] RegisterForm (con ARIA labels y validación)
- [x] ForgotPasswordForm
- [x] ProfileForm
- [x] AccountSidebar

### Fase 8: Layout
- [x] Header (con dropdown de categorías desde Collections, ARIA completo)
- [x] Footer (con ARIA labels y navegación accesible)
- [x] TopBar
- [x] MobileMenu (con focus trap y accesibilidad)

### Fase 9: Páginas Básicas
- [x] Home (/)
- [x] Login (/login)
- [x] Registro (/registro)
- [x] Cuenta (/cuenta)
- [x] Carrito (/carrito)
- [x] Checkout (/checkout)
- [x] Contacto (/contacto)
- [x] Conócenos (/conocenos)
- [x] Servicios (/servicios)
- [x] FAQ (/faq)

### Fase 10: Páginas Legales
- [x] Privacidad (/privacidad)
- [x] Términos (/terminos)
- [x] Cookies (/cookies)
- [x] Aviso Legal (/aviso-legal)
- [x] Devoluciones (/devoluciones)
- [x] Envíos (/envios)

### Fase 11: Integración GraphQL
- [x] Queries de auth (GET_ACTIVE_CUSTOMER, GET_CUSTOMER_ORDERS, GET_CUSTOMER_ADDRESSES)
- [x] Queries de cart (GET_ACTIVE_ORDER)
- [x] Queries de products (GET_PRODUCTS, GET_PRODUCT_BY_SLUG, GET_FACETS, GET_COLLECTIONS) 🔗
- [x] Mutations de auth (LOGIN, REGISTER, LOGOUT, UPDATE_CUSTOMER)
- [x] Mutations de cart (ADD_ITEM_TO_ORDER, ADJUST_ORDER_LINE, REMOVE_ORDER_LINE)
- [x] Mutations de order (SET_SHIPPING_ADDRESS, SET_BILLING_ADDRESS)
- [x] Mutations de addresses (CREATE_CUSTOMER_ADDRESS, UPDATE_CUSTOMER_ADDRESS, DELETE_CUSTOMER_ADDRESS)
- [x] Mutations de Stripe (CREATE_STRIPE_PAYMENT_INTENT, ADD_PAYMENT_TO_ORDER)

### Fase 12: Hooks y Utilidades
- [x] useMediaQuery
- [x] useFocusTrap
- [x] useRecentlyViewed (productos vistos recientemente en localStorage)
- [x] useCompare (comparador de productos en localStorage)
- [x] Metadata SEO utils (generateProductMetadata, generateCategoryMetadata, etc.)
- [x] Error handler utils

### Fase 13: Catálogo de Productos 🔗
- [x] Página catálogo (/productos) con datos reales de Vendure
- [x] Detalle de producto (/productos/[slug]) con todos los custom fields
- [x] Mostrar Custom Fields HVAC (specs técnicas completas)
- [x] Filtros por Facets funcionando (dinámicos desde Vendure)
- [x] Navegación por Collections (dropdown en Header)
- [x] Botón de filtros para móvil con drawer
- [x] Página de categoría (/categoria/[slug])

### Fase 14: Funcionalidad de Carrito 🔗
- [x] Añadir al carrito funcional (desde ProductCard y detalle)
- [x] Modificar cantidades (página /carrito)
- [x] Eliminar del carrito (página /carrito)
- [x] Contador en Header (usando GET_ACTIVE_ORDER)
- [x] MiniCart drawer (CartDrawer integrado en Header)
- [x] Persistencia de sesión (vendure-token en localStorage)

### Fase 15: Checkout Completo 🔗 ✅
- [x] Formulario de dirección funcional (validación completa)
- [x] Selector de método de envío (desde eligibleShippingMethods)
- [x] Página de confirmación del pedido
- [x] Integración Stripe Elements (StripePaymentForm)

### Fase 16: Área de Cliente ✅
- [x] Historial de pedidos (/cuenta/pedidos)
- [x] Detalle de pedido (/pedido/[code])
- [x] Libro de direcciones (/cuenta/direcciones) - Con GraphQL real
- [x] Editar perfil (/cuenta) - ProfileForm con actualización
- [x] Cambiar contraseña (/cuenta) - Integrado en ProfileForm

### Fase 17: Mejoras de Catálogo ✅
- [x] Galería de imágenes con zoom (ProductGallery)
- [x] Productos relacionados (RelatedProducts)
- [x] Vistos recientemente (RecentlyViewed con useRecentlyViewed)
- [x] Comparador de productos funcional (/comparar con useCompare)

### Fase 18: Home Page ✅
- [x] Hero banner (gradiente, stats, CTAs)
- [x] Categorías destacadas (desde Collections de Vendure)
- [x] Productos destacados (desde GET_PRODUCTS)
- [x] Sección de características/beneficios
- [x] Banner de marcas
- [x] CTA final con contacto

### Fase 19: Integración Stripe 🔗 ✅
- [x] Stripe Elements configurado (StripePaymentForm)
- [x] Página de procesamiento de pago (integrado en Checkout)
- [x] Manejo de errores de pago (mensajes en español)
- [x] Confirmación post-pago (/pedido/confirmacion)

### Fase 20: Búsqueda ✅
- [x] Búsqueda con sugerencias (ProductSearch con debounce)
- [x] Página de resultados (/buscar)
- [x] Filtros en resultados (ProductFilters reutilizado)

### Fase 21: SEO y Performance ✅
- [x] Meta tags dinámicos (generateProductMetadata, generateCategoryMetadata)
- [x] Sitemap.xml mejorado (con prioridades dinámicas, filtrado de productos)
- [x] robots.txt mejorado (con reglas para bots específicos)
- [x] Lazy loading imágenes (OptimizedImage component)
- [x] ISR para productos (revalidate: 60s en /productos/[slug])

### Fase 22: Accesibilidad ✅
- [x] ARIA labels completos (Header, Footer, Forms, Modals)
- [x] Navegación por teclado (useFocusTrap, escape handlers)
- [x] Skip to content (enlace en layout.tsx)
- [ ] Contraste WCAG AA (auditoría pendiente)

---

## 📝 PENDIENTE (MEJORAS OPCIONALES)

### Mejoras Futuras
| Tarea | Prioridad | Estado |
|-------|-----------|--------|
| Contraste WCAG AA audit | Baja | Opcional |
| Blog funcional | Baja | Opcional |
| PWA support | Baja | Opcional |

---

## 🔗 PUNTOS DE CONFLUENCIA CON BACKEND

### Datos que Ya Tienes Disponibles ✅
| Item | Estado | Cómo usarlo |
|------|--------|-------------|
| Custom Fields HVAC | ✅ Backend listo | `product.customFields.potenciaKw` |
| Facets | ✅ Backend listo | Query `GET_FACETS` para filtros |
| Collections | ✅ Backend listo | Query `GET_COLLECTIONS` para menú |
| Métodos de envío | ✅ Backend listo | Query `eligibleShippingMethods` |
| Productos ejemplo | ✅ Backend listo | Query `GET_PRODUCTS` |
| Customer Addresses | ✅ Backend listo | CRUD mutations para direcciones |
| Customer Orders | ✅ Backend listo | Query `GET_CUSTOMER_ORDERS` |

### Datos que Necesitas Esperar
| Item | Estado Backend | Impacto en Frontend |
|------|----------------|---------------------|
| Más productos | 🔄 En progreso | Más contenido para mostrar |
| Stripe configurado | ⏳ Pendiente | No puedes hacer pagos reales |
| Imágenes reales | 🔄 En progreso | Mejor presentación visual |

---

## 📊 RESUMEN DE PROGRESO

### ✅ PROYECTO FRONTEND COMPLETO

Todas las funcionalidades principales están implementadas:

- ✅ Configuración y Sistema de Diseño (Fases 1-2)
- ✅ Componentes Core y de Producto (Fases 3-4)
- ✅ Componentes de Carrito y Checkout (Fases 5-6)
- ✅ Componentes de Auth y Layout (Fases 7-8)
- ✅ Todas las Páginas (Fases 9-10)
- ✅ Integración GraphQL completa (Fase 11)
- ✅ Hooks y Utilidades (Fase 12)
- ✅ Catálogo funcional (Fase 13)
- ✅ Carrito funcional (Fase 14)
- ✅ Checkout completo con Stripe (Fase 15)
- ✅ Área de Cliente completa (Fase 16)
- ✅ Mejoras de Catálogo (Fase 17)
- ✅ Home Page (Fase 18)
- ✅ Integración Stripe (Fase 19)
- ✅ Búsqueda (Fase 20)
- ✅ SEO y Performance con ISR (Fase 21)
- ✅ Accesibilidad (Fase 22)

### 🎯 Funcionalidades Implementadas Recientemente:
- **Stripe Payment**: Integración completa con Stripe Elements
- **ISR**: Incremental Static Regeneration para productos (60s)
- **Vistos Recientemente**: Hook useRecentlyViewed con localStorage
- **Comparador**: Hook useCompare + CompareButton + página /comparar

---

## 🛠️ QUERIES GRAPHQL DISPONIBLES

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

### Direcciones de Cliente
```graphql
mutation CreateCustomerAddress($input: CreateAddressInput!) {
  createCustomerAddress(input: $input) {
    id
    fullName
    streetLine1
    city
    postalCode
    country { code name }
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
- Accesibilidad: ARIA labels, focus management, keyboard navigation

---

*Última actualización: 11/12/2025 11:12*