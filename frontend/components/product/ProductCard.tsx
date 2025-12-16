/**
 * ProductCard Component - Uniclima
 *
 * Tarjeta de producto profesional para listados del catálogo HVAC.
 * Incluye badges de estado, diseño responsive y botón prominente.
 *
 * Características:
 * - Hover effects atractivos con overlay
 * - Badge de descuento/oferta
 * - Botón de favoritos
 * - Lazy loading mejorado de imágenes
 *
 * @author Frontend Team
 * @version 2.2.0
 */
'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { Product } from '@/lib/types/product';
import { ADD_ITEM_TO_ORDER } from '@/lib/vendure/mutations/cart';
import { GET_ACTIVE_ORDER } from '@/lib/vendure/queries/cart';
import { CartIcon, HeartIcon, EyeIcon, CheckIcon, BadgeIcon, StockIcon } from '@/components/icons';
import styles from './ProductCard.module.css';

export interface ProductCardProps {
    /** Producto a mostrar en la tarjeta */
    product: Product;
    /** Mostrar especificaciones técnicas HVAC (default: true) */
    showSpecs?: boolean;
    /** Condición del producto: nuevo, reacondicionado, outlet */
    condition?: 'new' | 'refurbished' | 'outlet';
    /** Porcentaje de descuento (ej: 15 para 15% descuento) */
    discount?: number;
    /** Precio original antes del descuento */
    originalPrice?: number;
}

/**
 * ProductCard - Tarjeta de producto profesional
 */
