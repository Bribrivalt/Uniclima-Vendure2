'use client';

import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook para crear un focus trap en un elemento
 * Útil para modales, dropdowns, etc. para mantener el focus dentro del componente
 * 
 * @param isActive - Si el focus trap está activo
 * @returns Ref para el elemento contenedor
 * 
 * @example
 * const modalRef = useFocusTrap(isOpen);
 * return <div ref={modalRef}>...</div>
 */
export function useFocusTrap<T extends HTMLElement>(isActive: boolean) {
    const containerRef = useRef<T>(null);

    const getFocusableElements = useCallback(() => {
        if (!containerRef.current) return [];

        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'textarea:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
        ].join(', ');

        return Array.from(
            containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
        );
    }, []);

    useEffect(() => {
        if (!isActive) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;

            const focusableElements = getFocusableElements();
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            // Shift + Tab: ir al último elemento si estamos en el primero
            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab: ir al primer elemento si estamos en el último
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        // Enfocar el primer elemento al activar
        const focusableElements = getFocusableElements();
        if (focusableElements.length > 0) {
            // Pequeño delay para asegurar que el DOM está listo
            setTimeout(() => {
                focusableElements[0].focus();
            }, 0);
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isActive, getFocusableElements]);

    return containerRef;
}

/**
 * Hook para restaurar el focus al elemento anterior cuando se cierra un modal/dropdown
 * 
 * @param isOpen - Si el modal/dropdown está abierto
 */
export function useRestoreFocus(isOpen: boolean) {
    const previousActiveElement = useRef<Element | null>(null);

    useEffect(() => {
        if (isOpen) {
            // Guardar el elemento actualmente enfocado
            previousActiveElement.current = document.activeElement;
        } else {
            // Restaurar el focus al cerrar
            if (previousActiveElement.current instanceof HTMLElement) {
                previousActiveElement.current.focus();
            }
        }
    }, [isOpen]);
}

/**
 * Hook para manejar Escape key
 * 
 * @param onEscape - Callback cuando se presiona Escape
 * @param isEnabled - Si el listener está activo
 */
export function useEscapeKey(onEscape: () => void, isEnabled: boolean = true) {
    useEffect(() => {
        if (!isEnabled) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onEscape();
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onEscape, isEnabled]);
}