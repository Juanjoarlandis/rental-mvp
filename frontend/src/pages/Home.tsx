import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import Container from '../components/shared/Container';
import Section from '../components/shared/Section';

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-brand text-white">
        <Container>
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 py-24 text-center">
            <h1 className="max-w-3xl text-balance text-5xl font-extrabold leading-tight">
              Alquila y gana dinero con tus herramientas que no usas a diario
            </h1>
            <p className="max-w-xl text-lg/relaxed text-white/90">
              Conecta con gente de tu zona, protege tus transacciones y ahorra comprando.
            </p>
            <Link to="/dashboard" className="btn inline-flex gap-2">
              Explorar catálogo <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </Container>
      </section>

      {/* HOW IT WORKS */}
      <Section title="¿Cómo funciona?">
        <Container>
          <div className="grid gap-12 md:grid-cols-3">
            {[
              ['Publica', 'Sube tu producto y fija tu precio.'],
              ['Reserva', 'Los usuarios reservan y pagan la fianza.'],
              ['Gana', 'Entrega el ítem y recibe tu dinero.']
            ].map(([t, d]) => (
              <div key={t} className="space-y-3 text-center">
                <div className="mx-auto h-12 w-12 rounded-full bg-brand/10" />
                <h3 className="text-xl font-semibold">{t}</h3>
                <p className="text-gray-600">{d}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
