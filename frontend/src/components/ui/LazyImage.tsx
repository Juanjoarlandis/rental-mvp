// frontend/src/components/ui/LazyImage.tsx
import { useState } from 'react';

type Props = { src: string; alt: string; className?: string };

export default function LazyImage({ src, alt, className = '' }: Props) {
  const [loaded, setLoaded] = useState(false);

  return (
    <img
      src={src}                       // ← SIEMPRE el src real
      loading="lazy"
      onLoad={() => setLoaded(true)}  // cuando acabe, quitamos fade-in
      className={`${className} transition-opacity duration-500 ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
      alt={alt}
    />
  );
}
