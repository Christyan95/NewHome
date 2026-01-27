# 🏡 NewHome - Chá de Casa Nova

Este projeto é uma plataforma interativa para listas de presentes de casamento ou chá de casa nova, desenvolvida com tecnologia moderna e foco em estética premium e experiência do usuário.

A aplicação permite que convidados:
1.  Visualizem a lista de presentes desejados pelos noivos/anfitriões.
2.  Contribuam com "cotas" ou valores parciais/totais de cada item através de PIX.
3.  Deixem mensagens no Mural de Recados.

A plataforma utiliza o conceito de "cotas virtuais", onde o presente físico não é comprado diretamente; o valor é transferido via PIX para os anfitriões comprarem posteriormente.

## 🚀 Tecnologias Utilizadas

*   **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
*   **Linguagem**: TypeScript
*   **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
*   **Animações**: [Framer Motion](https://www.framer.com/motion/)
*   **Banco de Dados**: [Supabase](https://supabase.com/) (PostgreSQL)
*   **Ícones**: Lucide React
*   **QR Code**: Geração de PIX Copy & Paste e QR Code dinâmico.

## 📋 Funcionalidades

*   **Lista de Presentes Interativa**:
    *   Filtragem por categorias.
    *   Barra de progresso visual para itens com múltiplas cotas.
    *   Status "Esgotado" automático.
*   **Checkout Simplificado**:
    *   Modal elegante para escolha de cota.
    *   Geração automática de código PIX "Copia e Cola" e QR Code.
    *   Confirmação de pagamento manual pelo usuário (registra a intenção de presente).
*   **Mural de Recados (Guestbook)**:
    *   Espaço para mensagens dos convidados.
    *   Listagem em tempo real.
*   **Design Responsivo e Premium**:
    *   Interface limpa, moderna e fuidal.
    *   Micro-interações e animações suaves.

## 🛠️ Configuração e Instalação

### Pré-requisitos
*   Node.js 18+ instalado.
*   Conta no Supabase (Gratuito).

### Passo a Passo

1.  **Clone o repositório**:
    ```bash
    git clone https://github.com/seu-usuario/new-home.git
    cd new-home
    ```

2.  **Instale as dependências**:
    ```bash
    npm install
    ```

3.  **Configuração do Banco de Dados (Supabase)**:
    *   Crie um novo projeto no Supabase.
    *   Vá até o SQL Editor no dashboard do Supabase.
    *   Execute o conteúdo do arquivo `database/supabase_schema.sql` para criar as tabelas e políticas de segurança (RLS).
    *   (Opcional) Execute o conteúdo de `database/seed.sql` para popular o banco com alguns produtos iniciais.

4.  **Variáveis de Ambiente**:
    *   Crie um arquivo `.env.local` na raiz do projeto.
    *   Adicione as chaves do seu projeto Supabase (encontradas em Project Settings > API):

    ```env
    NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
    ```

5.  **Configuração do PIX**:
    *   Abra o arquivo `src/components/CheckoutModal.tsx`.
    *   Localize a chamada da função `generatePix` (dentro do `useEffect`).
    *   Altere a chave PIX, nome e cidade para os dados reais do recebedor:
        ```typescript
        key: 'seu-email-ou-chave-pix',
        name: 'Seu Nome Completo',
        city: 'Sua Cidade',
        ```

6.  **Rodando Localmente**:
    ```bash
    npm run dev
    ```
    Acesse `http://localhost:3000` no seu navegador.

## 📂 Estrutura do Projeto

```
src/
├── app/              # Páginas e Layout (Next.js App Router)
├── components/       # Componentes React Reutilizáveis
│   ├── Hero.tsx      # Seção Principal
│   ├── ProductGrid.tsx # Lista de Produtos
│   ├── ProductCard.tsx # Card individual do presente
│   ├── CheckoutModal.tsx # Modal de Pagamento PIX
│   └── Guestbook.tsx # Mural de Recados
└── lib/              # Utilitários e Funções Auxiliares
    ├── pix.ts        # Lógica de geração do Payload PIX (BR Code)
    └── supabase.ts   # Cliente do Supabase
```

## 🛡️ Segurança e Privacidade

*   As chaves do Supabase no frontend (`anon`) são seguras desde que as políticas RLS (Row Level Security) estejam configuradas corretamente no banco de dados (o arquivo `supabase_schema.sql` já inclui políticas básicas).
*   **Dados Sensíveis**: Não commite o arquivo `.env.local` no GitHub.

## 📄 Licença

Este projeto é de uso pessoal e livre para modificações.
