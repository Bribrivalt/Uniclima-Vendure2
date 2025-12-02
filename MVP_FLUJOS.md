# 🚀 MVP - Flujos de Trabajo Paralelos

## Objetivo
Definir las tareas mínimas necesarias para tener un e-commerce funcional de climatización.

---

# 📋 FLUJO 1: BACKEND & API
**Responsable del servidor, datos y configuración de Vendure**

## Fase 1.1: Datos del Producto ✅ COMPLETADO
Prioridad: ⭐⭐⭐⭐⭐

- [x] **Custom Fields HVAC implementados** (vendure-config.ts - 19 campos totales)
  - [x] `potenciaKw` (float) - Potencia en kW
  - [x] `frigorias` (int) - Frigorías/hora
  - [x] `claseEnergetica` (string) - A+++, A++, A+, A, B
  - [x] `refrigerante` (string) - R32, R410A, R290
  - [x] Sincronización automática en dev (synchronize: true)

- [x] **Custom Fields adicionales** ✅ (02/12/2024)
  - [x] `wifi` (boolean) - WiFi integrado
  - [x] `garantiaAnos` (int) - Años de garantía
  - [x] `seer` (float) - Eficiencia refrigeración estacional
  - [x] `scop` (float) - Eficiencia calefacción estacional
  - [x] `nivelSonoro` (int) - Decibelios interior
  - [x] `nivelSonoroExterior` (int) - Decibelios exterior
  - [x] `superficieRecomendada` (string) - m² recomendados
  - [x] `dimensionesUnidadInterior` (string) - Alto x Ancho x Profundo
  - [x] `dimensionesUnidadExterior` (string) - Alto x Ancho x Profundo
  - [x] `pesoUnidadInterior` (float) - kg
  - [x] `pesoUnidadExterior` (float) - kg
  - [x] `alimentacion` (string) - Monofásico/Trifásico
  - [x] `cargaRefrigerante` (float) - kg de gas
  - [x] `longitudMaximaTuberia` (int) - metros
  - [x] `desnivelMaximo` (int) - metros desnivel

## Fase 1.2: Categorización ✅ SCRIPTS LISTOS
Prioridad: ⭐⭐⭐⭐⭐

- [x] **Script Facets creado** (scripts/seed-facets.ts)
  - [x] Marca (10 marcas: Daikin, Mitsubishi, LG, etc.)
  - [x] Tipo de Producto (7 tipos)
  - [x] Clase Energética (A+++ a C)
  - [x] Refrigerante (R32, R410A, R290, R134a)
  - [x] Potencia (5 rangos por m²)
  - [x] Características (WiFi, Inverter, Silencioso, etc.)

- [x] **Script Collections creado** (scripts/seed-collections.ts)
  - [x] Climatización > Aire Acondicionado (8 subcategorías)
  - [x] Climatización > Calefacción (5 subcategorías)
  - [x] Climatización > Ventilación (3 subcategorías)
  - [x] Climatización > Tratamiento de Aire (3 subcategorías)
  - [x] Accesorios (5 subcategorías)
  - [x] Repuestos (4 subcategorías)
  - [x] Servicios (6 subcategorías)

- [x] **Scripts ejecutados en servidor** ✅ (02/12/2024)
  - [x] `npx tsx scripts/seed-facets.ts` - 6 facets, 39 valores
  - [x] `npx tsx scripts/seed-collections.ts` - 42 categorías
  - [x] Verificado en Dashboard que se crearon

## Fase 1.3: Configuración E-commerce (PARCIAL)
Prioridad: ⭐⭐⭐⭐

- [x] **Impuestos configurados** ✅ (02/12/2024)
  - [x] Zona España creada
  - [x] IVA 21% configurado
  - [x] Canal predeterminado con zona España

- [ ] **Envíos básicos** (PENDIENTE)
  - [ ] Envío Estándar Península (50€)
  - [ ] Envío Express (100€)
  - [ ] Recogida en Tienda (Gratis)
  - [ ] Envío gratis >1000€

- [x] **Pagos básicos**
  - [x] Dummy Payment configurado (desarrollo)
  - [ ] Preparar integración Stripe (para producción)

## Fase 1.4: Emails (PENDIENTE)
Prioridad: ⭐⭐⭐

- [x] Email plugin configurado con URLs de Uniclima
- [ ] Personalizar plantilla confirmación de pedido (español)
- [ ] Personalizar plantilla registro de cuenta (español)
- [ ] Configurar SMTP real (para producción)

