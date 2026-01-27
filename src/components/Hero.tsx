"use client";

import { motion } from 'framer-motion';

export function Hero() {
    return (
        <header className="relative text-white shadow-lg overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2000&auto=format&fit=crop')",
                }}
            >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-20 md:py-32 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold tracking-tight"
                >
                    Christyan & Vivian
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4 text-xl md:text-2xl font-light"
                >
                    Nosso Chá de Casa Nova
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-8 bg-white/20 backdrop-blur-sm inline-block px-6 py-3 rounded-full"
                >
                    <p className="text-lg font-semibold">30 de Novembro de 2025</p>
                </motion.div>
            </div>
        </header>
    );
}
