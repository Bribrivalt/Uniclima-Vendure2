'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './Dropdown.module.css';

export interface DropdownOption {
    value: string;
    label: string;
    disabled?: boolean;
    icon?: React.ReactNode;
}

export interface DropdownProps {
    options: DropdownOption[];
    value?: string;
    defaultValue?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    label?: string;
    fullWidth?: boolean;
    className?: string;
}

/**
 * Dropdown - Componente de selección desplegable
 * 
 * @param options - Array de opciones
 * @param value - Valor seleccionado (controlado)
 * @param defaultValue - Valor por defecto (no controlado)
 * @param onChange - Callback cuando cambia el valor
 * @param placeholder - Texto placeholder
 * @param disabled - Estado deshabilitado
 * @param error - Mensaje de error
 * @param label - Etiqueta del dropdown
 * @param fullWidth - Ocupar todo el ancho
 * @param className - Clases CSS adicionales
 */
export const Dropdown: React.FC<DropdownProps> = ({
    options,
    value: controlledValue,
    defaultValue,
    onChange,
    placeholder = 'Seleccionar...',
    disabled = false,
    error,
    label,
    fullWidth = false,
    className = '',
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue || '');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // Determinar si es controlado
    const isControlled = controlledValue !== undefined;
    const selectedValue = isControlled ? controlledValue : internalValue;

    // Opción seleccionada
    const selectedOption = options.find((opt) => opt.value === selectedValue);

    // Cerrar al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Manejar selección
    const handleSelect = useCallback(
        (optionValue: string) => {
            if (!isControlled) {
                setInternalValue(optionValue);
            }
            onChange?.(optionValue);
            setIsOpen(false);
            setFocusedIndex(-1);
        },
        [isControlled, onChange]
    );

    // Toggle dropdown
    const handleToggle = () => {
        if (!disabled) {
            setIsOpen((prev) => !prev);
        }
    };

    // Manejo de teclado
    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (disabled) return;

        const enabledOptions = options.filter((opt) => !opt.disabled);

        switch (event.key) {
            case 'Enter':
            case ' ':
                event.preventDefault();
                if (isOpen && focusedIndex >= 0) {
                    const option = enabledOptions[focusedIndex];
                    if (option) handleSelect(option.value);
                } else {
                    setIsOpen(true);
                }
                break;
            case 'Escape':
                event.preventDefault();
                setIsOpen(false);
                setFocusedIndex(-1);
                break;
            case 'ArrowDown':
                event.preventDefault();
                if (!isOpen) {
                    setIsOpen(true);
                } else {
                    setFocusedIndex((prev) =>
                        prev < enabledOptions.length - 1 ? prev + 1 : 0
                    );
                }
                break;
            case 'ArrowUp':
                event.preventDefault();
                if (isOpen) {
                    setFocusedIndex((prev) =>
                        prev > 0 ? prev - 1 : enabledOptions.length - 1
                    );
                }
                break;
            case 'Home':
                event.preventDefault();
                setFocusedIndex(0);
                break;
            case 'End':
                event.preventDefault();
                setFocusedIndex(enabledOptions.length - 1);
                break;
        }
    };

    // Scroll hacia opción enfocada
    useEffect(() => {
        if (isOpen && focusedIndex >= 0 && listRef.current) {
            const focusedElement = listRef.current.children[focusedIndex] as HTMLElement;
            focusedElement?.scrollIntoView({ block: 'nearest' });
        }
    }, [focusedIndex, isOpen]);

    const containerClasses = [
        styles.container,
        fullWidth ? styles.fullWidth : '',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const buttonClasses = [
        styles.button,
        isOpen ? styles.open : '',
        error ? styles.error : '',
        disabled ? styles.disabled : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={containerClasses} ref={dropdownRef}>
            {label && <label className={styles.label}>{label}</label>}

            <button
                type="button"
                className={buttonClasses}
                onClick={handleToggle}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-labelledby={label ? 'dropdown-label' : undefined}
            >
                <span className={selectedOption ? styles.selectedText : styles.placeholder}>
                    {selectedOption ? (
                        <>
                            {selectedOption.icon && (
                                <span className={styles.icon}>{selectedOption.icon}</span>
                            )}
                            {selectedOption.label}
                        </>
                    ) : (
                        placeholder
                    )}
                </span>
                <span className={`${styles.chevron} ${isOpen ? styles.rotated : ''}`}>
                    <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <ul
                    className={styles.list}
                    role="listbox"
                    ref={listRef}
                    tabIndex={-1}
                >
                    {options.map((option, index) => {
                        const isSelected = option.value === selectedValue;
                        const isFocused = index === focusedIndex;
                        const optionClasses = [
                            styles.option,
                            isSelected ? styles.selected : '',
                            isFocused ? styles.focused : '',
                            option.disabled ? styles.optionDisabled : '',
                        ]
                            .filter(Boolean)
                            .join(' ');

                        return (
                            <li
                                key={option.value}
                                className={optionClasses}
                                role="option"
                                aria-selected={isSelected}
                                aria-disabled={option.disabled}
                                onClick={() => !option.disabled && handleSelect(option.value)}
                                onMouseEnter={() => !option.disabled && setFocusedIndex(index)}
                            >
                                {option.icon && (
                                    <span className={styles.optionIcon}>{option.icon}</span>
                                )}
                                <span>{option.label}</span>
                                {isSelected && (
                                    <span className={styles.checkmark}>
                                        <svg
                                            width="16"
                                            height="16"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}

            {error && <p className={styles.errorText}>{error}</p>}
        </div>
    );
};