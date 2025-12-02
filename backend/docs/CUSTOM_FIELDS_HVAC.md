# 📋 Custom Fields HVAC - Documentación

**Fecha**: 02/12/2024  
**Rama**: `feature/backend-custom-fields-facets`  
**Commit**: `61bd82d`

---

## 📖 ¿Qué son los Custom Fields?

Los **Custom Fields** son campos personalizados que Vendure permite añadir a sus entidades (Producto, Cliente, Pedido, etc.). Estos campos:

- Aparecen automáticamente en el **Dashboard Admin** al crear/editar productos
- Están disponibles en las **APIs GraphQL** (shop-api y admin-api)
- Se sincronizan automáticamente con la base de datos (en desarrollo)

---

## 🔧 Campos Implementados

Se han añadido **4 Custom Fields** a la entidad `Product` para productos de climatización HVAC:

### 1. `potenciaKw` (float)
- **Descripción**: Potencia nominal del equipo en kilowatios (kW)
- **Tipo**: `float` (número decimal)
- **Ejemplos**: 2.5, 3.5, 5.0, 7.0
- **Uso**: Indica la capacidad de refrigeración/calefacción del equipo

### 2. `frigorias` (int)
- **Descripción**: Capacidad frigorífica en frigorías por hora
- **Tipo**: `int` (número entero)
- **Ejemplos**: 2150, 3010, 4300, 6020
- **Conversión**: 1 kW ≈ 860 frigorías/hora

### 3. `claseEnergetica` (string)
- **Descripción**: Clasificación de eficiencia energética según normativa europea
- **Tipo**: `string` (texto)
- **Valores válidos**: A+++, A++, A+, A, B, C, D, E, F, G
- **Nota**: Los equipos modernos suelen ser A++ o superior

### 4. `refrigerante` (string)
- **Descripción**: Tipo de gas refrigerante del equipo
- **Tipo**: `string` (texto)
- **Valores comunes**:
  - **R32**: Ecológico, bajo GWP (675), recomendado
  - **R410A**: Común pero mayor impacto ambiental (GWP 2088)
  - **R290**: Propano, muy ecológico (GWP 3), uso limitado

---

## 📍 Ubicación del Código

Los Custom Fields están definidos en:

```
backend/src/vendure-config.ts
```

**Líneas**: 60-115 (aproximadamente)

### Estructura del código:

```typescript
customFields: {
    Product: [
        {
            name: 'potenciaKw',
            type: 'float',
            label: [{ languageCode: LanguageCode.es, value: 'Potencia (kW)' }],
            description: [{ languageCode: LanguageCode.es, value: 'Potencia nominal del equipo en kilowatios' }],
            nullable: true,
            public: true,
        },
        // ... más campos
    ],
}
```

---

## 🔑 Propiedades de cada campo

| Propiedad | Valor | Descripción |
|-----------|-------|-------------|
| `name` | string | Nombre interno del campo (camelCase) |
| `type` | string | Tipo de dato: float, int, string, boolean, datetime, text |
| `label` | array | Etiqueta visible en el Dashboard (con idioma) |
| `description` | array | Descripción de ayuda para el admin |
| `nullable` | true | El campo es opcional (puede estar vacío) |
| `public` | true | Visible en shop-api (frontend puede acceder) |

---

## 🌐 Uso en GraphQL

Los Custom Fields están disponibles en las queries GraphQL bajo `customFields`:

### Query de ejemplo (shop-api):

```graphql
query GetProducts {
  products {
    items {
      id
      name
      customFields {
        potenciaKw
        frigorias
        claseEnergetica
        refrigerante
      }
    }
  }
}
```

### Mutation de ejemplo (admin-api):

```graphql
mutation CreateProduct {
  createProduct(input: {
    translations: [{
      languageCode: es
      name: "Daikin TXF35A"
      slug: "daikin-txf35a"
      description: "Split pared 3.5kW"
    }]
    customFields: {
      potenciaKw: 3.5
      frigorias: 3010
      claseEnergetica: "A++"
      refrigerante: "R32"
    }
  }) {
    id
    name
  }
}
```

---

## 🖥️ Visualización en Dashboard

Los campos aparecen automáticamente en el formulario de producto:

1. Ir a **Dashboard** → http://localhost:3001/dashboard
2. **Catalog** → **Products**
3. Click en **New Product** o editar uno existente
4. Los campos aparecen debajo de la descripción:
   - potenciaKw (campo numérico)
   - frigorias (campo numérico)
   - claseEnergetica (campo de texto)
   - refrigerante (campo de texto)

---

## ⚙️ Sincronización con Base de Datos

En **desarrollo** (`APP_ENV=dev`):
- `synchronize: true` está activado
- Los campos se crean automáticamente en la BD al reiniciar

En **producción**:
- Ejecutar migración: `npx vendure migrate`
- Genera archivo de migración en `src/migrations/`

---

## 🔜 Campos Adicionales Futuros

Si se necesitan más campos técnicos, se pueden añadir:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `seer` | float | Eficiencia estacional refrigeración |
| `scop` | float | Eficiencia estacional calefacción |
| `nivelSonoro` | int | Decibelios dB(A) interior |
| `wifi` | boolean | WiFi integrado |
| `garantiaAnos` | int | Años de garantía |
| `superficieRecomendada` | string | m² recomendados |
| `dimensiones` | string | Alto x Ancho x Profundo |

---

## 📚 Referencias

- [Vendure Docs - Custom Fields](https://docs.vendure.io/guides/developer-guide/custom-fields/)
- [Vendure Docs - Migrations](https://docs.vendure.io/guides/developer-guide/migrations/)

---

*Última actualización: 02/12/2024*