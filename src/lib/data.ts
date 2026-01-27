
export interface Product {
    id: string;
    created_at?: string;
    name: string;
    category: string;
    image: string;
    totalValue: number;
    totalQuotas: number;
    soldQuotas: number;
    active: boolean;
}

// Data is fetched from Supabase using 'myhome_products' table.
// See src/components/ProductGrid.tsx for fetch logic.
// Initial data seed available in seed.sql
