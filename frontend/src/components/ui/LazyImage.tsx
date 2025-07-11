import { useState } from 'react';

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** ancho estimado para el atributo `sizes` (ej. "100vw", "50vw") */
  sizes?: string;
};

export default function LazyImage({
  src,
  alt,
  className = '',
  sizes = '100vw'
}: Props) {
  const [loaded, setLoaded] = useState(false);

  /* genera srcset (320-640-960 px) */
  const srcset = [320, 640, 960]
    .map(w => `${src.replace(/(\?.*)?$/, '')}?w=${w} ${w}w`)
    .join(', ');

  return (
    <img
      src={src}
      srcSet={srcset}
      sizes={sizes}
      loading="lazy"
      decoding="async"                    /* 🆕 */
      onLoad={() => setLoaded(true)}
      className={`${className} transition-opacity duration-500 ${
        loaded ? 'opacity-100' : 'opacity-0'
      }`}
      alt={alt}
    />
  );
}
