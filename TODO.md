# 📋 TODO List - Uniclima Vendure E-commerce

## 🎯 **ESTADO ACTUAL (29/11/2024)**

✅ **Backend Vendure**: Funcionando en http://localhost:3001
✅ **Dashboard Admin**: Funcionando en http://localhost:3001/dashboard
✅ **Frontend Next.js**: Funcionando en http://localhost:3000
✅ **PostgreSQL**: Corriendo en puerto 6543

**Próximos pasos**: Completar páginas del frontend y configurar autenticación con Vendure.

---

## ✅ **PROBLEMAS CRÍTICOS RESUELTOS** 

### ✅ Problema 1: Conflicto Base de Datos SQLite vs PostgreSQL
**Estado**: ✅ **RESUELTO**
**Solución**: Migrado a PostgreSQL con variables de entorno

- [x] **Migrar de SQLite a PostgreSQL** en `backend/src/vendure-config.ts`:
  - [x] Cambiar `type: 'better-sqlite3'` a `type: 'postgres'`
  - [x] Actualizar `dbConnectionOptions` con las credenciales de PostgreSQL
  - [x] Eliminar referencia a `vendure.sqlite`
  - [x] Añadir dependencia `pg` en `backend/package.json`

### ✅ Problema 2: Script incorrecto en Dockerfile.dev
**Estado**: ✅ **RESUELTO**
**Solución**: Corregido el comando a `npm run dev`

- [x] **Corregir comando** en `Dockerfile.dev`:
  - [x] Cambiar de: `CMD ["npm", "run", "start:dev"]`
  - [x] A: `CMD ["npm", "run", "dev"]`

### ✅ Problema 3: Falta instalación de dependencias en Dockerfile
**Estado**: ✅ **RESUELTO**
**Solución**: Añadida instalación completa de dependencias con caching

- [x] **Añadir instalación** en `Dockerfile.dev`:
  - [x] Copiar `package.json` y `package-lock.json`
  - [x] Ejecutar `npm ci`
  - [x] Copiar el resto del código
  - [x] Instalar Vendure CLI globalmente

### ✅ Problema 4: Falta dependencia PostgreSQL
**Estado**: ✅ **RESUELTO**
**Solución**: Driver `pg` v8.16.3 instalado correctamente

- [x] **Instalar driver PostgreSQL**:
  - [x] Ejecutado `npm install pg` en `/backend`
  - [x] Eliminado `better-sqlite3` (ya no necesario)

### ✅ Mejoras Adicionales Implementadas
- [x] Optimizado `docker-compose.yml`:
  - [x] Añadida red personalizada `vendure-network`
  - [x] Configurado health check para PostgreSQL
  - [x] Añadido `restart: unless-stopped` a servicios
  - [x] Configuradas variables de entorno desde `.env`
  - [x] Backend espera a que DB esté healthy antes de iniciar
- [x] Creado `.env.example` con todas las variables necesarias
- [x] Creado `QUICKSTART.md` con guía de inicio paso a paso
- [x] Actualizado `synchronize: IS_DEV` para auto-sync en desarrollo

---

## 🔧 **CONFIGURACIÓN BACKEND** (Prioridad Alta)

### Configuración Base de Datos
- [ ] Crear archivo de migración para PostgreSQL
- [ ] Configurar sincronización inicial (`synchronize: true` para dev)
- [ ] Añadir variables de entorno para conexión DB en `.env`
- [ ] Verificar que la conexión funcione con `docker-compose up db`

### Custom Fields para Productos HVAC
- [ ] Añadir custom fields en `vendure-config.ts`:
  - [ ] `potenciaKw` (float) - Potencia en kW
  - [ ] `frigorias` (int) - Frigorías/hora
  - [ ] `claseEnergetica` (string) - Clase energética (A+++, A++, etc.)
  - [ ] `refrigerante` (string) - Tipo de refrigerante (R32, R410A)
  - [ ] `wifi` (boolean) - WiFi integrado
  - [ ] `garantiaAnos` (int) - Años de garantía
  - [ ] `dimensionesUnidadInterior` (string)
  - [ ] `dimensionesUnidadExterior` (string)
  - [ ] `nivelSonoro` (int) - Decibelios

### Facets (Filtros)
- [ ] Crear Facet "Marca":
  - Daikin, Mitsubishi Electric, LG, Fujitsu, Samsung, Panasonic
