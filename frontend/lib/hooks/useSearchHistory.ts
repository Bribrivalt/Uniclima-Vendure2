/**
 * useSearchHistory - Hook para gestionar historial de búsquedas
 * 
 * Funcionalidades:
 * - Almacena búsquedas recientes en localStorage
 * - Limita el número de búsquedas guardadas
 * - Permite eliminar búsquedas individuales o todo el historial
 * - Ordena por fecha más reciente
 * 
 * @module useSearchHistory
 * @version 1.0.0
 */
'use client';

import { useState, useEffect, useCallback } from 'react';

/** Clave de localStorage para el historial */
const STORAGE_KEY = 'uniclima_search_history';

/** Número máximo de búsquedas a guardar */
const MAX_HISTORY_ITEMS = 10;

/** Interface para un item del historial */
export interface SearchHistoryItem {
    query: string;
    timestamp: number;
    resultCount?: number;
}

/** Interface para el retorno del hook */
export interface UseSearchHistoryReturn {
    /** Lista de búsquedas recientes */
    history: SearchHistoryItem[];
    /** Añadir una búsqueda al historial */
    addSearch: (query: string, resultCount?: number) => void;
    /** Eliminar una búsqueda del historial */
    removeSearch: (query: string) => void;
    /** Limpiar todo el historial */
    clearHistory: () => void;
    /** Obtener sugerencias basadas en el término actual */
    getSuggestions: (term: string) => SearchHistoryItem[];
}

/**
 * Hook para gestionar el historial de búsquedas
 * 
 * @example
 * ```tsx
 * const { history, addSearch, removeSearch, clearHistory } = useSearchHistory();
 * 
 * // Añadir una búsqueda
 * addSearch('aire acondicionado', 25);
 * 
 * // Eliminar una búsqueda
 * removeSearch('aire acondicionado');
 * ```
 */
export function useSearchHistory(): UseSearchHistoryReturn {
    const [history, setHistory] = useState<SearchHistoryItem[]>([]);

    /**
     * Cargar historial desde localStorage al montar
     */
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as SearchHistoryItem[];
                // Filtrar items antiguos (más de 30 días)
                const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
                const validItems = parsed.filter(item => item.timestamp > thirtyDaysAgo);
                setHistory(validItems);
            }
        } catch (error) {
            console.error('Error loading search history:', error);
        }
    }, []);

    /**
     * Guardar historial en localStorage cuando cambie
     */
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (error) {
            console.error('Error saving search history:', error);
        }
    }, [history]);

    /**
     * Añadir una búsqueda al historial
     * Si ya existe, actualiza el timestamp
     */
    const addSearch = useCallback((query: string, resultCount?: number) => {
        const trimmedQuery = query.trim().toLowerCase();
        if (!trimmedQuery || trimmedQuery.length < 2) return;

        setHistory(prev => {
            // Eliminar si ya existe
            const filtered = prev.filter(
                item => item.query.toLowerCase() !== trimmedQuery
            );

            // Añadir al principio
            const newItem: SearchHistoryItem = {
                query: query.trim(),
                timestamp: Date.now(),
                resultCount,
            };

            // Limitar el número de items
            return [newItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
        });
    }, []);

    /**
     * Eliminar una búsqueda del historial
     */
    const removeSearch = useCallback((query: string) => {
        setHistory(prev =>
            prev.filter(item => item.query.toLowerCase() !== query.toLowerCase())
        );
    }, []);

    /**
     * Limpiar todo el historial
     */
    const clearHistory = useCallback(() => {
        setHistory([]);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing search history:', error);
        }
    }, []);

    /**
     * Obtener sugerencias basadas en el término actual
     * Filtra el historial por coincidencia parcial
     */
    const getSuggestions = useCallback((term: string): SearchHistoryItem[] => {
        if (!term || term.length < 1) return history.slice(0, 5);

        const lowercaseTerm = term.toLowerCase();
        return history
            .filter(item => item.query.toLowerCase().includes(lowercaseTerm))
            .slice(0, 5);
    }, [history]);

    return {
        history,
        addSearch,
        removeSearch,
        clearHistory,
        getSuggestions,
    };
}

export default useSearchHistory;