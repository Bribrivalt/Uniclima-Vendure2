'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Breadcrumb } from '@/components/core';
import { useCompare, CompareProduct } from '@/lib/hooks/useCompare';
import styles from './page.module.css';

/**
 * Especificaciones a mostrar en comparación HVAC
 * Mapeamos los campos de customFields de Vendure
 */
const specLabels: Record<string, string> = {
    potenciaKw: 'Potencia (kW)',
    frigorias: 'Frigorías',
    claseEnergetica: 'Clase Energética',
    seer: 'SEER (Eficiencia frío)',
    scop: 'SCOP (Eficiencia calor)',
    refrigerante: 'Refrigerante',
    nivelSonoroInterior: 'Ruido Interior (dB)',
    nivelSonoroExterior: 'Ruido Exterior (dB)',
    wifi: 'WiFi incluido',
    garantiaAnos: 'Garantía (años)',
    dimensionesInterior: 'Dimensiones Interior',
    dimensionesExterior: 'Dimensiones Exterior',
    pesoUnidadInterior: 'Peso Interior (kg)',
    pesoUnidadExterior: 'Peso Exterior (kg)',
};

/**
 * CompararPage - Página de comparación de productos
 *
 * Permite a los usuarios comparar características de
 * múltiples productos HVAC lado a lado.
 * Usa localStorage para persistir la lista de comparación.
 */
