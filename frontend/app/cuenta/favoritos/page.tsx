'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AccountSidebar } from '@/components/auth';
import { ProductCard } from '@/components/product';
import { Breadcrumb, Button, Alert } from '@/components/core';
import styles from './page.module.css';

/**
 * Interfaz para producto favorito
 */
interface FavoriteProduct {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    originalPrice?: number;
    image?: string;
    rating?: number;
    reviewCount?: number;
    inStock: boolean;
    addedAt: string;
}

/**
 * FavoritosPage - Página de lista de deseos
 * 
 * Muestra los productos que el usuario ha guardado como favoritos.
 */
export default function FavoritosPage() {
    const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Cargar favoritos
    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);

            // TODO: Reemplazar con llamada a Vendure GraphQL
            await new Promise(resolve => setTimeout(resolve, 600));

            const mockFavorites: FavoriteProduct[] = [
                {
                    id: '1',
                    name: 'Daikin FTXF35C Split 3500W',
                    slug: 'daikin-ftxf35c',
                    description: 'Split de pared con tecnología inverter y eficiencia A++',
                    price: 849,
                    originalPrice: 999,
                    image: '/images/products/placeholder-1.jpg',
                    rating: 4.5,
                    reviewCount: 127,
                    inStock: true,
                    addedAt: '2024-01-10T10:30:00Z',
                },
                {
                    id: '2',
                    name: 'Mitsubishi MSZ-HR35VF',
                    slug: 'mitsubishi-msz-hr35vf',
                    description: 'Aire acondicionado split con wifi integrado',
                    price: 749,
                    image: '/images/products/placeholder-2.jpg',
                    rating: 4.3,
                    reviewCount: 89,
                    inStock: true,
                    addedAt: '2024-01-08T14:22:00Z',
                },
                {
                    id: '3',
                    name: 'Bomba de calor Vaillant',
                    slug: 'bomba-calor-vaillant',
                    description: 'Bomba de calor aerotérmica para ACS y calefacción',
                    price: 2350,
                    image: '/images/products/placeholder-3.jpg',
                    rating: 4.8,
                    reviewCount: 45,
                    inStock: false,
                    addedAt: '2023-12-20T09:15:00Z',
                },
            ];

            setFavorites(mockFavorites);
            setLoading(false);
        };

        fetchFavorites();
    }, []);

    // Eliminar de favoritos
    const handleRemove = async (productId: string) => {
        // TODO: Llamar a Vendure mutation
        setFavorites(prev => prev.filter(p => p.id !== productId));
        setSuccessMessage('Producto eliminado de favoritos');
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    // Añadir al carrito
    const handleAddToCart = async (productId: string) => {
        // TODO: Llamar a mutation de carrito
        console.log('Añadir al carrito:', productId);
        setSuccessMessage('Producto añadido al carrito');
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    // Breadcrumbs
    const breadcrumbItems = [
        { label: 'Inicio', href: '/' },
        { label: 'Mi cuenta', href: '/cuenta' },
        { label: 'Lista de deseos' },
    ];

    return (
        <div className={styles.container}>
            <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />

            <div className={styles.layout}>
                <AccountSidebar className={styles.sidebar} />

                <main className={styles.main}>
                    <header className={styles.header}>
                        <div>
                            <h1 className={styles.title}>Lista de deseos</h1>
                            <p className={styles.subtitle}>
                                {favorites.length} {favorites.length === 1 ? 'producto guardado' : 'productos guardados'}
                            </p>
                        </div>
                    </header>

                    {successMessage && (
                        <Alert type="success">
                            {successMessage}
                        </Alert>
                    )}

                    {loading ? (
                        <div className={styles.loading}>Cargando favoritos...</div>
                    ) : favorites.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>❤️</div>
                            <h2>Tu lista de deseos está vacía</h2>
                            <p>Guarda productos para encontrarlos fácilmente más tarde</p>
                            <Link href="/productos">
                                <Button variant="primary">
                                    Explorar productos
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.productGrid}>
                            {favorites.map((product) => (
                                <div key={product.id} className={styles.productWrapper}>
                                    <ProductCard
                                        product={product}
                                        showQuickAdd
                                    />
                                    <div className={styles.productActions}>
                                        {product.inStock && (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                fullWidth
                                                onClick={() => handleAddToCart(product.id)}
                                            >
                                                Añadir al carrito
                                            </Button>
                                        )}
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => handleRemove(product.id)}
                                        >
                                            Eliminar de favoritos
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}