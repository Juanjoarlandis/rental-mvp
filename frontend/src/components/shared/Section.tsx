type Props = {
  title?: string;
  children: React.ReactNode;
  id?: string;
};

export default function Section({ title, children, id }: Props) {
  return (
    <section id={id} className="space-y-6 py-16">
      {title && (
        <h2 className="text-center text-3xl font-bold tracking-tight">{title}</h2>
      )}
      {children}
    </section>
  );
}
