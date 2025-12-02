# 📋 TODO List - Uniclima Vendure E-commerce

## 🎯 **ESTADO ACTUAL (02/12/2024)**

✅ **Backend Vendure**: Funcionando en http://localhost:3001
✅ **Dashboard Admin**: Funcionando en http://localhost:3001/dashboard
✅ **Frontend Next.js**: Funcionando en http://localhost:3000
✅ **PostgreSQL**: Corriendo en puerto 6543
✅ **Configuración E-commerce**: Zonas, impuestos, envíos configurados

---

# 📋 LISTA 1: BACKEND, API & INFRAESTRUCTURA

## 🔧 1.1 Custom Fields para Productos HVAC (Alta Prioridad)
- [ ] Añadir custom field `potenciaKw` (float) - Potencia en kW
- [ ] Añadir custom field `frigorias` (int) - Frigorías/hora
- [ ] Añadir custom field `claseEnergetica` (string) - A+++, A++, A+, A, B
- [ ] Añadir custom field `refrigerante` (string) - R32, R410A, R290
- [ ] Añadir custom field `wifi` (boolean) - WiFi integrado
- [ ] Añadir custom field `garantiaAnos` (int) - Años de garantía
- [ ] Añadir custom field `dimensionesUnidadInterior` (string) - Alto x Ancho x Profundo
- [ ] Añadir custom field `dimensionesUnidadExterior` (string) - Alto x Ancho x Profundo
- [ ] Añadir custom field `pesoUnidadInterior` (float) - Peso en kg
- [ ] Añadir custom field `pesoUnidadExterior` (float) - Peso en kg
- [ ] Añadir custom field `nivelSonoro` (int) - Decibelios dB(A)
- [ ] Añadir custom field `nivelSonoroExterior` (int) - Decibelios exterior
- [ ] Añadir custom field `seer` (float) - Eficiencia refrigeración estacional
- [ ] Añadir custom field `scop` (float) - Eficiencia calefacción estacional
- [ ] Añadir custom field `superficieRecomendada` (string) - m² recomendados
- [ ] Añadir custom field `alimentacion` (string) - Monofásico/Trifásico
- [ ] Añadir custom field `cargaRefrigerante` (float) - kg de refrigerante
- [ ] Añadir custom field `longitudMaximaTuberia` (int) - Metros máximos
- [ ] Añadir custom field `desnivelMaximo` (int) - Metros desnivel
- [ ] Añadir custom field `fichaTecnicaPdf` (relation) - Asset del PDF técnico
- [ ] Ejecutar migración de base de datos
- [ ] Verificar campos en Dashboard Admin
- [ ] Crear validaciones para campos numéricos

## 🏷️ 1.2 Facets (Filtros de Búsqueda)
- [ ] Crear Facet "Marca":
  - [ ] Daikin
  - [ ] Mitsubishi Electric
  - [ ] LG
  - [ ] Fujitsu
  - [ ] Samsung
  - [ ] Panasonic
  - [ ] Toshiba
  - [ ] Hitachi
  - [ ] Haier
  - [ ] Midea
- [ ] Crear Facet "Tipo de Producto":
  - [ ] Split Pared
  - [ ] Multisplit
  - [ ] Conductos
  - [ ] Cassette
  - [ ] Suelo/Techo
  - [ ] Portátil
  - [ ] Ventana
- [ ] Crear Facet "Potencia":
  - [ ] < 2.5kW (hasta 20m²)
  - [ ] 2.5 - 3.5kW (20-30m²)
  - [ ] 3.5 - 5kW (30-40m²)
  - [ ] 5 - 7kW (40-60m²)
  - [ ] > 7kW (> 60m²)
- [ ] Crear Facet "Clase Energética":
  - [ ] A+++
  - [ ] A++
  - [ ] A+
  - [ ] A
  - [ ] B
- [ ] Crear Facet "Refrigerante":
  - [ ] R32 (Ecológico)
  - [ ] R410A
  - [ ] R290
- [ ] Crear Facet "Funciones":
  - [ ] WiFi
  - [ ] Bomba de calor
  - [ ] Inverter
  - [ ] Silencioso (<25dB)
  - [ ] Purificador de aire
  - [ ] Deshumidificador
- [ ] Crear Facet "Zona Climática":
  - [ ] Clima cálido
  - [ ] Clima templado
  - [ ] Clima frío
