# 📗 Guía del Frontend - Uniclima Vendure

## Índice

1. [Estructura del Proyecto](#estructura-del-proyecto)
2. [Sistema de Diseño](#sistema-de-diseño)
3. [Componentes](#componentes)
4. [Páginas](#páginas)
5. [Integración GraphQL](#integración-graphql)
6. [Convenciones](#convenciones)

---

## Estructura del Proyecto

```
frontend/
├── app/                        # Next.js App Router (páginas)
│   ├── layout.tsx              # Layout principal
│   ├── page.tsx                # Home
│   ├── globals.css             # Estilos globales
│   ├── carrito/                # Página del carrito
│   ├── checkout/               # Proceso de compra
│   ├── contacto/               # Formulario de contacto
│   ├── cuenta/                 # Área de cliente
│   ├── login/                  # Inicio de sesión
│   ├── registro/               # Registro de usuario
│   ├── productos/              # Catálogo y detalle
│   ├── servicios/              # Servicios ofrecidos
│   └── [páginas legales]/      # Privacidad, términos, cookies
│
├── components/
│   ├── core/                   # Componentes base reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Alert.tsx
│   │   ├── Modal.tsx
│   │   ├── Dropdown.tsx
│   │   ├── Tabs.tsx
│   │   └── Skeleton.tsx
│   │
│   ├── product/                # Componentes de producto
│   │   ├── ProductCard.tsx
│   │   ├── ProductSearch.tsx
│   │   ├── ProductSort.tsx
│   │   ├── ProductPagination.tsx
│   │   └── QuoteModal.tsx
│   │
│   ├── cart/                   # Componentes del carrito
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   │
│   ├── checkout/               # Componentes de checkout
│   │   ├── CheckoutSteps.tsx
│   │   ├── ShippingForm.tsx
│   │   └── OrderSummary.tsx
│   │
│   ├── auth/                   # Componentes de autenticación
│   │   └── ProtectedRoute.tsx
│   │
│   └── layout/                 # Estructura de página
│       ├── Header.tsx
│       ├── Footer.tsx
│       └── TopBar.tsx
│
├── lib/
│   ├── vendure/                # Cliente GraphQL
│   │   ├── client.ts           # Apollo Client config
│   │   ├── queries/            # Queries GraphQL
│   │   └── mutations/          # Mutations GraphQL
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── useMediaQuery.ts
│   │   └── useFocusTrap.ts
│   │
│   ├── seo/                    # Utilidades SEO
│   │   └── metadata.ts
│   │
│   ├── types/                  # TypeScript types
│   │   └── product.ts
│   │
│   ├── auth-context.tsx        # Contexto de autenticación
│   └── providers.tsx           # Providers de la app
│
└── styles/
    ├── tokens.css              # Design tokens (variables CSS)
    └── themes/
        └── default.css         # Tema por defecto
```

---

## Sistema de Diseño

### Design Tokens (`styles/tokens.css`)

```css
:root {
  /* Colores */
  --color-primary: #0066CC;
  --color-secondary: #FF6600;
  --color-success: #28A745;
  --color-error: #DC3545;
  --color-warning: #FFC107;
  
  /* Tipografía */
  --font-family: 'Inter', sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  
  /* Espaciados */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Bordes */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  
  /* Sombras */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  
  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

### Uso de Variables
```css
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
}
```

---

## Componentes

### Componentes Core

#### Button
```tsx
import { Button } from '@/components/core';

<Button variant="primary" size="md" loading={false}>
  Añadir al carrito
</Button>

// Variantes: primary, secondary, outline, ghost
// Tamaños: sm, md, lg
```

#### Input
```tsx
import { Input } from '@/components/core';

<Input
  type="email"
  label="Email"
  error="Email inválido"
  placeholder="tu@email.com"
/>
```

#### Card
```tsx
import { Card } from '@/components/core';

<Card variant="elevated" padding="md">
  Contenido de la tarjeta
</Card>
```

#### Modal
```tsx
import { Modal } from '@/components/core';

<Modal isOpen={isOpen} onClose={handleClose} title="Título">
  Contenido del modal
</Modal>
```

### Componentes de Producto

#### ProductCard
```tsx
import { ProductCard } from '@/components/product';

<ProductCard
  product={product}
  onAddToCart={handleAddToCart}
  onRequestQuote={handleQuote}
/>
```

### Componentes de Checkout

#### CheckoutSteps
```tsx
import { CheckoutSteps } from '@/components/checkout';

<CheckoutSteps
  currentStep={2}
  steps={['Datos', 'Envío', 'Pago', 'Confirmación']}
/>
```

---

## Páginas

### Rutas Principales

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/` | `app/page.tsx` | Home |
| `/productos` | `app/productos/page.tsx` | Catálogo |
| `/productos/[slug]` | `app/productos/[slug]/page.tsx` | Detalle producto |
| `/carrito` | `app/carrito/page.tsx` | Carrito de compra |
| `/checkout` | `app/checkout/page.tsx` | Proceso de pago |
| `/login` | `app/login/page.tsx` | Inicio sesión |
| `/registro` | `app/registro/page.tsx` | Registro |
| `/cuenta` | `app/cuenta/page.tsx` | Área cliente |

### Páginas Secundarias

| Ruta | Descripción |
|------|-------------|
| `/servicios` | Servicios de instalación |
| `/repuestos` | Catálogo de repuestos |
| `/contacto` | Formulario de contacto |
| `/conocenos` | Sobre la empresa |

### Páginas Legales

| Ruta | Descripción |
|------|-------------|
| `/privacidad` | Política de privacidad |
| `/terminos` | Términos y condiciones |
| `/cookies` | Política de cookies |

---

## Integración GraphQL

### Cliente Apollo (`lib/vendure/client.ts`)

```typescript
import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_VENDURE_API_URL || 'http://localhost:3001/shop-api',
  cache: new InMemoryCache(),
  credentials: 'include', // Para cookies de sesión
});
```

### Queries Disponibles

```typescript
// lib/vendure/queries/products.ts
import { GET_PRODUCTS, GET_PRODUCT_BY_SLUG, SEARCH_PRODUCTS } from '@/lib/vendure/queries';

// Uso
const { data } = await client.query({
  query: GET_PRODUCTS,
  variables: { take: 12, skip: 0 }
});
```

| Query | Descripción |
|-------|-------------|
| `GET_PRODUCTS` | Lista de productos con paginación |
| `GET_PRODUCT_BY_SLUG` | Detalle de producto por slug |
| `SEARCH_PRODUCTS` | Búsqueda con filtros |
| `GET_COLLECTIONS` | Lista de categorías |
| `GET_ACTIVE_ORDER` | Carrito actual |
| `GET_ACTIVE_CUSTOMER` | Usuario logueado |

### Mutations Disponibles

```typescript
// lib/vendure/mutations/cart.ts
import { ADD_ITEM_TO_ORDER, ADJUST_ORDER_LINE } from '@/lib/vendure/mutations';
```

| Mutation | Descripción |
|----------|-------------|
| `ADD_ITEM_TO_ORDER` | Añadir producto al carrito |
| `ADJUST_ORDER_LINE` | Cambiar cantidad |
| `REMOVE_ORDER_LINE` | Eliminar del carrito |
| `SET_SHIPPING_ADDRESS` | Guardar dirección |
| `SET_SHIPPING_METHOD` | Seleccionar envío |
| `ADD_PAYMENT_TO_ORDER` | Procesar pago |
| `LOGIN` | Iniciar sesión |
| `LOGOUT` | Cerrar sesión |
| `REGISTER_CUSTOMER` | Registrar usuario |

---

## Convenciones

### Nombrado de Archivos
- Componentes: `PascalCase.tsx` (ej: `ProductCard.tsx`)
- Estilos: `PascalCase.module.css` (ej: `ProductCard.module.css`)
- Hooks: `camelCase.ts` (ej: `useMediaQuery.ts`)
- Páginas: `page.tsx` (Next.js App Router)

### CSS Modules
Todos los componentes usan CSS Modules para evitar conflictos:

```tsx
// ProductCard.tsx
import styles from './ProductCard.module.css';

export function ProductCard() {
  return <div className={styles.card}>...</div>;
}
```

### TypeScript
- Usar interfaces para props de componentes
- Exportar tipos desde `lib/types/`
- Evitar `any`, usar tipos específicos

### Imports
```typescript
// Orden de imports
1. React/Next.js
2. Librerías externas
3. Componentes locales (@/components)
4. Utilidades (@/lib)
5. Estilos
```

---

## Hooks Personalizados

### useMediaQuery
```typescript
import { useMediaQuery } from '@/lib/hooks';

const isMobile = useMediaQuery('(max-width: 768px)');
```

### useFocusTrap
```typescript
import { useFocusTrap } from '@/lib/hooks';

const modalRef = useFocusTrap(isOpen);
```

---

## Variables de Entorno

```bash
# .env.local
NEXT_PUBLIC_VENDURE_API_URL=http://localhost:3001/shop-api
```

---

## Comandos

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm run start

# Lint
npm run lint
```

---

*Última actualización: 03/12/2025*