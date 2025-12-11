/**
 * Blog Page - Uniclima Solutions
 *
 * Página del blog con artículos sobre climatización
 * Diseño inspirado en uniclimasolutions.com/blog
 *
 * @author Frontend Team
 * @version 2.0.0
 */

import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import styles from './page.module.css';
import { blogPosts, blogCategories, getFeaturedPosts } from '@/lib/data/blog-posts';

// ========================================
// METADATA SEO
// ========================================

export const metadata: Metadata = {
    title: 'Blog de Climatización | Consejos y Guías HVAC - Uniclima',
    description: 'Artículos, consejos y guías sobre climatización, aire acondicionado, calderas y aerotermia. Información experta para optimizar el confort de tu hogar.',
    keywords: ['blog climatización', 'consejos HVAC', 'guías aire acondicionado', 'calderas', 'aerotermia'],
    openGraph: {
        title: 'Blog de Climatización - Uniclima Solutions',
        description: 'Artículos y consejos expertos sobre climatización HVAC',
        type: 'website',
    },
};

// ========================================
// ICONOS SVG
// ========================================

const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default function BlogPage() {
    const featuredPosts = blogPosts.filter(post => post.featured);
    const latestPosts = blogPosts.slice(0, 5);

    return (
        <div className={styles.blogPage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroPattern} />
                <div className={styles.container}>
                    <h1 className={styles.heroTitle}>Blog de Uniclima Solutions</h1>
                    <p className={styles.heroSubtitle}>
                        En nuestro blog encontrarás información actualizada sobre calderas,
                        aire acondicionado y aerotermia, con consejos expertos y novedades
                        del sector para optimizar el bienestar en tu hogar.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className={styles.mainSection}>
                <div className={styles.container}>
                    <div className={styles.blogLayout}>
                        {/* Featured Posts */}
                        <div className={styles.featuredPosts}>
                            {featuredPosts.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className={styles.featuredCard}
                                >
                                    <div className={styles.featuredImage}>
                                        {post.image ? (
                                            <Image
                                                src={post.image}
                                                alt={post.title}
                                                fill
                                                className={styles.postImage}
                                            />
                                        ) : (
                                            <div className={styles.imagePlaceholder}>
                                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                    <polyline points="21 15 16 10 5 21" />
                                                </svg>
                                            </div>
                                        )}
                                        <span className={styles.categoryBadge}>{post.category.name.toUpperCase()}</span>
                                    </div>
                                    <div className={styles.featuredContent}>
                                        <h2 className={styles.featuredTitle}>{post.title}</h2>
                                        <p className={styles.featuredExcerpt}>{post.excerpt}</p>
                                        <div className={styles.postMeta}>
                                            <CalendarIcon />
                                            <span>{new Date(post.date).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Sidebar */}
                        <aside className={styles.sidebar}>
                            <div className={styles.sidebarSection}>
                                <h3 className={styles.sidebarTitle}>ÚLTIMAS ENTRADAS</h3>
                                <ul className={styles.latestList}>
                                    {latestPosts.map((post) => (
                                        <li key={post.id}>
                                            <Link href={`/blog/${post.slug}`} className={styles.latestItem}>
                                                {post.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.sidebarSection}>
                                <h3 className={styles.sidebarTitle}>CATEGORÍAS</h3>
                                <ul className={styles.categoryList}>
                                    {blogCategories.map((cat) => (
                                        <li key={cat.slug}>
                                            <Link href={`/blog?categoria=${cat.slug}`} className={styles.categoryItem}>
                                                {cat.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.sidebarCTA}>
                                <h3 className={styles.ctaTitle}>¿Necesitas ayuda?</h3>
                                <p className={styles.ctaText}>
                                    Nuestro equipo está listo para asesorarte en tu proyecto de climatización.
                                </p>
                                <Link href="/contacto" className={styles.ctaButton}>
                                    Contactar
                                    <ArrowRightIcon />
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* All Posts Grid */}
            <section className={styles.allPostsSection}>
                <div className={styles.container}>
                    <h2 className={styles.sectionTitle}>Todos los Artículos</h2>

                    <div className={styles.postsGrid}>
                        {blogPosts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className={styles.postCard}
                            >
                                <div className={styles.postCardImage}>
                                    {post.image ? (
                                        <Image
                                            src={post.image}
                                            alt={post.title}
                                            fill
                                            className={styles.postImage}
                                        />
                                    ) : (
                                        <div className={styles.imagePlaceholder}>
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                <circle cx="8.5" cy="8.5" r="1.5" />
                                                <polyline points="21 15 16 10 5 21" />
                                            </svg>
                                        </div>
                                    )}
                                    <span className={styles.categoryBadge}>{post.category.name.toUpperCase()}</span>
                                </div>
                                <div className={styles.postCardContent}>
                                    <h3 className={styles.postCardTitle}>{post.title}</h3>
                                    <p className={styles.postCardExcerpt}>{post.excerpt}</p>
                                    <div className={styles.postMeta}>
                                        <CalendarIcon />
                                        <span>{new Date(post.date).toLocaleDateString('es-ES', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className={styles.newsletterSection}>
                <div className={styles.container}>
                    <div className={styles.newsletterContent}>
                        <h2 className={styles.newsletterTitle}>Suscríbete a nuestro newsletter</h2>
                        <p className={styles.newsletterText}>
                            Recibe las últimas noticias, consejos y ofertas exclusivas directamente en tu email.
                        </p>
                        <form className={styles.newsletterForm}>
                            <input
                                type="email"
                                placeholder="Tu correo electrónico"
                                className={styles.newsletterInput}
                            />
                            <button type="submit" className={styles.newsletterButton}>
                                Suscribirse
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}