/**
 * Blog Article Page - Uniclima Solutions
 * 
 * Página individual de artículo del blog
 * Con SEO dinámico, contenido Markdown, y artículos relacionados
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    blogPosts,
    getPostBySlug,
    getRelatedPosts,
    getAllPostSlugs
} from '@/lib/data/blog-posts';
import styles from './page.module.css';

// ========================================
// TIPOS
// ========================================

interface BlogArticlePageProps {
    params: Promise<{ slug: string }>;
}

// ========================================
// STATIC GENERATION
// ========================================

export async function generateStaticParams() {
    return getAllPostSlugs().map(slug => ({ slug }));
}

// ========================================
// METADATA SEO DINÁMICA
// ========================================

export async function generateMetadata({ params }: BlogArticlePageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Artículo no encontrado - Uniclima',
        };
    }

    return {
        title: `${post.title} | Blog Uniclima`,
        description: post.excerpt,
        keywords: post.tags,
        authors: [{ name: post.author.name }],
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author.name],
            tags: post.tags,
            images: post.image ? [{ url: post.image }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
        },
    };
}

// ========================================
// COMPONENTES AUXILIARES
// ========================================

const CalendarIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const ClockIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
    </svg>
);

const UserIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
);

const ShareIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = getRelatedPosts(slug, 3);

    // Convertir Markdown simple a HTML (básico)
    const contentHtml = post.content
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/^\- (.*$)/gim, '<li>$1</li>')
        .replace(/(<li>[\s\S]*<\/li>)/, '<ul>$1</ul>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[hulo])/gim, '<p>')
        .replace(/\| (.*) \| (.*) \|/g, '<tr><td>$1</td><td>$2</td></tr>')
        .replace(/---/g, '<hr />');

    return (
        <div className={styles.articlePage}>
            {/* Hero */}
            <header className={styles.hero}>
                <div className={styles.heroPattern} />
                <div className={styles.container}>
                    {/* Breadcrumb */}
                    <nav className={styles.breadcrumb} aria-label="Migas de pan">
                        <Link href="/blog" className={styles.backLink}>
                            <ArrowLeftIcon />
                            Volver al blog
                        </Link>
                    </nav>

                    {/* Category Badge */}
                    <span className={styles.categoryBadge}>
                        {post.category.name}
                    </span>

                    {/* Title */}
                    <h1 className={styles.title}>{post.title}</h1>

                    {/* Meta */}
                    <div className={styles.meta}>
                        <div className={styles.metaItem}>
                            <UserIcon />
                            <span>{post.author.name}</span>
                        </div>
                        <div className={styles.metaItem}>
                            <CalendarIcon />
                            <time dateTime={post.date}>
                                {new Date(post.date).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </time>
                        </div>
                        <div className={styles.metaItem}>
                            <ClockIcon />
                            <span>{post.readTime} min de lectura</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Content */}
            <article className={styles.article}>
                <div className={styles.container}>
                    <div className={styles.articleLayout}>
                        {/* Main Content */}
                        <div className={styles.content}>
                            {/* Featured Image */}
                            {post.image && (
                                <div className={styles.featuredImage}>
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        priority
                                        className={styles.image}
                                    />
                                </div>
                            )}

                            {/* Article Body */}
                            <div
                                className={styles.articleBody}
                                dangerouslySetInnerHTML={{ __html: contentHtml }}
                            />

                            {/* Tags */}
                            <div className={styles.tags}>
                                <span className={styles.tagsLabel}>Etiquetas:</span>
                                <div className={styles.tagsList}>
                                    {post.tags.map(tag => (
                                        <span key={tag} className={styles.tag}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Share */}
                            <div className={styles.share}>
                                <span className={styles.shareLabel}>
                                    <ShareIcon />
                                    Compartir:
                                </span>
                                <div className={styles.shareButtons}>
                                    <a
                                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://uniclima.es/blog/${post.slug}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.shareButton}
                                        aria-label="Compartir en Twitter"
                                    >
                                        Twitter
                                    </a>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://uniclima.es/blog/${post.slug}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.shareButton}
                                        aria-label="Compartir en Facebook"
                                    >
                                        Facebook
                                    </a>
                                    <a
                                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://uniclima.es/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.shareButton}
                                        aria-label="Compartir en LinkedIn"
                                    >
                                        LinkedIn
                                    </a>
                                    <a
                                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} https://uniclima.es/blog/${post.slug}`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`${styles.shareButton} ${styles.shareWhatsapp}`}
                                        aria-label="Compartir en WhatsApp"
                                    >
                                        WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className={styles.sidebar}>
                            {/* Author */}
                            <div className={styles.authorCard}>
                                <div className={styles.authorAvatar}>
                                    <UserIcon />
                                </div>
                                <div className={styles.authorInfo}>
                                    <span className={styles.authorName}>{post.author.name}</span>
                                    <span className={styles.authorRole}>{post.author.role}</span>
                                </div>
                            </div>

                            {/* CTA */}
                            <div className={styles.ctaCard}>
                                <h3 className={styles.ctaTitle}>¿Necesitas asesoramiento?</h3>
                                <p className={styles.ctaText}>
                                    Nuestro equipo de expertos está listo para ayudarte con tu proyecto de climatización.
                                </p>
                                <Link href="/contacto" className={styles.ctaButton}>
                                    Solicitar presupuesto
                                </Link>
                            </div>
                        </aside>
                    </div>
                </div>
            </article>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <section className={styles.relatedSection}>
                    <div className={styles.container}>
                        <h2 className={styles.relatedTitle}>Artículos relacionados</h2>
                        <div className={styles.relatedGrid}>
                            {relatedPosts.map(relatedPost => (
                                <Link
                                    key={relatedPost.id}
                                    href={`/blog/${relatedPost.slug}`}
                                    className={styles.relatedCard}
                                >
                                    <div className={styles.relatedImage}>
                                        {relatedPost.image ? (
                                            <Image
                                                src={relatedPost.image}
                                                alt={relatedPost.title}
                                                fill
                                                className={styles.image}
                                            />
                                        ) : (
                                            <div className={styles.imagePlaceholder}>
                                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                                    <circle cx="8.5" cy="8.5" r="1.5" />
                                                    <polyline points="21 15 16 10 5 21" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.relatedContent}>
                                        <span className={styles.relatedCategory}>
                                            {relatedPost.category.name}
                                        </span>
                                        <h3 className={styles.relatedPostTitle}>
                                            {relatedPost.title}
                                        </h3>
                                        <span className={styles.relatedDate}>
                                            {new Date(relatedPost.date).toLocaleDateString('es-ES', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}