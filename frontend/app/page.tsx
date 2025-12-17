/**
 * Home Page - Uniclima Solutions
 * 
 * Página principal profesional inspirada en uniclimasolutions.com con:
 * - Hero banner con gradiente rojo corporativo
 * - Sección de características (asesoramiento, garantía, soporte)
 * - Categorías destacadas desde Vendure
 * - Productos destacados
 * - Sección de servicios
 * - Marcas asociadas
 * - CTA final
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

/** Icono de asesoramiento personalizado */
const UserCheckIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.featureIcon}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="16 11 18 13 22 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/** Icono de garantía / trofeo */
const TrophyIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.featureIcon}>
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 22h16" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 22V8a2 2 0 0 1 4 0v14" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 4h12v5a6 6 0 0 1-12 0V4z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/** Icono de soporte telefónico */
const PhoneCallIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.featureIcon}>
        <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/** Icono de instalación */
const ToolIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.serviceIcon}>
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/** Icono de mantenimiento */
const SettingsIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.serviceIcon}>
        <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/** Icono de reparación */
const WrenchIcon = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.serviceIcon}>
        <path d="M21.64 3.64a1.17 1.17 0 0 0-1.65 0l-2.83 2.83a1.17 1.17 0 0 0 0 1.65l.71.71a1.17 1.17 0 0 0 1.65 0l2.83-2.83a1.17 1.17 0 0 0 0-1.65l-.71-.71z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.29 20.71a1.17 1.17 0 0 0 1.65 0l9.9-9.9a5 5 0 1 0-1.65-1.65l-9.9 9.9a1.17 1.17 0 0 0 0 1.65z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/** Icono de flecha */
const ArrowRightIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

