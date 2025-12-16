/**
 * Cart Context - Uniclima
 * 
 * Contexto global para el carrito de compras con:
 * - Sincronización con Vendure API
 * - Persistencia local con localStorage
 * - Notificaciones de stock bajo
 * - Animaciones de actualización
 * - Estado optimista para UX fluida
 * 
 * @author Frontend Team
 * @version 2.0.0
 */
'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { GET_ACTIVE_ORDER } from './vendure/queries/cart';
import { ADD_ITEM_TO_ORDER, REMOVE_ORDER_LINE, ADJUST_ORDER_LINE } from './vendure/mutations/cart';
import { useToast } from '@/components/ui/Toast';

// =========================================
// TIPOS
// =========================================

export interface CartLine {
    id: string;
    quantity: number;
    unitPrice: number;
    unitPriceWithTax: number;
    linePrice: number;
    linePriceWithTax: number;
    productVariant: {
        id: string;
        name: string;
        sku: string;
        stockLevel?: string;
        product: {
            id: string;
            name: string;
            slug: string;
            featuredAsset?: {
                id: string;
                preview: string;
            };
        };
    };
}

export interface Cart {
    id: string;
    code: string;
    state: string;
    totalQuantity: number;
    subTotal: number;
    subTotalWithTax: number;
    total: number;
    totalWithTax: number;
    currencyCode: string;
    lines: CartLine[];
}

export interface AddToCartResult {
    success: boolean;
    message?: string;
    errorCode?: string;
}

export interface CartNotification {
    id: string;
    type: 'added' | 'updated' | 'removed' | 'error' | 'low_stock';
    message: string;
    productName?: string;
    productImage?: string;
    timestamp: number;
}

interface CartContextType {
    // Estado del carrito
    cart: Cart | null;
    loading: boolean;
    error: Error | null;

    // Estado UI
    isDrawerOpen: boolean;
    isAnimating: boolean;
    recentlyAddedItem: CartLine | null;
    notifications: CartNotification[];

    // Acciones
    addToCart: (variantId: string, quantity?: number) => Promise<AddToCartResult>;
    updateQuantity: (lineId: string, quantity: number) => Promise<void>;
    removeItem: (lineId: string) => Promise<void>;
    clearCart: () => Promise<void>;

    // UI Actions
    openDrawer: () => void;
    closeDrawer: () => void;
    toggleDrawer: () => void;
    clearNotification: (id: string) => void;

    // Helpers
    getItemCount: () => number;
    getSubtotal: () => number;
    getTotal: () => number;
    isProductInCart: (productId: string) => boolean;
    getProductQuantityInCart: (productId: string) => number;

    // Refetch
    refetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// =========================================
// CONSTANTES
// =========================================

const CART_STORAGE_KEY = 'uniclima_cart_state';
const LOW_STOCK_THRESHOLD = 5;
const NOTIFICATION_DURATION = 5000;

// =========================================
// PROVIDER
// =========================================

interface CartProviderProps {
    children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
    const client = useApolloClient();
    const { showToast } = useToast();

    // Estado local
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [recentlyAddedItem, setRecentlyAddedItem] = useState<CartLine | null>(null);
    const [notifications, setNotifications] = useState<CartNotification[]>([]);

    // Query del carrito
    const { data, loading, error, refetch } = useQuery(GET_ACTIVE_ORDER, {
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
    });

    const cart = data?.activeOrder as Cart | null;

    // Mutations
    const [addItemMutation] = useMutation(ADD_ITEM_TO_ORDER, {
        refetchQueries: [{ query: GET_ACTIVE_ORDER }],
        awaitRefetchQueries: true,
    });

    const [removeLineMutation] = useMutation(REMOVE_ORDER_LINE, {
        refetchQueries: [{ query: GET_ACTIVE_ORDER }],
        awaitRefetchQueries: true,
    });

    const [adjustLineMutation] = useMutation(ADJUST_ORDER_LINE, {
        refetchQueries: [{ query: GET_ACTIVE_ORDER }],
        awaitRefetchQueries: true,
    });

