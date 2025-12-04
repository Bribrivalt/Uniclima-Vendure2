import { gql } from '@apollo/client';

/**
 * Query para obtener lista de productos con opciones de filtrado, búsqueda y paginación
 * 
 * Opciones de filtrado disponibles:
 * - filter.name.contains: Búsqueda por nombre
 * - filter.facetValueIds: Filtrar por facets (marca, tipo, características, etc.)
 * - sort: Ordenamiento (name, price, createdAt)
 * - take: Número de productos a obtener
 * - skip: Offset para paginación
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
        customFields {
          potenciaKw
          frigorias
          claseEnergetica
          refrigerante
          wifi
          garantiaAnos
          nivelSonoroInterior
          nivelSonoroExterior
          dimensionesInterior
          dimensionesExterior
          superficieRecomendada
          seer
          scop
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
      customFields {
        potenciaKw
        frigorias
        claseEnergetica
        refrigerante
        wifi
        garantiaAnos
        nivelSonoroInterior
        nivelSonoroExterior
        dimensionesInterior
        dimensionesExterior
        superficieRecomendada
        seer
        scop
        pesoUnidadInterior
        pesoUnidadExterior
        alimentacion
        cargaRefrigerante
        longitudMaximaTuberia
        desnivelMaximo
      }
    }
  }
`;
