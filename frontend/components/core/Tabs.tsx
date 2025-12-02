'use client';

import React, { useState, useCallback } from 'react';
import styles from './Tabs.module.css';

export interface Tab {
    id: string;
    label: string;
    content: React.ReactNode;
    disabled?: boolean;
    icon?: React.ReactNode;
}

export interface TabsProps {
    tabs: Tab[];
    defaultActiveTab?: string;
    activeTab?: string;
    onTabChange?: (tabId: string) => void;
    variant?: 'default' | 'pills' | 'underline';
    fullWidth?: boolean;
    className?: string;
}

/**
 * Tabs - Componente de pestañas
 * 
 * @param tabs - Array de objetos Tab
 * @param defaultActiveTab - Tab activa por defecto (no controlado)
 * @param activeTab - Tab activa (controlado)
 * @param onTabChange - Callback cuando cambia la tab activa
 * @param variant - Variante visual (default, pills, underline)
 * @param fullWidth - Si las tabs ocupan todo el ancho
 * @param className - Clases CSS adicionales
 */
export const Tabs: React.FC<TabsProps> = ({
    tabs,
    defaultActiveTab,
    activeTab: controlledActiveTab,
    onTabChange,
    variant = 'default',
    fullWidth = false,
    className = '',
}) => {
    // Estado interno para modo no controlado
    const [internalActiveTab, setInternalActiveTab] = useState(
        defaultActiveTab || tabs[0]?.id || ''
    );

    // Determinar si es controlado o no
    const isControlled = controlledActiveTab !== undefined;
    const activeTab = isControlled ? controlledActiveTab : internalActiveTab;

    // Cambiar tab
    const handleTabClick = useCallback(
        (tabId: string) => {
            if (!isControlled) {
                setInternalActiveTab(tabId);
            }
            onTabChange?.(tabId);
        },
        [isControlled, onTabChange]
    );

    // Manejo de teclado para accesibilidad
    const handleKeyDown = (event: React.KeyboardEvent, currentIndex: number) => {
        const enabledTabs = tabs.filter((tab) => !tab.disabled);
        const currentEnabledIndex = enabledTabs.findIndex(
            (tab) => tab.id === tabs[currentIndex].id
        );

        let newIndex = currentEnabledIndex;

        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                newIndex = currentEnabledIndex > 0
                    ? currentEnabledIndex - 1
                    : enabledTabs.length - 1;
                break;
            case 'ArrowRight':
                event.preventDefault();
                newIndex = currentEnabledIndex < enabledTabs.length - 1
                    ? currentEnabledIndex + 1
                    : 0;
                break;
            case 'Home':
                event.preventDefault();
                newIndex = 0;
                break;
            case 'End':
                event.preventDefault();
                newIndex = enabledTabs.length - 1;
                break;
            default:
                return;
        }

        const newTabId = enabledTabs[newIndex]?.id;
        if (newTabId) {
            handleTabClick(newTabId);
        }
    };

    const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

    const containerClasses = [
        styles.container,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const tabListClasses = [
        styles.tabList,
        styles[variant],
        fullWidth ? styles.fullWidth : '',
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={containerClasses}>
            {/* Tab List */}
            <div
                className={tabListClasses}
                role="tablist"
                aria-orientation="horizontal"
            >
                {tabs.map((tab, index) => {
                    const isActive = tab.id === activeTab;
                    const tabClasses = [
                        styles.tab,
                        isActive ? styles.active : '',
                        tab.disabled ? styles.disabled : '',
                    ]
                        .filter(Boolean)
                        .join(' ');

                    return (
                        <button
                            key={tab.id}
                            id={`tab-${tab.id}`}
                            className={tabClasses}
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`tabpanel-${tab.id}`}
                            aria-disabled={tab.disabled}
                            tabIndex={isActive ? 0 : -1}
                            onClick={() => !tab.disabled && handleTabClick(tab.id)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            disabled={tab.disabled}
                        >
                            {tab.icon && (
                                <span className={styles.icon}>{tab.icon}</span>
                            )}
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Panels */}
            {tabs.map((tab) => (
                <div
                    key={tab.id}
                    id={`tabpanel-${tab.id}`}
                    className={styles.tabPanel}
                    role="tabpanel"
                    aria-labelledby={`tab-${tab.id}`}
                    hidden={tab.id !== activeTab}
                    tabIndex={0}
                >
                    {tab.id === activeTab && activeTabContent}
                </div>
            ))}
        </div>
    );
};