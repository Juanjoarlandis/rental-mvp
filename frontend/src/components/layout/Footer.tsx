export default function Footer() {
  return (
    <footer className="mt-24 border-t bg-white py-12 text-center text-sm text-gray-500">
      Rental‑MVP © {new Date().getFullYear()} · Hecho con ❤ en FastAPI + React
    </footer>
  );
}
