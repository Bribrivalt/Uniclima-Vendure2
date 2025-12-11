import { gql } from '@apollo/client';

/**
 * Query para obtener lista de productos con opciones de filtrado, búsqueda y paginación
 *
 * Esta query se conecta con el backend de Vendure para obtener:
 * - Lista paginada de productos
 * - Total de productos disponibles
 * - Datos completos incluyendo custom fields HVAC
 *
 * Opciones de filtrado disponibles (ProductListOptions):
 * - filter.name.contains: Búsqueda por nombre
 * - filter.facetValueIds: Filtrar por facets (marca, tipo, características, etc.)
 * - sort: Ordenamiento (name, price, createdAt)
 * - take: Número de productos a obtener
 * - skip: Offset para paginación
 *
 * Los custom fields HVAC coinciden con los definidos en backend/vendure-config.ts
 *
 * @param {ProductListOptions} options - Opciones de filtrado y paginación
 * @returns Lista de productos con sus variantes, custom fields y total de items
 */
export const GET_PRODUCTS = gql`
  query GetProducts(
    $options: ProductListOptions
  ) {
    products(options: $options) {
      items {
        id
        name
        slug
        description
        featuredAsset {
          id
          preview
        }
        variants {
          id
          name
          price
          priceWithTax
          sku
          stockLevel
        }
        facetValues {
          id
          code
          name
          facet {
            id
            code
            name
          }
        }
        # Custom fields definidos en backend/vendure-config.ts
        customFields {
          compatibilidades
          erroresSintomas
        }
      }
      totalItems
    }
  }
`;

/**
 * Query para obtener colecciones (categorías) para filtros
 */
export const GET_COLLECTIONS = gql`
  query GetCollections {
    collections {
      items {
        id
        name
        slug
        featuredAsset {
          id
          preview
        }
      }
    }
  }
`;

/**
 * Query para obtener facets (filtros) disponibles
 * 
 * Los facets son grupos de filtros como Marca, Tipo de Producto, etc.
 * Cada facet tiene valores (facetValues) que son las opciones de filtro.
 * 
 * Ejemplo de uso:
 * - Facet "Marca" con valores: Daikin, Mitsubishi, LG, etc.
 * - Facet "Tipo de Producto" con valores: Split Pared, Multisplit, etc.
 * 
 * @returns Lista de facets con sus valores y conteo de productos
 */
export const GET_FACETS = gql`
  query GetFacets {
    facets {
      items {
        id
        code
        name
        values {
          id
          code
          name
          facet {
            id
            code
            name
          }
        }
      }
    }
  }
`;

/**
 * Query para obtener un producto individual por slug
 *
 * Esta query obtiene todos los detalles de un producto específico,
 * incluyendo todos los custom fields HVAC para mostrar en la página de detalle.
 *
 * Los custom fields coinciden exactamente con los definidos en backend/vendure-config.ts:
 * - Campos básicos: potenciaKw, frigorias, claseEnergetica, refrigerante, wifi, garantiaAnos
 * - Eficiencia: seer, scop
 * - Sonoro: nivelSonoroInterior, nivelSonoroExterior
 * - Dimensiones: superficieRecomendada, dimensionesInterior, dimensionesExterior
 * - Peso: pesoUnidadInterior, pesoUnidadExterior
 * - Instalación: alimentacion, cargaRefrigerante, longitudMaximaTuberia, desnivelMaximo
 *
 * @param {string} slug - Slug único del producto
 * @returns Producto completo con todos los custom fields
 */
export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      description
      featuredAsset {
        id
        preview
      }
      assets {
        id
        preview
      }
      variants {
        id
        name
        price
        priceWithTax
        sku
        stockLevel
      }
      facetValues {
        id
        code
        name
        facet {
          id
          code
          name
        }
      }
      # Custom fields definidos en backend/vendure-config.ts
      customFields {
        compatibilidades
        erroresSintomas
      }
    }
  }
`;
