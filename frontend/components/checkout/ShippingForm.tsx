'use client';

import React, { useState } from 'react';
import { Input, Button, Dropdown } from '@/components/core';
import styles from './ShippingForm.module.css';

export interface ShippingAddress {
    fullName: string;
    company?: string;
    streetLine1: string;
    streetLine2?: string;
    city: string;
    province: string;
    postalCode: string;
    countryCode: string;
    phoneNumber: string;
}

export interface ShippingFormProps {
    initialData?: Partial<ShippingAddress>;
    onSubmit: (address: ShippingAddress) => void;
    loading?: boolean;
    submitLabel?: string;
}

// Provincias de España
const SPANISH_PROVINCES = [
    { value: 'A Coruña', label: 'A Coruña' },
    { value: 'Álava', label: 'Álava' },
    { value: 'Albacete', label: 'Albacete' },
    { value: 'Alicante', label: 'Alicante' },
    { value: 'Almería', label: 'Almería' },
    { value: 'Asturias', label: 'Asturias' },
    { value: 'Ávila', label: 'Ávila' },
    { value: 'Badajoz', label: 'Badajoz' },
    { value: 'Barcelona', label: 'Barcelona' },
    { value: 'Burgos', label: 'Burgos' },
    { value: 'Cáceres', label: 'Cáceres' },
    { value: 'Cádiz', label: 'Cádiz' },
    { value: 'Cantabria', label: 'Cantabria' },
    { value: 'Castellón', label: 'Castellón' },
    { value: 'Ciudad Real', label: 'Ciudad Real' },
    { value: 'Córdoba', label: 'Córdoba' },
    { value: 'Cuenca', label: 'Cuenca' },
    { value: 'Girona', label: 'Girona' },
    { value: 'Granada', label: 'Granada' },
    { value: 'Guadalajara', label: 'Guadalajara' },
    { value: 'Guipúzcoa', label: 'Guipúzcoa' },
    { value: 'Huelva', label: 'Huelva' },
    { value: 'Huesca', label: 'Huesca' },
    { value: 'Jaén', label: 'Jaén' },
    { value: 'La Rioja', label: 'La Rioja' },
    { value: 'Las Palmas', label: 'Las Palmas' },
    { value: 'León', label: 'León' },
    { value: 'Lleida', label: 'Lleida' },
    { value: 'Lugo', label: 'Lugo' },
    { value: 'Madrid', label: 'Madrid' },
    { value: 'Málaga', label: 'Málaga' },
    { value: 'Murcia', label: 'Murcia' },
    { value: 'Navarra', label: 'Navarra' },
    { value: 'Ourense', label: 'Ourense' },
    { value: 'Palencia', label: 'Palencia' },
    { value: 'Pontevedra', label: 'Pontevedra' },
    { value: 'Salamanca', label: 'Salamanca' },
    { value: 'Santa Cruz de Tenerife', label: 'Santa Cruz de Tenerife' },
    { value: 'Segovia', label: 'Segovia' },
    { value: 'Sevilla', label: 'Sevilla' },
    { value: 'Soria', label: 'Soria' },
    { value: 'Tarragona', label: 'Tarragona' },
    { value: 'Teruel', label: 'Teruel' },
    { value: 'Toledo', label: 'Toledo' },
    { value: 'Valencia', label: 'Valencia' },
    { value: 'Valladolid', label: 'Valladolid' },
    { value: 'Vizcaya', label: 'Vizcaya' },
    { value: 'Zamora', label: 'Zamora' },
    { value: 'Zaragoza', label: 'Zaragoza' },
];

/**
 * ShippingForm - Formulario de dirección de envío
 */
export function ShippingForm({
    initialData = {},
    onSubmit,
    loading = false,
    submitLabel = 'Continuar al pago',
}: ShippingFormProps) {
    const [formData, setFormData] = useState<ShippingAddress>({
        fullName: initialData.fullName || '',
        company: initialData.company || '',
        streetLine1: initialData.streetLine1 || '',
        streetLine2: initialData.streetLine2 || '',
        city: initialData.city || '',
        province: initialData.province || '',
        postalCode: initialData.postalCode || '',
        countryCode: initialData.countryCode || 'ES',
        phoneNumber: initialData.phoneNumber || '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'El nombre completo es obligatorio';
        }

        if (!formData.streetLine1.trim()) {
            newErrors.streetLine1 = 'La dirección es obligatoria';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'La ciudad es obligatoria';
        }

        if (!formData.province) {
            newErrors.province = 'La provincia es obligatoria';
        }

        if (!formData.postalCode.trim()) {
            newErrors.postalCode = 'El código postal es obligatorio';
        } else if (!/^\d{5}$/.test(formData.postalCode)) {
            newErrors.postalCode = 'El código postal debe tener 5 dígitos';
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'El teléfono es obligatorio';
        } else if (!/^[6-9]\d{8}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
            newErrors.phoneNumber = 'Introduce un teléfono válido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof ShippingAddress, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Limpiar error al modificar
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className={styles.title}>Dirección de envío</h3>

            <div className={styles.row}>
                <Input
                    label="Nombre completo"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    error={errors.fullName}
                    required
                    fullWidth
                    placeholder="Juan García López"
                />
            </div>

            <div className={styles.row}>
                <Input
                    label="Empresa (opcional)"
                    value={formData.company}
                    onChange={(e) => handleChange('company', e.target.value)}
                    fullWidth
                    placeholder="Nombre de la empresa"
                />
            </div>

            <div className={styles.row}>
                <Input
                    label="Dirección"
                    value={formData.streetLine1}
                    onChange={(e) => handleChange('streetLine1', e.target.value)}
                    error={errors.streetLine1}
                    required
                    fullWidth
                    placeholder="Calle, número, piso, puerta..."
                />
            </div>

            <div className={styles.row}>
                <Input
                    label="Dirección adicional (opcional)"
                    value={formData.streetLine2}
                    onChange={(e) => handleChange('streetLine2', e.target.value)}
                    fullWidth
                    placeholder="Urbanización, bloque, etc."
                />
            </div>

            <div className={styles.rowGroup}>
                <Input
                    label="Ciudad"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    error={errors.city}
                    required
                    fullWidth
                    placeholder="Madrid"
                />

                <Input
                    label="Código postal"
                    value={formData.postalCode}
                    onChange={(e) => handleChange('postalCode', e.target.value)}
                    error={errors.postalCode}
                    required
                    fullWidth
                    placeholder="28001"
                    maxLength={5}
                />
            </div>

            <div className={styles.row}>
                <Dropdown
                    label="Provincia"
                    options={SPANISH_PROVINCES}
                    value={formData.province}
                    onChange={(value) => handleChange('province', value)}
                    error={errors.province}
                    placeholder="Selecciona una provincia"
                    fullWidth
                />
            </div>

            <div className={styles.row}>
                <Input
                    label="Teléfono"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    error={errors.phoneNumber}
                    required
                    fullWidth
                    placeholder="612 345 678"
                    helperText="Para contactar en caso de incidencia con el envío"
                />
            </div>

            <div className={styles.actions}>
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={loading}
                    fullWidth
                >
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}