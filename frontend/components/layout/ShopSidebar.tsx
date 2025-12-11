/**
 * ShopSidebar Component - Sidebar estilo Uniclima para la tienda
 * 
 * Incluye:
 * - Inicio con icono de casa
 * - Categorías expandibles con subcategorías
 * - Marcas expandibles
 * - Enlaces rápidos con iconos
 * 
 * @author Frontend Team
 * @version 1.0.0
 */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@apollo/client';
import { GET_COLLECTIONS, GET_FACETS } from '@/lib/vendure/queries/products';
import styles from './ShopSidebar.module.css';

/**
 * Iconos SVG
 */
const HomeIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
    </svg>
);

const ChevronUpIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 15l-6-6-6 6" />
    </svg>
);

const CatalogIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z" />
        <path d="M8 12h8v2H8zm0 4h8v2H8z" />
    </svg>
);

const LocationIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
);

const DiscountIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 5.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S9 9.83 9 9s.67-1.5 1.5-1.5zm3 8c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm.5-4.5L8.5 17l1-1 5.5-5.5-1-1z" />
    </svg>
);

const ToolsIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z" />
    </svg>
);

/**
 * Interfaz para Collection de Vendure
 */
interface Collection {
    id: string;
    name: string;
    slug: string;
}

/**
 * Interfaz para Facet de Vendure
 */
interface Facet {
    id: string;
    code: string;
    name: string;
    values: {
        id: string;
        code: string;
        name: string;
    }[];
}

export default function ShopSidebar() {
    // Estados para secciones expandidas
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['categorias']));

    // Query para obtener categorías (collections)
    const { data: collectionsData } = useQuery(GET_COLLECTIONS);
    const collections: Collection[] = collectionsData?.collections?.items || [];

    // Query para obtener facets (marcas)
    const { data: facetsData } = useQuery(GET_FACETS);
    const facets: Facet[] = facetsData?.facets?.items || [];

    // Encontrar el facet de marcas
    const brandsFacet = facets.find(f => f.code === 'marca' || f.name.toLowerCase().includes('marca'));

    // Toggle de sección
    const toggleSection = (section: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev);
            if (next.has(section)) {
                next.delete(section);
            } else {
                next.add(section);
            }
            return next;
        });
    };

    return (
        <aside className={styles.sidebar}>
            {/* Inicio */}
            <Link href="/" className={styles.homeLink}>
                <span>Inicio</span>
                <div className={styles.homeIcon}>
                    <HomeIcon />
                </div>
            </Link>

            {/* Categorías */}
            <div className={styles.section}>
                <button 
                    className={`${styles.sectionHeader} ${expandedSections.has('categorias') ? styles.expanded : ''}`}
                    onClick={() => toggleSection('categorias')}
                >
                    <span className={styles.sectionTitle}>Categorias</span>
                    {expandedSections.has('categorias') ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
                
                {expandedSections.has('categorias') && (
                    <div className={styles.sectionContent}>
                        {collections.map((collection) => (
                            <Link
                                key={collection.id}
                                href={`/productos?collection=${collection.slug}`}
                                className={styles.subItem}
                            >
                                <span>{collection.name}</span>
                                <ChevronDownIcon />
                            </Link>
                        ))}
                        {collections.length === 0 && (
                            <>
                                <Link href="/productos?categoria=calderas" className={styles.subItem}>
                                    <span>Calderas y Calentadores</span>
                                    <ChevronDownIcon />
                                </Link>
                                <Link href="/productos?categoria=aire" className={styles.subItem}>
                                    <span>Aire Acondicionado</span>
                                    <ChevronDownIcon />
                                </Link>
                                <Link href="/productos?categoria=termos" className={styles.subItem}>
                                    <span>Termos eléctricos</span>
                                    <ChevronDownIcon />
                                </Link>
                                <Link href="/productos?categoria=condensacion" className={styles.subItem}>
                                    <span>Calderas de Condensación</span>
                                    <ChevronDownIcon />
                                </Link>
                                <Link href="/productos?categoria=repuestos" className={styles.subItem}>
                                    <span>Repuestos para instalaciones de...</span>
                                    <ChevronDownIcon />
                                </Link>
                                <Link href="/productos?categoria=acumulador" className={styles.subItem}>
                                    <span>Acumulador</span>
                                    <ChevronDownIcon />
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Marcas */}
            <div className={styles.section}>
                <button 
                    className={`${styles.sectionHeader} ${expandedSections.has('marcas') ? styles.expanded : ''}`}
                    onClick={() => toggleSection('marcas')}
                >
                    <span className={styles.sectionTitle}>Marcas</span>
                    {expandedSections.has('marcas') ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
                
                {expandedSections.has('marcas') && brandsFacet && (
                    <div className={styles.sectionContent}>
                        {brandsFacet.values.map((brand) => (
                            <Link
                                key={brand.id}
                                href={`/productos?marca=${brand.code}`}
                                className={styles.subItem}
                            >
                                <span>{brand.name}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Enlaces rápidos */}
            <div className={styles.quickLinks}>
                <Link href="/catalogo" className={styles.quickLink}>
                    <span>Catálogo</span>
                    <div className={styles.quickLinkIcon}>
                        <CatalogIcon />
                    </div>
                </Link>

                <Link href="/contacto" className={styles.quickLink}>
                    <span>¿Dónde Estamos?</span>
                    <div className={styles.quickLinkIcon}>
                        <LocationIcon />
                    </div>
                </Link>

                <Link href="/productos?ofertas=true" className={styles.quickLink}>
                    <span>Descuentos</span>
                    <div className={styles.quickLinkIcon}>
                        <DiscountIcon />
                    </div>
                </Link>

                <Link href="/instaladores" className={styles.quickLink}>
                    <span>Reparadores/Instaladores</span>
                    <div className={styles.quickLinkIcon}>
                        <ToolsIcon />
                    </div>
                </Link>
            </div>
        </aside>
    );
}