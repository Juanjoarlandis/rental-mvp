import { Link } from 'react-router-dom';
import { ArrowRightIcon, PlusIcon } from '@heroicons/react/24/solid';
import Container from '../components/shared/Container';
import Section from '../components/shared/Section';
import Stats from '../components/Home/Stats';
import LogoCloud from '../components/Home/LogoCloud';
import Testimonials from '../components/Home/Testimonials';
import FAQ from '../components/Home/FAQ';

export default function Home() {
  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="relative isolate overflow-hidden bg-brand text-white">
        {/* background blur blob */}
        <span className="pointer-events-none absolute -top-16 left-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />

        <Container>
          <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-28 text-center">
            <h1 className="max-w-3xl text-balance text-5xl font-extrabold leading-tight">
              Dónde tus cosas <br className="hidden sm:inline" />
              <span className="text-white/80">cambian de mano</span>
            </h1>

            <p className="max-w-xl text-lg/relaxed text-white/90">
              Alquila herramientas, gadgets o equipamiento deportivo y monetiza lo
              que ya tienes. ¡Conecta con tu barrio y ahorra al planeta!
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/dashboard" className="btn inline-flex gap-2">
                Explorar catálogo <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <Link to="/dashboard#add" className="btn--ghost inline-flex gap-2">
                <PlusIcon className="h-5 w-5" />
                Publicar mi primer ítem
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- STATS ---------- */}
      <Stats />

      {/* ---------- LOGO CLOUD ---------- */}
      <LogoCloud />

      {/* ---------- CÓMO FUNCIONA ---------- */}
      <Section title="¿Cómo funciona?">
        <Container>
          <div className="grid gap-12 md:grid-cols-3">
            {[
              ['Publica', 'Sube tu producto, ponle precio y límites de uso.'],
              ['Reserva', 'Los usuarios pagan la fianza y reservan al instante.'],
              ['Gana', 'Entregas el ítem, recibes el pago y valoraciones ⭐'],
            ].map(([t, d]) => (
              <div key={t} className="space-y-3 text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-brand/10" />
                <h3 className="text-xl font-semibold">{t}</h3>
                <p className="text-gray-600">{d}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ---------- TESTIMONIOS ---------- */}
      <Testimonials />

      {/* ---------- FAQ ---------- */}
      <FAQ />

      {/* ---------- CTA FINAL ---------- */}
      <section className="bg-brand py-16 text-center text-white">
        <Container>
          <h2 className="mb-6 text-3xl font-bold">
            ¿Listo para estrenar ingresos extra?
          </h2>
          <Link to="/register" className="btn">
            Crear cuenta gratis
          </Link>
        </Container>
      </section>
    </>
  );
}
