"use client";

import { MousePointerClick, QrCode, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export function StepsSection() {
    return (
        <section className="max-w-4xl mx-auto mt-12 md:mt-16 bg-white p-8 rounded-2xl shadow-md border border-slate-200">
            <h3 className="text-2xl font-bold text-center text-slate-800 mb-6">Como nos presentear? É muito fácil!</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center"
                >
                    <div className="bg-emerald-100 text-emerald-600 rounded-full p-4">
                        <MousePointerClick className="w-8 h-8" />
                    </div>
                    <h4 className="font-semibold mt-4 mb-1">1. Escolha um item</h4>
                    <p className="text-sm">Navegue pela nossa lista e escolha o presente que mais tocar seu coração.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col items-center"
                >
                    <div className="bg-emerald-100 text-emerald-600 rounded-full p-4">
                        <QrCode className="w-8 h-8" />
                    </div>
                    <h4 className="font-semibold mt-4 mb-1">2. Pague com PIX</h4>
                    <p className="text-sm">Você receberá o valor e nossa chave PIX. O presente é o valor em dinheiro para comprarmos o item.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col items-center"
                >
                    <div className="bg-emerald-100 text-emerald-600 rounded-full p-4">
                        <CheckCheck className="w-8 h-8" />
                    </div>
                    <h4 className="font-semibold mt-4 mb-1">3. Confirme e celebre!</h4>
                    <p className="text-sm">Após o PIX, clique em 'Confirmei!' para dar baixa no item. E pronto! Agradecemos seu carinho.</p>
                </motion.div>
            </div>
        </section>
    );
}