- [ ] Crear Facet "Tipo de Producto":
  - Split, Multisplit, Conductos, Cassette, Suelo/Techo
- [ ] Crear Facet "Potencia":
  - 2.5kW, 3.5kW, 5kW, 7kW, 10kW
- [ ] Crear Facet "Clase Energética":
  - A+++, A++, A+, A, B

### Collections (Categorías)
- [ ] Crear jerarquía de colecciones:
  - [ ] Climatización (root)
    - [ ] Aire Acondicionado
      - [ ] Split Pared
      - [ ] Multisplit
      - [ ] Conductos
      - [ ] Cassette
    - [ ] Calderas
      - [ ] Condensación
      - [ ] Biomasa
    - [ ] Accesorios
    - [ ] Servicios de Instalación

### Configuraciones Adicionales
- [ ] Configurar métodos de envío
- [ ] Configurar zonas de envío (España, provincias)
- [ ] Configurar impuestos (IVA 21%)
- [ ] Revisar método de pago (actualmente solo `dummyPaymentHandler`)

---

## 🐳 **DOCKER & DEPLOYMENT**

### Dashboard Configuration
- [x] ✅ **Dashboard UI Working**
  - [x] Configure DashboardPlugin
  - [x] Point `appDir` to `../dist/dashboard`
  - [x] Add Vite build step to Dockerfile and docker-compose
  - [x] Update vite.config.mts with correct port (3001)
  - [x] Install vite and ts-node dependencies

### Frontend Setup (Next.js)
- [x] ✅ **Frontend Project Created**
  - [x] Create project structure manually for Docker
  - [x] Configure TypeScript and Next.js 14
  - [x] Install Apollo Client dependencies
  - [x] Create Dockerfile.dev for frontend
  - [x] Add frontend service to docker-compose.yml
  
- [x] ✅ **Layout & Core Pages**
  - [x] Create Header component with navigation
  - [x] Create Footer component
  - [x] Implement root layout
  - [x] Create Home page with hero section
  - [x] Responsive design (mobile/tablet/desktop)
  - [x] **Frontend running on http://localhost:3000**

### ✅ Completado en sesión actual

- [x] **Custom Fields HVAC (Backend)**
  - [x] `potenciaKw` - Potencia en kW
  - [x] `frigorias` - Frigorías/hora
  - [x] `claseEnergetica` - Clase energética (A+++, A++, etc.)
  - [x] `refrigerante` - Tipo de refrigerante (R32, R410A, etc.)
  - [x] `wifi` - WiFi integrado
  - [x] `garantiaAnos` - Años de garantía
  - [x] `dimensionesUnidadInterior/Exterior` - Dimensiones
  - [x] `nivelSonoro` - Nivel sonoro en dB

- [x] **Páginas Adicionales**
  - [x] `/productos` - Productos page (con filtros de categoría y marca)
  - [x] `/servicios` - Servicios page (con tarjetas, precios y CTA)
  - [x] `/conocenos` - Conócenos/About page (timeline, equipo, valores)
  - [x] `/login` - Login page
  - [x] `/registro` - Registro page

### 🔄 Pendiente para próxima sesión

- [x] **Integración Vendure GraphQL**
  - [x] Crear Apollo Client configurado
  - [x] Definir queries básicas (GET_ACTIVE_CUSTOMER, GET_PRODUCTS)
  - [x] Definir mutations auth (REGISTER_CUSTOMER, LOGIN, LOGOUT)
  - [x] Implementar formularios de autenticación

- [x] **Backend Configuration**
  - [x] Añadir Custom Fields para productos HVAC
  - [ ] Crear Facets (Marca, Tipo, Potencia, Clase Energética)
  - [ ] Crear Collections (Categorías)
  - [ ] Script de importación masiva desde WooCommerce/PrestaShop MySQL

### Dockerfile Production
- [ ] Decidir ubicación del frontend:
  - Opción A: Carpeta `/frontend` en este proyecto
  - Opción B: Migrar frontend existente de `Uniclima---Desarrollo`
- [ ] Crear proyecto Next.js 14 con TypeScript
- [ ] Configurar estructura de carpetas modular

### Integración Vendure (GraphQL)
- [ ] Instalar dependencias:
  - `@apollo/client`
  - `graphql`
  - `@apollo/experimental-nextjs-app-support` (para App Router)
- [ ] Crear cliente Apollo en `lib/vendure/client.ts`
- [ ] Configurar endpoint: `http://localhost:3001/shop-api`

