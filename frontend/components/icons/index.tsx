import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    strokeWidth?: number;
}

const defaultProps = {
    size: 24,
    strokeWidth: 1.5,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};

export const CartIcon: React.FC<IconProps> = ({ size = 24, strokeWidth = 1.5, ...props }) => (
    <svg
        {...defaultProps}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        {...props}
    >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
        <path d="M3 6h18" />
        <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ size = 24, strokeWidth = 1.5, ...props }) => (
    <svg
        {...defaultProps}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        {...props}
    >
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

export const SearchIcon: React.FC<IconProps> = ({ size = 24, strokeWidth = 1.5, ...props }) => (
    <svg
        {...defaultProps}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        {...props}
    >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

export const UserIcon: React.FC<IconProps> = ({ size = 24, strokeWidth = 1.5, ...props }) => (
    <svg
        {...defaultProps}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        {...props}
    >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

export const CategoryIcon: React.FC<IconProps> = ({ size = 24, strokeWidth = 1.5, ...props }) => (
    <svg
        {...defaultProps}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        {...props}
    >
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
);

export const BadgeIcon: React.FC<IconProps> = ({ size = 24, strokeWidth = 1.5, ...props }) => (
    <svg
        {...defaultProps}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        {...props}
    >
        <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.78 4.78 4 4 0 0 1-6.74 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

export const StockIcon: React.FC<IconProps> = ({ size = 24, strokeWidth = 1.5, ...props }) => (
    <svg
        {...defaultProps}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        {...props}
    >
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

export const CloseIcon: React.FC<IconProps> = ({ size = 24, strokeWidth = 1.5, ...props }) => (
    <svg
        {...defaultProps}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        {...props}
    >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ size = 24, strokeWidth = 1.5, ...props }) => (
    <svg
        {...defaultProps}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        {...props}
    >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
    </svg>
);

export const MinusIcon: React.FC<IconProps> = ({ size = 24, strokeWidth = 1.5, ...props }) => (
    <svg
        {...defaultProps}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        {...props}
    >
        <path d="M5 12h14" />
    </svg>
);

export const MenuIcon: React.FC<IconProps> = ({ size = 24, strokeWidth = 1.5, ...props }) => (
    <svg
        {...defaultProps}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        {...props}
    >
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 24, strokeWidth = 1.5, ...props }) => (
    <svg
        {...defaultProps}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        {...props}
    >
        <path d="M6 9l6 6 6-6" />
    </svg>
);

export const PackageIcon: React.FC<IconProps> = ({ size = 24, strokeWidth = 1.5, ...props }) => (
    <svg
        {...defaultProps}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        {...props}
    >
        <path d="M16.5 9.4 7.5 4.21" />
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
);

export const LogoutIcon: React.FC<IconProps> = ({ size = 24, strokeWidth = 1.5, ...props }) => (
    <svg
        {...defaultProps}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        {...props}
    >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
);

export const HeartIcon: React.FC<IconProps & { filled?: boolean }> = ({ size = 24, strokeWidth = 1.5, filled, ...props }) => (
    <svg
        {...defaultProps}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        fill={filled ? "currentColor" : "none"}
        {...props}
    >
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ size = 24, strokeWidth = 1.5, ...props }) => (
    <svg
        {...defaultProps}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        {...props}
    >
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size = 24, strokeWidth = 1.5, ...props }) => (
    <svg
        {...defaultProps}
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        {...props}
    >
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
