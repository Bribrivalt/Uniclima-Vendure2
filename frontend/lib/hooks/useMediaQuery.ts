'use client';

import { useState, useEffect } from 'react';

// Breakpoints que coinciden con tokens.css
export const breakpoints = {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
} as const;

type BreakpointKey = keyof typeof breakpoints;

/**
 * Hook para detectar media queries de manera reactiva
 * 
 * @param query - Media query string o breakpoint key
 * @returns boolean indicando si la media query coincide
 * 
 * @example
 * // Usando una media query directa
 * const isMobile = useMediaQuery('(max-width: 640px)');
 * 
 * // Usando un breakpoint predefinido
 * const isTablet = useMediaQuery('md');
 */
export function useMediaQuery(query: string): boolean {
    // Convertir breakpoint key a media query si es necesario
    const mediaQuery = breakpoints[query as BreakpointKey]
        ? `(min-width: ${breakpoints[query as BreakpointKey]})`
        : query;

    const [matches, setMatches] = useState(false);

    useEffect(() => {
        // Verificar si estamos en el cliente
        if (typeof window === 'undefined') return;

        const media = window.matchMedia(mediaQuery);

        // Establecer valor inicial
        setMatches(media.matches);

        // Listener para cambios
        const listener = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // Usar addEventListener moderno
        media.addEventListener('change', listener);

        return () => {
            media.removeEventListener('change', listener);
        };
    }, [mediaQuery]);

    return matches;
}

/**
 * Hook para obtener el breakpoint actual
 * 
 * @returns El breakpoint actual ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl')
 */
export function useBreakpoint(): string {
    const is2xl = useMediaQuery('2xl');
    const isXl = useMediaQuery('xl');
    const isLg = useMediaQuery('lg');
    const isMd = useMediaQuery('md');
    const isSm = useMediaQuery('sm');

    if (is2xl) return '2xl';
    if (isXl) return 'xl';
    if (isLg) return 'lg';
    if (isMd) return 'md';
    if (isSm) return 'sm';
    return 'xs';
}

/**
 * Hook para verificar si es móvil
 */
export function useIsMobile(): boolean {
    return !useMediaQuery('md');
}

/**
 * Hook para verificar si es tablet
 */
export function useIsTablet(): boolean {
    const isMd = useMediaQuery('md');
    const isLg = useMediaQuery('lg');
    return isMd && !isLg;
}

/**
 * Hook para verificar si es desktop
 */
export function useIsDesktop(): boolean {
    return useMediaQuery('lg');
}