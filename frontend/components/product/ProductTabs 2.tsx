'use client';

import React, { useState } from 'react';
import styles from './ProductTabs.module.css';

/**
 * Interfaz para una especificación técnica
 */
export interface ProductSpec {
    label: string;
    value: string;
    unit?: string;
}

/**
 * Interfaz para un documento del producto
 */
export interface ProductDocument {
    id: string;
    name: string;
    url: string;
    type: 'pdf' | 'doc' | 'image' | 'other';
    size?: string;
}

/**
 * Interfaz para una opinión/review
 */
export interface ProductReview {
    id: string;
    author: string;
    rating: number;
    date: string;
    title?: string;
    content: string;
    verified?: boolean;
}

/**
 * Props para el componente ProductTabs
 * @interface ProductTabsProps
 */
export interface ProductTabsProps {
    /** Descripción del producto (HTML permitido) */
    description?: string;
    /** Especificaciones técnicas */
    specifications?: ProductSpec[];
    /** Documentos descargables */
    documents?: ProductDocument[];
    /** Opiniones de clientes */
    reviews?: ProductReview[];
    /** Tab activo por defecto */
    defaultTab?: 'description' | 'specifications' | 'documents' | 'reviews';
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Icono de descarga
 */
const DownloadIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
    </svg>
);

/**
 * Icono de PDF
 */
const PdfIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM9.5 15c.5 0 .9.1 1.2.3.3.2.6.4.8.8.2.3.3.7.3 1.2 0 .4-.1.8-.3 1.2-.2.3-.5.6-.8.8-.3.2-.7.3-1.2.3H8v-4.6h1.5zm0 3.6c.4 0 .7-.1.9-.4.2-.3.3-.6.3-1 0-.4-.1-.8-.3-1-.2-.3-.5-.4-.9-.4H9v2.8h.5zM13 15v4.6h-1v-4.6h1zm2.5 4.6h-1v-4.6h1.5c.4 0 .8.1 1.1.3.3.2.5.5.5.9 0 .3-.1.5-.2.7-.1.2-.3.4-.5.5l1 2.2h-1.1l-.8-1.9h-.5v1.9zm0-2.7h.5c.2 0 .3-.1.4-.2.1-.1.2-.2.2-.4 0-.2-.1-.3-.2-.4-.1-.1-.2-.2-.4-.2h-.5v1.2zM14 8h-2V4l6 6h-4V8z" />
    </svg>
);

/**
 * Icono de estrella
 */
const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

/**
 * Icono de verificado
 */
const VerifiedIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
    </svg>
);

/**
 * ProductTabs - Tabs de información del producto
 * 
 * Características:
 * - Descripción con HTML
 * - Especificaciones técnicas en tabla
 * - Documentos descargables
 * - Opiniones con valoración
 * 
 * @example
 * ```tsx
 * <ProductTabs
 *   description="<p>Descripción del producto...</p>"
 *   specifications={[
 *     { label: 'Potencia', value: '3.5', unit: 'kW' },
 *     { label: 'Eficiencia', value: 'A+++' },
 *   ]}
 *   documents={[
 *     { id: '1', name: 'Ficha técnica', url: '/docs/ficha.pdf', type: 'pdf' }
 *   ]}
 *   reviews={[
 *     { id: '1', author: 'Juan', rating: 5, date: '2024-01-15', content: 'Excelente producto' }
 *   ]}
 * />
 * ```
 */
