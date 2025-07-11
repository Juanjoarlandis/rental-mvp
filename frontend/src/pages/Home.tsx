/* -------------------------------------------------------------------------- */
/*  src/pages/Home.tsx                                                        */
/* -------------------------------------------------------------------------- */
import { Link } from 'react-router-dom';
import {
  ArrowRightIcon,
  PlusIcon,
  CloudArrowUpIcon,
  CalendarDaysIcon,
  BanknotesIcon,
} from '@heroicons/react/24/solid';

import Container from '../components/shared/Container';
import Section from '../components/shared/Section';

import Stats from '../components/Home/Stats';
import LogoCloud from '../components/Home/LogoCloud';
import Testimonials from '../components/Home/Testimonials';
import FAQ from '../components/Home/FAQ';

export default function Home() {
  /* Pasos del “cómo funciona” con su icono */
  const STEPS = [
    {
      title: 'Publica',
      desc: 'Sube tu producto, ponle precio y límites de uso.',
      icon: CloudArrowUpIcon,
    },
    {
      title: 'Reserva',
      desc: 'Los usuarios pagan la fianza y reservan al instante.',
      icon: CalendarDaysIcon,
    },
    {
      title: 'Gana',
      desc: 'Entregas el ítem, recibes el pago y valoraciones ⭐',
      icon: BanknotesIcon,
    },
  ];

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

        {/* wave separator */}
        <svg
          aria-hidden
          viewBox="0 0 1440 120"
          className="block w-full text-brand"
          preserveAspectRatio="none"
        >
          <path
            d="M0,96L48,106.7C96,117,192,139,288,128C384,117,480,75,576,58.7C672,43,768,53,864,74.7C960,96,1056,128,1152,138.7C1248,149,1344,139,1392,133.3L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            className="fill-white"
          />
        </svg>
      </section>

      {/* ---------- STATS ---------- */}
      <Stats />

      {/* ---------- LOGO CLOUD ---------- */}
      <LogoCloud />

      {/* ---------- CÓMO FUNCIONA ---------- */}
      <Section title="¿Cómo funciona?">
        <Container>
          <div className="grid gap-12 md:grid-cols-3">
            {STEPS.map(({ title, desc, icon: Icon }) => (
              <div key={title} className="space-y-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand/10">
                  <Icon className="h-6 w-6 text-brand" />
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-gray-600">{desc}</p>
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
