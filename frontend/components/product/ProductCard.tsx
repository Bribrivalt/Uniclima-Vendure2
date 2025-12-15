/**
 * ProductCard Component - Uniclima
 *
 * Tarjeta de producto profesional para listados del catálogo HVAC.
 * Incluye badges de estado, diseño responsive y botón prominente.
 *
 * @author Frontend Team
 * @version 2.1.0
 */
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { Product } from '@/lib/types/product';
import { ProductButton } from './ProductButton';
import { ADD_ITEM_TO_ORDER } from '@/lib/vendure/mutations/cart';
import { GET_ACTIVE_ORDER } from '@/lib/vendure/queries/cart';
import styles from './ProductCard.module.css';

export interface ProductCardProps {
    /** Producto a mostrar en la tarjeta */
    product: Product;
    /** Mostrar especificaciones técnicas HVAC (default: true) */
    showSpecs?: boolean;
    /** Condición del producto: nuevo, reacondicionado, outlet */
    condition?: 'new' | 'refurbished' | 'outlet';
}

/**
 * Transforma URL de asset del backend para usar proxy del frontend
 * Convierte URLs absolutas de localhost:3001 a rutas relativas
 */
function transformAssetUrl(url: string | undefined): string {
    if (!url) return '/placeholder-product.svg';
    
    // Si la URL es absoluta de localhost:3001, convertir a ruta relativa
    // para que pase por el proxy de Next.js (definido en next.config.js)
    const backendPatterns = [
        'http://localhost:3001',
        'http://backend:3001',
    ];
    
    for (const pattern of backendPatterns) {
        if (url.startsWith(pattern)) {
            return url.replace(pattern, '');
        }
    }
    
    return url;
}

/**
 * ProductCard - Tarjeta de producto profesional
 */
export function ProductCard({ product, showSpecs = true, condition }: ProductCardProps) {
    const defaultVariant = product.variants?.[0];
    const price = defaultVariant?.priceWithTax || 0;
    const formattedPrice = (price / 100).toFixed(2);
    const imageUrl = transformAssetUrl(product.featuredAsset?.preview);
    const customFields = product.customFields;

    // Estado para feedback visual
    const [isAdding, setIsAdding] = useState(false);
    const [addedSuccess, setAddedSuccess] = useState(false);

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
    const handleAddToCart = async (e: React.MouseEvent) => {
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
    };

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
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageUrl}
                        alt={`${product.name} - Producto de climatización HVAC`}
                        className={styles.image}
                        loading="lazy"
                        onError={(e) => {
                            // Fallback a placeholder si la imagen falla
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes('placeholder')) {
                                target.src = '/placeholder-product.svg';
                            }
                        }}
                    />

                    {/* Badge de condición (Nuevo/Reacondicionado) */}
                    {productCondition && (
                        <div className={`${styles.conditionBadge} ${styles[`condition${productCondition.charAt(0).toUpperCase() + productCondition.slice(1)}`]}`}>
                            {productCondition === 'new' && 'Nuevo'}
                            {productCondition === 'refurbished' && 'Reacondicionado'}
                            {productCondition === 'outlet' && 'Outlet'}
                        </div>
                    )}

                    {/* Badge de stock bajo */}
                    {isLowStock && (
                        <div className={styles.stockBadge}>
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
                        <span className={styles.price} itemProp="price" content={formattedPrice}>{formattedPrice}€</span>
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
                                Añadiendo...
                            </>
                        ) : addedSuccess ? (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                ¡Añadido!
                            </>
                        ) : (
                            <>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Añadir al carrito
                            </>
                        )}
                    </button>
                </div>
            </div>
        </article>
    );
}
