"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/data';
import { ProductCard } from './ProductCard';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function ProductGrid() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        fetchProducts();

        // Subscribe to real-time changes
        const channel = supabase
            .channel('products-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'myhome_products'
                },
                () => {
                    fetchProducts();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    async function fetchProducts() {
        try {
            const { data, error } = await supabase
                .from('myhome_products')
                .select('*')
                .order('name');

            if (error) throw error;
            if (data) {
                const mappedProducts: Product[] = data.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    category: p.category,
                    image: p.image,
                    totalValue: Number(p.total_value),
                    totalQuotas: Number(p.total_quotas),
                    soldQuotas: Number(p.sold_quotas),
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
        <section id="products" className="py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12"
            >
                <div className="text-left">
                    <h2 className="text-3xl font-black text-blue-950 mb-4 tracking-tighter leading-none">Lista de Presentes</h2>
                    <p className="text-slate-500 font-medium max-w-md">Escolha algo que combine com nossa nova casa. Ficaremos muito felizes!</p>
                </div>

                {!loading && (
                    <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={cn(
                                    "px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                    filter === cat
                                        ? "bg-blue-950 text-white shadow-lg shadow-blue-950/20"
                                        : "bg-white text-blue-900/40 hover:bg-blue-50 border border-blue-100"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 h-[300px] md:h-[450px] animate-pulse">
                            <div className="w-full aspect-square bg-slate-50 rounded-xl mb-4" />
                            <div className="h-4 bg-slate-50 rounded-lg w-3/4 mb-2" />
                            <div className="h-3 bg-slate-50 rounded-lg w-1/2 mb-6" />
                            <div className="space-y-2">
                                <div className="h-1.5 bg-slate-50 rounded-full w-full" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div
                    layout
                    className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8"
                    id="gift-list"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}
        </section>
    );
}
