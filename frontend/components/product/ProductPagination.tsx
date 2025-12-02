'use client';

import styles from './ProductPagination.module.css';

export interface ProductPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

/**
 * ProductPagination - Componente de paginación
 * 
 * Muestra números de página con botones anterior/siguiente
 * Maneja la navegación entre páginas de productos
 */
export function ProductPagination({ currentPage, totalPages, onPageChange }: ProductPaginationProps) {
    // No mostrar paginación si solo hay 1 página
    if (totalPages <= 1) {
        return null;
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    // Generar array de números de página a mostrar
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5; // Máximo de números visibles

        if (totalPages <= maxVisible) {
            // Mostrar todas las páginas si son pocas
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Lógica para mostrar páginas con elipsis
            if (currentPage <= 3) {
                // Cerca del inicio
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Cerca del final
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // En el medio
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav className={styles.pagination} aria-label="Paginación de productos">
            {/* Botón Anterior */}
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={styles.navButton}
                aria-label="Página anterior"
            >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className={styles.navText}>Anterior</span>
            </button>

            {/* Números de página */}
            <div className={styles.pages}>
                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                                ...
                            </span>
                        );
                    }

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page as number)}
                            className={`${styles.pageButton} ${currentPage === page ? styles.active : ''
                                }`}
                            aria-label={`Página ${page}`}
                            aria-current={currentPage === page ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    );
                })}
            </div>

            {/* Botón Siguiente */}
            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={styles.navButton}
                aria-label="Página siguiente"
            >
                <span className={styles.navText}>Siguiente</span>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </nav>
    );
}
