# 🏠 Chá de Casa Nova - Christyan & Vivian

Bem-vindo ao repositório oficial do projeto **Chá de Casa Nova**. Este é um sistema moderno, inovador e de alta performance desenvolvido para gerenciar a lista de presentes e o mural de recados para a celebração do nosso primeiro lar.

---

## ✨ Destaques do Projeto

*   **Design Ultra-Moderno**: Estética minimalista baseada em *Baby Blue*, *Navy Blue* e *Glassmorphism 2.0*.
*   **Sincronização em Tempo Real**: Atualização instantânea do progresso dos presentes via Supabase Realtime.
*   **Arquitetura Robusta**: Lógica de banco de dados atômica com Triggers e RLS (Row Level Security).
*   **UX Premium**: Fluxo de presente simplificado com geração dinâmica de QR Code PIX e feedback visual com confetes.
*   **Totalmente Responsivo**: Experiência otimizada para Desktop, Tablets e Mobile.

---

## 🛠️ Tech Stack

*   **Frontend**: Next.js 15, React 19, TypeScript.
*   **Estilização**: Tailwind CSS 4, Lucide React (Ícones).
*   **Animações**: Framer Motion, Canvas-Confetti.
*   **Backend & Banco de Dados**: Supabase (PostgreSQL).
*   **Utilitários**: Date-fns, Sonner (Toasts), QRCode (Gerador).

---

## 📂 Estrutura do Projeto

```text
├── database/
│   └── schema.sql        # Arquivo Mestre de Schema e Seed (Padrão Senior)
├── public/
│   ├── hero-creative.png # Imagem artística de destaque
│   └── logo.svg          # Identidade visual
├── src/
│   ├── app/              # Estrutura Next.js App Router
│   ├── components/       # Componentes React modulares e reutilizáveis
│   └── lib/              # Utilidades, configurações e gerador de PIX
└── .env.example          # Exemplo de configuração de variáveis
```

---

## 🚀 Como Configurar o Projeto

### 1. Clonar o Repositório
```bash
git clone https://github.com/Christyan95/NewHome.git
cd NewHome
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Renomeie o arquivo `.env.example` para `.env.local` e preencha com suas credenciais do Supabase e sua chave PIX.

### 4. Configurar o Banco de Dados (Supabase)
1.  Crie um novo projeto no [Supabase](https://supabase.com/).
2.  Vá até o **SQL Editor**.
3.  Copie o conteúdo de `database/schema.sql` e execute.
    *   *Nota: Este script criará as tabelas, funções, triggers, políticas de segurança e ativará o Realtime automaticamente.*

### 5. Rodar Localmente
```bash
npm run dev
```

---

## 🌍 Deployment (Vercel)

1.  Suba seu projeto para o GitHub.
2.  Importe o projeto na **Vercel**.
3.  Adicione as mesmas variáveis de ambiente do seu `.env.local` nas configurações da Vercel.
4.  O deploy será automático e estará online em segundos!

---

## 👨‍💻 Desenvolvido por
**Christyan & Vivian** - Feito com ❤️ para o início de uma nova jornada.