    // =========================================
    // PERSISTENCIA LOCAL
    // =========================================

    // Guardar estado del carrito en localStorage
    useEffect(() => {
        if (cart && typeof window !== 'undefined') {
            const cartState = {
                id: cart.id,
                code: cart.code,
                totalQuantity: cart.totalQuantity,
                lastUpdated: Date.now(),
            };
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
        }
    }, [cart]);

    // Recuperar estado al iniciar (solo para UI, los datos reales vienen de API)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(CART_STORAGE_KEY);
            if (stored) {
                try {
                    const parsed = JSON.parse(stored);
                    // Verificar si el carrito almacenado no es muy antiguo (24h)
                    const isExpired = Date.now() - parsed.lastUpdated > 24 * 60 * 60 * 1000;
                    if (isExpired) {
                        localStorage.removeItem(CART_STORAGE_KEY);
                    }
                } catch {
                    localStorage.removeItem(CART_STORAGE_KEY);
                }
            }
        }
    }, []);

    // =========================================
    // NOTIFICACIONES
    // =========================================

    const addNotification = useCallback((notification: Omit<CartNotification, 'id' | 'timestamp'>) => {
        const newNotification: CartNotification = {
            ...notification,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
        };

        setNotifications(prev => [...prev, newNotification]);

        // Auto-remove después del tiempo configurado
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
        }, NOTIFICATION_DURATION);
    }, []);

    const clearNotification = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    // Verificar stock bajo cuando cambia el carrito
    useEffect(() => {
        if (cart?.lines) {
            cart.lines.forEach(line => {
                const stockLevel = line.productVariant.stockLevel;
                // Si tenemos info de stock y es bajo
                if (stockLevel && parseInt(stockLevel) <= LOW_STOCK_THRESHOLD && parseInt(stockLevel) > 0) {
                    addNotification({
                        type: 'low_stock',
                        message: `¡Solo quedan ${stockLevel} unidades de ${line.productVariant.product.name}!`,
                        productName: line.productVariant.product.name,
                        productImage: line.productVariant.product.featuredAsset?.preview,
                    });
                }
            });
        }
    }, [cart?.lines, addNotification]);

    // =========================================
    // ACCIONES DEL CARRITO
    // =========================================

    const addToCart = useCallback(async (variantId: string, quantity: number = 1): Promise<AddToCartResult> => {
        try {
            setIsAnimating(true);

            const { data } = await addItemMutation({
                variables: { productVariantId: variantId, quantity },
            });

            const result = data?.addItemToOrder;

            if (result?.errorCode) {
                const errorMessage = result.message || 'Error al añadir al carrito';
                showToast(errorMessage, 'error');

                addNotification({
                    type: 'error',
                    message: errorMessage,
                });

                return { success: false, message: errorMessage, errorCode: result.errorCode };
            }

            // Encontrar el item recién añadido
            const addedLine = result?.lines?.find(
                (line: CartLine) => line.productVariant.id === variantId
            );

            if (addedLine) {
                setRecentlyAddedItem(addedLine);
                setTimeout(() => setRecentlyAddedItem(null), 3000);

                addNotification({
                    type: 'added',
                    message: `${addedLine.productVariant.product?.name || 'Producto'} añadido al carrito`,
                    productName: addedLine.productVariant.product?.name,
                    productImage: addedLine.productVariant.product?.featuredAsset?.preview,
                });
            }

            showToast('¡Producto añadido al carrito!', 'success');

            // Abrir drawer automáticamente
            setIsDrawerOpen(true);

            return { success: true };
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al añadir al carrito';
            showToast(message, 'error');
            return { success: false, message };
        } finally {
            setTimeout(() => setIsAnimating(false), 300);
        }
    }, [addItemMutation, showToast, addNotification]);

    const updateQuantity = useCallback(async (lineId: string, quantity: number) => {
        if (quantity < 1) {
            await removeItem(lineId);
            return;
        }

        try {
            setIsAnimating(true);

            const { data } = await adjustLineMutation({
                variables: { orderLineId: lineId, quantity },
            });

            const result = data?.adjustOrderLine;

            if (result?.errorCode) {
                showToast(result.message || 'Error al actualizar cantidad', 'error');

                if (result.errorCode === 'INSUFFICIENT_STOCK_ERROR') {
                    addNotification({
                        type: 'low_stock',
                        message: 'No hay suficiente stock disponible',
                    });
                }
                return;
            }

            addNotification({
                type: 'updated',
                message: 'Cantidad actualizada',
            });
        } catch (err) {
            showToast('Error al actualizar cantidad', 'error');
        } finally {
            setTimeout(() => setIsAnimating(false), 300);
        }
    }, [adjustLineMutation, showToast, addNotification]);

    const removeItem = useCallback(async (lineId: string) => {
        try {
            setIsAnimating(true);

            // Encontrar el item antes de eliminarlo para la notificación
            const removedItem = cart?.lines.find(line => line.id === lineId);

            const { data } = await removeLineMutation({
                variables: { orderLineId: lineId },
            });

            const result = data?.removeOrderLine;

            if (result?.errorCode) {
                showToast(result.message || 'Error al eliminar producto', 'error');
                return;
            }

            if (removedItem) {
                addNotification({
                    type: 'removed',
                    message: `${removedItem.productVariant.product.name} eliminado del carrito`,
                    productName: removedItem.productVariant.product.name,
                });
            }

            showToast('Producto eliminado del carrito', 'info');
        } catch (err) {
            showToast('Error al eliminar producto', 'error');
        } finally {
            setTimeout(() => setIsAnimating(false), 300);
        }
    }, [cart?.lines, removeLineMutation, showToast, addNotification]);

    const clearCart = useCallback(async () => {
        if (!cart?.lines) return;

        try {
            setIsAnimating(true);

            // Eliminar todos los items
            await Promise.all(
                cart.lines.map(line =>
                    removeLineMutation({ variables: { orderLineId: line.id } })
                )
            );

            // Refetch para asegurar estado limpio
            await refetch();

            showToast('Carrito vaciado', 'info');

            // Limpiar localStorage
            localStorage.removeItem(CART_STORAGE_KEY);
        } catch (err) {
            showToast('Error al vaciar carrito', 'error');
        } finally {
            setIsAnimating(false);
        }
    }, [cart?.lines, removeLineMutation, refetch, showToast]);

    // =========================================
    // UI ACTIONS
    // =========================================

    const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
    const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
    const toggleDrawer = useCallback(() => setIsDrawerOpen(prev => !prev), []);

    // =========================================
    // HELPERS
    // =========================================

    const getItemCount = useCallback(() => cart?.totalQuantity || 0, [cart]);

    const getSubtotal = useCallback(() => cart?.subTotalWithTax || 0, [cart]);

    const getTotal = useCallback(() => cart?.totalWithTax || 0, [cart]);

    const isProductInCart = useCallback((productId: string) => {
        return cart?.lines.some(line => line.productVariant.product.id === productId) || false;
    }, [cart]);

    const getProductQuantityInCart = useCallback((productId: string) => {
        const line = cart?.lines.find(line => line.productVariant.product.id === productId);
        return line?.quantity || 0;
    }, [cart]);

    const refetchCart = useCallback(async () => {
        await refetch();
    }, [refetch]);

    // =========================================
    // CONTEXTO
    // =========================================

    const value = useMemo(() => ({
        cart,
        loading,
        error: error || null,
        isDrawerOpen,
        isAnimating,
        recentlyAddedItem,
        notifications,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        clearNotification,
        getItemCount,
        getSubtotal,
        getTotal,
        isProductInCart,
        getProductQuantityInCart,
        refetchCart,
    }), [
        cart,
        loading,
        error,
        isDrawerOpen,
        isAnimating,
        recentlyAddedItem,
        notifications,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        clearNotification,
        getItemCount,
        getSubtotal,
        getTotal,
        isProductInCart,
        getProductQuantityInCart,
        refetchCart,
    ]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

// =========================================
// HOOK
// =========================================

export function useCart() {
    const context = useContext(CartContext);

    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }

    return context;
}

export default CartProvider;