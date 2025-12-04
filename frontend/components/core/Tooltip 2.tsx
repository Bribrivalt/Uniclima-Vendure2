'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import styles from './Tooltip.module.css';

/**
 * Props para el componente Tooltip
 * @interface TooltipProps
 */
export interface TooltipProps {
    /** Contenido del tooltip */
    content: React.ReactNode;
    /** Elemento que activa el tooltip */
    children: React.ReactElement;
    /** Posición del tooltip respecto al trigger */
    position?: 'top' | 'bottom' | 'left' | 'right';
    /** Tipo de activación */
    trigger?: 'hover' | 'click' | 'focus';
    /** Delay antes de mostrar (ms) */
    delay?: number;
    /** Delay antes de ocultar (ms) */
    hideDelay?: number;
    /** Si el tooltip está deshabilitado */
    disabled?: boolean;
    /** Ancho máximo del tooltip */
    maxWidth?: number;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Tooltip - Componente de información contextual
 * 
 * Características:
 * - Posiciones: top, bottom, left, right
 * - Triggers: hover, click, focus
 * - Delays configurables
 * - Flecha indicadora
 * - Accesible con ARIA
 * 
 * @example
 * ```tsx
 * // Básico (hover)
 * <Tooltip content="Información adicional">
 *   <button>Hover me</button>
 * </Tooltip>
 * 
 * // Con posición
 * <Tooltip content="Tooltip a la derecha" position="right">
 *   <span>Texto con tooltip</span>
 * </Tooltip>
 * 
 * // Con click
 * <Tooltip content="Click para cerrar" trigger="click">
 *   <button>Click me</button>
 * </Tooltip>
 * 
 * // Con delay
 * <Tooltip content="Aparece con delay" delay={500}>
 *   <span>Espera 500ms</span>
 * </Tooltip>
 * ```
 */
export function Tooltip({
    content,
    children,
    position = 'top',
    trigger = 'hover',
    delay = 0,
    hideDelay = 0,
    disabled = false,
    maxWidth = 250,
    className,
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ x: 0, y: 0 });
    const triggerRef = useRef<HTMLElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const showTimeoutRef = useRef<NodeJS.Timeout>();
    const hideTimeoutRef = useRef<NodeJS.Timeout>();
    const tooltipId = useId();

    // Limpiar timeouts al desmontar
    useEffect(() => {
        return () => {
            if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        };
    }, []);

    // Calcular posición del tooltip
    const updatePosition = () => {
        if (!triggerRef.current || !tooltipRef.current) return;

        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const spacing = 8; // Espacio entre trigger y tooltip

        let x = 0;
        let y = 0;

        switch (position) {
            case 'top':
                x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                y = triggerRect.top - tooltipRect.height - spacing;
                break;
            case 'bottom':
                x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
                y = triggerRect.bottom + spacing;
                break;
            case 'left':
                x = triggerRect.left - tooltipRect.width - spacing;
                y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                break;
            case 'right':
                x = triggerRect.right + spacing;
                y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
                break;
        }

        // Ajustar si se sale de la pantalla
        const padding = 10;
        x = Math.max(padding, Math.min(x, window.innerWidth - tooltipRect.width - padding));
        y = Math.max(padding, Math.min(y, window.innerHeight - tooltipRect.height - padding));

        setCoords({ x, y });
    };

    // Mostrar tooltip
    const show = () => {
        if (disabled) return;

        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }

        if (delay > 0) {
            showTimeoutRef.current = setTimeout(() => {
                setIsVisible(true);
            }, delay);
        } else {
            setIsVisible(true);
        }
    };

    // Ocultar tooltip
    const hide = () => {
        if (showTimeoutRef.current) {
            clearTimeout(showTimeoutRef.current);
        }

        if (hideDelay > 0) {
            hideTimeoutRef.current = setTimeout(() => {
                setIsVisible(false);
            }, hideDelay);
        } else {
            setIsVisible(false);
        }
    };

    // Toggle para click
    const toggle = () => {
        if (isVisible) {
            hide();
        } else {
            show();
        }
    };

    // Actualizar posición cuando se hace visible
    useEffect(() => {
        if (isVisible) {
            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
        }

        return () => {
            window.removeEventListener('scroll', updatePosition, true);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isVisible, position]);

    // Cerrar con Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isVisible) {
                hide();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isVisible]);

    // Props para el trigger según el tipo
    const triggerProps: Record<string, unknown> = {
        ref: triggerRef,
        'aria-describedby': isVisible ? tooltipId : undefined,
    };

    if (trigger === 'hover') {
        triggerProps.onMouseEnter = show;
        triggerProps.onMouseLeave = hide;
        triggerProps.onFocus = show;
        triggerProps.onBlur = hide;
    } else if (trigger === 'click') {
        triggerProps.onClick = toggle;
    } else if (trigger === 'focus') {
        triggerProps.onFocus = show;
        triggerProps.onBlur = hide;
    }

    // Clonar el children con las props adicionales
    const triggerElement = React.cloneElement(children, triggerProps);

    // Clases CSS
    const tooltipClasses = [
        styles.tooltip,
        styles[position],
        isVisible && styles.visible,
        className,
    ].filter(Boolean).join(' ');

    return (
        <>
            {triggerElement}
            <div
                ref={tooltipRef}
                id={tooltipId}
                role="tooltip"
                className={tooltipClasses}
                style={{
                    left: coords.x,
                    top: coords.y,
                    maxWidth,
                }}
            >
                <div className={styles.content}>
                    {content}
                </div>
                <div className={styles.arrow} />
            </div>
        </>
    );
}

export default Tooltip;