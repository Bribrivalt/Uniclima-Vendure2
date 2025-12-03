# 📋 LISTA 2: FRONTEND, UI & EXPERIENCIA - Progreso de Tareas

**Rama:** `feature/frontend-lista2-completion`  
**Última actualización:** 2024-12-03  
**Estado:** 🔄 EN PROGRESO

---

## 📊 RESUMEN DE PROGRESO

| Sección | Completado | Total | % |
|---------|------------|-------|---|
| 2.1-2.2 Sistema diseño & Core | 10 | 18 | 55% |
| 2.3 Componentes Producto | 5 | 13 | 38% |
| 2.4 Componentes Carrito | 2 | 5 | 40% |
| 2.5 Componentes Checkout | 3 | 9 | 33% |
| 2.6 Componentes Auth | 2 | 11 | 18% |
| 2.7-2.10 Páginas | 16 | 29 | 55% |
| 2.11 GraphQL | 15 | 15 | 100% |
| 2.12-2.14 Responsive/Perf/A11y | 6 | 16 | 37% |
| 2.15-2.17 SEO/Test/Docs | 5 | 16 | 31% |
| **TOTAL** | **64** | **132** | **48%** |

---

## 🎨 2.1 Sistema de Diseño

### Design Tokens
- [x] ~~Definir paleta de colores corporativos~~ → `styles/tokens.css`
- [x] ~~Color primario (rojo Uniclima)~~ → `--color-primary: #DC2626`
- [x] ~~Color secundario~~ → Definido
- [x] ~~Colores de acento~~ → Definido
- [x] ~~Colores de estado (success, error, warning)~~ → Definido
- [x] ~~Variables CSS en tokens.css~~ → `styles/tokens.css`
- [x] ~~Tipografía (font-family, sizes, weights)~~ → Definido
- [x] ~~Espaciados (padding, margin, gap)~~ → `--spacing-*`
- [x] ~~Border radius~~ → `--border-radius-*`
- [x] ~~Shadows~~ → `--shadow-*`
- [x] ~~Breakpoints responsive~~ → `--breakpoint-*`
- [x] ~~Transiciones/animaciones~~ → `--transition-*`
- [x] ~~Tema default~~ → `styles/themes/default.css`
- [ ] Crear tema dark mode (opcional)
- [ ] Documentar sistema de diseño completo

---

## 🧩 2.2 Componentes Core

### Completados ✅
- [x] ~~Button~~ → `components/core/Button.tsx`
  - [x] ~~Variantes: primary, secondary, outline, ghost~~
  - [x] ~~Tamaños: sm, md, lg~~
  - [x] ~~Estados: hover, active, disabled, loading~~
  - [x] ~~Iconos opcionales~~
- [x] ~~Input~~ → `components/core/Input.tsx`
  - [x] ~~Tipos: text, email, password, number, tel~~
  - [x] ~~Estados: focus, error, disabled~~
  - [x] ~~Label y helper text~~
  - [x] ~~Validación visual~~
- [x] ~~Card~~ → `components/core/Card.tsx`
  - [x] ~~Variantes con/sin imagen~~
  - [x] ~~Hover effects~~
- [x] ~~Alert/Toast~~ → `components/core/Alert.tsx`
- [x] ~~Modal/Dialog~~ → `components/core/Modal.tsx`
- [x] ~~Dropdown/Select~~ → `components/core/Dropdown.tsx`
- [x] ~~Tabs~~ → `components/core/Tabs.tsx`
- [x] ~~Skeleton/Loading~~ → `components/core/Skeleton.tsx`

### Pendientes ❌
- [ ] Checkbox
  - [ ] Estados: checked, unchecked, indeterminate
  - [ ] Tamaños: sm, md
  - [ ] Label integrado
- [ ] Radio
  - [ ] Grupo de opciones
  - [ ] Estados: selected, unselected, disabled
- [ ] Badge/Tag
  - [ ] Variantes de color
  - [ ] Con icono
  - [ ] Tamaños
- [ ] Breadcrumb
  - [ ] Separadores personalizables
  - [ ] Truncamiento automático
- [ ] Accordion
  - [ ] Single/multiple open
  - [ ] Animación