/** Icono de teléfono */
const PhoneIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default function Home() {
    // Query para categorías
    const { data: collectionsData, loading: loadingCollections } = useQuery(GET_COLLECTIONS, {
        variables: { options: { take: 4 } },
    });

    // Query para productos destacados
    const { data: productsData, loading: loadingProducts } = useQuery(GET_PRODUCTS, {
        variables: { options: { take: 8, sort: { createdAt: 'DESC' } } },
    });

    const collections: Collection[] = collectionsData?.collections?.items || [];
    const products: HomeProduct[] = productsData?.products?.items || [];

    return (
        <div className={styles.home}>
            {/* ========================================
                HERO SECTION
               ======================================== */}
            <section className={styles.hero}>
                <div className={styles.heroPattern} />
                <div className={styles.container}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>
                            CALDERAS EN MADRID
                        </h1>
                        <div className={styles.heroBanner}>
                            TU CONFORT Y BIENESTAR ES NUESTRA PRIORIDAD.
                        </div>
                        <p className={styles.heroSubtitle}>
                            En Uniclima Solutions convertimos la climatización de tu hogar en una
                            experiencia de máximo confort y ahorro energético. Instalamos, reparamos y
                            mantenemos calderas y sistemas de aire acondicionado en toda Madrid, con
                            soluciones rápidas, eficientes y duraderas.
                        </p>
                        <div className={styles.heroButtons}>
                            <Link href="/contacto" className={styles.heroBtnPrimary}>
                                CONTÁCTANOS
                            </Link>
                            <a href="tel:+34911177777" className={styles.heroBtnSecondary}>
                                <PhoneIcon />
                                LLÁMANOS
                            </a>
                            <Link href="/productos" className={styles.heroBtnTertiary}>
                                🛒 TIENDA
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================
                ABOUT SECTION - Características principales
               ======================================== */}
            <section className={styles.aboutSection}>
                <div className={styles.container}>
                    <span className={styles.aboutTitle}>UNICLIMA SOLUTIONS</span>
                    <h2 className={styles.aboutHeading}>
                        Innovación y Confort en Climatización
                    </h2>
                    <p className={styles.aboutText}>
                        En Uniclima Solutions, no solo instalamos sistemas de calefacción o Aire Acondicionado;
                        creamos ambientes perfectos para tu bienestar y el de tu familia, con soluciones eficientes
                        y respetuosas con el medio ambiente. Nuestro equipo de expertos en calefacción lleva el
                        confort de tu hogar a un nuevo nivel, ofreciendo asesoramiento, instalación y mantenimiento
                        que establecen el estándar de excelencia en Madrid.
                    </p>

                    {/* Features Grid */}
                    <div className={styles.featuresGrid}>
                        <div className={styles.featureCard}>
                            <div className={styles.featureIconWrapper}>
                                <UserCheckIcon />
                            </div>
                            <h3 className={styles.featureTitle}>Asesoría Personalizada</h3>
                            <p className={styles.featureText}>
                                Analizamos tus necesidades específicas para ofrecerte la solución
                                de climatización más adecuada para tu hogar o negocio.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIconWrapper}>
                                <TrophyIcon />
                            </div>
                            <h3 className={styles.featureTitle}>Garantía de Satisfacción</h3>
                            <p className={styles.featureText}>
                                Trabajamos con las mejores marcas del mercado y ofrecemos
                                garantía oficial en todas nuestras instalaciones y reparaciones.
                            </p>
                        </div>

                        <div className={styles.featureCard}>
                            <div className={styles.featureIconWrapper}>
                                <PhoneCallIcon />
                            </div>
                            <h3 className={styles.featureTitle}>Respuesta Inmediata</h3>
                            <p className={styles.featureText}>
                                Servicio técnico disponible para atender tus urgencias.
                                Respuesta rápida y profesional cuando más lo necesitas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================
                TESTIMONIOS - Reseñas de Clientes
               ======================================== */}
            <section className={styles.testimonialsSection}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Lo que dicen nuestros clientes</h2>
                        <p className={styles.sectionSubtitle}>
                            La satisfacción de nuestros clientes es nuestra mejor carta de presentación
                        </p>
                    </div>

                    <div className={styles.testimonialsGrid}>
                        <div className={styles.testimonialCard}>
                            <div className={styles.testimonialStars}>
                                {'★★★★★'}
                            </div>
                            <blockquote className={styles.testimonialText}>
                                "Excelente servicio. Instalaron mi caldera en tiempo récord y el equipo fue muy profesional.
                                El precio fue muy competitivo y la calidad del trabajo impecable."
                            </blockquote>
                            <div className={styles.testimonialAuthor}>
                                <div className={styles.testimonialAvatar}>MG</div>
                                <div className={styles.testimonialInfo}>
                                    <span className={styles.testimonialName}>María García</span>
                                    <span className={styles.testimonialLocation}>Madrid Centro</span>
                                </div>
                            </div>
                            <span className={styles.testimonialService}>Instalación de Caldera</span>
                        </div>

                        <div className={styles.testimonialCard}>
                            <div className={styles.testimonialStars}>
                                {'★★★★★'}
                            </div>
                            <blockquote className={styles.testimonialText}>
                                "Llevaba semanas con problemas de aire acondicionado y vinieron el mismo día.
                                Solucionaron el problema rápidamente y a un precio muy razonable. Muy recomendables."
                            </blockquote>
                            <div className={styles.testimonialAuthor}>
                                <div className={styles.testimonialAvatar}>JL</div>
                                <div className={styles.testimonialInfo}>
                                    <span className={styles.testimonialName}>José López</span>
                                    <span className={styles.testimonialLocation}>Alcobendas</span>
                                </div>
                            </div>
                            <span className={styles.testimonialService}>Reparación de Aire Acondicionado</span>
                        </div>

                        <div className={styles.testimonialCard}>
                            <div className={styles.testimonialStars}>
                                {'★★★★★'}
                            </div>
                            <blockquote className={styles.testimonialText}>
                                "Contraté el mantenimiento anual y estoy encantada. Son puntuales, profesionales
                                y siempre dejan todo limpio. El mejor servicio de climatización de Madrid."
                            </blockquote>
                            <div className={styles.testimonialAuthor}>
                                <div className={styles.testimonialAvatar}>AR</div>
                                <div className={styles.testimonialInfo}>
                                    <span className={styles.testimonialName}>Ana Rodríguez</span>
                                    <span className={styles.testimonialLocation}>Las Rozas</span>
                                </div>
                            </div>
                            <span className={styles.testimonialService}>Mantenimiento Preventivo</span>
                        </div>

                        <div className={styles.testimonialCard}>
                            <div className={styles.testimonialStars}>
                                {'★★★★☆'}
                            </div>
                            <blockquote className={styles.testimonialText}>
                                "Instalaron aerotermia en mi chalet y el ahorro en la factura es increíble.
                                El equipo explicó todo el proceso y resolvió todas mis dudas. Gran inversión."
                            </blockquote>
                            <div className={styles.testimonialAuthor}>
                                <div className={styles.testimonialAvatar}>CP</div>
                                <div className={styles.testimonialInfo}>
                                    <span className={styles.testimonialName}>Carlos Pérez</span>
                                    <span className={styles.testimonialLocation}>Pozuelo de Alarcón</span>
                                </div>
                            </div>
                            <span className={styles.testimonialService}>Instalación de Aerotermia</span>
                        </div>
                    </div>

                    <div className={styles.testimonialsSummary}>
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryNumber}>4.9</span>
                            <span className={styles.summaryLabel}>Valoración media</span>
                            <div className={styles.summaryStars}>★★★★★</div>
                        </div>
                        <div className={styles.summaryDivider} />
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryNumber}>+500</span>
                            <span className={styles.summaryLabel}>Clientes satisfechos</span>
                        </div>
                        <div className={styles.summaryDivider} />
                        <div className={styles.summaryItem}>
                            <span className={styles.summaryNumber}>15+</span>
                            <span className={styles.summaryLabel}>Años de experiencia</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================
                CATEGORÍAS
               ======================================== */}
            <section className={styles.categoriesSection}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Nuestras Categorías</h2>
                        <p className={styles.sectionSubtitle}>
                            Encuentra el equipo perfecto para tu hogar o negocio
                        </p>
                    </div>

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
                                    <div className={styles.categoryImage}>
                                        {collection.featuredAsset ? (
                                            <img
                                                src={collection.featuredAsset.preview}
                                                alt={collection.name}
                                            />
                                        ) : (
                                            <div className={styles.categoryPlaceholder}>
                                                🌡️
                                            </div>
                                        )}
                                    </div>
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
                                            {cat.icon}
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

                    <div className={styles.sectionFooter}>
                        <Link href="/productos" className={styles.viewAllLink}>
                            Ver todas las categorías
                            <ArrowRightIcon />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ========================================
                PRODUCTOS DESTACADOS
               ======================================== */}
            <section className={styles.productsSection}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Productos Destacados</h2>
                        <p className={styles.sectionSubtitle}>
                            Los equipos más vendidos y mejor valorados
                        </p>
                    </div>

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
                            <Link href="/productos" className={styles.viewAllBtn}>
                                Ir al catálogo
                            </Link>
                        </div>
                    )}

                    <div className={styles.sectionFooter}>
                        <Link href="/productos" className={styles.viewAllBtn}>
                            Ver todos los productos
                            <ArrowRightIcon />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ========================================
                SERVICIOS
               ======================================== */}
            <section className={styles.servicesSection}>
                <div className={styles.container}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Nuestros Servicios</h2>
                        <p className={styles.sectionSubtitle}>
                            Soluciones profesionales de climatización para tu hogar y negocio
                        </p>
                    </div>

                    <div className={styles.servicesGrid}>
                        <div className={styles.serviceCard}>
                            <div className={styles.serviceIconWrapper}>
                                <ToolIcon />
                            </div>
                            <h3 className={styles.serviceTitle}>Instalación</h3>
                            <p className={styles.serviceText}>
                                Instalación profesional de equipos de aire acondicionado,
                                calderas y sistemas de aerotermia con garantía oficial.
                            </p>
                            <Link href="/servicios#instalacion" className={styles.serviceLink}>
                                Más información →
                            </Link>
                        </div>

                        <div className={styles.serviceCard}>
                            <div className={styles.serviceIconWrapper}>
                                <SettingsIcon />
                            </div>
                            <h3 className={styles.serviceTitle}>Mantenimiento</h3>
                            <p className={styles.serviceText}>
                                Planes de mantenimiento preventivo para mantener tus equipos
                                en óptimas condiciones y prolongar su vida útil.
                            </p>
                            <Link href="/servicios#mantenimiento" className={styles.serviceLink}>
                                Más información →
                            </Link>
                        </div>

                        <div className={styles.serviceCard}>
                            <div className={styles.serviceIconWrapper}>
                                <WrenchIcon />
                            </div>
                            <h3 className={styles.serviceTitle}>Reparación</h3>
                            <p className={styles.serviceText}>
                                Servicio técnico especializado para la reparación de cualquier
                                avería en tus sistemas de climatización.
                            </p>
                            <Link href="/servicios#reparacion" className={styles.serviceLink}>
                                Más información →
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================
                MARCAS
               ======================================== */}
            <section className={styles.brandsSection}>
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
            <section className={styles.ctaSection}>
                <div className={styles.ctaPattern} />
                <div className={styles.container}>
                    <div className={styles.ctaContent}>
                        <h2 className={styles.ctaTitle}>¿Necesitas asesoramiento?</h2>
                        <p className={styles.ctaText}>
                            Contacta con nosotros y te ayudaremos a encontrar la solución
                            perfecta para tu hogar o negocio. Presupuesto sin compromiso.
                        </p>
                        <div className={styles.ctaButtons}>
                            <Link href="/contacto" className={styles.ctaBtnPrimary}>
                                Solicitar Presupuesto Gratis
                            </Link>
                            <a href="tel:+34911177777" className={styles.ctaBtnSecondary}>
                                <PhoneIcon />
                                91 117 77 77
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
