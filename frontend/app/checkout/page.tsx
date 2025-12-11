/**
 * Checkout Page - Proceso de pago completo
 *
 * Flujo de checkout:
 * 1. Dirección de envío (con integración a Vendure)
 * 2. Método de envío (seleccionar de métodos elegibles)
 * 3. Pago con Stripe
 *
 * @author Frontend Team
 * @version 3.0.0 - Integración con Stripe
 */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ACTIVE_ORDER } from '@/lib/vendure/queries/cart';
import {
    SET_ORDER_SHIPPING_ADDRESS,
    SET_CUSTOMER_FOR_ORDER,
    GET_ELIGIBLE_SHIPPING_METHODS,
    SET_ORDER_SHIPPING_METHOD,
    TRANSITION_ORDER_TO_STATE
} from '@/lib/vendure/mutations/order';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/Toast';
import { CheckoutSteps, DEFAULT_CHECKOUT_STEPS, ShippingAddress, StripePaymentForm } from '@/components/checkout';
import { Button, Alert, Input, Dropdown } from '@/components/core';
import styles from './page.module.css';

// ========================================
// INTERFACES
// ========================================

/**
 * Línea del pedido para mostrar en el resumen
 */
interface OrderLineItem {
    id: string;
    quantity: number;
    linePriceWithTax: number;
    productVariant: {
        id: string;
        name: string;
        sku: string;
        product: {
            id: string;
            name: string;
            slug: string;
            featuredAsset?: {
                preview: string;
            };
        };
    };
}

/**
 * Datos del pedido activo
 */
interface ActiveOrderData {
    activeOrder: {
        id: string;
        code: string;
        state: string;
        totalQuantity: number;
        subTotal: number;
        subTotalWithTax: number;
        shipping: number;
        shippingWithTax: number;
        total: number;
        totalWithTax: number;
        lines: OrderLineItem[];
        shippingAddress?: {
            fullName: string;
            streetLine1: string;
            streetLine2?: string;
            city: string;
            province: string;
            postalCode: string;
            country: string;
            phoneNumber: string;
        };
        shippingLines: Array<{
            shippingMethod: {
                id: string;
                name: string;
            };
            priceWithTax: number;
        }>;
        customer?: {
            id: string;
            firstName: string;
            lastName: string;
            emailAddress: string;
        };
    } | null;
}

/**
 * Método de envío elegible
 */
interface ShippingMethodOption {
    id: string;
    name: string;
    description: string;
    price: number;
    priceWithTax: number;
}

// ========================================
// CONSTANTES
// ========================================

