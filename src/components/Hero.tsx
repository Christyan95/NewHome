"use client";

import { motion } from 'framer-motion';

import Image from 'next/image';

export function Hero() {
    return (
        <header className="relative w-full min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden">
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/hero-creative.png"
                    alt="Nossa Primeira Casa"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Refined Modern Glass Overlay: Subtle darkening + gradient */}
                <div className="absolute inset-0 bg-blue-950/20 z-[1]" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/90 backdrop-blur-[1px] z-[2]" />
            </div>
            
            <div className="container mx-auto max-w-5xl px-6 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-3 mb-8 px-5 py-2 bg-white/20 rounded-full border border-white/30 backdrop-blur-xl"
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-900">
                        Nossa Nova Jornada
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl md:text-7xl font-black text-blue-950 tracking-tighter mb-6 leading-none drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)]"
                >
                    Christyan & Vivian
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg md:text-2xl text-blue-950/70 font-bold max-w-2xl mx-auto mb-12 leading-relaxed tracking-tight drop-shadow-[0_1px_5px_rgba(255,255,255,0.5)]"
                >
                    Celebrando o início do nosso primeiro lar com as pessoas que mais amamos.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="inline-flex flex-col md:flex-row items-center gap-8 md:gap-16 bg-white/40 backdrop-blur-xl p-8 md:p-10 rounded-[3rem] shadow-2xl shadow-blue-950/5 border border-white/50"
                >
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Data do Chá</span>
                        <span className="text-2xl font-black text-black">16 MAIO 2026</span>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-blue-100" />
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Local</span>
                        <span className="text-2xl font-black text-black">Uberaba, MG</span>
                    </div>
                </motion.div>
            </div>
        </header>
    );
}
