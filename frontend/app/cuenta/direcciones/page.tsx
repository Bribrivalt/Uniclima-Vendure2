'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { AccountSidebar } from '@/components/auth';
import { AddressForm } from '@/components/checkout';
import { ProtectedRoute } from '@/components/auth';
import { Breadcrumb, Button, Modal, Alert } from '@/components/core';
import { GET_ACTIVE_CUSTOMER_WITH_ADDRESSES } from '@/lib/vendure/queries/auth';
import {
    CREATE_CUSTOMER_ADDRESS_MUTATION,
    UPDATE_CUSTOMER_ADDRESS_MUTATION,
    DELETE_CUSTOMER_ADDRESS_MUTATION,
} from '@/lib/vendure/mutations/auth';
import styles from './page.module.css';

/**
 * Interfaz para dirección desde Vendure
 */
interface VendureAddress {
    id: string;
    fullName: string;
    company?: string;
    streetLine1: string;
    streetLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    country: {
        code: string;
        name: string;
    };
    phoneNumber?: string;
    defaultShippingAddress: boolean;
    defaultBillingAddress: boolean;
}

/**
 * Interfaz para datos del cliente desde GraphQL
 */
interface CustomerData {
    activeCustomer: {
        id: string;
        addresses: VendureAddress[];
    } | null;
}

/**
 * Interfaz para el formulario de direcciones
 */
interface AddressFormData {
    fullName: string;
    company?: string;
    streetLine1: string;
    streetLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    countryCode: string;
    phoneNumber?: string;
    defaultShippingAddress?: boolean;
    defaultBillingAddress?: boolean;
}

/**
 * DireccionesPage - Página de gestión de direcciones
 *
 * Permite al usuario ver, añadir, editar y eliminar
 * sus direcciones de envío usando Vendure GraphQL.
 */
