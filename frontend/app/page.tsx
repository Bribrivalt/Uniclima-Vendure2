/**
 * Home Page - Uniclima
 * 
 * Página principal con:
 * - Hero banner atractivo con CTA
 * - Categorías destacadas (desde Vendure Collections)
 * - Productos destacados (desde Vendure Products)
 * - Sección de características/beneficios
 * - CTA de contacto
 * 
 * @author Frontend Team
 * @version 2.0.0
 */
'use client';

import { useQuery } from '@apollo/client';
import Link from 'next/link';
import { GET_COLLECTIONS, GET_PRODUCTS } from '@/lib/vendure/queries/products';
import { ProductCard } from '@/components/product';
import styles from './page.module.css';

// ========================================
// INTERFACES
// ========================================

/**
 * Colección de Vendure para categorías
 */
interface Collection {
    id: string;
    name: string;
    slug: string;
    description?: string;
    featuredAsset?: {
        id: string;
        preview: string;
    };
}

/**
 * Producto de Vendure para la home page
 * Interfaz compatible con lo que devuelve GET_PRODUCTS y con ProductCard
 */
interface HomeProduct {
    id: string;
    name: string;
    slug: string;
    description: string;
    featuredAsset?: {
        id: string;
        preview: string;
        source?: string;
    };
    assets?: Array<{
        id: string;
        preview: string;
        source: string;
    }>;
    variants: Array<{
        id: string;
        name?: string;
        sku?: string;
        price?: number;
        priceWithTax: number;
        currencyCode?: string;
        stockLevel?: string;
    }>;
    customFields?: {
        modoVenta?: string;
        potenciaKw?: number;
        frigorias?: number;
        claseEnergetica?: string;
        wifi?: boolean;
    };
    facetValues?: Array<{
        id: string;
        name: string;
        facet: {
            name: string;
        };
    }>;
}

// ========================================
// ICONOS SVG
// ========================================

/** Icono de experiencia */
const ExperienceIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.featureIcon}>
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/** Icono de rapidez */
const SpeedIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.featureIcon}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/** Icono de garantía */
const GuaranteeIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.featureIcon}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/** Icono de precio */
const PriceIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.featureIcon}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v12M9 9h4.5a1.5 1.5 0 010 3H9m0 0h5a1.5 1.5 0 010 3H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/** Icono de envío */
const ShippingIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.featureIcon}>
        <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/** Icono de soporte */
const SupportIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.featureIcon}>
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default function Home() {
    // Query para obtener categorías (Collections)
    const { data: collectionsData, loading: loadingCollections } = useQuery(GET_COLLECTIONS, {
        variables: { options: { take: 6 } },
    });

    // Query para obtener productos destacados
    const { data: productsData, loading: loadingProducts } = useQuery(GET_PRODUCTS, {
        variables: { options: { take: 8, sort: { createdAt: 'DESC' } } },
    });

    const collections: Collection[] = collectionsData?.collections?.items || [];
    const products: HomeProduct[] = productsData?.products?.items || [];

    return (
        <div className={styles.home}>
            {/* ========================================
                HERO SECTION - Banner principal
               ======================================== */}
            <section className={styles.hero}>
                {/* Imagen de fondo con overlay */}
                <div className={styles.heroBackground}>
                    <div className={styles.heroOverlay} />
                </div>

                {/* Contenido del hero */}
                <div className={styles.heroContent}>
                    {/* Badge de destacado */}
                    <span className={styles.heroBadge}>
                        🏆 Líderes en climatización desde 2014
                    </span>

                    {/* Título principal */}
                    <h1 className={styles.heroTitle}>
                        Expertos en <span className={styles.heroHighlight}>Climatización</span>
                    </h1>

                    {/* Subtítulo */}
                    <p className={styles.heroSubtitle}>
                        Instalación, mantenimiento y reparación de sistemas HVAC.
                        <br />
                        Aires acondicionados, aerotermia y más con las mejores marcas.
                    </p>

                    {/* Botones de acción */}
                    <div className={styles.heroButtons}>
                        <Link href="/productos" className={styles.heroBtnPrimary}>
                            Ver Catálogo
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                        <Link href="/contacto" className={styles.heroBtnSecondary}>
                            Pedir Presupuesto
                        </Link>
                    </div>

                    {/* Stats rápidos */}
                    <div className={styles.heroStats}>
                        <div className={styles.heroStat}>
                            <span className={styles.heroStatNumber}>10+</span>
                            <span className={styles.heroStatLabel}>Años experiencia</span>
                        </div>
                        <div className={styles.heroStatDivider} />
                        <div className={styles.heroStat}>
                            <span className={styles.heroStatNumber}>5.000+</span>
                            <span className={styles.heroStatLabel}>Instalaciones</span>
                        </div>
                        <div className={styles.heroStatDivider} />
                        <div className={styles.heroStat}>
                            <span className={styles.heroStatNumber}>4.9★</span>
                            <span className={styles.heroStatLabel}>Valoración</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================
                CATEGORÍAS DESTACADAS
               ======================================== */}
            <section className={styles.categories}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Nuestras Categorías</h2>
                        <p className={styles.sectionSubtitle}>
                            Encuentra el equipo perfecto para tu hogar o negocio
                        </p>
                    </div>

                    {/* Loading state */}
                    {loadingCollections ? (
                        <div className={styles.loadingGrid}>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={styles.categorySkeleton} />
                            ))}
                        </div>
                    ) : collections.length > 0 ? (
                        <div className={styles.categoriesGrid}>
                            {collections.map((collection) => (
                                <Link
                                    key={collection.id}
                                    href={`/productos?collection=${collection.slug}`}
                                    className={styles.categoryCard}
                                >
                                    {/* Imagen de la categoría */}
                                    <div className={styles.categoryImage}>
                                        {collection.featuredAsset ? (
                                            <img
                                                src={collection.featuredAsset.preview}
                                                alt={collection.name}
                                            />
                                        ) : (
                                            <div className={styles.categoryPlaceholder}>
                                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    {/* Nombre de la categoría */}
                                    <div className={styles.categoryInfo}>
                                        <h3 className={styles.categoryName}>{collection.name}</h3>
                                        <span className={styles.categoryLink}>
                                            Ver productos →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        // Fallback con categorías estáticas si no hay datos de Vendure
                        <div className={styles.categoriesGrid}>
                            {[
                                { name: 'Aires Acondicionados', slug: 'aires-acondicionados', icon: '❄️' },
                                { name: 'Aerotermia', slug: 'aerotermia', icon: '🌡️' },
                                { name: 'Calderas', slug: 'calderas', icon: '🔥' },
                                { name: 'Repuestos', slug: 'repuestos', icon: '🔧' },
                            ].map((cat) => (
                                <Link
                                    key={cat.slug}
                                    href={`/productos?collection=${cat.slug}`}
                                    className={styles.categoryCard}
                                >
                                    <div className={styles.categoryImage}>
                                        <div className={styles.categoryPlaceholder}>
                                            <span style={{ fontSize: '48px' }}>{cat.icon}</span>
                                        </div>
                                    </div>
                                    <div className={styles.categoryInfo}>
                                        <h3 className={styles.categoryName}>{cat.name}</h3>
                                        <span className={styles.categoryLink}>Ver productos →</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Link a ver todas */}
                    <div className={styles.sectionFooter}>
                        <Link href="/productos" className={styles.viewAllLink}>
                            Ver todas las categorías
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ========================================
                PRODUCTOS DESTACADOS
               ======================================== */}
            <section className={styles.featuredProducts}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Productos Destacados</h2>
                        <p className={styles.sectionSubtitle}>
                            Los equipos más vendidos y mejor valorados
                        </p>
                    </div>

                    {/* Loading state */}
                    {loadingProducts ? (
                        <div className={styles.productsGrid}>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={styles.productSkeleton} />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <div className={styles.productsGrid}>
                            {products.slice(0, 4).map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product as any}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.emptyProducts}>
                            <p>No hay productos disponibles en este momento.</p>
                            <Link href="/productos" className={styles.heroBtnPrimary}>
                                Ir al catálogo
                            </Link>
                        </div>
                    )}

                    {/* Link a ver todos */}
                    <div className={styles.sectionFooter}>
                        <Link href="/productos" className={styles.viewAllBtn}>
                            Ver todos los productos
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ========================================
                CARACTERÍSTICAS / BENEFICIOS
               ======================================== */}
            <section className={styles.features}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>¿Por qué elegirnos?</h2>
                        <p className={styles.sectionSubtitle}>
                            Confía en profesionales con experiencia
                        </p>
                    </div>

                    <div className={styles.featuresGrid}>
                        {/* Feature 1: Experiencia */}
                        <div className={styles.featureCard}>
                            <div className={styles.featureIconWrapper}>
                                <ExperienceIcon />
                            </div>
                            <h3 className={styles.featureTitle}>Experiencia</h3>
                            <p className={styles.featureText}>
                                Más de 10 años especializados en climatización y HVAC
                            </p>
                        </div>

                        {/* Feature 2: Rapidez */}
                        <div className={styles.featureCard}>
                            <div className={styles.featureIconWrapper}>
                                <SpeedIcon />
                            </div>
                            <h3 className={styles.featureTitle}>Rapidez</h3>
                            <p className={styles.featureText}>
                                Instalación y reparación en 24-48h en toda España
                            </p>
                        </div>

                        {/* Feature 3: Garantía */}
                        <div className={styles.featureCard}>
                            <div className={styles.featureIconWrapper}>
                                <GuaranteeIcon />
                            </div>
                            <h3 className={styles.featureTitle}>Garantía Oficial</h3>
                            <p className={styles.featureText}>
                                Todos nuestros productos con garantía del fabricante
                            </p>
                        </div>

                        {/* Feature 4: Mejor Precio */}
                        <div className={styles.featureCard}>
                            <div className={styles.featureIconWrapper}>
                                <PriceIcon />
                            </div>
                            <h3 className={styles.featureTitle}>Mejor Precio</h3>
                            <p className={styles.featureText}>
                                Presupuestos sin compromiso y financiación disponible
                            </p>
                        </div>

                        {/* Feature 5: Envío Gratis */}
                        <div className={styles.featureCard}>
                            <div className={styles.featureIconWrapper}>
                                <ShippingIcon />
                            </div>
                            <h3 className={styles.featureTitle}>Envío Gratis</h3>
                            <p className={styles.featureText}>
                                Envío gratuito en pedidos superiores a 100€
                            </p>
                        </div>

                        {/* Feature 6: Soporte */}
                        <div className={styles.featureCard}>
                            <div className={styles.featureIconWrapper}>
                                <SupportIcon />
                            </div>
                            <h3 className={styles.featureTitle}>Atención Personalizada</h3>
                            <p className={styles.featureText}>
                                Asesoramiento técnico y soporte postventa
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================
                BANNER MARCAS
               ======================================== */}
            <section className={styles.brands}>
                <div className={styles.container}>
                    <p className={styles.brandsTitle}>Trabajamos con las mejores marcas</p>
                    <div className={styles.brandsLogos}>
                        {['Daikin', 'Mitsubishi', 'Fujitsu', 'LG', 'Samsung', 'Panasonic'].map((brand) => (
                            <span key={brand} className={styles.brandLogo}>
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ========================================
                CTA FINAL
               ======================================== */}
            <section className={styles.cta}>
                <div className={styles.container}>
                    <div className={styles.ctaContent}>
                        <h2 className={styles.ctaTitle}>¿Necesitas asesoramiento?</h2>
                        <p className={styles.ctaText}>
                            Contacta con nosotros y te ayudaremos a encontrar la solución perfecta para tu hogar o negocio
                        </p>
                        <div className={styles.ctaButtons}>
                            <Link href="/contacto" className={styles.ctaBtnPrimary}>
                                Solicitar Presupuesto Gratis
                            </Link>
                            <a href="tel:+34900000000" className={styles.ctaBtnSecondary}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                </svg>
                                Llamar ahora
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
