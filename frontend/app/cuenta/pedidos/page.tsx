'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AccountSidebar } from '@/components/auth';
import { Breadcrumb, Badge, Skeleton } from '@/components/core';
import styles from './page.module.css';

/**
 * Interfaz para pedido
 */
interface Order {
    id: string;
    code: string;
    date: string;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    itemCount: number;
    items: OrderItem[];
}

/**
 * Interfaz para item del pedido
 */
interface OrderItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
}

/**
 * Mapeo de estados a etiquetas y colores
 */
const statusConfig: Record<Order['status'], { label: string; variant: 'info' | 'warning' | 'success' | 'error' }> = {
    pending: { label: 'Pendiente', variant: 'warning' },
    processing: { label: 'En proceso', variant: 'info' },
    shipped: { label: 'Enviado', variant: 'info' },
    delivered: { label: 'Entregado', variant: 'success' },
    cancelled: { label: 'Cancelado', variant: 'error' },
};

/**
 * PedidosPage - Página de historial de pedidos
 * 
 * Muestra el listado de pedidos del usuario con estado
 * y acceso a los detalles de cada uno.
 */
export default function PedidosPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // Cargar pedidos
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);

            // TODO: Reemplazar con llamada a Vendure GraphQL
            await new Promise(resolve => setTimeout(resolve, 800));

            // Pedidos simulados
            const mockOrders: Order[] = [
                {
                    id: '1',
                    code: 'UC-2024-001234',
                    date: '2024-01-15T10:30:00Z',
                    status: 'delivered',
                    total: 1249.99,
                    itemCount: 2,
                    items: [
                        { id: 'i1', name: 'Daikin FTXF35C Split', quantity: 1, price: 849.99, image: '/images/products/placeholder-1.jpg' },
                        { id: 'i2', name: 'Kit instalación profesional', quantity: 1, price: 400, image: '/images/products/placeholder-2.jpg' },
                    ],
                },
                {
                    id: '2',
                    code: 'UC-2024-001156',
                    date: '2024-01-10T14:22:00Z',
                    status: 'shipped',
                    total: 156.50,
                    itemCount: 3,
                    items: [
                        { id: 'i3', name: 'Filtro aire HEPA', quantity: 2, price: 45.50, image: '/images/products/placeholder-3.jpg' },
                        { id: 'i4', name: 'Termostato digital', quantity: 1, price: 65.50, image: '/images/products/placeholder-4.jpg' },
                    ],
                },
                {
                    id: '3',
                    code: 'UC-2023-009876',
                    date: '2023-12-20T09:15:00Z',
                    status: 'delivered',
                    total: 2350.00,
                    itemCount: 1,
                    items: [
                        { id: 'i5', name: 'Mitsubishi Multi-split 4x1', quantity: 1, price: 2350, image: '/images/products/placeholder-1.jpg' },
                    ],
                },
            ];

            setOrders(mockOrders);
            setLoading(false);
        };

        fetchOrders();
    }, []);

    // Formatear fecha
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    // Breadcrumbs
    const breadcrumbItems = [
        { label: 'Inicio', href: '/' },
        { label: 'Mi cuenta', href: '/cuenta' },
        { label: 'Mis pedidos' },
    ];

    return (
        <div className={styles.container}>
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />

            <div className={styles.layout}>
                {/* Sidebar */}
                <AccountSidebar className={styles.sidebar} />

                {/* Contenido principal */}
                <main className={styles.main}>
                    <header className={styles.header}>
                        <h1 className={styles.title}>Mis pedidos</h1>
                        <p className={styles.subtitle}>
                            Consulta el estado y detalles de tus pedidos
                        </p>
                    </header>

                    {loading ? (
                        <div className={styles.loading}>
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} height={160} />
                            ))}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📦</div>
                            <h2>No tienes pedidos</h2>
                            <p>Cuando realices tu primera compra, aparecerá aquí</p>
                            <Link href="/productos" className={styles.shopLink}>
                                Ver productos
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.orderList}>
                            {orders.map((order) => (
                                <article key={order.id} className={styles.orderCard}>
                                    {/* Header del pedido */}
                                    <div className={styles.orderHeader}>
                                        <div className={styles.orderInfo}>
                                            <span className={styles.orderCode}>{order.code}</span>
                                            <span className={styles.orderDate}>{formatDate(order.date)}</span>
                                        </div>
                                        <Badge variant={statusConfig[order.status].variant}>
                                            {statusConfig[order.status].label}
                                        </Badge>
                                    </div>

                                    {/* Items del pedido */}
                                    <div className={styles.orderItems}>
                                        {order.items.slice(0, 2).map((item) => (
                                            <div key={item.id} className={styles.orderItem}>
                                                {item.image && (
                                                    <div className={styles.itemImage}>
                                                        <img src={item.image} alt={item.name} />
                                                    </div>
                                                )}
                                                <div className={styles.itemInfo}>
                                                    <span className={styles.itemName}>{item.name}</span>
                                                    <span className={styles.itemQty}>Cantidad: {item.quantity}</span>
                                                </div>
                                                <span className={styles.itemPrice}>
                                                    {item.price.toLocaleString('es-ES')}€
                                                </span>
                                            </div>
                                        ))}
                                        {order.items.length > 2 && (
                                            <p className={styles.moreItems}>
                                                + {order.items.length - 2} producto(s) más
                                            </p>
                                        )}
                                    </div>

                                    {/* Footer del pedido */}
                                    <div className={styles.orderFooter}>
                                        <div className={styles.orderTotal}>
                                            <span>Total:</span>
                                            <strong>{order.total.toLocaleString('es-ES')}€</strong>
                                        </div>
                                        <Link
                                            href={`/pedido/${order.code}`}
                                            className={styles.viewDetails}
                                        >
                                            Ver detalles →
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}