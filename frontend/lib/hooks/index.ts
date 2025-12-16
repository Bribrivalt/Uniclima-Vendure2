// Media query hooks
export {
    useMediaQuery,
    useBreakpoint,
    useIsMobile,
    useIsTablet,
    useIsDesktop,
    breakpoints,
} from './useMediaQuery';

// Accessibility hooks
export {
    useFocusTrap,
    useRestoreFocus,
    useEscapeKey,
} from './useFocusTrap';

// Storage hooks
export {
    useRecentlyViewed,
} from './useRecentlyViewed';
export type { RecentlyViewedProduct } from './useRecentlyViewed';

// Comparador de productos
export {
    useCompare,
} from './useCompare';
export type { CompareProduct } from './useCompare';

// Search history hooks
export {
    useSearchHistory,
} from './useSearchHistory';
export type { SearchHistoryItem, UseSearchHistoryReturn } from './useSearchHistory';