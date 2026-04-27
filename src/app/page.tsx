import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductGrid';
import { StepsSection } from '@/components/StepsSection';
import { Guestbook } from '@/components/Guestbook';
import { CustomContribution } from '@/components/CustomContribution';

export default function Home() {
  return (
    <>
      {/* Seção Principal (Hero) */}
      <Hero />

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-12 md:py-16">

        {/* Mensagem de Boas-Vindas */}
        <section className="text-center max-w-4xl mx-auto py-12">
          <h2 className="text-3xl md:text-5xl font-black text-blue-950 mb-8 tracking-tighter">Construindo nosso ninho,<br />tijolo por tijolo.</h2>
          <p id="welcomeMessage" className="text-base md:text-lg leading-relaxed text-slate-500 font-medium">
            Com o coração cheio de alegria, estamos prestes a começar um novo capítulo em nosso primeiro lar. Cada cantinho desta casa será preenchido não apenas com móveis, mas com as memórias que construiremos. Seja bem-vindo à nossa jornada!
          </p>
        </section>

        {/* Como Funciona */}
        <StepsSection />

        {/* Lista de Presentes */}
        <ProductGrid />

        {/* Contribuição Livre */}
        <CustomContribution />

        {/* Mural de Recados */}
        <Guestbook />

      </main>

      {/* Rodapé */}
      <footer className="bg-blue-950 text-white mt-20">
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="font-black text-xl mb-3 tracking-tight">Feito com carinho para o nosso novo lar.</p>
          <p className="text-[10px] text-blue-300 font-black tracking-[0.3em] uppercase">© 2026 <span id="footerCoupleNames">Christyan & Vivian</span></p>
        </div>
      </footer>
    </>
  );
}
