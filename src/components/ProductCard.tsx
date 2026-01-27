"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Check, Gift } from 'lucide-react';
import { useState } from 'react';
import { CheckoutModal } from './CheckoutModal';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Safety check for empty or invalid product data
    if (!product || !product.totalQuotas) return null;

    const totalQuotas = Math.max(1, product.totalQuotas);
    const quotaValue = product.totalValue / totalQuotas;
    const progress = Math.min(100, Math.max(0, (product.soldQuotas / totalQuotas) * 100));

    return (
        <>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                layout
                className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-emerald-900/5 hover:border-emerald-100/50 transition-all duration-300 group flex flex-col h-full"
            >
                {/* Image & Header */}
                <div className="flex flex-col gap-4 mb-4">
                    <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-stone-50 group-hover:bg-white transition-colors">
                        <Image
                            src={product.image || `https://placehold.co/400x400/f8fafc/cbd5e1?text=${encodeURIComponent(product.name)}`}
                            alt={product.name}
                            fill
                            className="object-contain p-6 group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        {/* Status Badge */}
                        {product.soldQuotas === product.totalQuotas && (
                            <div className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                                ESGOTADO
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="font-bold text-lg text-slate-900 leading-tight group-hover:text-emerald-700 transition-colors">
                            {product.name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">{product.category}</p>
                    </div>
                </div>

                {/* Progress Section */}
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-end text-sm">
                        <span className={cn("font-medium transition-colors", progress === 100 ? "text-emerald-600" : "text-slate-600")}>
                            {product.soldQuotas} de {product.totalQuotas} cotas
                        </span>
                        <span className="font-bold text-slate-900 bg-slate-50 px-2 py-1 rounded-lg text-xs">
                            R$ {product.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                    </div>

                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-100">
                        <motion.div
                            className="h-full bg-emerald-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* Quotas Grid */}
                <div className="space-y-3 mt-auto">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Gift className="w-3 h-3" />
                        Presentear com uma cota
                    </p>

                    <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: product.totalQuotas }).map((_, index) => {
                            const isSold = index < product.soldQuotas;
                            return (
                                <button
                                    key={index}
                                    disabled={isSold}
                                    onClick={() => !isSold && setIsModalOpen(true)}
                                    className={cn(
                                        "relative py-2.5 px-1 text-[11px] font-bold rounded-xl transition-all border overflow-hidden",
                                        isSold
                                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/10 cursor-default"
                                            : "bg-white text-slate-500 border-slate-200 hover:border-emerald-500 hover:text-emerald-600 hover:shadow-md hover:shadow-emerald-500/10 active:scale-95"
                                    )}
                                >
                                    {isSold ? (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="flex items-center justify-center"
                                        >
                                            <Check className="w-4 h-4" />
                                        </motion.div>
                                    ) : (
                                        `R$ ${quotaValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </motion.div>

            <CheckoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={product}
                quotaValue={quotaValue}
                onSuccess={() => {
                    // Force refresh logic could go here or rely on Optimistic updates
                    window.location.reload(); // Simple refresh for now to see updates
                }}
            />
        </>
    );
}
