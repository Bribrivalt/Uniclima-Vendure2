'use client';

import React, { useState } from 'react';
import styles from './ProductSpecs.module.css';

/**
 * Interfaz para una especificación técnica individual
 * @interface Spec
 */
export interface Spec {
    /** Nombre/etiqueta de la especificación */
    label: string;
    /** Valor de la especificación */
    value: string;
    /** Unidad de medida (opcional) */
    unit?: string;
    /** Descripción adicional o tooltip (opcional) */
    description?: string;
    /** Icono o símbolo a mostrar (opcional) */
    icon?: string;
}

/**
 * Interfaz para un grupo de especificaciones
 * @interface SpecGroup
 */
export interface SpecGroup {
    /** ID único del grupo */
    id: string;
    /** Título del grupo de especificaciones */
    title: string;
    /** Lista de especificaciones en este grupo */
    specs: Spec[];
}

/**
 * Props para el componente ProductSpecs
 * @interface ProductSpecsProps
 */
export interface ProductSpecsProps {
    /** Especificaciones sin agrupar */
    specs?: Spec[];
    /** Especificaciones agrupadas por categoría */
    groups?: SpecGroup[];
    /** Título de la sección (opcional) */
    title?: string;
    /** Variante de visualización */
    variant?: 'table' | 'grid' | 'list';
    /** Mostrar como acordeón colapsable */
    collapsible?: boolean;
    /** Grupos expandidos por defecto (solo si collapsible=true) */
    defaultExpanded?: string[];
    /** Mostrar icono de información para specs con descripción */
    showDescriptionTooltip?: boolean;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Icono de información
 */
const InfoIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
);

/**
 * Icono de chevron para acordeón
 */
const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

/**
 * ProductSpecs - Tabla/Grid de especificaciones técnicas
 * 
 * Componente flexible para mostrar especificaciones técnicas del producto
 * en diferentes formatos: tabla, grid o lista. Soporta agrupación por
 * categorías y modo acordeón colapsable.
 * 
 * @example
 * ```tsx
 * // Especificaciones simples en tabla
 * <ProductSpecs
 *   specs={[
 *     { label: 'Potencia', value: '3.5', unit: 'kW' },
 *     { label: 'Eficiencia', value: 'A+++' },
 *   ]}
 * />
 * 
 * // Especificaciones agrupadas
 * <ProductSpecs
 *   groups={[
 *     {
 *       id: 'general',
 *       title: 'Características Generales',
 *       specs: [...]
 *     },
 *     {
 *       id: 'technical',
 *       title: 'Datos Técnicos',
 *       specs: [...]
 *     }
 *   ]}
 *   variant="grid"
 *   collapsible
 * />
 * ```
 */
