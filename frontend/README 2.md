# 🏠 Uniclima Frontend

Frontend e-commerce para Uniclima, tienda especializada en equipos de climatización HVAC (aire acondicionado, calefacción, ventilación).

## 🛠️ Stack Tecnológico

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** CSS Modules + Design Tokens
- **Estado:** React Context + Apollo Client
- **Backend:** Vendure (Headless Commerce)
- **Testing:** Jest + React Testing Library

## 📁 Estructura del Proyecto

```
frontend/
├── app/                    # Páginas (Next.js App Router)
│   ├── page.tsx           # Home
│   ├── productos/         # Catálogo y detalle de productos
│   ├── carrito/           # Carrito de compra
│   ├── checkout/          # Proceso de checkout
│   ├── cuenta/            # Área de cliente
│   ├── buscar/            # Búsqueda de productos
│   ├── categoria/         # Páginas de categorías
│   └── ...                # Otras páginas
├── components/
│   ├── core/              # Componentes base reutilizables
│   │   ├── Button.tsx     # Botón con variantes
│   │   ├── Input.tsx      # Campo de entrada
│   │   ├── Modal.tsx      # Diálogo modal
│   │   ├── Card.tsx       # Tarjeta contenedora
│   │   ├── Alert.tsx      # Alertas y notificaciones
│   │   ├── Tabs.tsx       # Pestañas
│   │   ├── Dropdown.tsx   # Selector desplegable
│   │   ├── Checkbox.tsx   # Checkbox con label
│   │   ├── Radio.tsx      # Radio buttons
│   │   ├── Badge.tsx      # Etiquetas/badges
│   │   ├── Breadcrumb.tsx # Navegación breadcrumb
│   │   ├── Accordion.tsx  # Acordeón colapsable
│   │   ├── Tooltip.tsx    # Tooltips
│   │   ├── Avatar.tsx     # Avatar de usuario
│   │   ├── Rating.tsx     # Estrellas de rating
│   │   ├── Skeleton.tsx   # Loading skeletons
│   │   ├── CookieBanner.tsx # Banner GDPR
│   │   └── SkipLink.tsx   # Skip to content (a11y)
│   ├── product/           # Componentes de producto
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── ProductTabs.tsx
│   │   ├── ProductSpecs.tsx
│   │   └── ...
│   ├── cart/              # Componentes de carrito
│   │   ├── CartItem.tsx
│   │   ├── CartDrawer.tsx
│   │   ├── CartSummary.tsx
│   │   └── MiniCart.tsx
│   ├── checkout/          # Componentes de checkout
│   │   ├── CheckoutSteps.tsx
│   │   ├── AddressForm.tsx
│   │   ├── ShippingMethodSelector.tsx
│   │   └── PaymentMethodSelector.tsx
│   ├── auth/              # Componentes de autenticación
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   └── layout/            # Componentes de layout
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── TopBar.tsx
│       └── MobileMenu.tsx
├── lib/
│   ├── vendure/           # Cliente GraphQL y operaciones
│   │   ├── client.ts      # Apollo Client config
│   │   ├── queries/       # Queries GraphQL
│   │   └── mutations/     # Mutations GraphQL
│   ├── hooks/             # Custom hooks
│   │   ├── useMediaQuery.ts
│   │   └── useFocusTrap.ts
│   ├── seo/               # Utilidades SEO
│   │   └── metadata.ts
│   ├── auth-context.tsx   # Context de autenticación
│   └── providers.tsx      # Providers wrapper
├── styles/
│   ├── tokens.css         # Design tokens (colores, spacing, etc.)
│   └── themes/
│       └── default.css    # Tema por defecto
└── public/                # Assets estáticos
```

## 🚀 Instalación

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Backend Vendure corriendo (puerto 3000)

### Pasos

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/uniclima-vendure2.git
cd uniclima-vendure2/frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Editar .env.local con tu configuración
# NEXT_PUBLIC_VENDURE_API_URL=http://localhost:3000/shop-api
```

## 💻 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# El frontend estará disponible en http://localhost:3001
```

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm test

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch
```

## 🏗️ Build para Producción

```bash
# Crear build de producción
npm run build

