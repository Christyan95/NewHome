"use client";

import { useEffect } from "react";

export function ScrollToTop() {
    useEffect(() => {
        // Evita que o navegador restaure a posição de rolagem automaticamente ao atualizar
        if (typeof window !== 'undefined' && window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Força a rolagem para o topo
        window.scrollTo(0, 0);
    }, []);

    return null;
}