- [ ] Crear Facet "Aplicación":
  - [ ] Residencial
  - [ ] Comercial
  - [ ] Industrial

## 📁 1.3 Collections (Categorías de Productos)
- [ ] Crear colección raíz "Climatización"
- [ ] Crear subcolección "Aire Acondicionado"
  - [ ] Split Pared
  - [ ] Multisplit 2x1
  - [ ] Multisplit 3x1
  - [ ] Multisplit 4x1
  - [ ] Conductos
  - [ ] Cassette
  - [ ] Suelo/Techo
  - [ ] Portátil
- [ ] Crear subcolección "Calefacción"
  - [ ] Calderas de Condensación
  - [ ] Calderas de Biomasa
  - [ ] Aerotermia
  - [ ] Radiadores
  - [ ] Suelo Radiante
- [ ] Crear subcolección "Ventilación"
  - [ ] Recuperadores de calor
  - [ ] Extractores
  - [ ] Ventiladores de techo
- [ ] Crear subcolección "Tratamiento de Aire"
  - [ ] Deshumidificadores
  - [ ] Purificadores
  - [ ] Humidificadores
- [ ] Crear subcolección "Accesorios"
  - [ ] Soportes y fijaciones
  - [ ] Kits de instalación
  - [ ] Mandos a distancia
  - [ ] Filtros de repuesto
  - [ ] Tuberías y conexiones
  - [ ] Cables y conectores
- [ ] Crear subcolección "Repuestos"
  - [ ] Por marca
  - [ ] Por tipo de equipo
  - [ ] Compresores
  - [ ] Placas electrónicas
  - [ ] Motores de ventilador
- [ ] Crear subcolección "Servicios"
  - [ ] Instalación Split
  - [ ] Instalación Multisplit
  - [ ] Instalación Conductos
  - [ ] Mantenimiento preventivo
  - [ ] Reparación
  - [ ] Carga de gas
- [ ] Configurar filtros automáticos por colección
- [ ] Añadir imágenes de categoría
- [ ] Configurar SEO para cada colección

## 🚚 1.4 Envíos y Logística
- [ ] Configurar método "Envío Estándar Península" (50€)
- [ ] Configurar método "Envío Express 24-48h" (100€)
- [ ] Configurar método "Recogida en Tienda" (Gratis)
- [ ] Crear zona "Baleares" con precios especiales
- [ ] Crear zona "Canarias" con precios especiales (sin IVA)
- [ ] Crear zona "Ceuta y Melilla" 
- [ ] Implementar envío gratuito para pedidos >1000€
- [ ] Configurar calculador de envío por peso/volumen
- [ ] Configurar restricciones por producto (equipos grandes)
- [ ] Añadir tracking de envíos
- [ ] Integrar con agencias de transporte (Seur, MRW, GLS)
- [ ] Crear política de devoluciones
- [ ] Configurar plazos de entrega estimados

## 💳 1.5 Pagos
- [ ] Mantener Dummy Payment para desarrollo
- [ ] Integrar Stripe como método principal
  - [ ] Configurar claves API
  - [ ] Configurar webhook para confirmaciones
  - [ ] Añadir soporte para 3D Secure
- [ ] Integrar PayPal
  - [ ] PayPal Express Checkout
  - [ ] PayPal Credit (pago a plazos)
- [ ] Integrar Redsys/TPV Virtual (bancos españoles)
- [ ] Implementar pago por transferencia bancaria
- [ ] Implementar pago contra reembolso
- [ ] Configurar facturación automática
- [ ] Implementar financiación Cetelem/Cofidis
- [ ] Configurar límites de pago por método

## 📧 1.6 Emails y Notificaciones
- [ ] Personalizar plantilla de confirmación de pedido
- [ ] Personalizar plantilla de envío realizado
- [ ] Personalizar plantilla de registro de cuenta
- [ ] Personalizar plantilla de recuperación de contraseña
- [ ] Crear plantilla de carrito abandonado
- [ ] Crear plantilla de producto en stock (wishlist)
- [ ] Configurar SMTP para producción (SendGrid/AWS SES)
- [ ] Añadir logo y branding de Uniclima
- [ ] Traducir todas las plantillas al español
- [ ] Añadir información legal y política de privacidad
- [ ] Configurar notificaciones push (opcional)

