'use client';

import React, { useState, useId, createContext, useContext } from 'react';
import styles from './Accordion.module.css';

/**
 * Contexto para compartir estado entre Accordion y AccordionItem
 */
interface AccordionContextValue {
    expandedItems: string[];
    toggleItem: (id: string) => void;
    allowMultiple: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

/**
 * Props para el componente Accordion
 * @interface AccordionProps
 */
export interface AccordionProps {
    /** Items del accordion */
    children: React.ReactNode;
    /** Permitir múltiples items abiertos simultáneamente */
    allowMultiple?: boolean;
    /** ID del item expandido por defecto (o array si allowMultiple) */
    defaultExpanded?: string | string[];
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Accordion - Componente de panel desplegable
 * 
 * Características:
 * - Soporte para single o multiple items abiertos
 * - Animación de apertura/cierre
 * - Accesible con ARIA
 * - Navegación por teclado
 * 
 * @example
 * ```tsx
 * // Básico (solo un item abierto)
 * <Accordion>
 *   <AccordionItem title="¿Cómo funciona?" id="item1">
 *     Contenido de la respuesta...
 *   </AccordionItem>
 *   <AccordionItem title="¿Cuánto cuesta?" id="item2">
 *     Información de precios...
 *   </AccordionItem>
 * </Accordion>
 * 
 * // Múltiples items abiertos
 * <Accordion allowMultiple defaultExpanded={['item1']}>
 *   <AccordionItem title="Sección 1" id="item1">...</AccordionItem>
 *   <AccordionItem title="Sección 2" id="item2">...</AccordionItem>
 * </Accordion>
 * ```
 */
export function Accordion({
    children,
    allowMultiple = false,
    defaultExpanded,
    className,
}: AccordionProps) {
    // Inicializar estado de items expandidos
    const initialExpanded = defaultExpanded
        ? Array.isArray(defaultExpanded)
            ? defaultExpanded
            : [defaultExpanded]
        : [];

    const [expandedItems, setExpandedItems] = useState<string[]>(initialExpanded);

    // Toggle de un item
    const toggleItem = (id: string) => {
        setExpandedItems(prev => {
            const isExpanded = prev.includes(id);

            if (allowMultiple) {
                // Si permite múltiples, toggle el item
                return isExpanded
                    ? prev.filter(item => item !== id)
                    : [...prev, id];
            } else {
                // Si solo permite uno, cerrar otros y abrir/cerrar este
                return isExpanded ? [] : [id];
            }
        });
    };

    const contextValue: AccordionContextValue = {
        expandedItems,
        toggleItem,
        allowMultiple,
    };

    const accordionClasses = [styles.accordion, className].filter(Boolean).join(' ');

    return (
        <AccordionContext.Provider value={contextValue}>
            <div className={accordionClasses}>
                {children}
            </div>
        </AccordionContext.Provider>
    );
}

/**
 * Props para el componente AccordionItem
 * @interface AccordionItemProps
 */
export interface AccordionItemProps {
    /** ID único del item */
    id: string;
    /** Título del item (siempre visible) */
    title: React.ReactNode;
    /** Contenido desplegable */
    children: React.ReactNode;
    /** Icono personalizado para el estado cerrado */
    icon?: React.ReactNode;
    /** Icono personalizado para el estado abierto */
    iconExpanded?: React.ReactNode;
    /** Deshabilitado */
    disabled?: boolean;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Icono de chevron por defecto
 */
const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
    <svg
        viewBox="0 0 20 20"
        fill="currentColor"
        className={`${styles.chevron} ${expanded ? styles.chevronExpanded : ''}`}
        aria-hidden="true"
    >
        <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
        />
    </svg>
);

/**
 * AccordionItem - Item individual del Accordion
 */
export function AccordionItem({
    id,
    title,
    children,
    icon,
    iconExpanded,
    disabled = false,
    className,
}: AccordionItemProps) {
    const context = useContext(AccordionContext);
    const generatedId = useId();
    const headerId = `accordion-header-${id || generatedId}`;
    const panelId = `accordion-panel-${id || generatedId}`;

    if (!context) {
        throw new Error('AccordionItem must be used within an Accordion');
    }

    const { expandedItems, toggleItem } = context;
    const isExpanded = expandedItems.includes(id);

    // Handler de click
    const handleClick = () => {
        if (!disabled) {
            toggleItem(id);
        }
    };

    // Handler de teclado
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;

        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleItem(id);
        }
    };

    // Clases CSS
    const itemClasses = [
        styles.item,
        isExpanded && styles.expanded,
        disabled && styles.disabled,
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={itemClasses}>
            {/* Header/Trigger */}
            <button
                id={headerId}
                className={styles.header}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                aria-disabled={disabled}
                disabled={disabled}
                type="button"
            >
                <span className={styles.title}>{title}</span>
                <span className={styles.iconWrapper}>
                    {isExpanded && iconExpanded
                        ? iconExpanded
                        : icon
                            ? icon
                            : <ChevronIcon expanded={isExpanded} />
                    }
                </span>
            </button>

            {/* Panel/Content */}
            <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                className={styles.panel}
                hidden={!isExpanded}
            >
                <div className={styles.content}>
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Accordion;