- [ ] Tooltip
  - [ ] Posiciones: top, bottom, left, right
  - [ ] Trigger: hover, click
- [ ] Avatar
  - [ ] Con imagen
  - [ ] Con iniciales
  - [ ] Tamaños: sm, md, lg
- [ ] Rating (estrellas)
  - [ ] Read-only y editable
  - [ ] Half stars
  - [ ] Tamaños

---

## 🛒 2.3 Componentes de Producto

### Completados ✅
- [x] ~~ProductCard~~ → `components/product/ProductCard.tsx`
  - [x] ~~Imagen con lazy loading~~
  - [x] ~~Nombre y descripción corta~~
  - [x] ~~Precio con descuento~~
  - [x] ~~Badge de oferta/nuevo~~
  - [x] ~~Botón añadir al carrito~~
  - [x] ~~Indicador de stock~~
- [x] ~~ProductSearch~~ → `components/product/ProductSearch.tsx`
- [x] ~~ProductSort~~ → `components/product/ProductSort.tsx`
  - [x] ~~Por precio (asc/desc)~~
  - [x] ~~Por nombre~~
  - [x] ~~Por relevancia~~
- [x] ~~ProductPagination~~ → `components/product/ProductPagination.tsx`
- [x] ~~QuoteModal~~ → `components/product/QuoteModal.tsx`

### Pendientes ❌
- [ ] ProductGrid
  - [ ] Responsive 1-4 columnas
  - [ ] Modo lista/grid toggle
  - [ ] Animación de entrada
- [ ] ProductFilters
  - [ ] Filtros por facet
  - [ ] Rango de precio
  - [ ] Filtros activos con pills
  - [ ] Limpiar filtros
  - [ ] Filtros colapsables
- [ ] ProductGallery
  - [ ] Imagen principal
  - [ ] Thumbnails
  - [ ] Zoom on hover
  - [ ] Lightbox fullscreen
- [ ] ProductTabs
  - [ ] Descripción
  - [ ] Especificaciones técnicas
  - [ ] Documentos/Fichas técnicas
  - [ ] Opiniones
- [ ] ProductSpecs (tabla de especificaciones)
- [ ] RelatedProducts
- [ ] RecentlyViewed
- [ ] ProductComparison (comparador)

---

## 🛍️ 2.4 Componentes de Carrito

### Completados ✅
- [x] ~~CartItem~~ → `components/cart/CartItem.tsx`
  - [x] ~~Imagen miniatura~~
  - [x] ~~Nombre y variante~~
  - [x] ~~Precio unitario~~
  - [x] ~~Selector de cantidad~~
  - [x] ~~Precio total línea~~
- [x] ~~CartSummary~~ → `components/cart/CartSummary.tsx`
  - [x] ~~Subtotal~~
  - [x] ~~Envío estimado~~
  - [x] ~~Impuestos~~
  - [x] ~~Total~~

### Pendientes ❌
- [ ] CartDrawer
  - [ ] Lista de items
  - [ ] Modificar cantidad
  - [ ] Eliminar items
  - [ ] Subtotal
  - [ ] Botón checkout
- [ ] CartEmpty (estado vacío)
- [ ] MiniCart (icono con contador en header)

---

## 💳 2.5 Componentes de Checkout

### Completados ✅
- [x] ~~CheckoutSteps~~ → `components/checkout/CheckoutSteps.tsx`
  - [x] ~~Datos de envío~~
  - [x] ~~Método de envío~~
  - [x] ~~Pago~~
  - [x] ~~Confirmación~~
- [x] ~~ShippingForm~~ → `components/checkout/ShippingForm.tsx`
- [x] ~~OrderSummary~~ → `components/checkout/OrderSummary.tsx`

### Pendientes ❌
- [ ] AddressForm (completo)
  - [ ] Nombre completo
  - [ ] Dirección
  - [ ] Ciudad
  - [ ] Código postal
  - [ ] Provincia (dropdown España)
  - [ ] Teléfono
  - [ ] Guardar dirección checkbox
- [ ] ShippingMethodSelector
- [ ] PaymentMethodSelector
- [ ] OrderReview
- [ ] OrderConfirmation
- [ ] GuestCheckout

