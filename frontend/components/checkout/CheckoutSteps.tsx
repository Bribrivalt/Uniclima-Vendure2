'use client';

import React from 'react';
import styles from './CheckoutSteps.module.css';

export interface CheckoutStep {
    id: string;
    label: string;
    description?: string;
}

export interface CheckoutStepsProps {
    steps: CheckoutStep[];
    currentStep: number;
    onStepClick?: (stepIndex: number) => void;
    allowNavigation?: boolean;
}

/**
 * CheckoutSteps - Indicador de progreso del checkout
 * 
 * @param steps - Array de pasos del checkout
 * @param currentStep - Índice del paso actual (0-based)
 * @param onStepClick - Callback para navegar entre pasos
 * @param allowNavigation - Permitir click para navegar (solo pasos completados)
 */
export function CheckoutSteps({
    steps,
    currentStep,
    onStepClick,
    allowNavigation = false,
}: CheckoutStepsProps) {
    const handleStepClick = (index: number) => {
        if (allowNavigation && onStepClick && index < currentStep) {
            onStepClick(index);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.steps}>
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;
                    const isClickable = allowNavigation && isCompleted;

                    const stepClasses = [
                        styles.step,
                        isCompleted ? styles.completed : '',
                        isCurrent ? styles.current : '',
                        isClickable ? styles.clickable : '',
                    ]
                        .filter(Boolean)
                        .join(' ');

                    return (
                        <React.Fragment key={step.id}>
                            <div
                                className={stepClasses}
                                onClick={() => handleStepClick(index)}
                                role={isClickable ? 'button' : undefined}
                                tabIndex={isClickable ? 0 : undefined}
                                onKeyDown={(e) => {
                                    if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
                                        handleStepClick(index);
                                    }
                                }}
                            >
                                <div className={styles.stepIndicator}>
                                    {isCompleted ? (
                                        <svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    ) : (
                                        <span>{index + 1}</span>
                                    )}
                                </div>
                                <div className={styles.stepContent}>
                                    <span className={styles.stepLabel}>{step.label}</span>
                                    {step.description && (
                                        <span className={styles.stepDescription}>
                                            {step.description}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Línea conectora */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`${styles.connector} ${isCompleted ? styles.connectorCompleted : ''
                                        }`}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}

// Pasos predefinidos para el checkout de Uniclima
export const DEFAULT_CHECKOUT_STEPS: CheckoutStep[] = [
    {
        id: 'shipping',
        label: 'Envío',
        description: 'Datos de entrega',
    },
    {
        id: 'payment',
        label: 'Pago',
        description: 'Método de pago',
    },
    {
        id: 'confirmation',
        label: 'Confirmación',
        description: 'Revisar pedido',
    },
];