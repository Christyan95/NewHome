"use client";

import { MousePointerClick, QrCode, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function StepsSection() {
    return (
        <section className="max-w-5xl mx-auto mt-20 md:mt-24 bg-white p-10 md:p-14 rounded-[3rem] shadow-2xl shadow-blue-900/5 border border-white relative overflow-hidden">
            <h3 className="text-2xl md:text-3xl font-black text-center text-blue-950 mb-14 tracking-tighter">Como presentear? É muito simples!</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    className="flex flex-col items-center group"
                >
                    <div className="bg-blue-50 text-blue-950 rounded-3xl p-7 group-hover:bg-blue-950 group-hover:text-white transition-all duration-500">
                        <MousePointerClick className="w-10 h-10" />
                    </div>
                    <h4 className="font-black text-xl text-blue-950 mt-6 mb-3">1. Escolha</h4>
                    <p className="text-blue-900/50 leading-relaxed font-medium text-sm">Navegue pela nossa lista e escolha o item que deseja nos agraciar.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col items-center group"
                >
                    <div className="bg-blue-50 text-blue-950 rounded-3xl p-7 group-hover:bg-blue-950 group-hover:text-white transition-all duration-500">
                        <QrCode className="w-10 h-10" />
                    </div>
                    <h4 className="font-black text-xl text-blue-950 mt-6 mb-3">2. Faça o PIX</h4>
                    <p className="text-blue-900/50 leading-relaxed font-medium text-sm">O presente é o valor simbólico do item, enviado via QR Code.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center group"
                >
                    <div className="bg-blue-50 text-blue-950 rounded-3xl p-7 group-hover:bg-blue-950 group-hover:text-white transition-all duration-500">
                        <CheckCheck className="w-10 h-10" />
                    </div>
                    <h4 className="font-black text-xl text-blue-950 mt-6 mb-3">3. Confirme</h4>
                    <p className="text-blue-900/50 leading-relaxed font-medium text-sm">Após o pagamento, confirme no site para que possamos agradecer!</p>
                </motion.div>
            </div>
        </section>
    );
}
