export default function SkeletonCard() {
  return (
    <article
      className="
        flex flex-col overflow-hidden rounded-lg bg-white shadow-card
        animate-pulse
      "
    >
      {/* zona de imagen (mantiene proporción 4:3) */}
      <div className="aspect-[4/3] w-full bg-gray-200" />

      {/* zona de texto */}
      <div className="space-y-2 p-4">
        <div className="h-4 w-2/3 rounded bg-gray-200" />
        <div className="h-4 w-1/3 rounded bg-gray-200" />
      </div>
    </article>
  );
}
