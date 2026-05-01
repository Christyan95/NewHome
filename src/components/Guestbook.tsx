"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserCircle2, Send, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { toast } from 'sonner';

const messageSchema = z.object({
    name: z.string()
        .min(2, "O nome deve ter pelo menos 2 caracteres.")
        .max(100, "O nome é muito longo.")
        .trim()
        .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "O nome deve conter apenas letras e espaços."),
    content: z.string()
        .min(1, "A mensagem não pode estar vazia.")
        .max(1000, "A mensagem é muito longa.")
        .trim()
});

interface Message {
    id: string;
    sender_name: string;
    content: string;
    created_at: string;
}

export function Guestbook() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    async function fetchMessages() {
        try {
            const { data, error } = await supabase
                .from('myhome_messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        
        // Advanced Validation & Sanitization
        const validation = messageSchema.safeParse({ name, content });

        if (!validation.success) {
            toast.error(validation.error.issues[0].message);
            return;
        }

        const cleanData = validation.data;
        setSubmitting(true);
        
        try {
            const { error } = await supabase
                .from('myhome_messages')
                .insert([{ sender_name: cleanData.name, content: cleanData.content }]);

            if (error) throw error;

            setName('');
            setContent('');
            toast.success("Recado enviado com sucesso! ✨");
            await fetchMessages(); // Refresh list
        } catch (error) {
            console.error('[SECURITY ALERT] Guestbook Submission Failed:', error);
            toast.error("Erro ao enviar mensagem. Tente novamente.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="py-20">
            <div className="container px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-black text-blue-950 mb-4 tracking-tighter">Mural de Recados</h2>
                    <p className="text-blue-900/60 mb-12 max-w-xl mx-auto text-lg font-medium">
                        Deixe uma mensagem especial para eternizar este momento conosco.
                    </p>
                </motion.div>

                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 text-left">
                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-[3rem] shadow-2xl shadow-blue-900/5 border border-white p-8 md:p-12 h-fit sticky top-24"
                    >
                        <div className="space-y-8">
                            <h3 className="font-black text-2xl text-blue-950 flex items-center gap-3">
                                <span className="w-1.5 h-8 bg-blue-950 rounded-full" />
                                Seu Recado
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Seu Nome</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Como prefere ser chamado?"
                                        className="w-full px-6 py-5 bg-blue-50/30 rounded-2xl border-2 border-blue-50/50 focus:bg-white focus:border-blue-950 outline-none transition-all placeholder:text-blue-100 text-black font-bold"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Sua Mensagem</label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={4}
                                        placeholder="Deseje algo especial..."
                                        className="w-full px-6 py-5 bg-blue-50/30 rounded-2xl border-2 border-blue-50/50 focus:bg-white focus:border-blue-950 outline-none transition-all resize-none placeholder:text-blue-100 text-black font-bold"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-blue-950 hover:bg-black disabled:bg-blue-100 text-white font-black py-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-950/10"
                                >
                                    {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-5 h-5" />}
                                    {submitting ? 'Enviando...' : 'Publicar no Mural'}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Message List */}
                    <div className="space-y-6">
                        <h3 className="font-black text-2xl text-blue-950 mb-8 px-2 flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-blue-200 rounded-full" />
                            Recados Recentes
                        </h3>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-300 gap-4">
                                <Loader2 className="w-10 h-10 animate-spin" />
                                <span className="font-black tracking-widest uppercase text-[10px]">Carregando o amor...</span>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center bg-white/50 rounded-[3rem] p-12 border-2 border-dashed border-blue-100">
                                <p className="text-slate-400 font-bold italic">Seja o primeiro a deixar um recado! ✨</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-20px" }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white p-8 rounded-[2.5rem] border border-white hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all group relative overflow-hidden"
                                    >
                                        <div className="flex gap-6 items-start">
                                            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-50 group-hover:bg-blue-950 group-hover:text-white transition-colors duration-500">
                                                <UserCircle2 className="w-8 h-8 text-slate-400 group-hover:text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-col items-start gap-1 mb-4">
                                                    <span className="font-black text-black text-lg tracking-tight">{msg.sender_name}</span>
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                                                        {format(new Date(msg.created_at), "d 'de' MMMM", { locale: ptBR })}
                                                    </span>
                                                </div>
                                                <p className="text-slate-500 text-sm leading-relaxed font-medium italic">
                                                    "{msg.content}"
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
