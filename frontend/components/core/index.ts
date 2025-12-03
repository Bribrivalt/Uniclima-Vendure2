/**
 * Core Components - Uniclima Design System
 *
 * Este archivo exporta todos los componentes core del sistema de diseño.
 * Cada componente incluye sus tipos TypeScript correspondientes.
 */

// ============================================
// COMPONENTES DE FORMULARIO
// ============================================

export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

export { Radio, RadioGroup } from './Radio';
export type { RadioProps, RadioGroupProps } from './Radio';

export { Dropdown } from './Dropdown';
export type { DropdownProps, DropdownOption } from './Dropdown';

// ============================================
// COMPONENTES DE VISUALIZACIÓN
// ============================================

export { Card } from './Card';
export type { CardProps } from './Card';

export { Badge, BadgeGroup } from './Badge';
export type { BadgeProps, BadgeGroupProps } from './Badge';

export { Avatar, AvatarGroup } from './Avatar';
export type { AvatarProps, AvatarGroupProps } from './Avatar';

export { Rating } from './Rating';
export type { RatingProps } from './Rating';

export { Skeleton, SkeletonCard, SkeletonAvatar, SkeletonButton } from './Skeleton';
export type { SkeletonProps } from './Skeleton';

// ============================================
// COMPONENTES DE FEEDBACK
// ============================================

export { Alert } from './Alert';
export type { AlertProps } from './Alert';

export { Modal } from './Modal';
export type { ModalProps } from './Modal';

export { Tooltip } from './Tooltip';
export type { TooltipProps } from './Tooltip';

// ============================================
// COMPONENTES DE NAVEGACIÓN
// ============================================

export { Tabs } from './Tabs';
export type { TabsProps, Tab } from './Tabs';

export { Breadcrumb, generateBreadcrumbJsonLd } from './Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItem } from './Breadcrumb';

export { Accordion, AccordionItem } from './Accordion';
export type { AccordionProps, AccordionItemProps } from './Accordion';

// ============================================
// COMPONENTES DE CONSENTIMIENTO Y PRIVACIDAD
// ============================================

export { CookieBanner } from './CookieBanner';
export type { CookieBannerProps, CookiePreferences } from './CookieBanner';
