'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ProductGrid, ProductFilters, ProductSort, ProductPagination } from '@/components/product';
import { Breadcrumb, Skeleton } from '@/components/core';
import styles from './page.module.css';

/**
 * Interfaz para categoría
 */
interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parentId?: string;
    children?: Category[];
    productCount: number;
}

/**
 * Interfaz para producto
 */
interface Product {
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
    isNew?: boolean;
    discount?: number;
}

/**
 * CategoriaPage - Página de categoría de productos
 * 
 * Muestra los productos de una categoría específica con
 * filtros, ordenación y paginación.
 */
export default function CategoriaPage() {
    const params = useParams();
    const slug = params.slug as string;

    // Estado
    const [category, setCategory] = useState<Category | null>(null);
    const [subcategories, setSubcategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('featured');

    // Opciones de ordenación
    const sortOptions = [
        { value: 'featured', label: 'Destacados' },
        { value: 'price-asc', label: 'Precio: menor a mayor' },
        { value: 'price-desc', label: 'Precio: mayor a menor' },
        { value: 'name-asc', label: 'Nombre: A-Z' },
        { value: 'newest', label: 'Más recientes' },
        { value: 'rating', label: 'Mejor valorados' },
    ];

    // Cargar datos de categoría
    useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);

            // TODO: Reemplazar con llamada real a Vendure GraphQL
            await new Promise(resolve => setTimeout(resolve, 600));

            // Datos simulados de categoría
            const mockCategory: Category = {
                id: '1',
                name: getCategoryName(slug),
                slug,
                description: `Descubre nuestra selección de productos de ${getCategoryName(slug)}. Equipos de alta calidad para profesionales y particulares.`,
                image: `/images/categories/${slug}.jpg`,
                productCount: 47,
            };

            // Subcategorías simuladas
            const mockSubcategories: Category[] = [
                { id: 'sub1', name: 'Split', slug: `${slug}/split`, productCount: 15 },
                { id: 'sub2', name: 'Multi-split', slug: `${slug}/multi-split`, productCount: 12 },
                { id: 'sub3', name: 'Conductos', slug: `${slug}/conductos`, productCount: 8 },
                { id: 'sub4', name: 'Cassette', slug: `${slug}/cassette`, productCount: 7 },
                { id: 'sub5', name: 'Suelo-techo', slug: `${slug}/suelo-techo`, productCount: 5 },
            ];

            // Productos simulados
            const mockProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
                id: `cat-${slug}-${i + 1}`,
                name: `${getCategoryName(slug)} - Modelo ${i + 1}`,
                slug: `producto-${slug}-${i + 1}`,
                description: `Producto de alta calidad de la categoría ${getCategoryName(slug)}`,
                price: Math.floor(Math.random() * 1500) + 300,
                originalPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 500) + 1800 : undefined,
                image: `/images/products/placeholder-${(i % 4) + 1}.jpg`,
                rating: 3.5 + Math.random() * 1.5,
                reviewCount: Math.floor(Math.random() * 80) + 5,
                inStock: Math.random() > 0.15,
                isNew: Math.random() > 0.85,
                discount: Math.random() > 0.7 ? Math.floor(Math.random() * 25) + 5 : undefined,
            }));

            setCategory(mockCategory);
            setSubcategories(mockSubcategories);
            setProducts(mockProducts);
            setTotalPages(4);
            setLoading(false);
        };

        fetchCategory();
    }, [slug, page, sortBy]);

    // Función para obtener nombre de categoría
    function getCategoryName(categorySlug: string): string {
        const names: Record<string, string> = {
            'climatizacion': 'Climatización',
            'calefaccion': 'Calefacción',
            'ventilacion': 'Ventilación',
            'repuestos': 'Repuestos',
            'aire-acondicionado': 'Aire Acondicionado',
            'bombas-calor': 'Bombas de Calor',
        };
        return names[categorySlug] || categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
    }

    // Handler de ordenación
    const handleSortChange = (newSort: string) => {
        setSortBy(newSort);
        setPage(1);
    };

    // Handler de paginación
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Breadcrumbs
    const breadcrumbItems = [
        { label: 'Inicio', href: '/' },
        { label: 'Categorías', href: '/productos' },
        { label: category?.name || 'Cargando...' },
    ];

    // Estado de carga
    if (loading && !category) {
        return (
            <div className={styles.container}>
                <Skeleton height={24} width={300} className={styles.breadcrumb} />
                <div className={styles.hero}>
                    <Skeleton height={200} />
                </div>
                <div className={styles.content}>
                    <div className={styles.sidebar}>
                        <Skeleton height={300} />
                    </div>
                    <div className={styles.main}>
                        <div className={styles.productGrid}>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton key={i} height={320} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />

            {/* Hero de categoría */}
            <section className={styles.hero}>
                {category?.image && (
                    <div className={styles.heroImage}>
                        <img src={category.image} alt={category.name} />
                        <div className={styles.heroOverlay} />
                    </div>
                )}
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>{category?.name}</h1>
                    {category?.description && (
                        <p className={styles.heroDescription}>{category.description}</p>
                    )}
                    <span className={styles.heroCount}>
                        {category?.productCount} productos
                    </span>
                </div>
            </section>

            {/* Subcategorías */}
            {subcategories.length > 0 && (
                <nav className={styles.subcategories} aria-label="Subcategorías">
                    <h2 className={styles.subcategoriesTitle}>Subcategorías</h2>
                    <ul className={styles.subcategoriesList}>
                        {subcategories.map((sub) => (
                            <li key={sub.id}>
                                <Link href={`/categoria/${sub.slug}`} className={styles.subcategoryLink}>
                                    {sub.name}
                                    <span className={styles.subcategoryCount}>({sub.productCount})</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            )}

            {/* Contenido principal */}
            <div className={styles.content}>
                {/* Sidebar de filtros */}
                <aside className={styles.sidebar}>
                    <ProductFilters
                        onClearAll={() => { }}
                    />
                </aside>

                {/* Productos */}
                <main className={styles.main}>
                    {/* Toolbar */}
                    <div className={styles.toolbar}>
                        <span className={styles.productCount}>
                            {category?.productCount} productos
                        </span>
                        <ProductSort
                            value={sortBy}
                            onChange={handleSortChange}
                        />
                    </div>

                    {/* Grid de productos */}
                    {loading ? (
                        <div className={styles.productGrid}>
                            {Array.from({ length: 8 }).map((_, i) => (
                                <Skeleton key={i} height={320} />
                            ))}
                        </div>
                    ) : (
                        <ProductGrid products={products} columns={3} />
                    )}

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <ProductPagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}