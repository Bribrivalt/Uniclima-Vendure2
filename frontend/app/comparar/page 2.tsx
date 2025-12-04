'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Breadcrumb } from '@/components/core';
import styles from './page.module.css';

/**
 * Interfaz para producto a comparar
 */
interface CompareProduct {
    id: string;
    name: string;
    slug: string;
    image?: string;
    price: number;
    originalPrice?: number;
    rating?: number;
    reviewCount?: number;
    inStock: boolean;
    brand?: string;
    specs: Record<string, string | number | boolean>;
}

/**
 * Especificaciones a mostrar en comparación
 */
const specLabels: Record<string, string> = {
    brand: 'Marca',
    model: 'Modelo',
    power: 'Potencia',
    energyClass: 'Clase energética',
    noise: 'Nivel de ruido',
    weight: 'Peso',
    dimensions: 'Dimensiones',
    warranty: 'Garantía',
    refrigerant: 'Refrigerante',
    wifi: 'WiFi incluido',
    inverter: 'Tecnología Inverter',
};

/**
 * CompararPage - Página de comparación de productos
 * 
 * Permite a los usuarios comparar características de
 * múltiples productos lado a lado.
 */
export default function CompararPage() {
    // Estado de productos a comparar (normalmente vendría del localStorage o contexto)
    const [products, setProducts] = useState<CompareProduct[]>([]);
    const [loading, setLoading] = useState(true);

    // Cargar productos de comparación
    useEffect(() => {
        const loadCompareProducts = async () => {
            setLoading(true);

            // TODO: Cargar productos del localStorage o contexto global
            // Simulamos datos de ejemplo
            await new Promise(resolve => setTimeout(resolve, 500));

            const mockProducts: CompareProduct[] = [
                {
                    id: '1',
                    name: 'Daikin FTXF35C Split 3500W',
                    slug: 'daikin-ftxf35c',
                    image: '/images/products/placeholder-1.jpg',
                    price: 849,
                    originalPrice: 999,
                    rating: 4.5,
                    reviewCount: 127,
                    inStock: true,
                    brand: 'Daikin',
                    specs: {
                        brand: 'Daikin',
                        model: 'FTXF35C',
                        power: '3500W',
                        energyClass: 'A++',
                        noise: '45 dB',
                        weight: '38 kg',
                        dimensions: '80x28x26 cm',
                        warranty: '5 años',
                        refrigerant: 'R-32',
                        wifi: true,
                        inverter: true,
                    },
                },
                {
                    id: '2',
                    name: 'Mitsubishi MSZ-HR35VF Split 3500W',
                    slug: 'mitsubishi-msz-hr35vf',
                    image: '/images/products/placeholder-2.jpg',
                    price: 749,
                    rating: 4.3,
                    reviewCount: 89,
                    inStock: true,
                    brand: 'Mitsubishi Electric',
                    specs: {
                        brand: 'Mitsubishi Electric',
                        model: 'MSZ-HR35VF',
                        power: '3500W',
                        energyClass: 'A++',
                        noise: '47 dB',
                        weight: '35 kg',
                        dimensions: '78x30x24 cm',
                        warranty: '3 años',
                        refrigerant: 'R-32',
                        wifi: false,
                        inverter: true,
                    },
                },
                {
                    id: '3',
                    name: 'Fujitsu ASY35UI-LM Split 3500W',
                    slug: 'fujitsu-asy35ui-lm',
                    image: '/images/products/placeholder-3.jpg',
                    price: 699,
                    rating: 4.2,
                    reviewCount: 65,
                    inStock: false,
                    brand: 'Fujitsu',
                    specs: {
                        brand: 'Fujitsu',
                        model: 'ASY35UI-LM',
                        power: '3500W',
                        energyClass: 'A+',
                        noise: '48 dB',
                        weight: '36 kg',
                        dimensions: '79x29x25 cm',
                        warranty: '2 años',
                        refrigerant: 'R-32',
                        wifi: true,
                        inverter: true,
                    },
                },
            ];

            setProducts(mockProducts);
            setLoading(false);
        };

        loadCompareProducts();
    }, []);

    // Eliminar producto de comparación
    const removeProduct = (productId: string) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
        // TODO: También eliminar del localStorage
    };

    // Limpiar comparación
    const clearAll = () => {
        setProducts([]);
        // TODO: Limpiar localStorage
    };

    // Obtener todas las especificaciones únicas
    const allSpecs = Object.keys(specLabels);

    // Formatear valor de especificación
    const formatSpecValue = (value: string | number | boolean | undefined) => {
        if (value === undefined) return '—';
        if (typeof value === 'boolean') return value ? '✓' : '✗';
        return String(value);
    };

    // Breadcrumbs
    const breadcrumbItems = [
        { label: 'Inicio', href: '/' },
        { label: 'Comparar productos' },
    ];

    // Estado de carga
    if (loading) {
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
    if (products.length === 0) {
        return (
            <div className={styles.container}>
                <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>⚖️</div>
                    <h1>No hay productos para comparar</h1>
                    <p>Añade productos a la comparación desde las fichas de producto</p>
                    <Link href="/productos">
                        <Button variant="primary">
                            Ver productos
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
                    Comparando {products.length} {products.length === 1 ? 'producto' : 'productos'}
                </p>
                <Button variant="outline" size="sm" onClick={clearAll}>
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
                                                <img src={product.image} alt={product.name} />
                                            </div>
                                        )}
                                        <h3 className={styles.productName}>
                                            <Link href={`/productos/${product.slug}`}>
                                                {product.name}
                                            </Link>
                                        </h3>
                                        <div className={styles.productPrice}>
                                            <span className={styles.price}>
                                                {product.price.toLocaleString('es-ES')}€
                                            </span>
                                            {product.originalPrice && (
                                                <span className={styles.originalPrice}>
                                                    {product.originalPrice.toLocaleString('es-ES')}€
                                                </span>
                                            )}
                                        </div>
                                        <div className={styles.productStock}>
                                            {product.inStock ? (
                                                <span className={styles.inStock}>En stock</span>
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
                        {allSpecs.map((spec) => (
                            <tr key={spec}>
                                <td className={styles.labelCell}>
                                    {specLabels[spec]}
                                </td>
                                {products.map((product) => {
                                    const value = product.specs[spec];
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
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Añadir más productos */}
            {products.length < 4 && (
                <div className={styles.addMore}>
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
    value: string | number | boolean | undefined,
    products: CompareProduct[]
): boolean {
    if (value === undefined) return false;

    const values = products.map(p => p.specs[spec]).filter(v => v !== undefined);

    // Para especificaciones numéricas, el mejor depende del tipo
    if (spec === 'noise') {
        // Menor ruido es mejor
        const numValue = parseInt(String(value));
        const minValue = Math.min(...values.map(v => parseInt(String(v))));
        return numValue === minValue && values.filter(v => parseInt(String(v)) === minValue).length === 1;
    }

    if (spec === 'warranty') {
        // Mayor garantía es mejor
        const numValue = parseInt(String(value));
        const maxValue = Math.max(...values.map(v => parseInt(String(v))));
        return numValue === maxValue && values.filter(v => parseInt(String(v)) === maxValue).length === 1;
    }

    if (spec === 'energyClass') {
        // A+++ es mejor que A++, etc.
        const classes = ['G', 'F', 'E', 'D', 'C', 'B', 'A', 'A+', 'A++', 'A+++'];
        const valueIndex = classes.indexOf(String(value));
        const maxIndex = Math.max(...values.map(v => classes.indexOf(String(v))));
        return valueIndex === maxIndex && values.filter(v => classes.indexOf(String(v)) === maxIndex).length === 1;
    }

    // Para booleanos, true es mejor
    if (typeof value === 'boolean') {
        return value === true && values.filter(v => v === true).length === 1;
    }

    return false;
}