### Queries GraphQL
- [ ] Crear `lib/vendure/queries/products.ts`:
  - [ ] `GET_PRODUCTS` - Listado con paginación
  - [ ] `GET_PRODUCT_BY_SLUG` - Detalle individual
  - [ ] `SEARCH_PRODUCTS` - Búsqueda con filtros
- [ ] Crear `lib/vendure/queries/collections.ts`:
  - [ ] `GET_COLLECTIONS` - Categorías
- [ ] Crear `lib/vendure/queries/cart.ts`:
  - [ ] `GET_ACTIVE_ORDER` - Carrito activo

### Mutations GraphQL
- [ ] Crear `lib/vendure/mutations/cart.ts`:
  - [ ] `ADD_TO_CART` - Añadir producto
  - [ ] `REMOVE_FROM_CART` - Eliminar producto
  - [ ] `UPDATE_QUANTITY` - Actualizar cantidad
- [ ] Crear `lib/vendure/mutations/checkout.ts`:
  - [ ] `ADD_SHIPPING_INFO`
  - [ ] `ADD_PAYMENT`
  - [ ] `COMPLETE_ORDER`

### Componentes UI
- [ ] Sistema de diseño (`design-system/`):
  - [ ] `tokens.css` - Variables CSS globales
  - [ ] `themes/default.css` - Tema actual
- [ ] Componentes core (`components/core/`):
  - [ ] `Button` - Botón reutilizable
  - [ ] `Card` - Tarjeta genérica
  - [ ] `Input` - Campo de formulario
  - [ ] `Badge` - Etiqueta (ej: "Oferta", "Nuevo")
- [ ] Componentes sections (`components/sections/`):
  - [ ] `ProductCard` - Tarjeta de producto
  - [ ] `ProductGrid` - Grid con filtros
  - [ ] `ProductFilters` - Panel de filtros
  - [ ] `CartDrawer` - Carrito lateral
  - [ ] `CheckoutForm` - Formulario de checkout
- [ ] Layout (`components/layout/`):
  - [ ] `Header` - Cabecera con navegación
  - [ ] `Footer` - Pie de página
  - [ ] `Sidebar` - Barra lateral para filtros

### Páginas
- [ ] `app/page.tsx` - Home con productos destacados
- [ ] `app/productos/page.tsx` - Catálogo con filtros
- [ ] `app/productos/[slug]/page.tsx` - Detalle de producto
- [ ] `app/carrito/page.tsx` - Vista del carrito
- [ ] `app/checkout/page.tsx` - Proceso de pago
- [ ] `app/pedido/[code]/page.tsx` - Confirmación de pedido

---

## 🧪 **TESTING & VERIFICACIÓN**

### Backend Testing
- [ ] Levantar PostgreSQL: `docker-compose up db -d`
- [ ] Verificar logs de la DB
- [ ] Levantar backend: `docker-compose up backend`
- [ ] Acceder al Dashboard: `http://localhost:3001/dashboard`
- [ ] Login con credenciales superadmin
- [ ] Crear un producto de prueba manualmente
- [ ] Verificar GraphQL Playground: `http://localhost:3001/shop-api`

### Frontend Testing (cuando exista)
- [ ] Verificar conexión Apollo Client
- [ ] Probar query de productos desde frontend
- [ ] Validar que las imágenes se muestren
- [ ] Probar añadir al carrito
- [ ] Verificar flujo de checkout completo

### Integration Testing
- [ ] E2E: Compra completa (frontend → backend → DB)
- [ ] Verificar persistencia de datos tras reiniciar contenedores
- [ ] Probar filtros y búsqueda

---

## 📚 **DATOS DE PRUEBA**

### Productos HVAC de Ejemplo
- [ ] Crear 10-15 productos representativos:
  - [ ] Daikin Split 2.5kW (ej: FTXM25R)
  - [ ] Mitsubishi Electric 3.5kW (ej: MSZ-AP35VGK)
  - [ ] LG Multisplit 5kW
  - [ ] Fujitsu Conductos 7kW
  - [ ] Samsung Cassette 10kW

### Assets (Imágenes)
- [ ] Subir imágenes de productos al Asset Server
- [ ] Crear variantes de productos si es necesario
- [ ] Añadir imágenes para cada colección

---
- [ ] Documentar variables de entorno requeridas
- [ ] Crear guía de desarrollo
- [ ] Documentar estructura de custom fields
- [ ] Crear diagramas de arquitectura
