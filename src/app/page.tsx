import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { StepsSection } from '@/components/StepsSection';
import { Guestbook } from '@/components/Guestbook';

export default function Home() {
  return (
    <>
      {/* Seção Principal (Hero) */}
      <Hero />

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-12 md:py-16">

        {/* Mensagem de Boas-Vindas */}
        <section className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800">Construindo nosso ninho, tijolo por tijolo.</h2>
          <p id="welcomeMessage" className="mt-4 text-lg leading-relaxed">
            Com o coração cheio de alegria, estamos prestes a começar um novo capítulo em nosso primeiro lar. Cada cantinho desta casa será preenchido não apenas com móveis, mas com as memórias que construiremos. Sua amizade já é o nosso maior presente, mas se desejar nos ajudar a montar nosso ninho, ficaremos eternamente gratos. Seja bem-vindo à nossa jornada!
          </p>
        </section>

        {/* Como Funciona */}
        <StepsSection />

        {/* Lista de Presentes */}
        <ProductGrid />

        {/* Mural de Recados */}
        <section className="mt-12 md:mt-16 max-w-3xl mx-auto">
          <Guestbook />
        </section>

      </main>

      {/* Rodapé */}
      <footer className="bg-slate-800 text-white mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Feito com amor para o nosso novo lar.</p>
          <p className="text-sm text-slate-400 mt-2">© 2025 <span id="footerCoupleNames">Christyan & Vivian</span></p>
        </div>
      </footer>
    </>
  );
}