---

## 🔐 2.6 Componentes de Autenticación

### Completados ✅
- [x] ~~ProtectedRoute~~ → `components/auth/ProtectedRoute.tsx`
- [x] ~~withAuth HOC~~ → `components/auth/ProtectedRoute.tsx`

### Pendientes ❌
- [ ] LoginForm (componente separado)
  - [ ] Email/username
  - [ ] Password
  - [ ] Recordarme
  - [ ] Olvidé mi contraseña link
  - [ ] Login social buttons (preparado)
- [ ] RegisterForm
  - [ ] Nombre y apellidos
  - [ ] Email
  - [ ] Password con requisitos
  - [ ] Confirmar password
  - [ ] Aceptar términos
  - [ ] Newsletter checkbox
- [ ] ForgotPasswordForm
- [ ] ResetPasswordForm
- [ ] AccountSidebar (menú lateral de cuenta)
- [ ] ProfileForm (editar perfil)
- [ ] AddressBook (libro de direcciones)
- [ ] OrderHistory (historial de pedidos)
- [ ] OrderDetail (detalle de pedido)

---

## 📄 2.7 Páginas Principales

### Completados ✅
- [x] ~~Home page (/)~~ → `app/page.tsx`
  - [x] ~~Hero banner~~
  - [x] ~~Categorías destacadas~~
  - [x] ~~Productos destacados~~
- [x] ~~Catálogo (/productos)~~ → `app/productos/page.tsx`
- [x] ~~Detalle de producto (/productos/[slug])~~ → `app/productos/[slug]/page.tsx`
- [x] ~~Carrito (/carrito)~~ → `app/carrito/page.tsx`
- [x] ~~Checkout (/checkout)~~ → `app/checkout/page.tsx`
- [x] ~~Confirmación (/pedido/[code])~~ → `app/pedido/[code]/page.tsx`
- [x] ~~Repuestos (/repuestos)~~ → `app/repuestos/page.tsx`

### Pendientes ❌
- [ ] Categoría (/categoria/[slug])
  - [ ] Descripción de categoría
  - [ ] Subcategorías
  - [ ] Productos de la categoría

---

## 📄 2.8 Páginas Secundarias

### Completados ✅
- [x] ~~Servicios (/servicios)~~ → `app/servicios/page.tsx`
- [x] ~~Sobre Nosotros (/conocenos)~~ → `app/conocenos/page.tsx`
- [x] ~~Contacto (/contacto)~~ → `app/contacto/page.tsx`

### Pendientes ❌
- [ ] Búsqueda (/buscar)
  - [ ] Barra de búsqueda grande
  - [ ] Sugerencias en tiempo real
  - [ ] Resultados con filtros
  - [ ] No results state
- [ ] FAQ (/faq)
  - [ ] Preguntas frecuentes
  - [ ] Accordion
  - [ ] Buscador
- [ ] Comparador (/comparar)
  - [ ] Tabla comparativa
  - [ ] Añadir/quitar productos
  - [ ] Destacar diferencias

---

## 📄 2.9 Páginas Legales

### Completados ✅
- [x] ~~Política de privacidad (/privacidad)~~ → `app/privacidad/page.tsx`
- [x] ~~Política de cookies (/cookies)~~ → `app/cookies/page.tsx`
- [x] ~~Términos y condiciones (/terminos)~~ → `app/terminos/page.tsx`

### Pendientes ❌
- [ ] Aviso legal (/aviso-legal)
- [ ] Política de devoluciones (/devoluciones)
- [ ] Política de envíos (/envios)
- [ ] Banner de cookies (GDPR)

---

## 📄 2.10 Páginas de Cuenta

### Completados ✅
- [x] ~~Login (/login)~~ → `app/login/page.tsx`
- [x] ~~Registro (/registro)~~ → `app/registro/page.tsx`
- [x] ~~Mi cuenta (/cuenta)~~ → `app/cuenta/page.tsx`

### Pendientes ❌
- [ ] Mis pedidos (/cuenta/pedidos)
  - [ ] Lista de pedidos
  - [ ] Filtrar por estado
  - [ ] Ver detalle
