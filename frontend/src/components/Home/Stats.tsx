import { useEffect, useRef, useState } from 'react';
import Container from '../shared/Container';

const DATA = [
  { label: 'Ítems publicados', value: 3124 },
  { label: 'Usuarios registrados', value: 857 },
  { label: '€ ahorrados', value: 24367 }
];

export default function Stats() {
  /* animate on scroll into view */
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-white py-12">
      <Container>
        <div className="grid gap-8 sm:grid-cols-3">
          {DATA.map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-4xl font-extrabold text-brand">
                {visible ? value.toLocaleString() : '0'}
              </p>
              <p className="mt-2 text-sm font-medium text-gray-600">{label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
