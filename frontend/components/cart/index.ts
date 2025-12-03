/**
 * Barrel export para componentes del carrito
 *
 * Este archivo centraliza todas las exportaciones de los componentes
 * relacionados con el carrito de compras.
 */

// Componentes existentes
export { CartItem } from './CartItem';
export { CartSummary } from './CartSummary';

// Nuevos componentes - Lista 2.4
export { CartDrawer } from './CartDrawer';
export { CartEmpty } from './CartEmpty';
export { MiniCart } from './MiniCart';

// Tipos existentes
export type { CartItemProps, OrderLine } from './CartItem';
export type { CartSummaryProps } from './CartSummary';

// Tipos nuevos - Lista 2.4
export type { CartDrawerProps } from './CartDrawer';
export type { CartEmptyProps } from './CartEmpty';
export type { MiniCartProps } from './MiniCart';