export default function CompararPage() {
    const {
        compareList: products,
        removeProduct,
        clearCompare,
        isLoading,
        count
    } = useCompare();

    // Obtener todas las especificaciones únicas de los productos
    const allSpecs = Object.keys(specLabels);

    // Formatear valor de especificación
    const formatSpecValue = (value: string | number | boolean | undefined | null) => {
        if (value === undefined || value === null) return '—';
        if (typeof value === 'boolean') return value ? '✓ Sí' : '✗ No';
        if (typeof value === 'number') {
            // Formatear números con coma decimal
            return value.toLocaleString('es-ES');
        }
        return String(value);
    };

    // Breadcrumbs
    const breadcrumbItems = [
        { label: 'Inicio', href: '/' },
        { label: 'Comparar productos' },
    ];

    // Estado de carga
    if (isLoading) {
        return (
            <div className={styles.container}>
                <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />
                <div className={styles.loading}>
                    <div className={styles.spinner} />
                    <p>Cargando comparación...</p>
                </div>
            </div>
        );
    }

    // Sin productos
    if (count === 0) {
        return (
            <div className={styles.container}>
                <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>⚖️</div>
                    <h1>No hay productos para comparar</h1>
                    <p>Añade productos a la comparación desde las fichas de producto usando el botón "Comparar"</p>
                    <Link href="/productos">
                        <Button variant="primary">
                            Ver catálogo de productos
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />

            {/* Header */}
            <header className={styles.header}>
                <h1 className={styles.title}>Comparar productos</h1>
                <p className={styles.subtitle}>
                    Comparando {count} {count === 1 ? 'producto' : 'productos'}
                </p>
                <Button variant="outline" size="sm" onClick={clearCompare}>
                    Limpiar comparación
                </Button>
            </header>

            {/* Tabla de comparación */}
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    {/* Cabecera con productos */}
                    <thead>
                        <tr>
                            <th className={styles.labelCell}>
                                <span className={styles.srOnly}>Especificación</span>
                            </th>
                            {products.map((product) => (
                                <th key={product.id} className={styles.productCell}>
                                    <div className={styles.productHeader}>
                                        <button
                                            className={styles.removeButton}
                                            onClick={() => removeProduct(product.id)}
                                            aria-label={`Eliminar ${product.name} de la comparación`}
                                        >
                                            ×
                                        </button>
                                        {product.image && (
                                            <div className={styles.productImage}>
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    width={150}
                                                    height={150}
                                                    style={{ objectFit: 'contain' }}
                                                />
                                            </div>
                                        )}
                                        <h3 className={styles.productName}>
                                            <Link href={`/productos/${product.slug}`}>
                                                {product.name}
                                            </Link>
                                        </h3>
                                        {product.brand && (
                                            <span className={styles.productBrand}>{product.brand}</span>
                                        )}
                                        <div className={styles.productPrice}>
                                            <span className={styles.price}>
                                                {(product.price / 100).toLocaleString('es-ES', {
                                                    style: 'currency',
                                                    currency: 'EUR'
                                                })}
                                            </span>
                                        </div>
                                        <div className={styles.productStock}>
                                            {product.inStock ? (
                                                <span className={styles.inStock}>✓ En stock</span>
                                            ) : (
                                                <span className={styles.outOfStock}>Agotado</span>
                                            )}
                                        </div>
                                        <Link href={`/productos/${product.slug}`}>
                                            <Button variant="primary" size="sm" fullWidth>
                                                Ver producto
                                            </Button>
                                        </Link>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Cuerpo con especificaciones */}
                    <tbody>
                        {allSpecs.map((spec) => {
                            // Solo mostrar filas si al menos un producto tiene este dato
                            const hasValue = products.some(p => {
                                const val = p.specs[spec as keyof typeof p.specs];
                                return val !== undefined && val !== null;
                            });
                            
                            if (!hasValue) return null;

                            return (
                                <tr key={spec}>
                                    <td className={styles.labelCell}>
                                        {specLabels[spec]}
                                    </td>
                                    {products.map((product) => {
                                        const value = product.specs[spec as keyof typeof product.specs];
                                        const isBest = checkIfBest(spec, value, products);

                                        return (
                                            <td
                                                key={product.id}
                                                className={`${styles.valueCell} ${isBest ? styles.bestValue : ''}`}
                                            >
                                                {formatSpecValue(value)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Añadir más productos */}
            {count < 4 && (
                <div className={styles.addMore}>
                    <p className={styles.addMoreText}>
                        Puedes comparar hasta 4 productos
                    </p>
                    <Link href="/productos">
                        <Button variant="outline">
                            + Añadir otro producto
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

/**
 * Determina si un valor es el mejor entre los productos comparados
 */
function checkIfBest(
    spec: string,
    value: string | number | boolean | undefined | null,
    products: CompareProduct[]
): boolean {
    if (value === undefined || value === null) return false;

    const values = products.map(p => p.specs[spec as keyof typeof p.specs]).filter(v => v !== undefined && v !== null);
    
    if (values.length < 2) return false;

    // Menor ruido es mejor
    if (spec === 'nivelSonoroInterior' || spec === 'nivelSonoroExterior') {
        const numValue = Number(value);
        const minValue = Math.min(...values.map(v => Number(v)));
        return numValue === minValue && values.filter(v => Number(v) === minValue).length === 1;
    }

    // Mayor eficiencia es mejor
    if (spec === 'seer' || spec === 'scop') {
        const numValue = Number(value);
        const maxValue = Math.max(...values.map(v => Number(v)));
        return numValue === maxValue && values.filter(v => Number(v) === maxValue).length === 1;
    }

    // Mayor garantía es mejor
    if (spec === 'garantiaAnos') {
        const numValue = Number(value);
        const maxValue = Math.max(...values.map(v => Number(v)));
        return numValue === maxValue && values.filter(v => Number(v) === maxValue).length === 1;
    }

    // Clase energética: A+++ es mejor
    if (spec === 'claseEnergetica') {
        const classes = ['G', 'F', 'E', 'D', 'C', 'B', 'A', 'A+', 'A++', 'A+++'];
        const valueIndex = classes.indexOf(String(value));
        const maxIndex = Math.max(...values.map(v => classes.indexOf(String(v))));
        return valueIndex === maxIndex && values.filter(v => classes.indexOf(String(v)) === maxIndex).length === 1;
    }

    // Para booleanos, true es mejor (wifi incluido, etc.)
    if (typeof value === 'boolean') {
        return value === true && values.filter(v => v === true).length === 1;
    }

    return false;
}