## 👥 1.7 Clientes y Autenticación
- [ ] Configurar registro de clientes
- [ ] Configurar verificación de email
- [ ] Implementar login social (Google, Facebook)
- [ ] Crear grupos de clientes (Particular, Profesional, Instalador)
- [ ] Configurar precios especiales por grupo
- [ ] Implementar sistema de puntos/fidelización
- [ ] Crear área de cliente (historial pedidos, direcciones)
- [ ] Implementar listas de deseos (wishlist)
- [ ] Configurar GDPR compliance
- [ ] Crear formulario de alta profesional con CIF

## 📊 1.8 Analytics y Reporting
- [ ] Integrar Google Analytics 4
- [ ] Configurar eventos de ecommerce (add_to_cart, purchase)
- [ ] Integrar Google Tag Manager
- [ ] Configurar Facebook Pixel
- [ ] Crear dashboard de ventas en Admin
- [ ] Crear reportes de productos más vendidos
- [ ] Crear reportes de stock bajo
- [ ] Exportar datos a Excel/CSV
- [ ] Configurar alertas de stock

## 🔒 1.9 Seguridad y Performance
- [ ] Configurar HTTPS/SSL en producción
- [ ] Implementar rate limiting
- [ ] Configurar CORS correctamente
- [ ] Añadir validación de inputs
- [ ] Configurar backups automáticos de BD
- [ ] Implementar caché de queries con Redis
- [ ] Optimizar queries de productos
- [ ] Configurar CDN para assets (imágenes)
- [ ] Implementar compresión de imágenes
- [ ] Configurar logs y monitorización

## 🐳 1.10 Docker y Deployment
- [ ] Optimizar Dockerfile para producción
- [ ] Configurar multi-stage build
- [ ] Crear docker-compose.production.yml
- [ ] Configurar secrets management
- [ ] Crear scripts de deployment
- [ ] Configurar CI/CD con GitHub Actions
- [ ] Configurar health checks
- [ ] Documentar proceso de deployment
- [ ] Configurar scaling horizontal
- [ ] Crear entorno de staging

## 📝 1.11 Importación de Datos
- [ ] Crear script de importación de productos
- [ ] Importar productos desde Excel/CSV
- [ ] Mapear campos de WooCommerce a Vendure
- [ ] Importar imágenes de productos
- [ ] Importar clientes existentes
- [ ] Importar historial de pedidos (opcional)
- [ ] Verificar integridad de datos importados
- [ ] Crear backup antes de importación

---

# 📋 LISTA 2: FRONTEND, UI & EXPERIENCIA DE USUARIO

## 🎨 2.1 Sistema de Diseño
- [ ] Definir paleta de colores corporativos
  - [ ] Color primario (azul Uniclima)
  - [ ] Color secundario
  - [ ] Colores de acento
  - [ ] Colores de estado (success, error, warning)
- [ ] Crear variables CSS en tokens.css
  - [ ] Colores
  - [ ] Tipografía (font-family, sizes, weights)
  - [ ] Espaciados (padding, margin, gap)
  - [ ] Border radius
  - [ ] Shadows
  - [ ] Breakpoints responsive
  - [ ] Transiciones/animaciones
- [ ] Crear tema default.css
- [ ] Crear tema dark mode (opcional)
- [ ] Documentar sistema de diseño

## 🧩 2.2 Componentes Core
- [ ] Componente Button
  - [ ] Variantes: primary, secondary, outline, ghost
  - [ ] Tamaños: sm, md, lg
  - [ ] Estados: hover, active, disabled, loading
  - [ ] Iconos opcionales
- [ ] Componente Input
  - [ ] Tipos: text, email, password, number, tel
  - [ ] Estados: focus, error, disabled
  - [ ] Label y helper text
  - [ ] Validación visual
- [ ] Componente Select/Dropdown
- [ ] Componente Checkbox
- [ ] Componente Radio
- [ ] Componente Card
  - [ ] Variantes con/sin imagen
  - [ ] Hover effects
- [ ] Componente Badge/Tag
- [ ] Componente Alert/Toast
- [ ] Componente Modal/Dialog
- [ ] Componente Breadcrumb
- [ ] Componente Pagination
- [ ] Componente Tabs
- [ ] Componente Accordion
- [ ] Componente Tooltip
- [ ] Componente Skeleton/Loading
- [ ] Componente Avatar
- [ ] Componente Rating (estrellas)

