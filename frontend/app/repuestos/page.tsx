import { Metadata } from 'next';
import { getClient } from '@/lib/vendure/client';
import { GET_PRODUCTS } from '@/lib/vendure/queries/products';
import { ProductCard } from '@/components/product/ProductCard';
import { Product } from '@/lib/types/product';
import styles from './page.module.css';

export const metadata: Metadata = {
    title: 'Repuestos - Uniclima',
    description: 'Repuestos reacondicionados de climatización y aire acondicionado',
};

interface ProductsData {
    products: {
        items: Product[];
        totalItems: number;
    };
}

async function getProducts() {
    const client = getClient();

    try {
        const { data } = await client.query<ProductsData>({
            query: GET_PRODUCTS,
            variables: {
                options: {
                    take: 12,
                    skip: 0,
                    sort: {
                        name: 'ASC',
                    },
                },
            },
        });

        return data.products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return { items: [], totalItems: 0 };
    }
}

export default async function RepuestosPage() {
    const products = await getProducts();

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>Repuestos Reacondicionados</h1>
                <p className={styles.subtitle}>
                    Repuestos de climatización de alta calidad a precios competitivos
                </p>
            </div>

            {/* Stats */}
            <div className={styles.stats}>
                <span className={styles.count}>
                    {products.totalItems} {products.totalItems === 1 ? 'producto' : 'productos'}
                </span>
            </div>

            {/* Products Grid */}
            {products.items.length > 0 ? (
                <div className={styles.grid}>
                    {products.items.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className={styles.empty}>
                    <svg
                        width="64"
                        height="64"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className={styles.emptyIcon}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                    </svg>
                    <h2 className={styles.emptyTitle}>No hay productos disponibles</h2>
                    <p className={styles.emptyText}>
                        Estamos trabajando en añadir más productos. Vuelve pronto.
                    </p>
                </div>
            )}
        </div>
    );
}