export function ProductTabs({
    description,
    specifications,
    documents,
    reviews,
    defaultTab = 'description',
    className,
}: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    // Determinar qué tabs mostrar
    const tabs = [
        { id: 'description', label: 'Descripción', visible: !!description },
        { id: 'specifications', label: 'Especificaciones', visible: specifications && specifications.length > 0 },
        { id: 'documents', label: 'Documentos', visible: documents && documents.length > 0 },
        { id: 'reviews', label: `Opiniones${reviews ? ` (${reviews.length})` : ''}`, visible: reviews && reviews.length > 0 },
    ].filter(tab => tab.visible);

    // Si no hay tabs visibles, no mostrar nada
    if (tabs.length === 0) {
        return null;
    }

    // Si el tab activo no está visible, seleccionar el primero disponible
    const activeTabExists = tabs.some(tab => tab.id === activeTab);
    if (!activeTabExists && tabs.length > 0) {
        setActiveTab(tabs[0].id as typeof activeTab);
    }

    // Calcular rating promedio
    const averageRating = reviews && reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const containerClasses = [styles.container, className].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            {/* Tab headers */}
            <div className={styles.tabList} role="tablist">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        type="button"
                        className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        aria-controls={`tabpanel-${tab.id}`}
                        id={`tab-${tab.id}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab panels */}
            <div className={styles.tabPanels}>
                {/* Descripción */}
                {activeTab === 'description' && description && (
                    <div
                        className={styles.tabPanel}
                        role="tabpanel"
                        id="tabpanel-description"
                        aria-labelledby="tab-description"
                    >
                        <div
                            className={styles.description}
                            dangerouslySetInnerHTML={{ __html: description }}
                        />
                    </div>
                )}

                {/* Especificaciones */}
                {activeTab === 'specifications' && specifications && (
                    <div
                        className={styles.tabPanel}
                        role="tabpanel"
                        id="tabpanel-specifications"
                        aria-labelledby="tab-specifications"
                    >
                        <table className={styles.specsTable}>
                            <tbody>
                                {specifications.map((spec, index) => (
                                    <tr key={index} className={styles.specRow}>
                                        <th className={styles.specLabel}>{spec.label}</th>
                                        <td className={styles.specValue}>
                                            {spec.value}
                                            {spec.unit && <span className={styles.specUnit}> {spec.unit}</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Documentos */}
                {activeTab === 'documents' && documents && (
                    <div
                        className={styles.tabPanel}
                        role="tabpanel"
                        id="tabpanel-documents"
                        aria-labelledby="tab-documents"
                    >
                        <ul className={styles.documentList}>
                            {documents.map(doc => (
                                <li key={doc.id} className={styles.documentItem}>
                                    <a
                                        href={doc.url}
                                        className={styles.documentLink}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <span className={styles.documentIcon}>
                                            {doc.type === 'pdf' ? <PdfIcon /> : <DownloadIcon />}
                                        </span>
                                        <span className={styles.documentInfo}>
                                            <span className={styles.documentName}>{doc.name}</span>
                                            {doc.size && <span className={styles.documentSize}>{doc.size}</span>}
                                        </span>
                                        <span className={styles.documentAction}>
                                            <DownloadIcon />
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Opiniones */}
                {activeTab === 'reviews' && reviews && (
                    <div
                        className={styles.tabPanel}
                        role="tabpanel"
                        id="tabpanel-reviews"
                        aria-labelledby="tab-reviews"
                    >
                        {/* Resumen de valoraciones */}
                        <div className={styles.reviewsSummary}>
                            <div className={styles.averageRating}>
                                <span className={styles.averageValue}>{averageRating.toFixed(1)}</span>
                                <div className={styles.averageStars}>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span key={star} className={styles.star}>
                                            <StarIcon filled={star <= Math.round(averageRating)} />
                                        </span>
                                    ))}
                                </div>
                                <span className={styles.reviewCount}>
                                    Basado en {reviews.length} {reviews.length === 1 ? 'opinión' : 'opiniones'}
                                </span>
                            </div>
                        </div>

                        {/* Lista de opiniones */}
                        <div className={styles.reviewsList}>
                            {reviews.map(review => (
                                <article key={review.id} className={styles.review}>
                                    <header className={styles.reviewHeader}>
                                        <div className={styles.reviewStars}>
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <span key={star} className={styles.star}>
                                                    <StarIcon filled={star <= review.rating} />
                                                </span>
                                            ))}
                                        </div>
                                        {review.title && (
                                            <h4 className={styles.reviewTitle}>{review.title}</h4>
                                        )}
                                    </header>
                                    <p className={styles.reviewContent}>{review.content}</p>
                                    <footer className={styles.reviewFooter}>
                                        <span className={styles.reviewAuthor}>
                                            {review.author}
                                            {review.verified && (
                                                <span className={styles.verifiedBadge} title="Compra verificada">
                                                    <VerifiedIcon />
                                                    Verificado
                                                </span>
                                            )}
                                        </span>
                                        <span className={styles.reviewDate}>
                                            {new Date(review.date).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </footer>
                                </article>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductTabs;