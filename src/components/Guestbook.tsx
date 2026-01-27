"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserCircle2, Send, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

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
        if (!name.trim() || !content.trim()) return;

        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('myhome_messages')
                .insert([{ sender_name: name, content: content }]);

            if (error) throw error;

            setName('');
            setContent('');
            await fetchMessages(); // Refresh list
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Erro ao enviar mensagem. Tente novamente.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="py-20 bg-slate-50">
            <div className="container px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">Mural de Recados</h2>
                    <p className="text-slate-500 mb-12 max-w-xl mx-auto">
                        Deixe uma mensagem para eternizar este momento conosco.
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 text-left">
                    {/* Form Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8 h-fit sticky top-24"
                    >
                        <div className="space-y-6">
                            <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                                <span className="w-1 h-6 bg-emerald-500 rounded-full" />
                                Escreva sua mensagem
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Seu nome</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Como prefere ser chamado?"
                                        className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-400"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sua mensagem</label>
                                    <textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        rows={4}
                                        placeholder="Deseje algo especial para o casal..."
                                        className="w-full px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none placeholder:text-slate-400"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-slate-900 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-slate-900/10 hover:shadow-emerald-600/20 transform hover:-translate-y-1"
                                >
                                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    {submitting ? 'Enviando...' : 'Publicar Mensagem'}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Message List */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-xl text-slate-800 mb-6 px-2">Recados Recentes</h3>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
                                <Loader2 className="w-8 h-8 animate-spin text-emerald-200" />
                                <span className="text-sm">Carregando o amor...</span>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center bg-slate-50 rounded-2xl p-12 border border-dashed border-slate-200">
                                <p className="text-slate-500">Seja o primeiro a deixar um recado! ✨</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((msg, index) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-20px" }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-500/5 transition-all group"
                                    >
                                        <div className="flex gap-4 items-start">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center shrink-0 border border-white shadow-sm ring-1 ring-emerald-50">
                                                <UserCircle2 className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <div>
                                                <div className="flex flex-col items-start gap-1 mb-2">
                                                    <span className="font-bold text-slate-900">{msg.sender_name}</span>
                                                    <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                                                        {format(new Date(msg.created_at), "d 'de' MMMM", { locale: ptBR })}
                                                    </span>
                                                </div>
                                                <p className="text-slate-600 text-sm leading-relaxed group-hover:text-slate-700">
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
