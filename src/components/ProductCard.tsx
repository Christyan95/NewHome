"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/lib/data';
import { Gift } from 'lucide-react';
import { useState } from 'react';
import { CheckoutModal } from './CheckoutModal';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!product || !product.totalQuotas) return null;

    const totalQuotas = Math.max(1, product.totalQuotas);
    const quotaValue = product.totalValue / totalQuotas;
    const progress = Math.min(100, Math.max(0, (product.soldQuotas / totalQuotas) * 100));
    const isCompleted = product.soldQuotas >= totalQuotas;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl md:rounded-[2.5rem] p-3 md:p-6 shadow-xl shadow-blue-900/5 border border-white hover:border-blue-100 transition-all duration-500 group flex flex-col h-full relative"
            >
                {/* Image */}
                <div className="relative w-full aspect-square rounded-xl md:rounded-3xl overflow-hidden bg-blue-50/30 mb-3 md:mb-6">
                    <Image
                        src={product.image || `https://placehold.co/400x400/eff6ff/172554?text=${encodeURIComponent(product.name)}`}
                        alt={product.name}
                        fill
                        className="object-contain p-4 md:p-8 group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    {isCompleted && (
                        <div className="absolute inset-0 bg-blue-950/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                            <span className="bg-white text-blue-950 text-[8px] md:text-[10px] font-black px-2 md:px-4 py-1 md:py-2 rounded-full shadow-2xl tracking-widest uppercase">
                                CONCLUÍDO
                            </span>
                        </div>
                    )}
                </div>
                
                {/* Content */}
                <div className="flex flex-col flex-1 px-1">
                    <div className="mb-3 md:mb-6">
                        <span className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 md:mb-2 block">{product.category}</span>
                        <h3 className="text-sm md:text-xl font-black text-black leading-tight tracking-tight group-hover:text-blue-950 transition-colors line-clamp-2">
                            {product.name}
                        </h3>
                    </div>

                    <div className="mt-auto space-y-3 md:space-y-6">
                        {/* Progress */}
                        <div className="space-y-2 md:space-y-3">
                            <div className="flex justify-between items-end">
                                <span className="text-[8px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest">Progresso</span>
                                <span className="text-[10px] md:text-sm font-black text-black">{progress.toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 md:h-2 w-full bg-blue-50 rounded-full overflow-hidden border border-blue-100/30">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${progress}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "circOut" }}
                                    className="h-full bg-blue-950 rounded-full"
                                />
                            </div>
                        </div>

                        {/* Price & Action */}
                        <div className="flex flex-col gap-3 pt-3 md:pt-6 border-t border-blue-50/50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Cota</p>
                                    <p className="text-sm md:text-lg font-black text-black">R$ {quotaValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</p>
                                </div>
                                <Gift className="w-4 h-4 text-blue-900/20 md:hidden" />
                            </div>
                            
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsModalOpen(true)}
                                disabled={isCompleted}
                                className={`w-full py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[8px] md:text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                                    isCompleted 
                                    ? 'bg-blue-50 text-blue-200 cursor-not-allowed' 
                                    : 'bg-blue-950 text-white hover:bg-black shadow-lg shadow-blue-950/10'
                                }`}
                            >
                                <Gift className="w-3 h-3 md:w-4 md:h-4" />
                                {isCompleted ? 'Esgotado' : 'Presentear'}
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.div>

            <CheckoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={product}
                quotaValue={quotaValue}
                onSuccess={() => {
                    // Real-time handles the update
                }}
            />
        </>
    );
}
