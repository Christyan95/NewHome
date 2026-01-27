"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, CheckCircle2, HeartHandshake, Loader2, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/data";
import { generatePix } from "@/lib/pix";
import QRCode from 'qrcode';
import Image from "next/image";

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
    quotaValue: number;
    onSuccess: () => void;
}

export function CheckoutModal({ isOpen, onClose, product, quotaValue, onSuccess }: CheckoutModalProps) {
    const [step, setStep] = useState<"details" | "payment">("details");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [pixKey, setPixKey] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState("");

    // Generate PIX when entering payment step
    useEffect(() => {
        if (isOpen && step === 'payment') {
            // Generating a standard Static PIX QR Code.
            // Using '***' as transactionId (handled by default in lib) ensures 
            // it is treated as a simple transfer, avoiding "billing" flows.
            const code = generatePix({
                key: 'chrisaraujo124@gmail.com',
                name: 'Christyan Vivian',
                city: 'UBERABA',
                value: quotaValue,
                transactionId: '***'
            });
            setPixKey(code);

            QRCode.toDataURL(code, {
                width: 400,
                margin: 2,
                color: {
                    dark: '#0f172a',
                    light: '#ffffff',
                },
                errorCorrectionLevel: 'M' // Better error correction
            }).then(url => {
                setQrCodeUrl(url);
            });
        }
    }, [isOpen, step, quotaValue, product.id]);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setStep("details");
            setName("");
            setLoading(false);
        }
    }, [isOpen]);

    const handleCopyPix = () => {
        navigator.clipboard.writeText(pixKey);
        toast.success("Chave PIX copiada!", {
            description: "Cole no seu app de banco para pagar."
        });
    };

    const handleConfirm = async () => {
        if (!name.trim()) {
            toast.error("Por favor, digite seu nome.");
            return;
        }

        setLoading(true);

        try {
            // 1. Registrar a contribuição
            const { error: contribError } = await supabase
                .from('myhome_contributions')
                .insert([{
                    product_id: product.id,
                    giver_name: name,
                    amount_paid: quotaValue,
                    quotas_count: 1,
                    status: 'confirmed'
                }]);

            if (contribError) throw contribError;

            // 2. Atualizar o produto
            const { error: productError } = await supabase.rpc('increment_quota', {
                product_id: product.id
            });

            if (productError) {
                // Fallback
                const { error: updateError } = await supabase
                    .from('myhome_products')
                    .update({ sold_quotas: product.soldQuotas + 1 })
                    .eq('id', product.id);

                if (updateError) throw updateError;
            }

            // Sucesso!
            handleSuccess();

        } catch (error) {
            console.error(error);
            toast.error("Erro ao registrar presente. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = () => {
        onClose();
        onSuccess();

        const duration = 3 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#10b981', '#34d399', '#fbbf24']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#10b981', '#34d399', '#fbbf24']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();

        toast.success("Presente confirmado!", {
            description: `Obrigado pelo carinho, ${name}! ❤️`,
            duration: 5000,
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-md rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] absolute bottom-0 md:relative md:bottom-auto"
                        >
                            {/* Header Visual */}
                            <div className="pt-8 px-6 text-center relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm ring-1 ring-emerald-50">
                                    <Gift className="w-8 h-8 text-emerald-600" />
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                                    {step === 'details' ? 'Que alegria!' : 'Quase lá!'}
                                </h3>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto">
                                    {step === 'details'
                                        ? <>Você escolheu presentear com uma cota de <span className="font-bold text-emerald-600">{product.name}</span>.</>
                                        : "Escaneie o QR Code ou copie a chave para finalizar."
                                    }
                                </p>
                            </div>

                            {/* Body */}
                            <div className="p-6 md:p-8 overflow-y-auto">
                                <div className="flex flex-col gap-6">

                                    {/* Value Box */}
                                    <div className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100">
                                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Valor do Presente</p>
                                        <p className="text-3xl font-bold text-slate-900">
                                            R$ {quotaValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>

                                    {step === "details" ? (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1.5 text-left">Como podemos te chamar?</label>
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Digite seu nome para o cartão"
                                                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 bg-white shadow-sm"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            {/* Real QR Code */}
                                            <div className="flex justify-center">
                                                <div className="p-4 bg-white border-2 border-slate-100 rounded-xl shadow-sm">
                                                    {qrCodeUrl ? (
                                                        <Image
                                                            src={qrCodeUrl}
                                                            alt="QR Code PIX"
                                                            width={160}
                                                            height={160}
                                                            className="w-40 h-40 mix-blend-multiply"
                                                        />
                                                    ) : (
                                                        <div className="w-40 h-40 flex items-center justify-center bg-slate-50">
                                                            <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <div className="relative group">
                                                    <div className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-500 break-all pr-12 min-h-[3rem] flex items-center">
                                                        {pixKey || "Gerando PIX..."}
                                                    </div>
                                                    <button
                                                        onClick={handleCopyPix}
                                                        className="absolute top-1/2 -translate-y-1/2 right-2 p-2 bg-white shadow-sm border border-slate-200 rounded-lg hover:border-emerald-500 hover:text-emerald-600 transition-all"
                                                        title="Copiar Chave"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-[10px] text-center text-slate-400 uppercase tracking-wide font-medium">PIX Copia e Cola</p>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-6 md:p-8 border-t border-slate-50 bg-white">
                                {step === "details" ? (
                                    <button
                                        onClick={() => setStep("payment")}
                                        disabled={!name.trim()}
                                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-200 disabled:cursor-not-allowed text-white font-bold text-lg rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                                    >
                                        Continuar
                                        <CheckCircle2 className="w-5 h-5 opacity-50" />
                                    </button>
                                ) : (
                                    <div className="space-y-3">
                                        <button
                                            onClick={handleConfirm}
                                            disabled={loading}
                                            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-200 text-white font-bold text-lg rounded-2xl transition-all shadow-lg shadow-emerald-500/20 active:scale-[0.98] flex items-center justify-center gap-2"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                            Já fiz o PIX, confirmar!
                                        </button>
                                        <button
                                            onClick={() => setStep("details")}
                                            className="w-full py-3 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
                                        >
                                            Voltar e corrigir nome
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
