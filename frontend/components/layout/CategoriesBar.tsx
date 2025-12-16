/**
 * CategoriesBar Component - Barra de categorías estilo Uniclima
 * 
 * Incluye:
 * - Botón "≡ Todas las categorías" con dropdown
 * - Campo de búsqueda
 * - Botón "Buscar"
 * 
 * @author Frontend Team
 * @version 1.0.0
 */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_COLLECTIONS, GET_FACETS } from '@/lib/vendure/queries/products';
import styles from './CategoriesBar.module.css';

/**
 * Iconos SVG
 */
const MenuIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
);

const SearchIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

/**
 * Interfaz para Collection de Vendure
 */
interface Collection {
    id: string;
    name: string;
    slug: string;
    children?: Collection[];
}

interface CategoriesBarProps {
    onSearch?: (query: string) => void;
    initialSearchQuery?: string;
}

export default function CategoriesBar({ onSearch, initialSearchQuery = '' }: CategoriesBarProps) {
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Query para obtener categorías (collections)
    const { data: collectionsData } = useQuery(GET_COLLECTIONS);
    const collections: Collection[] = collectionsData?.collections?.items || [];

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Manejar búsqueda
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(searchQuery);
        } else {
            router.push(`/productos?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    // Toggle para subcategorías
    const toggleCategory = (e: React.MouseEvent, categoryId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setExpandedCategories(prev => ({
            ...prev,
            [categoryId]: !prev[categoryId]
        }));
    };

    // Categorías por defecto si no hay collections
    const defaultCategories = [
        { id: '1', name: 'Calderas y Calentadores', slug: 'calderas' },
        { id: '2', name: 'Aire Acondicionado', slug: 'aire-acondicionado' },
        { id: '3', name: 'Termos eléctricos', slug: 'termos' },
        { id: '4', name: 'Calderas de Condensación', slug: 'calderas-condensacion' },
        {
            id: '5', name: 'Repuestos', slug: 'repuestos', children: [
                { id: '5-1', name: 'Bombas', slug: 'bombas' },
                { id: '5-2', name: 'Válvulas', slug: 'valvulas' },
                { id: '5-3', name: 'Placas PCB', slug: 'placas-pcb' },
                { id: '5-4', name: 'Sensores', slug: 'sensores' },
                { id: '5-5', name: 'Ventiladores', slug: 'ventiladores' },
                { id: '5-6', name: 'Compresores', slug: 'compresores' },
            ]
        },
        { id: '6', name: 'Acumuladores', slug: 'acumuladores' },
    ];

    const categoriesToShow = collections.length > 0 ? collections : defaultCategories;

    return (
        <div className={styles.categoriesBar}>
            <div className={styles.container}>
                {/* Botón de categorías */}
                <div className={styles.categoriesDropdown} ref={dropdownRef}>
                    <button
                        className={styles.categoriesButton}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="true"
                    >
                        <MenuIcon />
                        <span>Todas las categorías</span>
                        <ChevronDownIcon />
                    </button>

                    {/* Dropdown de categorías */}
                    {isDropdownOpen && (
                        <div className={styles.dropdown}>
                            {categoriesToShow.map((category) => (
                                <div key={category.id} className={styles.categoryWrapper}>
                                    <div className={styles.categoryHeader}>
                                        <Link
                                            href={`/productos?collection=${category.slug}`}
                                            className={styles.dropdownItem}
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            {category.name}
                                        </Link>
                                        {category.children && category.children.length > 0 && (
                                            <button
                                                className={`${styles.toggleButton} ${expandedCategories[category.id] ? styles.expanded : ''}`}
                                                onClick={(e) => toggleCategory(e, category.id)}
                                                aria-label={expandedCategories[category.id] ? "Collapsar categoría" : "Expandir categoría"}
                                            >
                                                <ChevronDownIcon />
                                            </button>
                                        )}
                                    </div>

                                    {/* Subcategorías */}
                                    {category.children && category.children.length > 0 && expandedCategories[category.id] && (
                                        <div className={styles.subCategories}>
                                            {category.children.map(child => (
                                                <Link
                                                    key={child.id}
                                                    href={`/productos?collection=${child.slug}`}
                                                    className={styles.subCategoryItem}
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    {child.name}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className={styles.dropdownDivider} />
                            <Link
                                href="/productos"
                                className={styles.dropdownItem}
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                Ver todos los productos
                            </Link>
                        </div>
                    )}
                </div>

                {/* Barra de búsqueda */}
                <form className={styles.searchForm} onSubmit={handleSearch}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="Buscar productos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        aria-label="Buscar productos"
                    />
                    <button type="submit" className={styles.searchButton}>
                        <SearchIcon />
                        <span>Buscar</span>
                    </button>
                </form>
            </div>
        </div>
    );
}