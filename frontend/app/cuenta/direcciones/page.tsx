'use client';

import React, { useState, useEffect } from 'react';
import { AccountSidebar } from '@/components/auth';
import { AddressForm } from '@/components/checkout';
import { Breadcrumb, Button, Modal, Alert } from '@/components/core';
import styles from './page.module.css';

/**
 * Interfaz para dirección
 */
interface Address {
    id: string;
    fullName: string;
    company?: string;
    streetLine1: string;
    streetLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    isDefault: boolean;
}

/**
 * DireccionesPage - Página de gestión de direcciones
 * 
 * Permite al usuario ver, añadir, editar y eliminar
 * sus direcciones de envío.
 */
export default function DireccionesPage() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Cargar direcciones
    useEffect(() => {
        const fetchAddresses = async () => {
            setLoading(true);

            // TODO: Reemplazar con llamada a Vendure GraphQL
            await new Promise(resolve => setTimeout(resolve, 500));

            const mockAddresses: Address[] = [
                {
                    id: '1',
                    fullName: 'Juan García',
                    company: 'Instalaciones García S.L.',
                    streetLine1: 'Calle Principal 123',
                    streetLine2: 'Bajo A',
                    city: 'Madrid',
                    province: 'Madrid',
                    postalCode: '28001',
                    country: 'España',
                    phoneNumber: '612345678',
                    isDefault: true,
                },
                {
                    id: '2',
                    fullName: 'Juan García',
                    streetLine1: 'Avenida Secundaria 456',
                    city: 'Barcelona',
                    province: 'Barcelona',
                    postalCode: '08001',
                    country: 'España',
                    phoneNumber: '687654321',
                    isDefault: false,
                },
            ];

            setAddresses(mockAddresses);
            setLoading(false);
        };

        fetchAddresses();
    }, []);

    // Abrir modal para nueva dirección
    const handleAddNew = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    // Abrir modal para editar
    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    // Guardar dirección
    const handleSave = async (data: Record<string, unknown>) => {
        // TODO: Llamar a Vendure mutation
        console.log('Guardando dirección:', data);

        if (editingAddress) {
            setAddresses(prev => prev.map(a =>
                a.id === editingAddress.id ? { ...a, ...data } as Address : a
            ));
            setSuccessMessage('Dirección actualizada correctamente');
        } else {
            const newAddress: Address = {
                id: Date.now().toString(),
                ...data,
                isDefault: addresses.length === 0,
            } as Address;
            setAddresses(prev => [...prev, newAddress]);
            setSuccessMessage('Dirección añadida correctamente');
        }

        setIsModalOpen(false);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    // Eliminar dirección
    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta dirección?')) return;

        // TODO: Llamar a Vendure mutation
        setAddresses(prev => prev.filter(a => a.id !== id));
        setSuccessMessage('Dirección eliminada correctamente');
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    // Establecer como predeterminada
    const handleSetDefault = async (id: string) => {
        // TODO: Llamar a Vendure mutation
        setAddresses(prev => prev.map(a => ({
            ...a,
            isDefault: a.id === id,
        })));
        setSuccessMessage('Dirección predeterminada actualizada');
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    // Breadcrumbs
    const breadcrumbItems = [
        { label: 'Inicio', href: '/' },
        { label: 'Mi cuenta', href: '/cuenta' },
        { label: 'Direcciones' },
    ];

    return (
        <div className={styles.container}>
            <Breadcrumb items={breadcrumbItems} className={styles.breadcrumb} />

            <div className={styles.layout}>
                <AccountSidebar className={styles.sidebar} />

                <main className={styles.main}>
                    <header className={styles.header}>
                        <div>
                            <h1 className={styles.title}>Mis direcciones</h1>
                            <p className={styles.subtitle}>
                                Gestiona tus direcciones de envío
                            </p>
                        </div>
                        <Button variant="primary" onClick={handleAddNew}>
                            + Añadir dirección
                        </Button>
                    </header>

                    {successMessage && (
                        <Alert variant="success" className={styles.alert}>
                            {successMessage}
                        </Alert>
                    )}

                    {loading ? (
                        <div className={styles.loading}>Cargando direcciones...</div>
                    ) : addresses.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📍</div>
                            <h2>No tienes direcciones guardadas</h2>
                            <p>Añade una dirección para facilitar tus compras</p>
                            <Button variant="primary" onClick={handleAddNew}>
                                Añadir primera dirección
                            </Button>
                        </div>
                    ) : (
                        <div className={styles.addressGrid}>
                            {addresses.map((address) => (
                                <article
                                    key={address.id}
                                    className={`${styles.addressCard} ${address.isDefault ? styles.defaultCard : ''}`}
                                >
                                    {address.isDefault && (
                                        <span className={styles.defaultBadge}>Predeterminada</span>
                                    )}
                                    <div className={styles.addressContent}>
                                        <p className={styles.name}>{address.fullName}</p>
                                        {address.company && (
                                            <p className={styles.company}>{address.company}</p>
                                        )}
                                        <p className={styles.street}>
                                            {address.streetLine1}
                                            {address.streetLine2 && <><br />{address.streetLine2}</>}
                                        </p>
                                        <p className={styles.location}>
                                            {address.postalCode} {address.city}, {address.province}
                                        </p>
                                        <p className={styles.country}>{address.country}</p>
                                        <p className={styles.phone}>Tel: {address.phoneNumber}</p>
                                    </div>
                                    <div className={styles.addressActions}>
                                        <button
                                            className={styles.actionBtn}
                                            onClick={() => handleEdit(address)}
                                        >
                                            Editar
                                        </button>
                                        {!address.isDefault && (
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => handleSetDefault(address.id)}
                                            >
                                                Predeterminada
                                            </button>
                                        )}
                                        <button
                                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                            onClick={() => handleDelete(address.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Modal de edición */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingAddress ? 'Editar dirección' : 'Nueva dirección'}
            >
                <AddressForm
                    initialData={editingAddress || undefined}
                    onSubmit={handleSave}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
}