## 🛒 2.3 Componentes de Producto
- [ ] ProductCard - Tarjeta de producto
  - [ ] Imagen con lazy loading
  - [ ] Nombre y descripción corta
  - [ ] Precio con descuento
  - [ ] Badge de oferta/nuevo
  - [ ] Botón añadir al carrito
  - [ ] Indicador de stock
  - [ ] Quick view hover
- [ ] ProductGrid - Grid de productos
  - [ ] Responsive 1-4 columnas
  - [ ] Modo lista/grid toggle
  - [ ] Animación de entrada
- [ ] ProductFilters - Panel de filtros
  - [ ] Filtros por facet
  - [ ] Rango de precio
  - [ ] Filtros activos con pills
  - [ ] Limpiar filtros
  - [ ] Filtros colapsables
- [ ] ProductSort - Ordenación
  - [ ] Por precio (asc/desc)
  - [ ] Por nombre
  - [ ] Por relevancia
  - [ ] Más recientes
  - [ ] Más vendidos
- [ ] ProductGallery - Galería de imágenes
  - [ ] Imagen principal
  - [ ] Thumbnails
  - [ ] Zoom on hover
  - [ ] Lightbox fullscreen
- [ ] ProductTabs - Tabs de información
  - [ ] Descripción
  - [ ] Especificaciones técnicas
  - [ ] Documentos/Fichas técnicas
  - [ ] Opiniones
- [ ] ProductSpecs - Tabla de especificaciones
- [ ] RelatedProducts - Productos relacionados
- [ ] RecentlyViewed - Vistos recientemente
- [ ] ProductComparison - Comparador de productos

## 🛍️ 2.4 Componentes de Carrito
- [ ] CartDrawer - Drawer lateral del carrito
  - [ ] Lista de items
  - [ ] Modificar cantidad
  - [ ] Eliminar items
  - [ ] Subtotal
  - [ ] Botón checkout
- [ ] CartItem - Item individual
  - [ ] Imagen miniatura
  - [ ] Nombre y variante
  - [ ] Precio unitario
  - [ ] Selector de cantidad
  - [ ] Precio total línea
- [ ] CartSummary - Resumen del carrito
  - [ ] Subtotal
  - [ ] Envío estimado
  - [ ] Impuestos
  - [ ] Total
  - [ ] Código promocional input
- [ ] CartEmpty - Estado vacío
- [ ] MiniCart - Icono con contador en header

## 💳 2.5 Componentes de Checkout
- [ ] CheckoutSteps - Indicador de pasos
  - [ ] Datos de envío
  - [ ] Método de envío
  - [ ] Pago
  - [ ] Confirmación
- [ ] AddressForm - Formulario de dirección
  - [ ] Nombre completo
  - [ ] Dirección
  - [ ] Ciudad
  - [ ] Código postal
  - [ ] Provincia (dropdown)
  - [ ] Teléfono
  - [ ] Guardar dirección
- [ ] ShippingMethodSelector - Selector de envío
- [ ] PaymentMethodSelector - Selector de pago
- [ ] OrderReview - Revisión del pedido
- [ ] OrderConfirmation - Confirmación de compra
- [ ] GuestCheckout - Checkout sin registro

## 🔐 2.6 Componentes de Autenticación
- [ ] LoginForm - Formulario de login
  - [ ] Email/username
  - [ ] Password
  - [ ] Recordarme
  - [ ] Olvidé mi contraseña link
  - [ ] Login social buttons
- [ ] RegisterForm - Formulario de registro
  - [ ] Nombre y apellidos
  - [ ] Email
  - [ ] Password con requisitos
  - [ ] Confirmar password
  - [ ] Aceptar términos
  - [ ] Newsletter checkbox
- [ ] ForgotPasswordForm
- [ ] ResetPasswordForm
- [ ] AccountSidebar - Menú de cuenta
- [ ] ProfileForm - Editar perfil
- [ ] AddressBook - Libro de direcciones
- [ ] OrderHistory - Historial de pedidos
- [ ] OrderDetail - Detalle de pedido

