'use client';

import React, { useState, useEffect } from 'react';
import { Input, Button, Dropdown, Checkbox } from '@/components/core';
import styles from './AddressForm.module.css';

/**
 * Interfaz para una dirección completa
 * @interface Address
 */
export interface Address {
    /** ID de la dirección (para direcciones guardadas) */
    id?: string;
    /** Nombre completo del destinatario */
    fullName: string;
    /** Empresa (opcional) */
    company?: string;
    /** Línea de dirección 1 */
    streetLine1: string;
    /** Línea de dirección 2 (opcional) */
    streetLine2?: string;
    /** Ciudad */
    city: string;
    /** Provincia/Estado */
    province: string;
    /** Código postal */
    postalCode: string;
    /** Código de país */
    countryCode: string;
    /** Número de teléfono */
    phoneNumber: string;
    /** Email (para contacto) */
    email?: string;
    /** NIF/CIF (para facturación) */
    taxId?: string;
}

/**
 * Props para el componente AddressForm
 * @interface AddressFormProps
 */
export interface AddressFormProps {
    /** Tipo de dirección: envío o facturación */
    type: 'shipping' | 'billing';
    /** Datos iniciales */
    initialData?: Partial<Address>;
    /** Callback al enviar el formulario */
    onSubmit: (address: Address) => void;
    /** Callback al cancelar */
    onCancel?: () => void;
    /** Estado de carga */
    loading?: boolean;
    /** Texto del botón de envío */
    submitLabel?: string;
    /** Mostrar campos de facturación (NIF/CIF) */
    showTaxFields?: boolean;
    /** Mostrar campo de email */
    showEmailField?: boolean;
    /** Direcciones guardadas del usuario */
    savedAddresses?: Address[];
    /** Callback al seleccionar dirección guardada */
    onSelectSavedAddress?: (address: Address) => void;
    /** Permitir guardar la dirección */
    allowSaveAddress?: boolean;
    /** Clase CSS adicional */
    className?: string;
}

/**
 * Lista de provincias españolas
 */
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
 * Lista de países disponibles
 */
const COUNTRIES = [
    { value: 'ES', label: 'España' },
    { value: 'PT', label: 'Portugal' },
    { value: 'FR', label: 'Francia' },
    { value: 'AD', label: 'Andorra' },
];

/**
 * AddressForm - Formulario de dirección genérico
 * 
 * Formulario reutilizable para direcciones de envío y facturación.
 * Incluye validación, selección de direcciones guardadas y campos
 * opcionales según el tipo.
 * 
 * @example
 * ```tsx
 * // Dirección de envío
 * <AddressForm
 *   type="shipping"
 *   onSubmit={handleShippingSubmit}
 *   submitLabel="Continuar al pago"
 * />
 * 
 * // Dirección de facturación con NIF
 * <AddressForm
 *   type="billing"
 *   showTaxFields
 *   onSubmit={handleBillingSubmit}
 *   savedAddresses={userAddresses}
 * />
 * ```
 */