export function ProductSpecs({
    specs,
    groups,
    title = 'Especificaciones Técnicas',
    variant = 'table',
    collapsible = false,
    defaultExpanded,
    showDescriptionTooltip = true,
    className,
}: ProductSpecsProps) {
    // Estado para acordeón - por defecto todos expandidos o los especificados
    const [expandedGroups, setExpandedGroups] = useState<string[]>(
        defaultExpanded || groups?.map(g => g.id) || []
    );

    // Alternar expansión de grupo
    const toggleGroup = (groupId: string) => {
        setExpandedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    // Renderizar una fila de especificación individual
    const renderSpecRow = (spec: Spec, index: number) => (
        <div key={index} className={styles.specRow}>
            <dt className={styles.specLabel}>
                {spec.icon && <span className={styles.specIcon}>{spec.icon}</span>}
                {spec.label}
                {spec.description && showDescriptionTooltip && (
                    <span className={styles.infoIcon} title={spec.description}>
                        <InfoIcon />
                    </span>
                )}
            </dt>
            <dd className={styles.specValue}>
                {spec.value}
                {spec.unit && <span className={styles.specUnit}> {spec.unit}</span>}
            </dd>
        </div>
    );

    // Renderizar lista de especificaciones según variante
    const renderSpecsList = (specsList: Spec[]) => {
        const listClasses = [
            styles.specsList,
            styles[`variant-${variant}`]
        ].join(' ');

        return (
            <dl className={listClasses}>
                {specsList.map((spec, index) => renderSpecRow(spec, index))}
            </dl>
        );
    };

    // Renderizar un grupo de especificaciones
    const renderGroup = (group: SpecGroup) => {
        const isExpanded = expandedGroups.includes(group.id);

        if (collapsible) {
            return (
                <div key={group.id} className={styles.group}>
                    <button
                        type="button"
                        className={`${styles.groupHeader} ${isExpanded ? styles.expanded : ''}`}
                        onClick={() => toggleGroup(group.id)}
                        aria-expanded={isExpanded}
                        aria-controls={`specs-${group.id}`}
                    >
                        <span className={styles.groupTitle}>{group.title}</span>
                        <span className={styles.groupChevron}>
                            <ChevronIcon expanded={isExpanded} />
                        </span>
                    </button>
                    <div
                        id={`specs-${group.id}`}
                        className={`${styles.groupContent} ${isExpanded ? styles.expanded : ''}`}
                        role="region"
                        aria-labelledby={`group-${group.id}`}
                        hidden={!isExpanded}
                    >
                        {renderSpecsList(group.specs)}
                    </div>
                </div>
            );
        }

        return (
            <div key={group.id} className={styles.group}>
                <h3 className={styles.groupTitle}>{group.title}</h3>
                {renderSpecsList(group.specs)}
            </div>
        );
    };

    // Si no hay especificaciones, no renderizar nada
    if ((!specs || specs.length === 0) && (!groups || groups.length === 0)) {
        return null;
    }

    const containerClasses = [styles.container, className].filter(Boolean).join(' ');

    return (
        <section className={containerClasses} aria-labelledby="specs-title">
            {title && (
                <h2 id="specs-title" className={styles.title}>{title}</h2>
            )}

            {/* Especificaciones sin agrupar */}
            {specs && specs.length > 0 && !groups && (
                renderSpecsList(specs)
            )}

            {/* Especificaciones agrupadas */}
            {groups && groups.length > 0 && (
                <div className={styles.groupsContainer}>
                    {groups.map(group => renderGroup(group))}
                </div>
            )}
        </section>
    );
}

/**
 * ProductSpecsCompact - Versión compacta para mostrar specs destacados
 * 
 * Muestra un número limitado de especificaciones clave en formato
 * horizontal, ideal para vistas de preview o tarjetas de producto.
 * 
 * @example
 * ```tsx
 * <ProductSpecsCompact
 *   specs={[
 *     { label: 'Potencia', value: '3.5 kW' },
 *     { label: 'SEER', value: '8.5' },
 *     { label: 'SCOP', value: '5.1' },
 *   ]}
 *   maxItems={3}
 * />
 * ```
 */
export interface ProductSpecsCompactProps {
    /** Lista de especificaciones a mostrar */
    specs: Spec[];
    /** Número máximo de specs a mostrar */
    maxItems?: number;
    /** Clase CSS adicional */
    className?: string;
}

export function ProductSpecsCompact({
    specs,
    maxItems = 4,
    className,
}: ProductSpecsCompactProps) {
    const displaySpecs = specs.slice(0, maxItems);

    if (displaySpecs.length === 0) {
        return null;
    }

    const containerClasses = [styles.compactContainer, className].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            {displaySpecs.map((spec, index) => (
                <div key={index} className={styles.compactSpec}>
                    <span className={styles.compactLabel}>{spec.label}</span>
                    <span className={styles.compactValue}>
                        {spec.value}
                        {spec.unit && <span className={styles.compactUnit}> {spec.unit}</span>}
                    </span>
                </div>
            ))}
        </div>
    );
}

export default ProductSpecs;