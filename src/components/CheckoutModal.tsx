"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, CheckCircle2, HeartHandshake, Loader2, Gift, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/data";
import { generatePix } from "@/lib/pix";
import QRCode from 'qrcode';
import Image from "next/image";
import { z } from "zod";

// High-Security Schema Validation
const checkoutSchema = z.object({
    name: z.string()
        .min(2, "O nome deve ter pelo menos 2 caracteres.")
        .max(100, "O nome é muito longo.")
        .trim()
        .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "O nome deve conter apenas letras e espaços."),
    amount: z.number().positive().max(100000),
    productId: z.string().uuid().or(z.literal("custom-contribution")).optional()
});

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
                key: process.env.NEXT_PUBLIC_PIX_KEY || 'chrisaraujo124@gmail.com',
                name: process.env.NEXT_PUBLIC_PIX_NAME || 'Christyan Vivian',
                city: process.env.NEXT_PUBLIC_PIX_CITY || 'UBERABA',
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
        // Advanced Validation & Sanitization
        const validation = checkoutSchema.safeParse({
            name: name,
            amount: quotaValue,
            productId: product.id
        });

        if (!validation.success) {
            toast.error(validation.error.issues[0].message);
            return;
        }

        const cleanData = validation.data;
        setLoading(true);

        try {
            const isCustom = cleanData.productId === 'custom-contribution';
            const { error: contribError } = await supabase
                .from('myhome_contributions')
                .insert([{
                    product_id: isCustom ? null : cleanData.productId,
                    giver_name: cleanData.name,
                    amount_paid: cleanData.amount,
                    quotas_count: 1,
                    status: 'confirmed'
                }]);

            if (contribError) throw contribError;
            handleSuccess(cleanData.name);
        } catch (error) {
            console.error('[SECURITY ALERT] Database Insertion Failed:', error);
            toast.error("Erro ao registrar presente. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleSuccess = (validatedName: string) => {
        onClose();
        onSuccess();

        const duration = 3 * 1000;
        const end = Date.now() + duration;        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#0f172a', '#172554', '#3b82f6']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#0f172a', '#172554', '#3b82f6']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();

        toast.success("Presente confirmado!", {
            description: `Obrigado pelo carinho, ${validatedName}! ❤️`,
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
                        className="fixed inset-0 bg-blue-950/40 backdrop-blur-md z-50 flex items-end md:items-center justify-center p-0 md:p-6"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 30, stiffness: 400 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-md rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-[85vh] relative md:bottom-auto border border-white"
                        >
                            {/* Header Visual - Ultra Compact on Mobile */}
                            <div className="pt-6 md:pt-10 px-6 text-center relative shrink-0">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-6 p-2 hover:bg-blue-50 rounded-full transition-colors text-blue-300 hover:text-blue-950 z-20"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="w-12 h-12 md:w-20 md:h-20 bg-blue-50 rounded-[1.2rem] md:rounded-[2rem] flex items-center justify-center mx-auto mb-3 md:mb-6 border border-blue-100 shadow-sm">
                                    <Gift className="w-6 h-6 md:w-10 md:h-10 text-blue-950" />
                                </div>

                                <h3 className="text-lg md:text-2xl font-black text-blue-950 mb-0.5 md:mb-2 tracking-tighter">
                                    {step === 'details' ? 'Que alegria!' : 'Quase lá!'}
                                </h3>
                                <p className="text-blue-900/40 text-[9px] md:text-xs font-medium max-w-[240px] mx-auto line-clamp-1 md:line-clamp-none">
                                    {step === 'details'
                                        ? <>Você escolheu presentear com <span className="font-black text-blue-950">{product.name}</span>.</>
                                        : "Escaneie o QR Code ou copie a chave para finalizar."
                                    }
                                </p>
                            </div>

                            {/* Body - Optimized scroll area */}
                            <div className="p-5 md:p-10 overflow-y-auto custom-scrollbar flex-1">
                                <div className="flex flex-col gap-5 md:gap-8">

                                    {/* Value Box - More compact on mobile */}
                                    <div className="bg-blue-50 rounded-[1.2rem] md:rounded-[2rem] py-4 md:py-8 text-center border border-blue-100 relative overflow-hidden group">
                                        <p className="text-[8px] md:text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] mb-0.5 md:mb-2">Valor do Presente</p>
                                        <p className="text-xl md:text-3xl font-black text-blue-950 tracking-tighter">
                                            R$ {quotaValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>

                                    {step === "details" ? (
                                        <div className="space-y-4 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div>
                                                <label className="block text-[8px] md:text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1.5 md:mb-3 ml-1">Como podemos te chamar?</label>
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Digite seu nome"
                                                    className="w-full px-5 py-3.5 md:px-6 md:py-5 rounded-xl md:rounded-2xl border-2 border-blue-50 focus:bg-white focus:border-blue-950 outline-none transition-all text-blue-950 font-bold placeholder:text-blue-200 bg-blue-50 shadow-sm text-sm md:text-base"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-5 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            {/* Real QR Code - Scaled for mobile */}
                                            <div className="flex justify-center">
                                                <div className="p-3 md:p-5 bg-white border-2 border-blue-50 rounded-[1.5rem] md:rounded-[2.5rem] shadow-xl shadow-blue-900/5">
                                                    {qrCodeUrl ? (
                                                        <Image
                                                            src={qrCodeUrl}
                                                            alt="QR Code PIX"
                                                            width={140}
                                                            height={140}
                                                            className="w-28 h-28 md:w-44 md:h-44 mix-blend-multiply"
                                                        />
                                                    ) : (
                                                        <div className="w-28 h-28 md:w-44 md:h-44 flex items-center justify-center bg-blue-50">
                                                            <Loader2 className="w-6 h-6 md:w-10 md:h-10 animate-spin text-blue-200" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="relative group">
                                                    <div className="w-full px-4 py-3 md:px-6 md:py-4 bg-blue-50 border border-blue-100 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-mono text-blue-400 break-all pr-11 md:pr-14 min-h-[3rem] md:min-h-[4rem] flex items-center leading-relaxed">
                                                        {pixKey || "Gerando PIX..."}
                                                    </div>
                                                    <button
                                                        onClick={handleCopyPix}
                                                        className="absolute top-1/2 -translate-y-1/2 right-2 md:right-3 p-2 md:p-3 bg-white shadow-xl border border-blue-100 rounded-lg md:rounded-xl hover:bg-blue-950 hover:text-white transition-all group/copy"
                                                        title="Copiar Chave"
                                                    >
                                                        <Copy className="w-3.5 h-3.5 md:w-4 md:h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-[7px] md:text-[9px] text-center text-blue-400 uppercase tracking-[0.3em] font-black">PIX Copia e Cola</p>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>

                            {/* Footer Actions - Minimal Padding on Mobile */}
                            <div className="p-5 md:p-10 pt-0 pb-8 md:pb-10 bg-white shrink-0">
                                {step === "details" ? (
                                    <button
                                        onClick={() => setStep("payment")}
                                        disabled={!name.trim()}
                                        className="w-full py-4 md:py-6 bg-blue-950 hover:bg-black disabled:bg-blue-100 disabled:cursor-not-allowed text-white font-black text-sm md:text-lg rounded-xl md:rounded-[2rem] transition-all shadow-2xl shadow-blue-950/10 flex items-center justify-center gap-3"
                                    >
                                        Continuar
                                        <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
                                    </button>
                                ) : (
                                    <div className="space-y-2 md:space-y-4">
                                        <button
                                            onClick={handleConfirm}
                                            disabled={loading}
                                            className="w-full py-4 md:py-6 bg-blue-950 hover:bg-black disabled:bg-blue-100 text-white font-black text-sm md:text-lg rounded-xl md:rounded-[2rem] transition-all shadow-2xl shadow-blue-950/10 flex items-center justify-center gap-3"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" /> : <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />}
                                            Confirmar PIX
                                        </button>
                                        <button
                                            onClick={() => setStep("details")}
                                            className="w-full py-2 text-blue-300 hover:text-blue-950 text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-colors"
                                        >
                                            Voltar
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