## 📄 2.7 Páginas Principales
- [ ] Home page (/)
  - [ ] Hero banner rotativo
  - [ ] Categorías destacadas
  - [ ] Productos destacados
  - [ ] Ofertas del momento
  - [ ] Marcas (logo carousel)
  - [ ] Por qué elegirnos
  - [ ] Newsletter signup
- [ ] Catálogo (/productos)
  - [ ] Filtros laterales
  - [ ] Grid de productos
  - [ ] Paginación
  - [ ] Breadcrumb
  - [ ] Contador de resultados
- [ ] Detalle de producto (/productos/[slug])
  - [ ] Galería de imágenes
  - [ ] Información básica
  - [ ] Selector de variante
  - [ ] Añadir al carrito
  - [ ] Tabs de info
  - [ ] Productos relacionados
- [ ] Categoría (/categoria/[slug])
  - [ ] Descripción de categoría
  - [ ] Subcategorías
  - [ ] Productos de la categoría
- [ ] Carrito (/carrito)
  - [ ] Lista de items
  - [ ] Resumen
  - [ ] Continuar comprando
  - [ ] Ir a checkout
- [ ] Checkout (/checkout)
  - [ ] Multi-step form
  - [ ] Progress bar
  - [ ] Resumen lateral
- [ ] Confirmación (/pedido/[code])
  - [ ] Número de pedido
  - [ ] Resumen del pedido
  - [ ] Siguiente pasos
  - [ ] CTA crear cuenta (si guest)

## 📄 2.8 Páginas Secundarias
- [ ] Búsqueda (/buscar)
  - [ ] Barra de búsqueda grande
  - [ ] Sugerencias en tiempo real
  - [ ] Resultados con filtros
  - [ ] No results state
- [ ] Servicios (/servicios)
  - [ ] Lista de servicios
  - [ ] Precios orientativos
  - [ ] Formulario de presupuesto
- [ ] Sobre Nosotros (/conocenos)
  - [ ] Historia de la empresa
  - [ ] Valores
  - [ ] Equipo
  - [ ] Instalaciones
- [ ] Contacto (/contacto)
  - [ ] Formulario de contacto
  - [ ] Mapa de ubicación
  - [ ] Datos de contacto
  - [ ] Horarios
- [ ] Blog (/blog) - opcional
  - [ ] Lista de artículos
  - [ ] Detalle de artículo
  - [ ] Categorías del blog
- [ ] FAQ (/faq)
  - [ ] Preguntas frecuentes
  - [ ] Accordion
  - [ ] Buscador
- [ ] Comparador (/comparar)
  - [ ] Tabla comparativa
  - [ ] Añadir/quitar productos
  - [ ] Destacar diferencias

## 📄 2.9 Páginas Legales
- [ ] Aviso legal (/aviso-legal)
- [ ] Política de privacidad (/privacidad)
- [ ] Política de cookies (/cookies)
- [ ] Términos y condiciones (/terminos)
- [ ] Política de devoluciones (/devoluciones)
- [ ] Política de envíos (/envios)
- [ ] Banner de cookies (GDPR)

## 📄 2.10 Páginas de Cuenta
- [ ] Mi cuenta (/cuenta)
  - [ ] Dashboard resumen
  - [ ] Últimos pedidos
  - [ ] Quick actions
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
  - [ ] Notificar disponibilidad

## 🔌 2.11 Integración GraphQL
- [ ] Configurar Apollo Client
- [ ] Crear queries de productos
  - [ ] GET_PRODUCTS (listado con paginación)
  - [ ] GET_PRODUCT_BY_SLUG (detalle)
  - [ ] SEARCH_PRODUCTS (búsqueda con filtros)
  - [ ] GET_PRODUCTS_BY_COLLECTION
- [ ] Crear queries de colecciones
  - [ ] GET_COLLECTIONS
  - [ ] GET_COLLECTION_BY_SLUG
- [ ] Crear queries de carrito
  - [ ] GET_ACTIVE_ORDER
  - [ ] GET_ORDER_BY_CODE
- [ ] Crear queries de cliente
  - [ ] GET_ACTIVE_CUSTOMER
  - [ ] GET_CUSTOMER_ORDERS
  - [ ] GET_CUSTOMER_ADDRESSES
- [ ] Crear mutations de carrito
  - [ ] ADD_ITEM_TO_ORDER
  - [ ] ADJUST_ORDER_LINE
  - [ ] REMOVE_ORDER_LINE
  - [ ] APPLY_COUPON_CODE
  - [ ] REMOVE_COUPON_CODE