export function AddressForm({
    type,
    initialData = {},
    onSubmit,
    onCancel,
    loading = false,
    submitLabel,
    showTaxFields = false,
    showEmailField = false,
    savedAddresses = [],
    onSelectSavedAddress,
    allowSaveAddress = true,
    className,
}: AddressFormProps) {
    // Estado del formulario
    const [formData, setFormData] = useState<Address>({
        fullName: initialData.fullName || '',
        company: initialData.company || '',
        streetLine1: initialData.streetLine1 || '',
        streetLine2: initialData.streetLine2 || '',
        city: initialData.city || '',
        province: initialData.province || '',
        postalCode: initialData.postalCode || '',
        countryCode: initialData.countryCode || 'ES',
        phoneNumber: initialData.phoneNumber || '',
        email: initialData.email || '',
        taxId: initialData.taxId || '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>({});
    const [saveAddress, setSaveAddress] = useState(false);
    const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null);

    // Actualizar formulario cuando cambian los datos iniciales
    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
        }
    }, [initialData]);

    // Validar formulario
    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof Address, string>> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'El nombre es obligatorio';
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
        } else if (formData.countryCode === 'ES' && !/^\d{5}$/.test(formData.postalCode)) {
            newErrors.postalCode = 'El código postal debe tener 5 dígitos';
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'El teléfono es obligatorio';
        }

        if (showEmailField && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

        if (showTaxFields && formData.taxId && !/^[A-Z0-9]{9}$/.test(formData.taxId.toUpperCase())) {
            newErrors.taxId = 'El NIF/CIF no es válido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handler para cambios en campos
    const handleChange = (field: keyof Address, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setSelectedSavedId(null); // Limpiar selección de guardado
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    // Handler para seleccionar dirección guardada
    const handleSelectSaved = (addressId: string) => {
        const address = savedAddresses.find(a => a.id === addressId);
        if (address) {
            setFormData({ ...address });
            setSelectedSavedId(addressId);
            setErrors({});
            onSelectSavedAddress?.(address);
        }
    };

    // Handler para envío
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({ ...formData, id: selectedSavedId || undefined });
        }
    };

    // Label del botón por defecto
    const defaultSubmitLabel = type === 'shipping'
        ? 'Continuar al método de envío'
        : 'Guardar dirección de facturación';

    const containerClasses = [styles.container, className].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            {/* Direcciones guardadas */}
            {savedAddresses.length > 0 && (
                <div className={styles.savedAddresses}>
                    <h4 className={styles.savedTitle}>Direcciones guardadas</h4>
                    <div className={styles.savedList}>
                        {savedAddresses.map(address => (
                            <button
                                key={address.id}
                                type="button"
                                className={`${styles.savedCard} ${selectedSavedId === address.id ? styles.selected : ''}`}
                                onClick={() => handleSelectSaved(address.id!)}
                            >
                                <span className={styles.savedName}>{address.fullName}</span>
                                <span className={styles.savedAddress}>
                                    {address.streetLine1}, {address.city}
                                </span>
                                <span className={styles.savedPostal}>
                                    {address.postalCode} - {address.province}
                                </span>
                            </button>
                        ))}
                        <button
                            type="button"
                            className={`${styles.savedCard} ${styles.newAddress} ${!selectedSavedId ? styles.selected : ''}`}
                            onClick={() => {
                                setSelectedSavedId(null);
                                setFormData({
                                    fullName: '',
                                    streetLine1: '',
                                    city: '',
                                    province: '',
                                    postalCode: '',
                                    countryCode: 'ES',
                                    phoneNumber: '',
                                });
                            }}
                        >
                            <span className={styles.newAddressIcon}>+</span>
                            <span className={styles.newAddressText}>Nueva dirección</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className={styles.form}>
                <h4 className={styles.formTitle}>
                    {type === 'shipping' ? 'Dirección de envío' : 'Dirección de facturación'}
                </h4>

                {/* Nombre completo */}
                <div className={styles.row}>
                    <Input
                        label="Nombre completo"
                        value={formData.fullName}
                        onChange={e => handleChange('fullName', e.target.value)}
                        error={errors.fullName}
                        required
                        fullWidth
                        placeholder="Juan García López"
                    />
                </div>

                {/* Empresa */}
                <div className={styles.row}>
                    <Input
                        label="Empresa (opcional)"
                        value={formData.company}
                        onChange={e => handleChange('company', e.target.value)}
                        fullWidth
                        placeholder="Nombre de la empresa"
                    />
                </div>

                {/* NIF/CIF para facturación */}
                {showTaxFields && (
                    <div className={styles.row}>
                        <Input
                            label="NIF / CIF"
                            value={formData.taxId}
                            onChange={e => handleChange('taxId', e.target.value.toUpperCase())}
                            error={errors.taxId}
                            fullWidth
                            placeholder="12345678A"
                            helperText="Necesario para la factura"
                        />
                    </div>
                )}

                {/* Dirección */}
                <div className={styles.row}>
                    <Input
                        label="Dirección"
                        value={formData.streetLine1}
                        onChange={e => handleChange('streetLine1', e.target.value)}
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
                        onChange={e => handleChange('streetLine2', e.target.value)}
                        fullWidth
                        placeholder="Urbanización, bloque, etc."
                    />
                </div>

                {/* Ciudad y CP */}
                <div className={styles.rowGroup}>
                    <Input
                        label="Ciudad"
                        value={formData.city}
                        onChange={e => handleChange('city', e.target.value)}
                        error={errors.city}
                        required
                        fullWidth
                        placeholder="Madrid"
                    />
                    <Input
                        label="Código postal"
                        value={formData.postalCode}
                        onChange={e => handleChange('postalCode', e.target.value)}
                        error={errors.postalCode}
                        required
                        fullWidth
                        placeholder="28001"
                        maxLength={5}
                    />
                </div>

                {/* Provincia y País */}
                <div className={styles.rowGroup}>
                    <Dropdown
                        label="Provincia"
                        options={SPANISH_PROVINCES}
                        value={formData.province}
                        onChange={value => handleChange('province', value)}
                        error={errors.province}
                        placeholder="Selecciona provincia"
                        fullWidth
                    />
                    <Dropdown
                        label="País"
                        options={COUNTRIES}
                        value={formData.countryCode}
                        onChange={value => handleChange('countryCode', value)}
                        fullWidth
                    />
                </div>

                {/* Teléfono */}
                <div className={styles.row}>
                    <Input
                        label="Teléfono"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={e => handleChange('phoneNumber', e.target.value)}
                        error={errors.phoneNumber}
                        required
                        fullWidth
                        placeholder="612 345 678"
                        helperText="Para contactar en caso de incidencia"
                    />
                </div>

                {/* Email */}
                {showEmailField && (
                    <div className={styles.row}>
                        <Input
                            label="Email"
                            type="email"
                            value={formData.email}
                            onChange={e => handleChange('email', e.target.value)}
                            error={errors.email}
                            fullWidth
                            placeholder="tu@email.com"
                        />
                    </div>
                )}

                {/* Opción de guardar dirección */}
                {allowSaveAddress && !selectedSavedId && (
                    <div className={styles.saveOption}>
                        <Checkbox
                            checked={saveAddress}
                            onChange={e => setSaveAddress(e.target.checked)}
                            label="Guardar esta dirección para futuras compras"
                        />
                    </div>
                )}

                {/* Botones de acción */}
                <div className={styles.actions}>
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >
                            Cancelar
                        </Button>
                    )}
                    <Button
                        type="submit"
                        variant="primary"
                        loading={loading}
                        fullWidth={!onCancel}
                    >
                        {submitLabel || defaultSubmitLabel}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default AddressForm;