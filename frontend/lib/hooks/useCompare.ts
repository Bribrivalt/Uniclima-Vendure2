/**
 * Hook para gestionar la comparación de productos
 * 
 * @description Permite añadir, eliminar y gestionar productos
 * para comparar, usando localStorage para persistencia.
 */

import { useState, useEffect, useCallback } from 'react';

// ========================================
// TIPOS
// ========================================

export interface CompareProduct {
    id: string;
    slug: string;
    name: string;
    image?: string;
    price: number;
    inStock: boolean;
    brand?: string;
    specs: {
        potenciaKw?: number;
        frigorias?: number;
        claseEnergetica?: string;
        refrigerante?: string;
        wifi?: boolean;
        garantiaAnos?: number;
        seer?: number;
        scop?: number;
        nivelSonoroInterior?: number;
        nivelSonoroExterior?: number;
        dimensionesInterior?: string;
        dimensionesExterior?: string;
        pesoUnidadInterior?: number;
        pesoUnidadExterior?: number;
    };
    addedAt: number;
}

interface UseCompareOptions {
    /** Número máximo de productos a comparar */
    maxItems?: number;
    /** Clave de localStorage */
    storageKey?: string;
}

interface UseCompareReturn {
    /** Lista de productos en comparación */
    compareList: CompareProduct[];
    /** Cantidad de productos en la lista */
    count: number;
    /** Añadir un producto a la comparación */
    addProduct: (product: Omit<CompareProduct, 'addedAt'>) => boolean;
    /** Eliminar un producto de la comparación */
    removeProduct: (productId: string) => void;
    /** Verificar si un producto está en la comparación */
    isInCompare: (productId: string) => boolean;
    /** Toggle: añadir si no está, eliminar si está */
    toggleProduct: (product: Omit<CompareProduct, 'addedAt'>) => void;
    /** Limpiar toda la comparación */
    clearCompare: () => void;
    /** Si está cargando desde localStorage */
    isLoading: boolean;
    /** Si la lista está llena */
    isFull: boolean;
}

// ========================================
// CONSTANTES
// ========================================

const DEFAULT_MAX_ITEMS = 4;
const DEFAULT_STORAGE_KEY = 'uniclima_compare';

// ========================================
// HOOK
// ========================================

/**
 * Hook para gestionar la comparación de productos
 * 
 * @example
 * ```tsx
 * const { compareList, addProduct, isInCompare, toggleProduct } = useCompare();
 * 
 * // Añadir/quitar producto
 * <button onClick={() => toggleProduct({
 *     id: product.id,
 *     slug: product.slug,
 *     name: product.name,
 *     image: product.featuredAsset?.preview,
 *     price: product.variants[0].priceWithTax,
 *     inStock: true,
 *     specs: product.customFields,
 * })}>
 *     {isInCompare(product.id) ? 'Quitar' : 'Comparar'}
 * </button>
 * ```
 */
export function useCompare(options: UseCompareOptions = {}): UseCompareReturn {
    const {
        maxItems = DEFAULT_MAX_ITEMS,
        storageKey = DEFAULT_STORAGE_KEY,
    } = options;

    const [compareList, setCompareList] = useState<CompareProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    /**
     * Cargar lista desde localStorage al montar
     */
    useEffect(() => {
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const parsed = JSON.parse(stored) as CompareProduct[];
                setCompareList(parsed);
            }
        } catch (error) {
            console.error('Error loading compare list:', error);
        } finally {
            setIsLoading(false);
        }
    }, [storageKey]);

    /**
     * Guardar en localStorage cuando cambia la lista
     */
    useEffect(() => {
        if (!isLoading) {
            try {
                localStorage.setItem(storageKey, JSON.stringify(compareList));
            } catch (error) {
                console.error('Error saving compare list:', error);
            }
        }
    }, [compareList, storageKey, isLoading]);

    /**
     * Añadir un producto a la comparación
     * @returns true si se añadió, false si la lista está llena
     */
    const addProduct = useCallback((product: Omit<CompareProduct, 'addedAt'>): boolean => {
        let added = false;
        
        setCompareList(prev => {
            // Verificar si ya existe
            if (prev.some(p => p.id === product.id)) {
                return prev;
            }
            
            // Verificar si está lleno
            if (prev.length >= maxItems) {
                return prev;
            }
            
            added = true;
            return [...prev, { ...product, addedAt: Date.now() }];
        });
        
        return added;
    }, [maxItems]);

    /**
     * Eliminar un producto de la comparación
     */
    const removeProduct = useCallback((productId: string) => {
        setCompareList(prev => prev.filter(p => p.id !== productId));
    }, []);

    /**
     * Verificar si un producto está en la comparación
     */
    const isInCompare = useCallback((productId: string): boolean => {
        return compareList.some(p => p.id === productId);
    }, [compareList]);

    /**
     * Toggle: añadir si no está, eliminar si está
     */
    const toggleProduct = useCallback((product: Omit<CompareProduct, 'addedAt'>) => {
        if (isInCompare(product.id)) {
            removeProduct(product.id);
        } else {
            addProduct(product);
        }
    }, [addProduct, removeProduct, isInCompare]);

    /**
     * Limpiar toda la comparación
     */
    const clearCompare = useCallback(() => {
        setCompareList([]);
        try {
            localStorage.removeItem(storageKey);
        } catch (error) {
            console.error('Error clearing compare list:', error);
        }
    }, [storageKey]);

    return {
        compareList,
        count: compareList.length,
        addProduct,
        removeProduct,
        isInCompare,
        toggleProduct,
        clearCompare,
        isLoading,
        isFull: compareList.length >= maxItems,
    };
}

export default useCompare;