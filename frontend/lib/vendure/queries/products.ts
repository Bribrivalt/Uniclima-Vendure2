import { gql } from '@apollo/client';

/**
 * Query para obtener lista de productos con opciones de filtrado, búsqueda y paginación
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
          customFields {
            potenciaKw
            frigorias
            claseEnergetica
            refrigerante
            wifi
            garantiaAnos
            dimensionesUnidadInterior
            dimensionesUnidadExterior
            nivelSonoro
          }
        }
        customFields {
          modoVenta
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
        customFields {
          potenciaKw
          frigorias
          claseEnergetica
          refrigerante
          wifi
          garantiaAnos
          dimensionesUnidadInterior
          dimensionesUnidadExterior
          nivelSonoro
        }
      }
      customFields {
        modoVenta
      }
    }
  }
`;