export default function DireccionesPage() {
    const [editingAddress, setEditingAddress] = useState<VendureAddress | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Query para obtener direcciones del cliente
    const { data, loading, refetch } = useQuery<CustomerData>(
        GET_ACTIVE_CUSTOMER_WITH_ADDRESSES,
        { fetchPolicy: 'network-only' }
    );

    // Mutation para crear dirección
    const [createAddress, { loading: creating }] = useMutation(CREATE_CUSTOMER_ADDRESS_MUTATION, {
        onCompleted: () => {
            setSuccessMessage('Dirección añadida correctamente');
            setIsModalOpen(false);
            refetch();
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (error) => {
            setErrorMessage(error.message || 'Error al crear la dirección');
            setTimeout(() => setErrorMessage(null), 5000);
        },
    });

    // Mutation para actualizar dirección
    const [updateAddress, { loading: updating }] = useMutation(UPDATE_CUSTOMER_ADDRESS_MUTATION, {
        onCompleted: () => {
            setSuccessMessage('Dirección actualizada correctamente');
            setIsModalOpen(false);
            refetch();
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (error) => {
            setErrorMessage(error.message || 'Error al actualizar la dirección');
            setTimeout(() => setErrorMessage(null), 5000);
        },
    });

    // Mutation para eliminar dirección
    const [deleteAddress, { loading: deleting }] = useMutation(DELETE_CUSTOMER_ADDRESS_MUTATION, {
        onCompleted: () => {
            setSuccessMessage('Dirección eliminada correctamente');
            refetch();
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (error) => {
            setErrorMessage(error.message || 'Error al eliminar la dirección');
            setTimeout(() => setErrorMessage(null), 5000);
        },
    });

    const addresses = data?.activeCustomer?.addresses || [];

    // Abrir modal para nueva dirección
    const handleAddNew = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    // Abrir modal para editar
    const handleEdit = (address: VendureAddress) => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    // Guardar dirección (crear o actualizar)
    const handleSave = async (formData: AddressFormData) => {
        if (editingAddress) {
            // Actualizar dirección existente
            await updateAddress({
                variables: {
                    input: {
                        id: editingAddress.id,
                        fullName: formData.fullName,
                        company: formData.company || '',
                        streetLine1: formData.streetLine1,
                        streetLine2: formData.streetLine2 || '',
                        city: formData.city,
                        province: formData.province,
                        postalCode: formData.postalCode,
                        countryCode: formData.countryCode || 'ES',
                        phoneNumber: formData.phoneNumber || '',
                        defaultShippingAddress: formData.defaultShippingAddress || false,
                        defaultBillingAddress: formData.defaultBillingAddress || false,
                    },
                },
            });
        } else {
            // Crear nueva dirección
            await createAddress({
                variables: {
                    input: {
                        fullName: formData.fullName,
                        company: formData.company || '',
                        streetLine1: formData.streetLine1,
                        streetLine2: formData.streetLine2 || '',
                        city: formData.city,
                        province: formData.province,
                        postalCode: formData.postalCode,
                        countryCode: formData.countryCode || 'ES',
                        phoneNumber: formData.phoneNumber || '',
                        defaultShippingAddress: addresses.length === 0, // Primera dirección es predeterminada
                        defaultBillingAddress: addresses.length === 0,
                    },
                },
            });
        }
    };

    // Eliminar dirección
    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta dirección?')) return;
        
        await deleteAddress({ variables: { id } });
    };

    // Establecer como predeterminada
    const handleSetDefault = async (id: string) => {
        await updateAddress({
            variables: {
                input: {
                    id,
                    defaultShippingAddress: true,
                    defaultBillingAddress: true,
                },
            },
        });
    };

    // Breadcrumbs
    const breadcrumbItems = [
        { label: 'Inicio', href: '/' },
        { label: 'Mi cuenta', href: '/cuenta' },
        { label: 'Direcciones' },
    ];

    const isProcessing = creating || updating || deleting;

    return (
        <ProtectedRoute>
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
                            <Button
                                variant="primary"
                                onClick={handleAddNew}
                                disabled={isProcessing}
                            >
                                + Añadir dirección
                            </Button>
                        </header>

                        {successMessage && (
                            <Alert type="success" dismissible onClose={() => setSuccessMessage(null)}>
                                {successMessage}
                            </Alert>
                        )}

                        {errorMessage && (
                            <Alert type="error" dismissible onClose={() => setErrorMessage(null)}>
                                {errorMessage}
                            </Alert>
                        )}

                        {loading ? (
                            <div className={styles.loading}>
                                <div className={styles.spinner} />
                                <p>Cargando direcciones...</p>
                            </div>
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
                                        className={`${styles.addressCard} ${address.defaultShippingAddress ? styles.defaultCard : ''}`}
                                    >
                                        {address.defaultShippingAddress && (
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
                                            <p className={styles.country}>{address.country?.name || 'España'}</p>
                                            {address.phoneNumber && (
                                                <p className={styles.phone}>Tel: {address.phoneNumber}</p>
                                            )}
                                        </div>
                                        <div className={styles.addressActions}>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => handleEdit(address)}
                                                disabled={isProcessing}
                                            >
                                                Editar
                                            </button>
                                            {!address.defaultShippingAddress && (
                                                <button
                                                    className={styles.actionBtn}
                                                    onClick={() => handleSetDefault(address.id)}
                                                    disabled={isProcessing}
                                                >
                                                    Predeterminada
                                                </button>
                                            )}
                                            <button
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                onClick={() => handleDelete(address.id)}
                                                disabled={isProcessing}
                                            >
                                                {deleting ? 'Eliminando...' : 'Eliminar'}
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
                        type="shipping"
                        initialData={editingAddress ? {
                            fullName: editingAddress.fullName,
                            company: editingAddress.company,
                            streetLine1: editingAddress.streetLine1,
                            streetLine2: editingAddress.streetLine2,
                            city: editingAddress.city,
                            province: editingAddress.province,
                            postalCode: editingAddress.postalCode,
                            countryCode: editingAddress.country?.code || 'ES',
                            phoneNumber: editingAddress.phoneNumber,
                        } : undefined}
                        onSubmit={handleSave}
                        onCancel={() => setIsModalOpen(false)}
                        loading={creating || updating}
                    />
                </Modal>
            </div>
        </ProtectedRoute>
    );
}