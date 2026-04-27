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
        if (!name.trim()) {
            toast.error("Por favor, digite seu nome.");
            return;
        }

        setLoading(true);

        try {
            // 1. Registrar a contribuição
            const isCustom = product.id === 'custom-contribution';
            const { error: contribError } = await supabase
                .from('myhome_contributions')
                .insert([{
                    product_id: isCustom ? null : product.id,
                    giver_name: name,
                    amount_paid: quotaValue,
                    quotas_count: 1,
                    status: 'confirmed'
                }]);

            if (contribError) throw contribError;

            // 2. O banco de dados (Trigger) atualizará o produto automaticamente
            // após a inserção bem-sucedida na tabela 'myhome_contributions'.
            
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
                        className="fixed inset-0 bg-blue-950/40 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 30, stiffness: 400 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white w-full max-w-md rounded-t-[3rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] absolute bottom-0 md:relative md:bottom-auto border border-white"
                        >
                            {/* Header Visual */}
                            <div className="pt-10 px-6 text-center relative">
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 p-2 hover:bg-blue-50 rounded-full transition-colors text-blue-300 hover:text-blue-950"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-blue-100 shadow-sm">
                                    <Gift className="w-10 h-10 text-blue-950" />
                                </div>

                                <h3 className="text-2xl font-black text-blue-950 mb-2 tracking-tighter">
                                    {step === 'details' ? 'Que alegria!' : 'Quase lá!'}
                                </h3>
                                <p className="text-blue-900/40 text-xs font-medium max-w-[240px] mx-auto">
                                    {step === 'details'
                                        ? <>Você escolheu presentear com <span className="font-black text-blue-950">{product.name}</span>.</>
                                        : "Escaneie o QR Code ou copie a chave para finalizar."
                                    }
                                </p>
                            </div>

                            {/* Body */}
                            <div className="p-8 md:p-10">
                                <div className="flex flex-col gap-8">

                                    {/* Value Box */}
                                    <div className="bg-blue-50 rounded-[2rem] py-8 text-center border border-blue-100 relative overflow-hidden group">
                                        <p className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em] mb-2">Valor do Presente</p>
                                        <p className="text-3xl font-black text-blue-950 tracking-tighter">
                                            R$ {quotaValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>

                                    {step === "details" ? (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            <div>
                                                <label className="block text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3 ml-1">Como podemos te chamar?</label>
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Digite seu nome para o cartão"
                                                    className="w-full px-6 py-5 rounded-2xl border-2 border-blue-50 focus:bg-white focus:border-blue-950 outline-none transition-all text-blue-950 font-bold placeholder:text-blue-200 bg-blue-50 shadow-sm"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            {/* Real QR Code */}
                                            <div className="flex justify-center">
                                                <div className="p-5 bg-white border-2 border-blue-50 rounded-[2.5rem] shadow-xl shadow-blue-900/5">
                                                    {qrCodeUrl ? (
                                                        <Image
                                                            src={qrCodeUrl}
                                                            alt="QR Code PIX"
                                                            width={180}
                                                            height={180}
                                                            className="w-44 h-44 mix-blend-multiply"
                                                        />
                                                    ) : (
                                                        <div className="w-44 h-44 flex items-center justify-center bg-blue-50">
                                                            <Loader2 className="w-10 h-10 animate-spin text-blue-200" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="relative group">
                                                    <div className="w-full px-6 py-4 bg-blue-50 border border-blue-100 rounded-2xl text-[10px] font-mono text-blue-400 break-all pr-14 min-h-[4rem] flex items-center leading-relaxed">
                                                        {pixKey || "Gerando PIX..."}
                                                    </div>
                                                    <button
                                                        onClick={handleCopyPix}
                                                        className="absolute top-1/2 -translate-y-1/2 right-3 p-3 bg-white shadow-xl border border-blue-100 rounded-xl hover:bg-blue-950 hover:text-white transition-all group/copy"
                                                        title="Copiar Chave"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <p className="text-[9px] text-center text-blue-400 uppercase tracking-[0.3em] font-black">PIX Copia e Cola</p>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-8 md:p-10 pt-0 bg-white">
                                {step === "details" ? (
                                    <button
                                        onClick={() => setStep("payment")}
                                        disabled={!name.trim()}
                                        className="w-full py-6 bg-blue-950 hover:bg-black disabled:bg-blue-100 disabled:cursor-not-allowed text-white font-black text-lg rounded-[2rem] transition-all shadow-2xl shadow-blue-950/10 flex items-center justify-center gap-3"
                                    >
                                        Continuar
                                        <ArrowRight className="w-6 h-6" />
                                    </button>
                                ) : (
                                    <div className="space-y-4">
                                        <button
                                            onClick={handleConfirm}
                                            disabled={loading}
                                            className="w-full py-6 bg-blue-950 hover:bg-black disabled:bg-blue-100 text-white font-black text-lg rounded-[2rem] transition-all shadow-2xl shadow-blue-950/10 flex items-center justify-center gap-3"
                                        >
                                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
                                            Confirmar PIX
                                        </button>
                                        <button
                                            onClick={() => setStep("details")}
                                            className="w-full py-2 text-blue-300 hover:text-blue-950 text-[10px] font-black uppercase tracking-widest transition-colors"
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
