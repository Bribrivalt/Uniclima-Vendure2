/**
 * Barrel export para componentes de producto
 *
 * Este archivo centraliza todas las exportaciones de los componentes
 * relacionados con la visualización y gestión de productos.
 */

// Componentes existentes
export { ProductButton } from './ProductButton';
export { ProductCard } from './ProductCard';
export { QuoteModal } from './QuoteModal';
export { ProductSearch } from './ProductSearch';
export { ProductSort } from './ProductSort';
export { ProductPagination } from './ProductPagination';

// Nuevos componentes - Lista 2.3
export { ProductGrid } from './ProductGrid';
export { ProductFilters } from './ProductFilters';
export { ProductGallery } from './ProductGallery';
export { ProductTabs } from './ProductTabs';
export { ProductSpecs, ProductSpecsCompact } from './ProductSpecs';
export { RelatedProducts, RelatedProductsSkeleton } from './RelatedProducts';
export { MobileFilterDrawer } from './MobileFilterDrawer';
export { RecentlyViewed, RecentlyViewedSkeleton } from './RecentlyViewed';

// Comparador de productos
export {
    CompareButton,
    CompareBadge,
    CompareFloatingButton
} from './CompareButton';

// Tipos existentes
export type { ProductButtonProps } from './ProductButton';
export type { ProductCardProps } from './ProductCard';
export type { QuoteModalProps } from './QuoteModal';
export type { ProductSearchProps } from './ProductSearch';
export type { ProductSortProps, SortOption } from './ProductSort';
export type { ProductPaginationProps } from './ProductPagination';

// Tipos nuevos - Lista 2.3
export type { ProductGridProps } from './ProductGrid';
export type {
    ProductFiltersProps,
    FilterGroup,
    FilterOption,
    ActiveFilters
} from './ProductFilters';
export type { ProductGalleryProps, GalleryImage } from './ProductGallery';
export type {
    ProductTabsProps,
    ProductSpec,
    ProductDocument,
    ProductReview
} from './ProductTabs';
export type {
    ProductSpecsProps,
    Spec,
    SpecGroup,
    ProductSpecsCompactProps
} from './ProductSpecs';
export type { RelatedProductsProps } from './RelatedProducts';
export type {
    MobileFilterDrawerProps,
    FilterOption as MobileFilterOption,
    FilterGroup as MobileFilterGroup
} from './MobileFilterDrawer';
export type { RecentlyViewedProduct } from '@/lib/hooks/useRecentlyViewed';
