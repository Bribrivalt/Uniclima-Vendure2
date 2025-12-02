'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { GET_PRODUCT_BY_SLUG } from '@/lib/vendure/queries/products';
import { ADD_ITEM_TO_ORDER } from '@/lib/vendure/mutations/cart';
import { Product } from '@/lib/types/product';
import { Button } from '@/components/core/Button';
import { Alert } from '@/components/core/Alert';
import styles from './page.module.css';

interface ProductData {
    product: Product | null;
}

export default function ProductDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [addedToCart, setAddedToCart] = useState(false);

    const { data, loading, error } = useQuery<ProductData>(GET_PRODUCT_BY_SLUG, {
        variables: { slug },
        skip: !slug,
    });

    const [addToCart, { loading: addingToCart }] = useMutation(ADD_ITEM_TO_ORDER, {
        onCompleted: () => {
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 3000);
        },
    });

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner} />
                <p>Cargando producto...</p>
            </div>
        );
    }

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

    const product = data.product;
    const selectedVariant = product.variants[selectedVariantIndex];
    const allImages = product.featuredAsset
        ? [product.featuredAsset, ...(product.assets || [])]
        : product.assets || [];

    const handleAddToCart = async () => {
        if (!selectedVariant) return;

        await addToCart({
            variables: {
                productVariantId: selectedVariant.id,
                quantity,
            },
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
        }).format(price / 100);
    };

    const customFields = selectedVariant?.customFields;
    const isQuoteOnly = product.customFields?.modoVenta === 'solicitar_presupuesto';

    return (
        <div className={styles.container}>
            {/* Breadcrumb */}
            <nav className={styles.breadcrumb}>
                <Link href="/">Inicio</Link>
                <span>/</span>
                <Link href="/productos">Productos</Link>
                <span>/</span>
                <span className={styles.current}>{product.name}</span>
            </nav>

            <div className={styles.productGrid}>
                {/* Gallery */}
                <div className={styles.gallery}>
                    <div className={styles.mainImage}>
                        {allImages.length > 0 ? (
                            <img
                                src={allImages[selectedImage]?.preview}
                                alt={product.name}
                                className={styles.image}
                            />
                        ) : (
                            <div className={styles.noImage}>
                                <svg width="80" height="80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    {allImages.length > 1 && (
                        <div className={styles.thumbnails}>
                            {allImages.map((image, index) => (
                                <button
                                    key={image.id}
                                    className={`${styles.thumbnail} ${selectedImage === index ? styles.thumbnailActive : ''}`}
                                    onClick={() => setSelectedImage(index)}
                                >
                                    <img src={image.preview} alt={`${product.name} ${index + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
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

            {/* Technical Specs */}
            {customFields && Object.values(customFields).some(v => v !== null && v !== undefined) && (
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
                        {customFields.claseEnergetica && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Clase Energética</span>
                                <span className={`${styles.specValue} ${styles.energyClass}`}>
                                    {customFields.claseEnergetica}
                                </span>
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
                                <span className={styles.specLabel}>WiFi</span>
                                <span className={styles.specValue}>
                                    {customFields.wifi ? 'Sí' : 'No'}
                                </span>
                            </div>
                        )}
                        {customFields.garantiaAnos && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Garantía</span>
                                <span className={styles.specValue}>{customFields.garantiaAnos} años</span>
                            </div>
                        )}
                        {customFields.nivelSonoro && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Nivel Sonoro</span>
                                <span className={styles.specValue}>{customFields.nivelSonoro} dB</span>
                            </div>
                        )}
                        {customFields.dimensionesUnidadInterior && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Unidad Interior</span>
                                <span className={styles.specValue}>{customFields.dimensionesUnidadInterior}</span>
                            </div>
                        )}
                        {customFields.dimensionesUnidadExterior && (
                            <div className={styles.specItem}>
                                <span className={styles.specLabel}>Unidad Exterior</span>
                                <span className={styles.specValue}>{customFields.dimensionesUnidadExterior}</span>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Back to products */}
            <div className={styles.backSection}>
                <Link href="/productos" className={styles.backLink}>
                    ← Volver a productos
                </Link>
            </div>
        </div>
    );
}