## Fase 1.5: Productos de Prueba (PARCIAL)
Prioridad: ⭐⭐⭐

- [x] **Producto de ejemplo creado** ✅ (02/12/2024)
  - [x] Daikin Sensira TXF35C
  - [x] Custom fields: 3.5kW, 3010 frigorías, A++, R32
  - [x] Variante con precio: 699€ + IVA = 845.79€
  - [x] Facets asignados: Daikin, Split Pared, R32, Inverter, Bomba de Calor
  - [x] Collection funcionando: aparece en "Split Pared"

- [ ] Crear 4-9 productos adicionales
- [ ] Subir imágenes de productos

---

# 📋 FLUJO 2: FRONTEND & UI
**Responsable de la interfaz de usuario y experiencia de compra**

## Fase 2.1: Sistema de Diseño (CRÍTICO)
Prioridad: ⭐⭐⭐⭐⭐

- [ ] **Variables CSS (tokens.css)**
  - [ ] Colores corporativos Uniclima
  - [ ] Tipografía (sizes, weights)
  - [ ] Espaciados
  - [ ] Breakpoints responsive

- [ ] **Componentes Core**
  - [ ] Button (primary, secondary, outline)
  - [ ] Input (text, email, password)
  - [ ] Card
  - [ ] Alert/Toast
  - [ ] Modal
  - [ ] Loading/Skeleton

## Fase 2.2: Layout (CRÍTICO)
Prioridad: ⭐⭐⭐⭐⭐

- [ ] **Header**
  - [ ] Logo
  - [ ] Navegación principal
  - [ ] Buscador
  - [ ] Icono carrito con contador
  - [ ] Login/Mi cuenta
  - [ ] Responsive (hamburguesa mobile)

- [ ] **Footer**
  - [ ] Enlaces legales
  - [ ] Contacto
  - [ ] Redes sociales

## Fase 2.3: Páginas de Producto (CRÍTICO)
Prioridad: ⭐⭐⭐⭐⭐

- [ ] **Catálogo (/productos)**
  - [ ] Grid de productos responsive
  - [ ] ProductCard con imagen, nombre, precio
  - [ ] Filtros básicos por facet
  - [ ] Paginación
  - [ ] Ordenación (precio, nombre)

- [ ] **Detalle (/productos/[slug])**
  - [ ] Galería de imágenes
  - [ ] Nombre, descripción, precio
  - [ ] Especificaciones técnicas (custom fields)
  - [ ] Botón añadir al carrito
  - [ ] Indicador de stock

- [ ] **Categoría (/categoria/[slug])**
  - [ ] Listado de productos por collection
  - [ ] Breadcrumb

## Fase 2.4: Carrito (CRÍTICO)
Prioridad: ⭐⭐⭐⭐⭐

- [ ] **Página Carrito (/carrito)**
  - [ ] Lista de items
  - [ ] Modificar cantidad
  - [ ] Eliminar items
  - [ ] Subtotal, impuestos, total
  - [ ] Botón ir a checkout

- [ ] **MiniCart (Header)**
  - [ ] Icono con contador
  - [ ] Dropdown/drawer con resumen

## Fase 2.5: Checkout (CRÍTICO)
Prioridad: ⭐⭐⭐⭐⭐

- [ ] **Checkout básico (/checkout)**
  - [ ] Formulario de datos de envío
  - [ ] Selección método de envío
  - [ ] Selección método de pago
  - [ ] Resumen del pedido
  - [ ] Botón confirmar pedido

- [ ] **Confirmación (/pedido/[code])**
  - [ ] Número de pedido
  - [ ] Resumen de compra
  - [ ] Próximos pasos

## Fase 2.6: Autenticación (IMPORTANTE)
Prioridad: ⭐⭐⭐⭐

- [ ] **Login (/login)**
  - [ ] Formulario email/password
  - [ ] Link a registro
  - [ ] Link olvidé contraseña

- [ ] **Registro (/registro)**
  - [ ] Formulario básico
  - [ ] Validaciones

- [ ] **Mi Cuenta (/cuenta)**
  - [ ] Datos del usuario
  - [ ] Historial de pedidos básico

## Fase 2.7: Home Page (IMPORTANTE)
Prioridad: ⭐⭐⭐⭐