- [ ] Crear mutations de checkout
  - [ ] SET_CUSTOMER_FOR_ORDER
  - [ ] SET_SHIPPING_ADDRESS
  - [ ] SET_SHIPPING_METHOD
  - [ ] ADD_PAYMENT_TO_ORDER
  - [ ] TRANSITION_ORDER_TO_STATE
- [ ] Crear mutations de auth
  - [ ] REGISTER_CUSTOMER
  - [ ] LOGIN
  - [ ] LOGOUT
  - [ ] REQUEST_PASSWORD_RESET
  - [ ] RESET_PASSWORD
  - [ ] UPDATE_CUSTOMER
- [ ] Implementar manejo de errores GraphQL
- [ ] Configurar caché y políticas de fetch

## 📱 2.12 Responsive Design
- [ ] Mobile first approach
- [ ] Breakpoints: mobile (<768px), tablet (768-1024px), desktop (>1024px)
- [ ] Header responsive con menú hamburguesa
- [ ] Filtros en drawer para mobile
- [ ] Grid adaptativo de productos
- [ ] Touch-friendly buttons y inputs
- [ ] Optimizar imágenes para diferentes dispositivos
- [ ] Testing en dispositivos reales

## ⚡ 2.13 Performance Frontend
- [ ] Implementar lazy loading de imágenes
- [ ] Code splitting por rutas
- [ ] Optimizar bundle size
- [ ] Implementar ISR para páginas de productos
- [ ] Configurar caché de Apollo Client
- [ ] Prefetch de rutas hover
- [ ] Optimizar Web Vitals (LCP, FID, CLS)
- [ ] Implementar skeleton loaders
- [ ] Minificar CSS y JS

## ♿ 2.14 Accesibilidad (a11y)
- [ ] Navegación por teclado
- [ ] ARIA labels en componentes interactivos
- [ ] Contraste de colores WCAG AA
- [ ] Alt text en todas las imágenes
- [ ] Focus visible en elementos interactivos
- [ ] Skip to content link
- [ ] Formularios accesibles con labels
- [ ] Testing con screen readers

## 🌐 2.15 SEO
- [ ] Meta tags dinámicos por página
- [ ] Open Graph tags para redes sociales
- [ ] Schema.org markup para productos
- [ ] Sitemap.xml dinámico
- [ ] Robots.txt
- [ ] Canonical URLs
- [ ] URLs amigables (slugs)
- [ ] Breadcrumb schema
- [ ] Rich snippets de producto (precio, stock, reviews)

## 🧪 2.16 Testing Frontend
- [ ] Unit tests con Jest
- [ ] Component tests con React Testing Library
- [ ] E2E tests con Playwright/Cypress
- [ ] Visual regression tests
- [ ] Testing de flujo de compra completo
- [ ] Testing de formularios
- [ ] Testing responsive
- [ ] Testing de performance (Lighthouse)

## 📚 2.17 Documentación
- [ ] README del proyecto
- [ ] Guía de instalación
- [ ] Guía de desarrollo
- [ ] Documentar componentes (Storybook opcional)
- [ ] Documentar estructura de carpetas
- [ ] Documentar variables de entorno
- [ ] Documentar API GraphQL usadas
- [ ] Crear guía de contribución

---

## 📅 PRIORIDADES

### Semana 1-2: Fundamentos
1. Custom Fields y Facets en backend
2. Colecciones básicas
3. Sistema de diseño (tokens, componentes core)
4. Páginas básicas (Home, Catálogo, Detalle)

### Semana 3-4: E-commerce Core
1. Carrito funcional
2. Checkout básico
3. Autenticación
4. Área de cliente básica

### Semana 5-6: Pulido
1. Responsive design
2. SEO
3. Performance
4. Testing

### Semana 7+: Producción
1. Integración pagos reales
2. Importación de productos
3. Deployment
4. Monitorización

---

## 📊 MÉTRICAS DE PROGRESO

| Área | Total | Completados | Porcentaje |
|------|-------|-------------|------------|
| Backend & Config | ~100 | 15 | 15% |
| Frontend & UI | ~150 | 20 | 13% |
| **TOTAL** | ~250 | 35 | 14% |

---

*Última actualización: 02/12/2024*
