# 📘 Guía del Backend - Uniclima Vendure

## Índice

1. [Configuración General](#configuración-general)
2. [Custom Fields HVAC](#custom-fields-hvac)
3. [Facets y Collections](#facets-y-collections)
4. [Configuración E-commerce](#configuración-e-commerce)
5. [Emails](#emails)
6. [Scripts Disponibles](#scripts-disponibles)

---

## Configuración General

### Archivo Principal
```
backend/src/vendure-config.ts
```

### Puertos y URLs
| Servicio | Puerto | URL |
|----------|--------|-----|
| Shop API | 3001 | http://localhost:3001/shop-api |
| Admin API | 3001 | http://localhost:3001/admin-api |
| Dashboard | 3001 | http://localhost:3001/dashboard |
| Mailbox | 3001 | http://localhost:3001/mailbox |

### Base de Datos
- **Motor:** PostgreSQL 13
- **Puerto:** 6543 (host) → 5432 (container)
- **Synchronize:** `true` en desarrollo (auto-migración)

---

## Custom Fields HVAC

Se han implementado **19 campos personalizados** para productos de climatización:

### Campos Principales
| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `potenciaKw` | float | Potencia en kW | 3.5 |
| `frigorias` | int | Frigorías/hora | 3010 |
| `claseEnergetica` | string | Eficiencia | "A++" |
| `refrigerante` | string | Tipo de gas | "R32" |
| `wifi` | boolean | WiFi integrado | true |
| `garantiaAnos` | int | Años garantía | 3 |

### Campos de Eficiencia
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `seer` | float | Eficiencia refrigeración estacional |
| `scop` | float | Eficiencia calefacción estacional |

### Campos de Ruido
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `nivelSonoro` | int | Decibelios interior dB(A) |
| `nivelSonoroExterior` | int | Decibelios exterior dB(A) |

### Campos de Dimensiones
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `superficieRecomendada` | string | m² recomendados |
| `dimensionesUnidadInterior` | string | Alto x Ancho x Profundo |
| `dimensionesUnidadExterior` | string | Alto x Ancho x Profundo |
| `pesoUnidadInterior` | float | Peso en kg |
| `pesoUnidadExterior` | float | Peso en kg |

### Campos de Instalación
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `alimentacion` | string | Monofásico/Trifásico |
| `cargaRefrigerante` | float | kg de gas |
| `longitudMaximaTuberia` | int | Metros máximos |
| `desnivelMaximo` | int | Metros desnivel |

### Uso en GraphQL
```graphql
query GetProduct($slug: String!) {
  product(slug: $slug) {
    name
    customFields {
      potenciaKw
      frigorias
      claseEnergetica
      refrigerante
      wifi
    }
  }
}
```

---

## Facets y Collections

### Facets Configurados (6 facets, 39 valores)

| Facet | Valores |
|-------|---------|
| **Marca** | Daikin, Mitsubishi Electric, LG, Fujitsu, Samsung, Panasonic, Toshiba, Hitachi, Haier, Midea |
| **Tipo de Producto** | Split Pared, Multisplit, Conductos, Cassette, Suelo/Techo, Portátil, Ventana |
| **Clase Energética** | A+++, A++, A+, A, B, C |
| **Refrigerante** | R32, R410A, R290, R134a |
| **Potencia** | <2.5kW, 2.5-3.5kW, 3.5-5kW, 5-7kW, >7kW |
| **Características** | WiFi, Inverter, Silencioso, Bomba de Calor, Purificador, Ionizador |

### Collections (42 categorías)

```
📁 Climatización
├── 📁 Aire Acondicionado
│   ├── Split Pared
│   ├── Multisplit 2x1, 3x1, 4x1
│   ├── Conductos
│   ├── Cassette
│   ├── Suelo/Techo
│   └── Portátil
├── 📁 Calefacción
│   ├── Calderas Condensación
│   ├── Calderas Biomasa
│   ├── Aerotermia
│   ├── Radiadores
│   └── Suelo Radiante
├── 📁 Ventilación
│   ├── Recuperadores de calor
│   ├── Extractores
│   └── Ventiladores de techo
└── 📁 Tratamiento de Aire
    ├── Deshumidificadores
    ├── Purificadores
    └── Humidificadores

📁 Accesorios
├── Soportes y fijaciones
├── Kits de instalación
├── Mandos a distancia
├── Filtros de repuesto
└── Tuberías y conexiones

📁 Repuestos
├── Compresores
├── Placas electrónicas
├── Motores de ventilador
└── Por marca

📁 Servicios
├── Instalación Split
├── Instalación Multisplit
├── Instalación Conductos
├── Mantenimiento preventivo
├── Reparación
└── Carga de gas
```

---

## Configuración E-commerce

### Zona e Impuestos
- **Zona:** España
- **IVA:** 21% (incluido en precio)
- **Tax Category:** IVA Estándar

### Métodos de Envío
| Método | Precio | Tiempo |
|--------|--------|--------|
| Envío Estándar | 50€ | 5-7 días |
| Envío Express | 100€ | 24-48h |
| Recogida en Tienda | Gratis | - |
| Envío Gratis | 0€ | Pedidos >1000€ |

### Métodos de Pago
- **Desarrollo:** Dummy Payment (testing)
- **Producción:** Stripe, PayPal, Redsys (pendiente)

---

## Emails

### Configuración Actual
```typescript
fromAddress: '"Uniclima Solutions" <pedidos@uniclima.es>'
```

### URLs de Frontend en Emails
| Tipo | URL |
|------|-----|
| Verificar email | http://localhost:3000/cuenta/verificar-email |
| Resetear password | http://localhost:3000/cuenta/resetear-password |
| Cambiar email | http://localhost:3000/cuenta/cambiar-email |

### Tipos de Email
1. **Bienvenida** - Al registrarse
2. **Confirmación de pedido** - Al completar compra
3. **Actualización de estado** - Cambios en pedido
4. **Reseteo de contraseña** - Solicitud de recuperación

### Ver Emails en Desarrollo
- **URL:** http://localhost:3001/mailbox
- Los emails se guardan como archivos HTML (no se envían)

### Configurar SMTP para Producción
```typescript
// En vendure-config.ts
EmailPlugin.init({
    devMode: false,
    transport: {
        type: 'smtp',
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    },
})
```

---

## Scripts Disponibles

Ubicación: `backend/scripts/`

### Ejecutar un Script
```bash
cd backend
npx tsx scripts/NOMBRE_SCRIPT.ts
```

### Scripts Principales

| Script | Descripción |
|--------|-------------|
| `seed-facets.ts` | Crea los 6 facets con 39 valores |
| `seed-collections.ts` | Crea las 42 categorías |
| `seed-products-hvac.ts` | Crea 8 productos de ejemplo |
| `seed-shipping-methods.ts` | Crea los 4 métodos de envío |
| `seed-tax-config.ts` | Configura IVA 21% España |
| `update-product-images.ts` | Actualiza imágenes de productos |
| `cleanup-duplicate-facets.ts` | Limpia facets duplicados |

### Orden de Ejecución Recomendado
```bash
# 1. Primero impuestos y zona
npx tsx scripts/seed-tax-config.ts

# 2. Facets (filtros)
npx tsx scripts/seed-facets.ts

# 3. Collections (categorías)
npx tsx scripts/seed-collections.ts

# 4. Métodos de envío
npx tsx scripts/seed-shipping-methods.ts

# 5. Productos de ejemplo
npx tsx scripts/seed-products-hvac.ts
```

---

## Comandos del Backend

```bash
# Desarrollo (con hot reload)
npm run dev

# Build para producción
npm run build

# Iniciar producción
npm run start

# Generar migración
npx vendure migrate
```

---

*Última actualización: 03/12/2025*