- [ ] **Home (/)**
  - [ ] Hero banner
  - [ ] Categorías destacadas
  - [ ] Productos destacados (4-8)
  - [ ] Por qué elegirnos

## Fase 2.8: Integración GraphQL (EN PARALELO)
Prioridad: ⭐⭐⭐⭐⭐

- [ ] **Queries**
  - [ ] GET_PRODUCTS
  - [ ] GET_PRODUCT_BY_SLUG
  - [ ] GET_COLLECTIONS
  - [ ] GET_ACTIVE_ORDER

- [ ] **Mutations**
  - [ ] ADD_ITEM_TO_ORDER
  - [ ] ADJUST_ORDER_LINE
  - [ ] REMOVE_ORDER_LINE
  - [ ] SET_SHIPPING_ADDRESS
  - [ ] SET_SHIPPING_METHOD
  - [ ] ADD_PAYMENT_TO_ORDER
  - [ ] REGISTER_CUSTOMER
  - [ ] LOGIN / LOGOUT

---

# 📅 TIMELINE MVP (3-4 Semanas restantes)

## ✅ Ya Completado (02/12/2024)
| FLUJO 1 (Backend) | FLUJO 2 (Frontend) |
|-------------------|-------------------|
| ✅ Custom Fields HVAC (4 campos) | ⏳ Pendiente |
| ✅ Facets ejecutados (6 facets, 39 valores) | ⏳ Pendiente |
| ✅ Collections ejecutadas (42 categorías) | ⏳ Pendiente |
| ✅ IVA España 21% configurado | ⏳ Pendiente |
| ✅ Dummy Payment configurado | ⏳ Pendiente |
| ✅ Email Plugin config | ⏳ Pendiente |
| ✅ Producto de prueba (Daikin + variante) | ⏳ Pendiente |
| ✅ Collection con filtro funcionando | ⏳ Pendiente |

## Semana 1 (Próxima)
| FLUJO 1 (Backend) | FLUJO 2 (Frontend) |
|-------------------|-------------------|
| ~~Ejecutar seed facets/collections~~ ✅ | Sistema de diseño (tokens) |
| Configurar envíos | Componentes core |
| Crear más productos de prueba | Layout (Header/Footer) |
| Añadir Custom Fields adicionales | |

## Semana 2
| FLUJO 1 (Backend) | FLUJO 2 (Frontend) |
|-------------------|-------------------|
| Personalizar emails español | Catálogo de productos |
| Asignar facets a productos | Detalle de producto |
| Testing Admin API | Integración GraphQL queries |

## Semana 3
| FLUJO 1 (Backend) | FLUJO 2 (Frontend) |
|-------------------|-------------------|
| Ajustes y refinamiento | Carrito funcional |
| Documentación | Checkout completo |
| Preparar Stripe | Integración GraphQL mutations |

## Semana 4
| FLUJO 1 (Backend) | FLUJO 2 (Frontend) |
|-------------------|-------------------|
| Testing final | Autenticación |
| Preparar producción | Home page |
| Deploy staging | Testing y pulido |

---

# ✅ Criterios de MVP Completado

El MVP está listo cuando un usuario puede:

1. ✅ Ver la home page con productos destacados
2. ✅ Navegar por categorías
3. ✅ Ver el catálogo con filtros básicos
4. ✅ Ver el detalle de un producto con especificaciones HVAC
5. ✅ Añadir productos al carrito
6. ✅ Modificar cantidades en el carrito
7. ✅ Hacer checkout (datos + envío + pago)
8. ✅ Recibir confirmación de pedido
9. ✅ Registrarse / Iniciar sesión
10. ✅ Ver historial de pedidos básico

---

# 🔄 Dependencias entre Flujos

```
FLUJO 1 (Backend)              FLUJO 2 (Frontend)
     │                              │
     │ Custom Fields ──────────────►│ Mostrar specs en detalle
     │                              │
     │ Facets ─────────────────────►│ Filtros en catálogo
     │                              │
     │ Collections ────────────────►│ Navegación por categorías
     │                              │
     │ Productos ejemplo ──────────►│ Datos para mostrar
     │                              │
     │ Config envíos ──────────────►│ Selector en checkout
     │                              │
     │ Config pagos ───────────────►│ Métodos en checkout
```

**Importante**: Ambos flujos pueden avanzar en paralelo, pero Frontend necesita que Backend tenga los datos configurados para poder integrar y probar.

---

*Creado: 02/12/2024*