/** Provincias de España para el dropdown */
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

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export default function CheckoutPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const { currentUser, isAuthenticated } = useAuth();

    // Estado del checkout
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // Estado del formulario de dirección
    const [addressForm, setAddressForm] = useState<ShippingAddress>({
        fullName: '',
        company: '',
        streetLine1: '',
        streetLine2: '',
        city: '',
        province: '',
        postalCode: '',
        countryCode: 'ES',
        phoneNumber: '',
    });
    const [addressErrors, setAddressErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

    // Estado para guest checkout (email)
    const [guestEmail, setGuestEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    // Estado del método de envío seleccionado
    const [selectedShippingMethod, setSelectedShippingMethod] = useState<string | null>(null);

    // ========================================
    // QUERIES
    // ========================================

    // Query para obtener el pedido activo
    const { data: orderData, loading: orderLoading, refetch: refetchOrder } = useQuery<ActiveOrderData>(
        GET_ACTIVE_ORDER,
        { fetchPolicy: 'network-only' }
    );

    // Query para obtener métodos de envío disponibles
    const { data: shippingMethodsData, loading: shippingMethodsLoading } = useQuery(
        GET_ELIGIBLE_SHIPPING_METHODS,
        { skip: currentStep < 1 } // Solo cargar cuando llegamos al paso de envío
    );

    // ========================================
    // MUTATIONS
    // ========================================

    // Mutation para establecer email del cliente (guest checkout)
    const [setCustomerForOrder, { loading: settingCustomer }] = useMutation(SET_CUSTOMER_FOR_ORDER, {
        onError: (err) => {
            console.error('Error setting customer:', err);
            setError('Error al guardar los datos del cliente');
        },
    });

    // Mutation para establecer dirección de envío
    const [setShippingAddress, { loading: settingAddress }] = useMutation(SET_ORDER_SHIPPING_ADDRESS, {
        onCompleted: (data) => {
            if (data.setOrderShippingAddress?.errorCode) {
                setError(data.setOrderShippingAddress.message || 'Error al guardar la dirección');
            } else {
                // Éxito: avanzar al siguiente paso
                refetchOrder();
                setCurrentStep(1);
                showToast('Dirección guardada correctamente', 'success');
            }
        },
        onError: (err) => {
            console.error('Error setting shipping address:', err);
            setError('Error al guardar la dirección de envío');
        },
    });

    // Mutation para establecer método de envío
    const [setShippingMethod, { loading: settingShipping }] = useMutation(SET_ORDER_SHIPPING_METHOD, {
        onCompleted: (data) => {
            if (data.setOrderShippingMethod?.errorCode) {
                setError(data.setOrderShippingMethod.message || 'Error al seleccionar método de envío');
            } else {
                refetchOrder();
                setCurrentStep(2);
                showToast('Método de envío seleccionado', 'success');
            }
        },
        onError: (err) => {
            console.error('Error setting shipping method:', err);
            setError('Error al establecer el método de envío');
        },
    });

    // Mutation para transicionar el estado del pedido
    const [transitionOrder, { loading: transitioning }] = useMutation(TRANSITION_ORDER_TO_STATE, {
        onCompleted: (data) => {
            if (data.transitionOrderToState?.errorCode) {
                setError(data.transitionOrderToState.message || 'Error al procesar el pedido');
            } else {
                // Pedido completado - redirigir a confirmación
                const orderCode = data.transitionOrderToState?.code;
                router.push(`/pedido/confirmacion?code=${orderCode}`);
            }
        },
        onError: (err) => {
            console.error('Error transitioning order:', err);
            setError('Error al procesar el pedido');
        },
    });

    // ========================================
    // EFFECTS
    // ========================================

    // Pre-rellenar formulario si el usuario está logueado
    useEffect(() => {
        if (currentUser) {
            setAddressForm(prev => ({
                ...prev,
                fullName: `${currentUser.firstName} ${currentUser.lastName}`.trim(),
            }));
        }
    }, [currentUser]);

    // Pre-rellenar con dirección existente del pedido
    useEffect(() => {
        if (orderData?.activeOrder?.shippingAddress) {
            const addr = orderData.activeOrder.shippingAddress;
            setAddressForm({
                fullName: addr.fullName || '',
                streetLine1: addr.streetLine1 || '',
                streetLine2: addr.streetLine2 || '',
                city: addr.city || '',
                province: addr.province || '',
                postalCode: addr.postalCode || '',
                countryCode: 'ES',
                phoneNumber: addr.phoneNumber || '',
            });
        }
    }, [orderData]);

    // Pre-seleccionar método de envío si ya hay uno
    useEffect(() => {
        if (orderData?.activeOrder?.shippingLines?.[0]) {
            setSelectedShippingMethod(orderData.activeOrder.shippingLines[0].shippingMethod.id);
        }
    }, [orderData]);

    // ========================================
    // HANDLERS
    // ========================================

    /**
     * Validar formulario de dirección
     */
    const validateAddressForm = (): boolean => {
        const errors: Partial<Record<keyof ShippingAddress, string>> = {};

        if (!addressForm.fullName.trim()) {
            errors.fullName = 'El nombre es obligatorio';
        }
        if (!addressForm.streetLine1.trim()) {
            errors.streetLine1 = 'La dirección es obligatoria';
        }
        if (!addressForm.city.trim()) {
            errors.city = 'La ciudad es obligatoria';
        }
        if (!addressForm.province) {
            errors.province = 'La provincia es obligatoria';
        }
        if (!addressForm.postalCode.trim()) {
            errors.postalCode = 'El código postal es obligatorio';
        } else if (!/^\d{5}$/.test(addressForm.postalCode)) {
            errors.postalCode = 'El código postal debe tener 5 dígitos';
        }
        if (!addressForm.phoneNumber.trim()) {
            errors.phoneNumber = 'El teléfono es obligatorio';
        }

        setAddressErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /**
     * Handler para cambios en el formulario de dirección
     */
    const handleAddressChange = (field: keyof ShippingAddress, value: string) => {
        setAddressForm(prev => ({ ...prev, [field]: value }));
        if (addressErrors[field]) {
            setAddressErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    /**
     * Handler para enviar formulario de dirección (Paso 1)
     */
    const handleAddressSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validar email si no está logueado
        if (!isAuthenticated) {
            if (!guestEmail.trim()) {
                setEmailError('El email es obligatorio');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
                setEmailError('Email no válido');
                return;
            }
        }

        // Validar dirección
        if (!validateAddressForm()) {
            return;
        }

        try {
            // Si es guest, primero establecer el email
            if (!isAuthenticated && guestEmail) {
                await setCustomerForOrder({
                    variables: {
                        input: {
                            emailAddress: guestEmail,
                            firstName: addressForm.fullName.split(' ')[0] || 'Cliente',
                            lastName: addressForm.fullName.split(' ').slice(1).join(' ') || '',
                        },
                    },
                });
            }

            // Establecer dirección de envío
            await setShippingAddress({
                variables: {
                    input: {
                        fullName: addressForm.fullName,
                        company: addressForm.company || '',
                        streetLine1: addressForm.streetLine1,
                        streetLine2: addressForm.streetLine2 || '',
                        city: addressForm.city,
                        province: addressForm.province,
                        postalCode: addressForm.postalCode,
                        countryCode: addressForm.countryCode,
                        phoneNumber: addressForm.phoneNumber,
                    },
                },
            });
        } catch (err) {
            console.error('Error in address submit:', err);
        }
    };

    /**
     * Handler para seleccionar método de envío (Paso 2)
     */
    const handleShippingMethodSubmit = async () => {
        if (!selectedShippingMethod) {
            setError('Por favor, selecciona un método de envío');
            return;
        }

        await setShippingMethod({
            variables: {
                shippingMethodId: [selectedShippingMethod],
            },
        });
    };

    /**
     * Handler cuando el pago de Stripe es exitoso
     */
    const handlePaymentSuccess = (orderCode: string) => {
        showToast('¡Pago realizado con éxito!', 'success');
        router.push(`/pedido/confirmacion?code=${orderCode}`);
    };

    /**
     * Handler cuando hay error en el pago
     */
    const handlePaymentError = (errorMessage: string) => {
        setError(errorMessage);
        showToast(errorMessage, 'error');
    };

    // ========================================
    // DATOS DERIVADOS
    // ========================================

    const activeOrder = orderData?.activeOrder;
    const hasItems = activeOrder && activeOrder.lines.length > 0;
    const shippingMethods: ShippingMethodOption[] = shippingMethodsData?.eligibleShippingMethods || [];

    // Calcular totales
    const subtotal = activeOrder?.subTotalWithTax || 0;
    const shippingCost = activeOrder?.shippingWithTax || 0;
    const total = activeOrder?.totalWithTax || 0;

    // Estado de carga general
    const isLoading = orderLoading || settingCustomer || settingAddress || settingShipping || transitioning;

    // ========================================
    // RENDERIZADO CONDICIONAL
    // ========================================

    // Si no hay carrito o está vacío
    if (!orderLoading && (!activeOrder || !hasItems)) {
        return (
            <div className={styles.container}>
                <div className={styles.emptyCart}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h2>Tu carrito está vacío</h2>
                    <p>Añade productos antes de continuar con el checkout</p>
                    <Link href="/productos" className={styles.shopLink}>
                        Ver productos
                    </Link>
                </div>
            </div>
        );
    }

    // ========================================
    // RENDER DE PASOS
    // ========================================

    /**
     * Paso 1: Formulario de dirección de envío
     */
    const renderAddressStep = () => (
        <form onSubmit={handleAddressSubmit} className={styles.stepForm}>
            <h3 className={styles.stepTitle}>Dirección de envío</h3>

            {/* Email para guest checkout */}
            {!isAuthenticated && (
                <div className={styles.guestEmail}>
                    <Input
                        label="Email de contacto"
                        type="email"
                        value={guestEmail}
                        onChange={(e) => {
                            setGuestEmail(e.target.value);
                            setEmailError('');
                        }}
                        error={emailError}
                        required
                        fullWidth
                        placeholder="tu@email.com"
                        helperText="Recibirás la confirmación del pedido en este email"
                    />
                </div>
            )}

            {/* Nombre completo */}
            <div className={styles.formRow}>
                <Input
                    label="Nombre completo"
                    value={addressForm.fullName}
                    onChange={(e) => handleAddressChange('fullName', e.target.value)}
                    error={addressErrors.fullName}
                    required
                    fullWidth
                    placeholder="Juan García López"
                />
            </div>

            {/* Empresa (opcional) */}
            <div className={styles.formRow}>
                <Input
                    label="Empresa (opcional)"
                    value={addressForm.company || ''}
                    onChange={(e) => handleAddressChange('company', e.target.value)}
                    fullWidth
                    placeholder="Nombre de la empresa"
                />
            </div>

            {/* Dirección */}
            <div className={styles.formRow}>
                <Input
                    label="Dirección"
                    value={addressForm.streetLine1}
                    onChange={(e) => handleAddressChange('streetLine1', e.target.value)}
                    error={addressErrors.streetLine1}
                    required
                    fullWidth
                    placeholder="Calle, número, piso, puerta..."
                />
            </div>

            {/* Dirección adicional */}
            <div className={styles.formRow}>
                <Input
                    label="Dirección adicional (opcional)"
                    value={addressForm.streetLine2 || ''}
                    onChange={(e) => handleAddressChange('streetLine2', e.target.value)}
                    fullWidth
                    placeholder="Urbanización, bloque, etc."
                />
            </div>

            {/* Ciudad y Código Postal */}
            <div className={styles.formRowGroup}>
                <Input
                    label="Ciudad"
                    value={addressForm.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    error={addressErrors.city}
                    required
                    fullWidth
                    placeholder="Madrid"
                />
                <Input
                    label="Código postal"
                    value={addressForm.postalCode}
                    onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                    error={addressErrors.postalCode}
                    required
                    fullWidth
                    placeholder="28001"
                    maxLength={5}
                />
            </div>

            {/* Provincia */}
            <div className={styles.formRow}>
                <Dropdown
                    label="Provincia"
                    options={SPANISH_PROVINCES}
                    value={addressForm.province}
                    onChange={(value) => handleAddressChange('province', value)}
                    error={addressErrors.province}
                    placeholder="Selecciona provincia"
                    fullWidth
                />
            </div>

            {/* Teléfono */}
            <div className={styles.formRow}>
                <Input
                    label="Teléfono"
                    type="tel"
                    value={addressForm.phoneNumber}
                    onChange={(e) => handleAddressChange('phoneNumber', e.target.value)}
                    error={addressErrors.phoneNumber}
                    required
                    fullWidth
                    placeholder="612 345 678"
                    helperText="Para contactar en caso de incidencia"
                />
            </div>

            {/* Botón de envío */}
            <div className={styles.stepActions}>
                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={isLoading}
                    fullWidth
                >
                    Continuar al envío
                </Button>
            </div>
        </form>
    );

    /**
     * Paso 2: Selección de método de envío
     */
    const renderShippingStep = () => (
        <div className={styles.stepForm}>
            <h3 className={styles.stepTitle}>Método de envío</h3>

            {/* Resumen de dirección */}
            <div className={styles.addressSummary}>
                <div className={styles.addressSummaryHeader}>
                    <span>Enviar a:</span>
                    <button
                        type="button"
                        className={styles.editLink}
                        onClick={() => setCurrentStep(0)}
                    >
                        Editar
                    </button>
                </div>
                <p>{addressForm.fullName}</p>
                <p>{addressForm.streetLine1}</p>
                {addressForm.streetLine2 && <p>{addressForm.streetLine2}</p>}
                <p>{addressForm.postalCode} {addressForm.city}, {addressForm.province}</p>
            </div>

            {/* Lista de métodos de envío */}
            {shippingMethodsLoading ? (
                <div className={styles.loadingMethods}>Cargando métodos de envío...</div>
            ) : shippingMethods.length === 0 ? (
                <Alert type="warning">
                    No hay métodos de envío disponibles para tu dirección.
                </Alert>
            ) : (
                <div className={styles.shippingMethods}>
                    {shippingMethods.map((method) => (
                        <label
                            key={method.id}
                            className={`${styles.shippingOption} ${selectedShippingMethod === method.id ? styles.selected : ''}`}
                        >
                            <input
                                type="radio"
                                name="shippingMethod"
                                value={method.id}
                                checked={selectedShippingMethod === method.id}
                                onChange={() => setSelectedShippingMethod(method.id)}
                            />
                            <div className={styles.shippingOptionContent}>
                                <span className={styles.shippingName}>{method.name}</span>
                                {method.description && (
                                    <span className={styles.shippingDescription}>{method.description}</span>
                                )}
                            </div>
                            <span className={styles.shippingPrice}>
                                {method.priceWithTax === 0 ? 'Gratis' : `${(method.priceWithTax / 100).toFixed(2)}€`}
                            </span>
                        </label>
                    ))}
                </div>
            )}

            {/* Botones */}
            <div className={styles.stepActions}>
                <Button
                    variant="outline"
                    onClick={() => setCurrentStep(0)}
                    disabled={isLoading}
                >
                    Volver
                </Button>
                <Button
                    variant="primary"
                    onClick={handleShippingMethodSubmit}
                    loading={isLoading}
                    disabled={!selectedShippingMethod}
                >
                    Continuar al pago
                </Button>
            </div>
        </div>
    );

    /**
     * Paso 3: Pago con Stripe
     */
    const renderPaymentStep = () => (
        <div className={styles.stepForm}>
            <h3 className={styles.stepTitle}>Método de pago</h3>

            {/* Resumen de dirección y envío */}
            <div className={styles.orderReview}>
                {/* Dirección */}
                <div className={styles.reviewSection}>
                    <div className={styles.reviewHeader}>
                        <span className={styles.reviewLabel}>Enviar a</span>
                        <button type="button" className={styles.editLink} onClick={() => setCurrentStep(0)}>
                            Cambiar
                        </button>
                    </div>
                    <p className={styles.reviewContent}>
                        {addressForm.fullName}<br />
                        {addressForm.streetLine1}<br />
                        {addressForm.postalCode} {addressForm.city}
                    </p>
                </div>

                {/* Método de envío */}
                <div className={styles.reviewSection}>
                    <div className={styles.reviewHeader}>
                        <span className={styles.reviewLabel}>Método de envío</span>
                        <button type="button" className={styles.editLink} onClick={() => setCurrentStep(1)}>
                            Cambiar
                        </button>
                    </div>
                    {activeOrder?.shippingLines?.[0] && (
                        <p className={styles.reviewContent}>
                            {activeOrder.shippingLines[0].shippingMethod.name}
                            {activeOrder.shippingLines[0].priceWithTax === 0
                                ? ' - Gratis'
                                : ` - ${(activeOrder.shippingLines[0].priceWithTax / 100).toFixed(2)}€`}
                        </p>
                    )}
                </div>
            </div>

            {/* Formulario de pago Stripe */}
            <StripePaymentForm
                amount={total}
                currency="eur"
                orderCode={activeOrder?.code || ''}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
            />

            {/* Botón de volver */}
            <div className={styles.backButton}>
                <Button
                    variant="ghost"
                    onClick={() => setCurrentStep(1)}
                    disabled={isLoading}
                >
                    ← Volver al método de envío
                </Button>
            </div>
        </div>
    );

    /**
     * Renderizar contenido del paso actual
     */
    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return renderAddressStep();
            case 1:
                return renderShippingStep();
            case 2:
                return renderPaymentStep();
            default:
                return null;
        }
    };

    // ========================================
    // RENDER PRINCIPAL
    // ========================================

    return (
        <div className={styles.container}>
            {/* Título */}
            <h1 className={styles.title}>Finalizar compra</h1>

            {/* Pasos del checkout */}
            <CheckoutSteps
                steps={DEFAULT_CHECKOUT_STEPS}
                currentStep={currentStep}
                onStepClick={(step) => {
                    // Solo permitir ir a pasos anteriores
                    if (step < currentStep) {
                        setCurrentStep(step);
                    }
                }}
                allowNavigation={true}
            />

            {/* Error global */}
            {error && (
                <Alert type="error" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Contenido principal */}
            <div className={styles.content}>
                {/* Formulario/Paso actual */}
                <div className={styles.mainContent}>
                    {orderLoading ? (
                        <div className={styles.loading}>
                            <div className={styles.spinner} />
                            <p>Cargando datos del pedido...</p>
                        </div>
                    ) : (
                        renderStepContent()
                    )}
                </div>

                {/* Sidebar con resumen */}
                <aside className={styles.sidebar}>
                    <div className={styles.orderSummary}>
                        <h3 className={styles.summaryTitle}>Resumen del pedido</h3>

                        {/* Lista de productos */}
                        <div className={styles.summaryItems}>
                            {activeOrder?.lines.map((line) => (
                                <div key={line.id} className={styles.summaryItem}>
                                    <div className={styles.summaryItemImage}>
                                        {line.productVariant.product.featuredAsset ? (
                                            <img
                                                src={line.productVariant.product.featuredAsset.preview}
                                                alt={line.productVariant.name}
                                            />
                                        ) : (
                                            <div className={styles.noImage}>📦</div>
                                        )}
                                        <span className={styles.itemQuantity}>{line.quantity}</span>
                                    </div>
                                    <div className={styles.summaryItemInfo}>
                                        <span className={styles.itemName}>{line.productVariant.name}</span>
                                        <span className={styles.itemPrice}>
                                            {(line.linePriceWithTax / 100).toFixed(2)}€
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Totales */}
                        <div className={styles.summaryTotals}>
                            <div className={styles.summaryRow}>
                                <span>Subtotal</span>
                                <span>{(subtotal / 100).toFixed(2)}€</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span>Envío</span>
                                <span>
                                    {shippingCost === 0 ? 'Gratis' : `${(shippingCost / 100).toFixed(2)}€`}
                                </span>
                            </div>
                            <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                                <span>Total</span>
                                <span>{(total / 100).toFixed(2)}€</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}