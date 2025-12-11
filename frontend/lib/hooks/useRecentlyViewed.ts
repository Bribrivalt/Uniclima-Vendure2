/**
 * Hook para gestionar productos vistos recientemente
 * 
 * @description Almacena y recupera el historial de productos vistos
 * usando localStorage para persistencia entre sesiones.
 */

import { useState, useEffect, useCallback } from 'react';

// ========================================
// TIPOS
// ========================================

export interface RecentlyViewedProduct {
    id: string;
    slug: string;
    name: string;
    image?: string;
    price: number;
    viewedAt: number; // timestamp
}

interface UseRecentlyViewedOptions {
    /** Número máximo de productos a almacenar */
    maxItems?: number;
    /** Clave de localStorage */
    storageKey?: string;
}

interface UseRecentlyViewedReturn {
    /** Lista de productos vistos recientemente */
    recentProducts: RecentlyViewedProduct[];
    /** Añadir un producto al historial */
    addProduct: (product: Omit<RecentlyViewedProduct, 'viewedAt'>) => void;
    /** Eliminar un producto del historial */
    removeProduct: (productId: string) => void;
    /** Limpiar todo el historial */
    clearHistory: () => void;
    /** Indica si está cargando desde localStorage */
    isLoading: boolean;
}

// ========================================
// CONSTANTES
// ========================================

const DEFAULT_MAX_ITEMS = 10;
const DEFAULT_STORAGE_KEY = 'uniclima_recently_viewed';

// ========================================
// HOOK
// ========================================

/**
 * Hook para gestionar productos vistos recientemente
 * 
 * @example
 * ```tsx
 * const { recentProducts, addProduct } = useRecentlyViewed();
 * 
 * // Añadir producto al historial
 * useEffect(() => {
 *     addProduct({
 *         id: product.id,
 *         slug: product.slug,
 *         name: product.name,
 *         image: product.featuredAsset?.preview,
 *         price: product.variants[0].priceWithTax,
 *     });
 * }, [product]);
 * 
 * // Mostrar productos recientes
 * return <RecentlyViewedProducts products={recentProducts} />;
 * ```
 */
export function useRecentlyViewed(options: UseRecentlyViewedOptions = {}): UseRecentlyViewedReturn {
    const {
        maxItems = DEFAULT_MAX_ITEMS,
        storageKey = DEFAULT_STORAGE_KEY,
    } = options;

    const [recentProducts, setRecentProducts] = useState<RecentlyViewedProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Cargar historial desde localStorage al montar
     */
    useEffect(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const parsed = JSON.parse(stored) as RecentlyViewedProduct[];
                // Filtrar productos muy antiguos (más de 30 días)
                const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
                const filtered = parsed.filter(p => p.viewedAt > thirtyDaysAgo);
                setRecentProducts(filtered);
            }
        } catch (error) {
            console.error('Error loading recently viewed products:', error);
        } finally {
            setIsLoading(false);
        }
    }, [storageKey]);

    /**
     * Guardar en localStorage cuando cambia el historial
     */
    useEffect(() => {
        if (!isLoading) {
            try {
                localStorage.setItem(storageKey, JSON.stringify(recentProducts));
            } catch (error) {
                console.error('Error saving recently viewed products:', error);
            }
        }
    }, [recentProducts, storageKey, isLoading]);

    /**
     * Añadir un producto al historial
     */
    const addProduct = useCallback((product: Omit<RecentlyViewedProduct, 'viewedAt'>) => {
        setRecentProducts(prev => {
            // Eliminar si ya existe para moverlo al principio
            const filtered = prev.filter(p => p.id !== product.id);
            
            // Añadir al principio con timestamp actual
            const newProduct: RecentlyViewedProduct = {
                ...product,
                viewedAt: Date.now(),
            };
            
            // Limitar al máximo de items
            const updated = [newProduct, ...filtered].slice(0, maxItems);
            
            return updated;
        });
    }, [maxItems]);

    /**
     * Eliminar un producto del historial
     */
    const removeProduct = useCallback((productId: string) => {
        setRecentProducts(prev => prev.filter(p => p.id !== productId));
    }, []);

    /**
     * Limpiar todo el historial
     */
    const clearHistory = useCallback(() => {
        setRecentProducts([]);
        try {
            localStorage.removeItem(storageKey);
        } catch (error) {
            console.error('Error clearing recently viewed products:', error);
        }
    }, [storageKey]);

    return {
        recentProducts,
        addProduct,
        removeProduct,
        clearHistory,
        isLoading,
    };
}

export default useRecentlyViewed;