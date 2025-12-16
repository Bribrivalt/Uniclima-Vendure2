/**
 * SubcategoryGrid Component
 * Muestra una rejilla de tarjetas visuales para navegar por subcategorías.
 */
import Link from 'next/link';
import {
    CpuIcon,
    WindIcon,
    ActivityIcon,
    DropletIcon,
    DiscIcon,
    CategoryIcon
} from '@/components/icons';
import styles from './SubcategoryGrid.module.css';

interface Subcategory {
    slug: string;
    name: string;
    icon?: string;
}

interface SubcategoryGridProps {
    subcategories: Subcategory[];
    basePath?: string;
}

const getIcon = (iconName: string = 'default') => {
    switch (iconName) {
        case 'cpu': return <CpuIcon size={32} />;
        case 'wind': return <WindIcon size={32} />;
        case 'activity': return <ActivityIcon size={32} />;
        case 'droplet': return <DropletIcon size={32} />;
        case 'disc': return <DiscIcon size={32} />;
        default: return <CategoryIcon size={32} />;
    }
};

export const SubcategoryGrid = ({ subcategories, basePath = '/productos' }: SubcategoryGridProps) => {
    if (!subcategories || subcategories.length === 0) return null;

    return (
        <div className={styles.grid}>
            {subcategories.map((sub) => (
                <Link
                    key={sub.slug}
                    href={`${basePath}?collection=${sub.slug}`}
                    className={styles.card}
                >
                    <div className={styles.icon}>
                        {getIcon(sub.icon)}
                    </div>
                    <span className={styles.name}>{sub.name}</span>
                </Link>
            ))}
        </div>
    );
};