- [ ] Detalle pedido (/cuenta/pedidos/[id])
  - [ ] Estado del pedido
  - [ ] Tracking
  - [ ] Items
  - [ ] Descargar factura
- [ ] Mis direcciones (/cuenta/direcciones)
  - [ ] Lista de direcciones
  - [ ] Añadir/editar/eliminar
  - [ ] Marcar como default
- [ ] Mi perfil (/cuenta/perfil)
  - [ ] Editar datos personales
  - [ ] Cambiar contraseña
  - [ ] Preferencias de comunicación
- [ ] Lista de deseos (/cuenta/favoritos)
  - [ ] Productos guardados
  - [ ] Mover al carrito

---

## 🔌 2.11 Integración GraphQL ✅ COMPLETADO

### Configuración
- [x] ~~Apollo Client configurado~~ → `lib/vendure/client.ts`

### Queries
- [x] ~~GET_PRODUCTS~~ → `lib/vendure/queries/products.ts`
- [x] ~~GET_PRODUCT_BY_SLUG~~ → `lib/vendure/queries/products.ts`
- [x] ~~GET_COLLECTIONS~~ → `lib/vendure/queries/products.ts`
- [x] ~~GET_ACTIVE_ORDER~~ → `lib/vendure/queries/cart.ts`
- [x] ~~GET_ACTIVE_CUSTOMER~~ → `lib/vendure/queries/auth.ts`

### Mutations de Carrito
- [x] ~~ADD_ITEM_TO_ORDER~~ → `lib/vendure/mutations/cart.ts`
- [x] ~~ADJUST_ORDER_LINE~~ → `lib/vendure/mutations/cart.ts`
- [x] ~~REMOVE_ORDER_LINE~~ → `lib/vendure/mutations/cart.ts`
- [x] ~~APPLY_COUPON_CODE~~ → `lib/vendure/mutations/order.ts`
- [x] ~~REMOVE_COUPON_CODE~~ → `lib/vendure/mutations/order.ts`

### Mutations de Checkout
- [x] ~~SET_CUSTOMER_FOR_ORDER~~ → `lib/vendure/mutations/order.ts`
- [x] ~~SET_SHIPPING_ADDRESS~~ → `lib/vendure/mutations/order.ts`
- [x] ~~SET_SHIPPING_METHOD~~ → `lib/vendure/mutations/order.ts`
- [x] ~~ADD_PAYMENT_TO_ORDER~~ → `lib/vendure/mutations/order.ts`
- [x] ~~TRANSITION_ORDER_TO_STATE~~ → `lib/vendure/mutations/order.ts`

### Mutations de Auth
- [x] ~~LOGIN~~ → `lib/vendure/mutations/auth.ts`
- [x] ~~LOGOUT~~ → `lib/vendure/mutations/auth.ts`
- [x] ~~REGISTER_CUSTOMER~~ → `lib/vendure/mutations/auth.ts`
- [x] ~~REQUEST_PASSWORD_RESET~~ → `lib/vendure/mutations/auth.ts`
- [x] ~~RESET_PASSWORD~~ → `lib/vendure/mutations/auth.ts`

---

## 📱 2.12 Responsive Design

### Completados ✅
- [x] ~~Breakpoints definidos~~ → `styles/tokens.css`
- [x] ~~Mobile-first CSS en componentes~~
- [x] ~~useMediaQuery hook~~ → `lib/hooks/useMediaQuery.ts`

### Pendientes ❌
- [ ] Header responsive con menú hamburguesa
- [ ] Filtros en drawer para mobile
- [ ] Grid adaptativo de productos (mejoras)
- [ ] Touch-friendly buttons y inputs
- [ ] Optimizar imágenes para diferentes dispositivos
- [ ] Testing en dispositivos reales

---

## ⚡ 2.13 Performance Frontend

### Completados ✅
- [x] ~~Skeleton loaders implementados~~