# Iniciar servidor de producción
npm start
```

## 🎨 Sistema de Diseño

### Design Tokens

Los tokens de diseño están definidos en `styles/tokens.css`:

```css
/* Colores */
--color-primary: #DC2626;      /* Rojo Uniclima */
--color-secondary: #1E40AF;    /* Azul secundario */
--color-success: #059669;
--color-warning: #D97706;
--color-error: #DC2626;

/* Espaciados */
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-4: 1rem;     /* 16px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */

/* Tipografía */
--font-family: 'Inter', system-ui, sans-serif;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;

/* Breakpoints */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

### Uso de Componentes

```tsx
import { Button, Input, Card, Modal } from '@/components/core';

// Botón con variantes
<Button variant="primary" size="lg">
  Comprar ahora
</Button>

// Input con validación
<Input
  label="Email"
  type="email"
  error="Email inválido"
  required
/>

// Modal
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <h2>Título del modal</h2>
  <p>Contenido...</p>
</Modal>
```

## 🔌 Integración con Vendure

### Queries

```typescript
import { GET_PRODUCTS, GET_PRODUCT_BY_SLUG } from '@/lib/vendure/queries/products';

// Obtener productos
const { data } = await client.query({
  query: GET_PRODUCTS,
  variables: { take: 12, skip: 0 }
});

// Obtener producto por slug
const { data } = await client.query({
  query: GET_PRODUCT_BY_SLUG,
  variables: { slug: 'aire-acondicionado-split' }
});
```

### Mutations

```typescript
import { ADD_ITEM_TO_ORDER } from '@/lib/vendure/mutations/cart';

// Añadir al carrito
const { data } = await client.mutate({
  mutation: ADD_ITEM_TO_ORDER,
  variables: { productVariantId: '123', quantity: 1 }
});
```

## ♿ Accesibilidad

El proyecto sigue las pautas WCAG 2.1 AA:

- ✅ Navegación por teclado
- ✅ Focus visible
- ✅ ARIA labels en elementos interactivos
- ✅ Skip to content link
- ✅ Contraste de colores
- ✅ Formularios accesibles

### Hooks de Accesibilidad

```typescript
import { useFocusTrap } from '@/lib/hooks/useFocusTrap';
import { useMediaQuery } from '@/lib/hooks/useMediaQuery';

// Focus trap para modales
const modalRef = useRef(null);
useFocusTrap(modalRef, isOpen);

// Media query para responsive
const isMobile = useMediaQuery('(max-width: 768px)');
```

## 📱 Responsive Design

Mobile-first approach con breakpoints:

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

## 🌐 SEO

- ✅ Meta tags optimizados
- ✅ Open Graph tags
- ✅ Schema.org markup
- ✅ Sitemap.xml dinámico
- ✅ Robots.txt
- ✅ Canonical URLs

## 📝 Variables de Entorno

```env
# API de Vendure
NEXT_PUBLIC_VENDURE_API_URL=http://localhost:3000/shop-api

# URL base del sitio (para SEO)
NEXT_PUBLIC_SITE_URL=https://uniclima.es

# Otros
NEXT_PUBLIC_GA_TRACKING_ID=UA-XXXXX-X
```

## 🗂️ Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Crea build de producción |
| `npm start` | Inicia servidor de producción |
| `npm test` | Ejecuta tests |
| `npm run lint` | Ejecuta linter |
| `npm run type-check` | Verifica tipos TypeScript |

## 📄 Licencia

Proyecto privado - Uniclima © 2024

## 🤝 Contribuir

1. Crear rama desde `main`
2. Hacer cambios siguiendo convenciones
3. Crear Pull Request con descripción clara
4. Esperar revisión de código

### Convenciones de Commits

```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formato (no afecta código)
refactor: refactorización
test: tests
chore: tareas de mantenimiento