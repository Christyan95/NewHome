"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Coins, Heart, ArrowRight } from "lucide-react";
import { CheckoutModal } from "./CheckoutModal";
import { Product } from "@/lib/data";

export function CustomContribution() {
    const [amount, setAmount] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        const value = parseFloat(amount);
        if (isNaN(value) || value <= 0) return;
        setIsModalOpen(true);
    };

    const customProduct: Product = {
        id: "custom-contribution",
        name: "Contribuição Livre",
        category: "Presente Especial",
        image: "",
        totalValue: parseFloat(amount) || 0,
        totalQuotas: 1,
        soldQuotas: 0,
        active: true
    };

    return (
        <section className="py-16 md:py-24">
            <div className="max-w-4xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-14 shadow-2xl shadow-blue-900/5 border border-white relative overflow-hidden"
                >
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                        <div className="flex-1 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-950 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-4 md:mb-6 border border-blue-100">
                                <Heart className="w-3 h-3 fill-blue-950" />
                                <span>Gesto de Carinho</span>
                            </div>
                            <h2 className="text-2xl md:text-5xl font-black text-blue-950 mb-4 md:mb-6 leading-none tracking-tighter">
                                Contribua com <br className="hidden md:block" /> quanto puder
                            </h2>
                            <p className="text-slate-500 text-sm md:text-lg font-medium leading-relaxed max-w-sm mx-auto md:mx-0">
                                Se preferir nos presentear com um valor personalizado, sinta-se à vontade.
                            </p>
                        </div>

                        <div className="w-full md:w-80 space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                                    <span className="text-slate-300 font-black text-lg md:text-xl">R$</span>
                                </div>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0,00"
                                    className="w-full pl-14 pr-6 py-4 md:pl-16 md:pr-6 md:py-6 bg-blue-50/30 border-2 border-blue-50 rounded-2xl md:rounded-[2rem] text-2xl md:text-3xl font-black text-black focus:bg-white focus:border-blue-950 outline-none transition-all placeholder:text-blue-100"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleOpenModal}
                                disabled={!amount || parseFloat(amount) <= 0}
                                className="w-full py-4 md:py-6 bg-blue-950 hover:bg-black disabled:bg-blue-100 text-white font-black text-base md:text-xl rounded-2xl md:rounded-[2rem] transition-all shadow-2xl shadow-blue-950/20 flex items-center justify-center gap-3"
                            >
                                <Coins className="w-5 h-5 md:w-6 md:h-6" />
                                Presentear
                                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <CheckoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={customProduct}
                quotaValue={customProduct.totalValue}
                onSuccess={() => {
                    setAmount("");
                    // We'll update the global state or refresh later
                }}
            />
        </section>
    );
}
