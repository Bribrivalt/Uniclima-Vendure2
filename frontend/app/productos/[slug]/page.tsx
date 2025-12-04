/**
 * Pagina de Detalle de Producto - /productos/[slug]
 *
 * Esta pagina muestra todos los detalles de un producto HVAC incluyendo:
 * - Galeria de imagenes con zoom y lightbox (ProductGallery)
 * - Informacion de precio y stock
 * - Selector de variantes (si hay mas de una)
 * - Boton de anadir al carrito o solicitar presupuesto
 * - Especificaciones tecnicas HVAC completas
 * - Productos relacionados (RelatedProducts)
 *
 * Los custom fields HVAC vienen del Product (no de la variante)
 * y coinciden con los definidos en backend/vendure-config.ts
 *
 * @author Frontend Team
 * @version 2.0.0 - Integrado ProductGallery y RelatedProducts
 */
'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { gql } from '@apollo/client';
import { GET_PRODUCT_BY_SLUG } from '@/lib/vendure/queries/products';
import { ADD_ITEM_TO_ORDER } from '@/lib/vendure/mutations/cart';
import { GET_ACTIVE_ORDER } from '@/lib/vendure/queries/cart';
import { Product } from '@/lib/types/product';
import { Button } from '@/components/core/Button';
import { Alert } from '@/components/core/Alert';
import { useToast } from '@/components/ui/Toast';
import { ProductGallery, GalleryImage } from '@/components/product/ProductGallery';
import { RelatedProducts, RelatedProductsSkeleton } from '@/components/product/RelatedProducts';
import styles from './page.module.css';

/**
 * Query para obtener productos relacionados
 * Busca productos de la misma coleccion o con facets similares
 */
const GET_RELATED_PRODUCTS = gql`
    query GetRelatedProducts($productId: ID!, $take: Int) {
        products(options: { take: $take, filter: { id: { notEq: $productId } } }) {
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
                    priceWithTax
                    stockLevel
                }
                customFields {
                    potenciaKw
                    frigorias
                    claseEnergetica
                    wifi
                    modoVenta
                }
                facetValues {
                    id
                    name
                    facet {
                        id
                        name
                    }
                }
            }
        }
    }
`;

/**
 * Interfaz para la respuesta de la query GET_PRODUCT_BY_SLUG
 */
interface ProductData {
    product: Product | null;
}

/**
 * Componente de página de detalle de producto
 * Obtiene el producto por slug y muestra toda su información
 */
