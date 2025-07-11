import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import Container from '../shared/Container';

const FAQS = [
  ['¿Cómo se gestionan los pagos?', 'Usamos Stripe Connect para retener la fianza y liberar el pago una vez devuelto el ítem.'],
  ['¿Qué pasa si mi herramienta se daña?', 'Dispones de un seguro opcional a todo riesgo y sistema de valoraciones para vetar a malos usuarios.'],
  ['¿Puedo cancelar una reserva?', 'Sí, hasta 12 h antes sin penalización.'],
  ['¿Hay comisión?', 'Solo cobramos un 8 % al propietario cuando se confirma el alquiler.']
];

export default function FAQ() {
  return (
    <section className="bg-gray-50 py-16">
      <Container>
        <h2 className="mb-8 text-center text-3xl font-bold">Preguntas frecuentes</h2>

        <div className="mx-auto max-w-3xl space-y-4">
          {FAQS.map(([q, a]) => (
            <Disclosure key={q}>
              {({ open }) => (
                <>
                  <Disclosure.Button className="flex w-full items-center justify-between rounded-md bg-white px-4 py-3 text-left text-sm font-medium shadow">
                    {q}
                    <ChevronUpIcon
                      className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </Disclosure.Button>
                  <Disclosure.Panel className="px-4 pt-2 text-sm text-gray-600">
                    {a}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </Container>
    </section>
  );
}