export function ProductCard({ product, showSpecs = true, condition, discount, originalPrice }: ProductCardProps) {
    const router = useRouter();
    const defaultVariant = product.variants?.[0];
    const price = defaultVariant?.priceWithTax || 0;
    const formattedPrice = (price / 100).toFixed(2);

    // Generar un placeholder SVG en base64 en lugar de usar una imagen externa
    const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect fill='%23f3f4f6' width='400' height='400'/%3E%3Ctext fill='%239ca3af' font-family='system-ui' font-size='14' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3EImagen no disponible%3C/text%3E%3C/svg%3E`;
    const imageUrl = product.featuredAsset?.preview || product.featuredAsset?.source || placeholderSvg;
    const customFields = product.customFields;

    // Estado para feedback visual
    const [isAdding, setIsAdding] = useState(false);
    const [addedSuccess, setAddedSuccess] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);

    // Mutation para añadir al carrito
    const [addItemToOrder, { loading: addingToCart }] = useMutation(ADD_ITEM_TO_ORDER, {
        refetchQueries: [{ query: GET_ACTIVE_ORDER }],
        onCompleted: (data) => {
            // Verificar si la operación fue exitosa
            if (data?.addItemToOrder?.id) {
                setAddedSuccess(true);
                setTimeout(() => setAddedSuccess(false), 2000);
            } else if (data?.addItemToOrder?.errorCode) {
                console.error('Error añadiendo al carrito:', data.addItemToOrder.message);
                alert(data.addItemToOrder.message || 'Error al añadir al carrito');
            }
            setIsAdding(false);
        },
        onError: (error) => {
            console.error('Error añadiendo al carrito:', error);
            alert('Error al añadir al carrito. Por favor, inténtalo de nuevo.');
            setIsAdding(false);
        },
    });

    /**
     * Maneja el click en el botón de añadir al carrito
     * Envía la mutation addItemToOrder con el ID de la variante
     */
    const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
        e.preventDefault(); // Evitar navegación al producto
        e.stopPropagation(); // Evitar propagación del evento

        if (!defaultVariant?.id) {
            alert('Este producto no está disponible para compra');
            return;
        }

        setIsAdding(true);

        try {
            await addItemToOrder({
                variables: {
                    productVariantId: defaultVariant.id,
                    quantity: 1,
                },
            });
        } catch (error) {
            // Error manejado en onError
        }
    }, [addItemToOrder, defaultVariant?.id]);

    /**
     * Maneja el click en el botón de favoritos
     */
    const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(prev => !prev);
        // TODO: Implementar persistencia de favoritos
    }, []);

    /**
     * Maneja el click en el botón de vista rápida
     */
    const handleQuickView = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/productos/${product.slug}`);
    }, [router, product.slug]);

    /**
     * Calcula el precio original si hay descuento
     */
    const calculatedOriginalPrice = originalPrice
        ? (originalPrice / 100).toFixed(2)
        : discount
            ? ((price / (1 - discount / 100)) / 100).toFixed(2)
            : null;

    // Determinar si es nuevo (creado en los últimos 30 días)
    const isNew = !condition && product.createdAt &&
        (new Date().getTime() - new Date(product.createdAt).getTime()) < 30 * 24 * 60 * 60 * 1000;

    // Determinar condición del producto
    const productCondition = condition || (isNew ? 'new' : undefined);

    // Verificar stock bajo
    const isLowStock = defaultVariant?.stockLevel === 'LOW_STOCK';

    return (
        <article className={styles.card} itemScope itemType="https://schema.org/Product">
            <Link href={`/productos/${product.slug}`} className={styles.imageLink} prefetch={false}>
                <div className={styles.imageWrapper}>
                    {/* Skeleton loader mientras carga la imagen */}
                    {!imageLoaded && (
                        <div className={styles.imageSkeleton}>
                            <div className={styles.shimmer} />
                        </div>
                    )}

                    <Image
                        src={imageUrl}
                        alt={`${product.name} - Producto de climatización HVAC`}
                        fill
                        className={`${styles.image} ${imageLoaded ? styles.imageLoaded : ''}`}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        quality={80}
                    />

                    {/* Overlay con acciones rápidas */}
                    <div className={styles.imageOverlay}>
                        <button
                            className={`${styles.quickAction} ${styles.favoriteButton} ${isFavorite ? styles.isFavorite : ''}`}
                            onClick={handleToggleFavorite}
                            aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                        >
                            <HeartIcon size={20} filled={isFavorite} />
                        </button>
                        <button
                            className={`${styles.quickAction} ${styles.quickViewButton}`}
                            onClick={handleQuickView}
                            aria-label="Ver detalles del producto"
                        >
                            <EyeIcon size={20} />
                        </button>
                    </div>

                    {/* Badges Wrapper */}
                    <div className={styles.badgesWrapper}>
                        {/* Badge de descuento */}
                        {discount && discount > 0 && (
                            <div className={styles.discountBadge}>
                                -{discount}%
                            </div>
                        )}

                        {/* Badge de condición */}
                        {productCondition && (
                            <div className={`${styles.conditionBadge} ${styles[`condition${productCondition.charAt(0).toUpperCase() + productCondition.slice(1)}`]}`}>
                                <BadgeIcon size={14} style={{ marginRight: 4 }} />
                                {productCondition === 'new' && 'Nuevo'}
                                {productCondition === 'refurbished' && 'Reacondicionado'}
                                {productCondition === 'outlet' && 'Outlet'}
                            </div>
                        )}
                    </div>

                    {/* Badge de stock bajo */}
                    {isLowStock && (
                        <div className={styles.stockBadge}>
                            <StockIcon size={14} style={{ marginRight: 4 }} />
                            Últimas unidades
                        </div>
                    )}
                </div>
            </Link>

            <div className={styles.content}>
                {/* Nombre del producto */}
                <Link href={`/productos/${product.slug}`} className={styles.titleLink} prefetch={false}>
                    <h3 className={styles.title} itemProp="name">{product.name}</h3>
                </Link>

                {/* Información de compatibilidades */}
                {customFields?.compatibilidades && (
                    <p className={styles.compatibility}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {customFields.compatibilidades.substring(0, 60)}...
                    </p>
                )}

                {/* Footer con precio y botón */}
                <div className={styles.footer}>
                    <div className={styles.priceWrapper} itemProp="offers" itemScope itemType="https://schema.org/Offer">
                        <div className={styles.priceContainer}>
                            {calculatedOriginalPrice && (
                                <span className={styles.originalPrice}>{calculatedOriginalPrice}€</span>
                            )}
                            <span className={`${styles.price} ${discount ? styles.salePrice : ''}`} itemProp="price" content={formattedPrice}>{formattedPrice}€</span>
                        </div>
                        <meta itemProp="priceCurrency" content="EUR" />
                        <meta itemProp="availability" content={defaultVariant?.stockLevel === 'IN_STOCK' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'} />
                        <span className={styles.tax}>IVA incluido</span>
                    </div>

                    {/* Botón prominente de añadir al carrito */}
                    <button
                        className={`${styles.addToCartButton} ${addedSuccess ? styles.addedSuccess : ''}`}
                        onClick={handleAddToCart}
                        disabled={isAdding || addingToCart || !defaultVariant?.id}
                        aria-label={`Añadir ${product.name} al carrito`}
                    >
                        {isAdding || addingToCart ? (
                            <>
                                <svg className={styles.spinner} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                                    <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                                </svg>
                                <span className={styles.buttonText}>Añadiendo...</span>
                            </>
                        ) : addedSuccess ? (
                            <>
                                <CheckIcon size={18} />
                                <span className={styles.buttonText}>¡Añadido!</span>
                            </>
                        ) : (
                            <>
                                <CartIcon size={18} />
                                <span className={styles.buttonText}>Añadir al carrito</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </article>
    );
}