export default function ProductDetailPage() {
    // Obtener slug de la URL
    const params = useParams();
    const slug = params.slug as string;

    // Estados del componente
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);

    // Hook de toast para notificaciones
    const { showToast } = useToast();

    // Query para obtener el producto por slug
    const { data, loading, error } = useQuery<ProductData>(GET_PRODUCT_BY_SLUG, {
        variables: { slug },
        skip: !slug,
    });

    // Mutation para añadir al carrito con actualización de caché
    const [addToCart, { loading: addingToCart }] = useMutation(ADD_ITEM_TO_ORDER, {
        // Refetch del carrito activo para actualizar contador en header
        refetchQueries: [{ query: GET_ACTIVE_ORDER }],
        onCompleted: (data) => {
            // Verificar si hubo error en la respuesta
            if (data?.addItemToOrder?.errorCode) {
                showToast(data.addItemToOrder.message || 'Error al añadir al carrito', 'error');
                return;
            }
            setAddedToCart(true);
            showToast('¡Producto añadido al carrito!', 'success');
            setTimeout(() => setAddedToCart(false), 3000);
        },
        onError: (error) => {
            console.error('Error al añadir al carrito:', error);
            showToast('Error al añadir al carrito', 'error');
        },
    });

    // Estado de carga
    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Cargando producto...</p>
            </div>
        );
    }

    // Estado de error o producto no encontrado
    if (error || !data?.product) {
        return (
            <div className={styles.error}>
                <h1>Producto no encontrado</h1>
                <p>El producto que buscas no existe o ha sido eliminado.</p>
                <Link href="/productos" className={styles.backLink}>
                    ← Volver a productos
                </Link>
            </div>
        );
    }

    // Extraer datos del producto
    const product = data.product;
    const selectedVariant = product.variants[selectedVariantIndex];
    // Combinar imagen destacada con las demás imágenes
    const allImages = product.featuredAsset
        ? [product.featuredAsset, ...(product.assets || [])]
        : product.assets || [];

    /**
     * Handler para añadir producto al carrito
     * Usa la variante seleccionada y la cantidad especificada
     */
    const handleAddToCart = async () => {
        if (!selectedVariant) return;

        await addToCart({
            variables: {
                productVariantId: selectedVariant.id,
                quantity,
            },
        });
    };

    /**
     * Formatea un precio en céntimos a formato de moneda EUR
     * @param price - Precio en céntimos
     * @returns Precio formateado (ej: "1.299,00 €")
     */
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
        }).format(price / 100);
    };

    // IMPORTANTE: Los custom fields HVAC están en product.customFields, NO en variant.customFields
    const customFields = product.customFields;
    // Modo de venta: compra directa o solicitar presupuesto
    const isQuoteOnly = customFields?.modoVenta === 'solicitar_presupuesto';

    // Convertir imagenes a formato GalleryImage para ProductGallery
    const galleryImages: GalleryImage[] = allImages.map((img, index) => ({
        id: img.id,
        src: img.preview,
        alt: `${product.name} - Imagen ${index + 1}`,
        thumbnail: img.preview,
    }));

    // Query para productos relacionados (excluir el producto actual)
    const { data: relatedData, loading: loadingRelated } = useQuery(GET_RELATED_PRODUCTS, {
        variables: { productId: product.id, take: 8 },
        skip: !product.id,
    });

    // Filtrar productos relacionados por facets similares si es posible
    const relatedProducts = relatedData?.products?.items || [];

    return (
        <div className={styles.container}>
            {/* Breadcrumb - Navegacion contextual */}
            <nav className={styles.breadcrumb} aria-label="Ruta de navegacion">
                <Link href="/">Inicio</Link>
                <span aria-hidden="true">/</span>
                <Link href="/productos">Productos</Link>
                <span aria-hidden="true">/</span>
                <span className={styles.current} aria-current="page">{product.name}</span>
            </nav>

            <div className={styles.productGrid}>
                {/* Galeria de imagenes con zoom y lightbox */}
                <div className={styles.gallery}>
                    <ProductGallery
                        images={galleryImages}
                        productName={product.name}
                        enableZoom={true}
                        enableLightbox={true}
                    />
                </div>

                {/* Product Info */}
                <div className={styles.info}>
                    <h1 className={styles.title}>{product.name}</h1>

                    {selectedVariant && (
                        <div className={styles.pricing}>
                            <span className={styles.price}>
                                {formatPrice(selectedVariant.priceWithTax)}
                            </span>
                            <span className={styles.tax}>IVA incluido</span>
                        </div>
                    )}

                    {selectedVariant?.sku && (
                        <p className={styles.sku}>REF: {selectedVariant.sku}</p>
                    )}

                    {/* Stock Status */}
                    <div className={styles.stockStatus}>
                        {selectedVariant?.stockLevel === 'IN_STOCK' ? (
                            <span className={styles.inStock}>
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                En stock
                            </span>
                        ) : (
                            <span className={styles.outOfStock}>
                                Consultar disponibilidad
                            </span>
                        )}
                    </div>

                    {/* Variant Selection */}
                    {product.variants.length > 1 && (
                        <div className={styles.variants}>
                            <h3 className={styles.variantsTitle}>Variantes</h3>
                            <div className={styles.variantButtons}>
                                {product.variants.map((variant, index) => (
                                    <button
                                        key={variant.id}
                                        className={`${styles.variantButton} ${selectedVariantIndex === index ? styles.variantButtonActive : ''}`}
                                        onClick={() => setSelectedVariantIndex(index)}
                                    >
                                        {variant.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add to Cart */}
                    {!isQuoteOnly ? (
                        <div className={styles.addToCart}>
                            <div className={styles.quantitySelector}>
                                <button
                                    className={styles.quantityButton}
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span className={styles.quantityValue}>{quantity}</span>
                                <button
                                    className={styles.quantityButton}
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>

                            <Button
                                variant="primary"
                                size="lg"
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                                className={styles.addButton}
                            >
                                {addingToCart ? 'Añadiendo...' : 'Añadir al carrito'}
                            </Button>
                        </div>
                    ) : (
                        <div className={styles.quoteOnly}>
                            <Alert type="info">
                                Este producto requiere solicitar presupuesto personalizado.
                            </Alert>
                            <Link href="/contacto" className={styles.quoteButton}>
                                Solicitar Presupuesto
                            </Link>
                        </div>
                    )}

                    {addedToCart && (
                        <div className={styles.successAlert}>
                            <Alert type="success">
                                ¡Producto añadido al carrito!
                            </Alert>
                        </div>
                    )}

                    {/* Description */}
                    <div className={styles.description}>
                        <h3>Descripción</h3>
                        <div dangerouslySetInnerHTML={{ __html: product.description || 'Sin descripción disponible.' }} />
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════════════
                ESPECIFICACIONES TÉCNICAS HVAC
                Los nombres de campos coinciden con backend/vendure-config.ts
                ════════════════════════════════════════════════════════════════════════ */}
            {customFields && (
                <section className={styles.specsSection}>
                    <h2 className={styles.specsTitle}>Especificaciones Técnicas</h2>
                    <div className={styles.specsGrid}>

                        {/* ─────────────────────────────────────────────────────────────
                            RENDIMIENTO Y CAPACIDAD
                            ───────────────────────────────────────────────────────────── */}
                        {customFields.potenciaKw && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Potencia</span>
                                <span className={styles.specValue}>{customFields.potenciaKw} kW</span>
                            </div>
                        )}
                        {customFields.frigorias && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Frigorías</span>
                                <span className={styles.specValue}>{customFields.frigorias.toLocaleString('es-ES')} frig/h</span>
                            </div>
                        )}
                        {customFields.superficieRecomendada && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Superficie Recomendada</span>
                                <span className={styles.specValue}>{customFields.superficieRecomendada}</span>
                            </div>
                        )}

                        {/* ─────────────────────────────────────────────────────────────
                            EFICIENCIA ENERGÉTICA
                            ───────────────────────────────────────────────────────────── */}
                        {customFields.claseEnergetica && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Clase Energética</span>
                                <span className={`${styles.specValue} ${styles.energyClass}`}>
                                    {customFields.claseEnergetica}
                                </span>
                            </div>
                        )}
                        {customFields.seer && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>SEER (Refrigeración)</span>
                                <span className={styles.specValue}>{customFields.seer}</span>
                            </div>
                        )}
                        {customFields.scop && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>SCOP (Calefacción)</span>
                                <span className={styles.specValue}>{customFields.scop}</span>
                            </div>
                        )}

                        {/* ─────────────────────────────────────────────────────────────
                            REFRIGERANTE Y CARACTERÍSTICAS
                            ───────────────────────────────────────────────────────────── */}
                        {customFields.refrigerante && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Refrigerante</span>
                                <span className={styles.specValue}>{customFields.refrigerante}</span>
                            </div>
                        )}
                        {customFields.wifi !== undefined && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>WiFi Integrado</span>
                                <span className={styles.specValue}>
                                    {customFields.wifi ? '✓ Sí' : '✗ No'}
                                </span>
                            </div>
                        )}
                        {customFields.garantiaAnos && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Garantía</span>
                                <span className={styles.specValue}>{customFields.garantiaAnos} años</span>
                            </div>
                        )}

                        {/* ─────────────────────────────────────────────────────────────
                            NIVEL SONORO (nombres correctos del backend)
                            ───────────────────────────────────────────────────────────── */}
                        {customFields.nivelSonoroInterior && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Nivel Sonoro Interior</span>
                                <span className={styles.specValue}>{customFields.nivelSonoroInterior} dB(A)</span>
                            </div>
                        )}
                        {customFields.nivelSonoroExterior && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Nivel Sonoro Exterior</span>
                                <span className={styles.specValue}>{customFields.nivelSonoroExterior} dB(A)</span>
                            </div>
                        )}

                        {/* ─────────────────────────────────────────────────────────────
                            DIMENSIONES Y PESO (nombres correctos del backend)
                            ───────────────────────────────────────────────────────────── */}
                        {customFields.dimensionesInterior && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Dimensiones U. Interior</span>
                                <span className={styles.specValue}>{customFields.dimensionesInterior}</span>
                            </div>
                        )}
                        {customFields.dimensionesExterior && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Dimensiones U. Exterior</span>
                                <span className={styles.specValue}>{customFields.dimensionesExterior}</span>
                            </div>
                        )}
                        {customFields.pesoUnidadInterior && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Peso U. Interior</span>
                                <span className={styles.specValue}>{customFields.pesoUnidadInterior} kg</span>
                            </div>
                        )}
                        {customFields.pesoUnidadExterior && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Peso U. Exterior</span>
                                <span className={styles.specValue}>{customFields.pesoUnidadExterior} kg</span>
                            </div>
                        )}

                        {/* ─────────────────────────────────────────────────────────────
                            INSTALACIÓN
                            ───────────────────────────────────────────────────────────── */}
                        {customFields.alimentacion && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Alimentación</span>
                                <span className={styles.specValue}>{customFields.alimentacion}</span>
                            </div>
                        )}
                        {customFields.cargaRefrigerante && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Carga Refrigerante</span>
                                <span className={styles.specValue}>{customFields.cargaRefrigerante} kg</span>
                            </div>
                        )}
                        {customFields.longitudMaximaTuberia && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Long. Máx. Tubería</span>
                                <span className={styles.specValue}>{customFields.longitudMaximaTuberia} m</span>
                            </div>
                        )}
                        {customFields.desnivelMaximo && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Desnivel Máximo</span>
                                <span className={styles.specValue}>{customFields.desnivelMaximo} m</span>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Seccion de productos relacionados */}
            <section className={styles.relatedSection}>
                {loadingRelated ? (
                    <RelatedProductsSkeleton itemCount={4} />
                ) : relatedProducts.length > 0 ? (
                    <RelatedProducts
                        products={relatedProducts}
                        title="Productos relacionados"
                        subtitle="Otros productos que podrian interesarte"
                        maxItems={8}
                        showNavigation={true}
                        showDots={true}
                        variant="carousel"
                    />
                ) : null}
            </section>

            {/* Enlace para volver al catalogo */}
            <div className={styles.backSection}>
                <Link href="/productos" className={styles.backLink}>
                    ← Volver a productos
                </Link>
            </div>
        </div>
    );
}