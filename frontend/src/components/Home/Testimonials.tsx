import Container from '../shared/Container';

const TESTIMONIALS = [
  {
    name: 'Laura P.',
    text: 'Alquilé mi cámara reflex y pagué las vacaciones. ¡Súper fácil!',
    avatar: 'https://source.unsplash.com/48x48/?woman,face'
  },
  {
    name: 'Carlos G.',
    text: 'Encontré un taladro a 5 € y no tuve que comprar uno nuevo.',
    avatar: 'https://source.unsplash.com/48x48/?man,face'
  },
  {
    name: 'Marta S.',
    text: 'Me encanta la seguridad del pago con fianza. Repetiré.',
    avatar: 'https://source.unsplash.com/48x48/?lady,face'
  }
];

export default function Testimonials() {
  return (
    <SectionWrapper>
      <Container>
        <h2 className="mb-10 text-center text-3xl font-bold">Historias reales</h2>

        {/* slider */}
        <div className="flex snap-x gap-6 overflow-x-auto pb-4 sm:justify-center">
          {TESTIMONIALS.map(t => (
            <article
              key={t.name}
              className="snap-center shrink-0 rounded-xl bg-white p-6 shadow-card sm:w-80"
            >
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                  loading="lazy"
                />
                <p className="font-semibold">{t.name}</p>
              </div>
              <p className="mt-4 text-sm text-gray-600">“{t.text}”</p>
            </article>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  );
}

function SectionWrapper({ children }: { children: React.ReactNode }) {
  return <section className="bg-white py-16">{children}</section>;
}