### Pendientes ❌
- [ ] Implementar lazy loading de imágenes (sistemático)
- [ ] Code splitting por rutas (verificar)
- [ ] Optimizar bundle size
- [ ] Implementar ISR para páginas de productos
- [ ] Configurar caché de Apollo Client (optimizar)
- [ ] Prefetch de rutas hover
- [ ] Optimizar Web Vitals (LCP, FID, CLS)
- [ ] Minificar CSS y JS (verificar build)

---

## ♿ 2.14 Accesibilidad (a11y)

### Completados ✅
- [x] ~~Navegación por teclado~~ (Modal, Dropdown, Tabs)
- [x] ~~ARIA labels en componentes interactivos~~
- [x] ~~Focus visible en elementos interactivos~~
- [x] ~~useFocusTrap hook~~ → `lib/hooks/useFocusTrap.ts`

### Pendientes ❌
- [ ] Contraste de colores WCAG AA (validar)
- [ ] Alt text en todas las imágenes (verificar)
- [ ] Skip to content link
- [ ] Formularios accesibles con labels (verificar todos)
- [ ] Testing con screen readers

---

## 🌐 2.15 SEO

### Completados ✅
- [x] ~~Meta tags utilities~~ → `lib/seo/metadata.ts`
- [x] ~~Open Graph tags~~ → `lib/seo/metadata.ts`
- [x] ~~Schema.org Organization~~ → `lib/seo/metadata.ts`
- [x] ~~Schema.org Product~~ → `lib/seo/metadata.ts`
- [x] ~~Breadcrumb schema~~ → `lib/seo/metadata.ts`

### Pendientes ❌
- [ ] Sitemap.xml dinámico
- [ ] Robots.txt
- [ ] Canonical URLs (implementar)
- [ ] URLs amigables (slugs) - verificar
- [ ] Rich snippets de producto (reviews)

---

## 🧪 2.16 Testing Frontend

### Pendientes ❌
- [ ] Configurar Jest
- [ ] Unit tests componentes core
- [ ] Component tests con React Testing Library
- [ ] E2E tests con Playwright/Cypress
- [ ] Visual regression tests
- [ ] Testing de flujo de compra completo
- [ ] Testing de formularios
- [ ] Testing responsive
- [ ] Testing de performance (Lighthouse CI)

---

## 📚 2.17 Documentación

### Completados ✅
- [x] ~~FRONTEND_PROGRESS.md~~ → `frontend/FRONTEND_PROGRESS.md`
- [x] ~~LISTA2_PROGRESO.md~~ → Este archivo

### Pendientes ❌
- [ ] README del frontend
- [ ] Guía de instalación
- [ ] Guía de desarrollo
- [ ] Documentar componentes (Storybook opcional)
- [ ] Documentar estructura de carpetas
- [ ] Documentar variables de entorno
- [ ] Documentar API GraphQL usadas
- [ ] Crear guía de contribución

---

## 📝 REGISTRO DE COMMITS

| Fecha | Hash | Descripción |
|-------|------|-------------|
| 2024-12-03 | - | feat: crear rama feature/frontend-lista2-completion |
| 2024-12-03 | - | docs: crear LISTA2_PROGRESO.md para tracking de tareas |

---

## ⚠️ NOTAS IMPORTANTES

1. **NO MODIFICAR** archivos del backend (`backend/`)
2. **NO MODIFICAR** archivos de configuración raíz que afecten al backend
3. Mantener consistencia con design tokens existentes
4. Todos los componentes deben usar CSS Modules
5. Seguir convenciones de nombrado de Next.js App Router
6. **Agregar comentarios JSDoc** a todos los componentes y funciones
7. **Hacer commit** después de cada tarea completada

---

## 🎯 ORDEN DE PRIORIDAD

1. **Alta Prioridad:**
   - Componentes Core faltantes (Checkbox, Radio, Badge, Breadcrumb)
   - ProductFilters (esencial para catálogo)
   - CartDrawer + MiniCart (UX crítica)
   - Header responsive (menú hamburguesa)

2. **Media Prioridad:**
   - Páginas de cuenta (/cuenta/pedidos, /cuenta/perfil)
   - Componentes de auth (LoginForm, RegisterForm)
   - SEO (sitemap.xml, robots.txt)

3. **Baja Prioridad:**
   - Testing
   - Dark mode
   - Storybook
   - Comparador de productos