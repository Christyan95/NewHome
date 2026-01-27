"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/data';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductGrid() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const { data, error } = await supabase
                .from('myhome_products')
                .select('*')
                .order('name');

            if (error) throw error;
            if (data) {
                // Map Supabase fields to our Product interface if needed (case conversion)
                const mappedProducts: Product[] = data.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    category: p.category,
                    image: p.image,
                    totalValue: p.total_value,
                    totalQuotas: p.total_quotas,
                    soldQuotas: p.sold_quotas,
                    active: p.active
                }));
                setProducts(mappedProducts);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }

    const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = filter === 'all'
        ? products
        : products.filter(p => p.category === filter);

    return (
        <section id="products" className="mt-12 md:mt-16">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-8">Nossa Lista de Presentes</h2>

            <div className="flex flex-col items-center gap-8 mb-8">
                {loading ? (
                    <div className="flex items-center gap-2 text-slate-500 bg-white px-6 py-3 rounded-full shadow-sm border border-slate-100">
                        <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                        <span>Carregando presentes...</span>
                    </div>
                ) : (
                    <div className="flex flex-wrap justify-center gap-2" id="category-filters">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={cn(
                                    "px-4 py-2 text-sm font-semibold rounded-full transition-colors",
                                    filter === cat
                                        ? "bg-slate-800 text-white"
                                        : "bg-white text-slate-600 hover:bg-slate-200"
                                )}
                            >
                                {cat === 'all' ? 'Todos' : cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                id="gift-list"
            >
                <AnimatePresence mode='popLayout'>
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}
