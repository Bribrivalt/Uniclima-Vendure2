'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { Product, ModoVenta } from '@/lib/types/product';
import { Button } from '@/components/core/Button';
import { QuoteModal } from './QuoteModal';
import { useToast } from '@/components/ui/Toast';
import { ADD_ITEM_TO_ORDER } from '@/lib/vendure/mutations/cart';
import styles from './ProductButton.module.css';

export interface ProductButtonProps {
    product: Product;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    onAddToCart?: (productId: string, variantId: string) => Promise<void>;
    onRequestQuote?: (productId: string) => void;
}

/**
 * ProductButton - Componente inteligente que renderiza el botón correcto según modoVenta
 * 
 * Soporta múltiples modos de venta de forma extensible:
 * - "compra_directa": Añade al carrito con mutation de Vendure
 * - "solicitar_presupuesto": Abre modal de solicitud de presupuesto
 * - Futuro: Otros modos pueden añadirse fácilmente
 * 
 * @param product - Producto con customFields.modoVenta
 * @param variant - Variante visual del botón (primary, secondary)
 * @param size - Tamaño del botón (sm, md, lg)
 * @param fullWidth - Si el botón debe ocupar todo el ancho
 * @param onAddToCart - Callback personalizado para añadir al carrito
 * @param onRequestQuote - Callback personalizado para solicitar presupuesto
 */
export const ProductButton: React.FC<ProductButtonProps> = ({
    product,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    onAddToCart,
    onRequestQuote,
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    const { showToast } = useToast();
    const [addItemToOrder] = useMutation(ADD_ITEM_TO_ORDER);

    const modoVenta: ModoVenta = product.customFields?.modoVenta || 'compra_directa';
    const defaultVariant = product.variants?.[0];

    // Handler para compra directa
    const handleAddToCart = async () => {
        if (!defaultVariant) {
            showToast('No hay variante disponible para este producto', 'error');
            return;
        }

        setIsLoading(true);
        setSuccess(false);

        try {
            if (onAddToCart) {
                // Usar callback personalizado si se proporciona
                await onAddToCart(product.id, defaultVariant.id);
            } else {
                // Implementación por defecto con mutation de Vendure
                const { data } = await addItemToOrder({
                    variables: {
                        productVariantId: defaultVariant.id,
                        quantity: 1,
                    },
                });

                if (data?.addItemToOrder?.errorCode) {
                    throw new Error(data.addItemToOrder.message || 'Error al añadir al carrito');
                }
            }

            setSuccess(true);
            showToast('Producto añadido al carrito', 'success');

            // Resetear estado de éxito después de 2 segundos
            setTimeout(() => {
                setSuccess(false);
            }, 2000);
        } catch (error) {
            console.error('Error al añadir al carrito:', error);
            showToast('Error al añadir al carrito', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handler para solicitar presupuesto
    const handleRequestQuote = () => {
        if (onRequestQuote) {
            onRequestQuote(product.id);
        } else {
            // Implementación por defecto - abrir modal
            setIsQuoteModalOpen(true);
        }
    };

    // Renderizar según modo de venta (extensible para futuros modos)
    const renderButton = () => {
        switch (modoVenta) {
            case 'solicitar_presupuesto':
                return (
                    <Button
                        variant={variant}
                        size={size}
                        fullWidth={fullWidth}
                        onClick={handleRequestQuote}
                        className={styles.quoteButton}
                    >
                        <svg
                            width="20"
                            height="20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className={styles.buttonIcon}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        Solicitar Presupuesto
                    </Button>
                );

            case 'compra_directa':
            default:
                return (
                    <Button
                        variant={variant}
                        size={size}
                        fullWidth={fullWidth}
                        onClick={handleAddToCart}
                        loading={isLoading}
                        disabled={isLoading || !defaultVariant}
                        className={success ? styles.successButton : styles.cartButton}
                    >
                        {success ? (
                            <>
                                <svg
                                    width="20"
                                    height="20"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className={styles.buttonIcon}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                ¡Añadido!
                            </>
                        ) : (
                            <>
                                <svg
                                    width="20"
                                    height="20"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    className={styles.buttonIcon}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                Añadir al Carrito
                            </>
                        )}
                    </Button>
                );
        }
    };

    return (
        <>
            {renderButton()}

            {/* Modal de presupuesto */}
            <QuoteModal
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
                productId={product.id}
                productName={product.name}
                productSlug={product.slug}
            />
        </>
    );
};
