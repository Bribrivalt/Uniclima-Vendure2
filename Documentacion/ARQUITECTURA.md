# 🏗️ Arquitectura del Proyecto - Uniclima E-commerce

## Diagrama General

```
┌─────────────────────────────────────────────────────────────────┐
│                         USUARIO                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS FRONTEND                              │
│                      Puerto: 3000                                │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ components/                                                  ││
│  │  ├── core/       (Button, Card, Modal, Input, Dropdown...)  ││
│  │  ├── product/    (ProductCard, Search, Sort, Pagination)    ││
│  │  ├── cart/       (CartItem, CartSummary)                    ││
│  │  ├── checkout/   (CheckoutSteps, ShippingForm, OrderSummary)││
│  │  ├── auth/       (ProtectedRoute)                           ││
│  │  └── layout/     (Header, Footer, TopBar)                   ││
│  └─────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ lib/vendure/  ← Cliente GraphQL                             ││
│  │  ├── client.ts       (Apollo Client)                        ││
│  │  ├── queries/        (products, cart, auth)                 ││
│  │  └── mutations/      (cart, order, auth)                    ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ GraphQL HTTP
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VENDURE BACKEND                               │
│                      Puerto: 3001                                │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │   Shop API     │  │   Admin API    │  │   Dashboard    │     │
│  │  /shop-api     │  │  /admin-api    │  │  /dashboard    │     │
│  └────────────────┘  └────────────────┘  └────────────────┘     │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Custom Fields HVAC (19 campos técnicos)                     ││
│  │  potenciaKw, frigorias, claseEnergetica, refrigerante...    ││
│  └─────────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ Facets: Marca, Tipo, Potencia, Refrigerante, Características││
│  │ Collections: Climatización, Accesorios, Repuestos, Servicios││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    POSTGRESQL                                    │
│                      Puerto: 6543                                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Estructura de Carpetas

```
Uniclima-Vendure2/
├── 📁 Documentacion/           # Documentación del proyecto
│   ├── QUICKSTART.md
│   ├── ARQUITECTURA.md
│   ├── backend/
│   │   └── GUIA_BACKEND.md
│   └── frontend/
│       └── GUIA_FRONTEND.md
│
├── 📁 Planificacion/           # TODOs y estado del proyecto
│   ├── TODO_BACKEND.md
│   ├── TODO_FRONTEND.md
│   └── ESTADO_PROYECTO.md
│
├── 📁 backend/                 # Vendure Backend
│   ├── src/
│   │   ├── vendure-config.ts   # Configuración principal
│   │   ├── index.ts            # Entry point
│   │   └── index-worker.ts     # Worker de Vendure
│   ├── scripts/                # Scripts de seed
│   ├── static/                 # Assets y templates de email
│   ├── package.json
│   └── Dockerfile
│
├── 📁 frontend/                # Next.js Frontend
│   ├── app/                    # App Router (páginas)
│   ├── components/             # Componentes React
│   ├── lib/                    # Utilidades y cliente GraphQL
│   ├── styles/                 # CSS tokens y temas
│   ├── package.json
│   └── Dockerfile.dev
│
├── docker-compose.yml          # Orquestación de servicios
└── .env.example                # Variables de entorno ejemplo
```

---

## 🔧 Tecnologías Utilizadas

### Backend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| Vendure | 3.5.1 | Framework e-commerce headless |
| TypeScript | 5.x | Lenguaje de programación |
| PostgreSQL | 13 | Base de datos |
| Node.js | 18+ | Runtime |

### Frontend
| Tecnología | Versión | Uso |
|------------|---------|-----|
| Next.js | 14.2 | Framework React |
| React | 18 | UI Library |
| Apollo Client | 3.x | Cliente GraphQL |
| TypeScript | 5.x | Lenguaje de programación |
| CSS Modules | - | Estilos con scope |

### Infraestructura
| Tecnología | Uso |
|------------|-----|
| Docker | Contenedorización |
| Docker Compose | Orquestación local |

---

## 🔗 Flujo de Datos

```
Usuario → Frontend (Next.js) → GraphQL Query/Mutation → Backend (Vendure) → PostgreSQL
                ↑                                              │
                └──────────────── Respuesta JSON ──────────────┘
```

### Ejemplo: Añadir al Carrito

1. Usuario hace clic en "Añadir al carrito"
2. Frontend ejecuta mutation `addItemToOrder`
3. Vendure procesa la petición, actualiza la orden en BD
4. Vendure devuelve la orden actualizada
5. Frontend actualiza el estado del carrito

---

## 📊 Modelo de Datos Clave

### Producto HVAC
```typescript
{
  id: string;
  name: string;
  slug: string;
  description: string;
  featuredAsset: { preview: string };
  variants: [{
    id: string;
    sku: string;
    priceWithTax: number;
    stockLevel: string;
  }];
  customFields: {
    potenciaKw: number;       // 2.5, 3.5, 5.0...
    frigorias: number;        // 2150, 3010...
    claseEnergetica: string;  // A+++, A++...
    refrigerante: string;     // R32, R410A...
    wifi: boolean;
    garantiaAnos: number;
    seer: number;
    scop: number;
    nivelSonoro: number;
    // ... más campos técnicos
  };
  facetValues: [{
    name: string;             // "Daikin", "Split Pared"...
    facet: { name: string };  // "Marca", "Tipo"...
  }];
}
```

---

## 🌐 APIs GraphQL

### Shop API (Frontend → Backend)
- **URL:** `http://localhost:3001/shop-api`
- **Uso:** Operaciones del cliente (catálogo, carrito, checkout)

### Admin API (Dashboard → Backend)
- **URL:** `http://localhost:3001/admin-api`
- **Uso:** Administración (productos, pedidos, clientes)

---

*Última actualización: 03/12/2025*