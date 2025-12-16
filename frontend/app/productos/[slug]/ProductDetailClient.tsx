/**
 * ProductDetailClient - Componente cliente para interactividad
 *
 * @description Maneja la interactividad de la página de producto:
 * - Selección de variantes
 * - Cantidad
 * - Añadir al carrito
 * - Galería de imágenes
 * - Tracking de productos vistos
 */
'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { gql } from '@apollo/client';
import { ADD_ITEM_TO_ORDER } from '@/lib/vendure/mutations/cart';
import { GET_ACTIVE_ORDER } from '@/lib/vendure/queries/cart';
import { Product } from '@/lib/types/product';
import { Button } from '@/components/core/Button';
import { Alert } from '@/components/core/Alert';
import { useToast } from '@/components/ui/Toast';
import { ProductGallery, GalleryImage } from '@/components/product/ProductGallery';
import { RelatedProducts, RelatedProductsSkeleton } from '@/components/product/RelatedProducts';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';
import { useRecentlyViewed } from '@/lib/hooks/useRecentlyViewed';
import styles from './page.module.css';

/**
 * Query para obtener productos relacionados
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

interface ProductDetailClientProps {
    product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    // Estados del componente
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);

    // Hook de toast para notificaciones
    const { showToast } = useToast();

    // Hook para productos vistos recientemente
    const { addProduct: addToRecentlyViewed } = useRecentlyViewed();

    // Añadir producto al historial de vistos al montar
    useEffect(() => {
        if (product) {
            addToRecentlyViewed({
                id: product.id,
                slug: product.slug,
                name: product.name,
                image: product.featuredAsset?.preview,
                price: product.variants[0]?.priceWithTax || 0,
            });
        }
    }, [product, addToRecentlyViewed]);

    // Mutation para añadir al carrito
    const [addToCart, { loading: addingToCart }] = useMutation(ADD_ITEM_TO_ORDER, {
        refetchQueries: [{ query: GET_ACTIVE_ORDER }],
        onCompleted: (data) => {
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

    // Query para productos relacionados
    const { data: relatedData, loading: loadingRelated } = useQuery(GET_RELATED_PRODUCTS, {
        variables: { productId: product.id, take: 8 },
        skip: !product.id,
    });

    // Datos derivados
    const selectedVariant = product.variants[selectedVariantIndex];
    const allImages = product.featuredAsset
        ? [product.featuredAsset, ...(product.assets || [])]
        : product.assets || [];
    const customFields = product.customFields;
    const isQuoteOnly = customFields?.modoVenta === 'solicitar_presupuesto';
    const relatedProducts = relatedData?.products?.items || [];

    // Badge Logic
    const isRefurbished = product.name.toLowerCase().includes('reacondicionado');
    const isNew = !isRefurbished && product.createdAt && (new Date().getTime() - new Date(product.createdAt).getTime()) < 1000 * 60 * 60 * 24 * 60; // 60 days for "New"
    const productCondition = isRefurbished ? 'refurbished' : (isNew ? 'new' : undefined);

    // Convertir imágenes a formato GalleryImage
    const galleryImages: GalleryImage[] = allImages.map((img, index) => ({
        id: img.id,
        src: img.preview,
        alt: `${product.name} - Imagen ${index + 1}`,
        thumbnail: img.preview,
    }));

    /**
     * Handler para añadir producto al carrito
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
     * Formatea precio en céntimos a EUR
     */
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
        }).format(price / 100);
    };

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb} aria-label="Ruta de navegación">
                <Link href="/">Inicio</Link>
                <span aria-hidden="true">/</span>
                <Link href="/productos">Productos</Link>
                <span aria-hidden="true">/</span>
                <span className={styles.current} aria-current="page">{product.name}</span>
            </nav>

            <div className={styles.productGrid}>
                {/* Galería de imágenes */}
                <div className={styles.gallery}>
                    {productCondition && (
                        <div className={styles.detailBadges}>
                            <span className={`${styles.conditionBadge} ${styles[`condition${productCondition.charAt(0).toUpperCase() + productCondition.slice(1)}`]}`}>
                                {productCondition === 'new' && 'NUEVO'}
                                {productCondition === 'refurbished' && 'REACONDICIONADO'}
                            </span>
                        </div>
                    )}
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
                                    aria-label="Reducir cantidad"
                                >
                                    -
                                </button>
                                <span className={styles.quantityValue}>{quantity}</span>
                                <button
                                    className={styles.quantityButton}
                                    onClick={() => setQuantity(quantity + 1)}
                                    aria-label="Aumentar cantidad"
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

            {/* Especificaciones Técnicas HVAC */}
            {customFields && (
                <section className={styles.specsSection}>
                    <h2 className={styles.specsTitle}>Especificaciones Técnicas</h2>
                    <div className={styles.specsGrid}>
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

            {/* Productos relacionados */}
            <section className={styles.relatedSection}>
                {loadingRelated ? (
                    <RelatedProductsSkeleton itemCount={4} />
                ) : relatedProducts.length > 0 ? (
                    <RelatedProducts
                        products={relatedProducts}
                        title="Productos relacionados"
                        subtitle="Otros productos que podrían interesarte"
                        maxItems={8}
                        showNavigation={true}
                        showDots={true}
                        variant="carousel"
                    />
                ) : null}
            </section>

            {/* Productos vistos recientemente */}
            <section className={styles.recentlyViewedSection}>
                <RecentlyViewed
                    title="Vistos recientemente"
                    maxItems={6}
                    excludeProductId={product.id}
                />
            </section>

            {/* Enlace para volver */}
            <div className={styles.backSection}>
                <Link href="/productos" className={styles.backLink}>
                    ← Volver a productos
                </Link>
            </div>
        </motion.div>
    );
}