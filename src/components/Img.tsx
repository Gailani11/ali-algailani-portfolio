import { DIMS } from '../data/assets';

/** Asset path; a single-file export can supply embedded copies through `__AA_ASSETS`. */
const embedded = (globalThis as { __AA_ASSETS?: Record<string, string> }).__AA_ASSETS;
export const assetUrl = (key: string) => embedded?.[key] ?? `assets/${key}.webp`;

/**
 * Image from the extracted portfolio assets. Intrinsic width/height come from the
 * extraction manifest so the layout never shifts while images stream in.
 */
export function Img({
  src,
  alt,
  className,
  eager,
  sizes,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
  sizes?: string;
  style?: Record<string, string | number>;
}) {
  const d = DIMS[src] ?? [1600, 1000];
  return (
    <img
      src={assetUrl(src)}
      alt={alt}
      width={d[0]}
      height={d[1]}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : undefined}
      sizes={sizes}
      className={className}
      style={style}
      draggable={false}
    />
  );
}

export const ratio = (src: string) => {
  const d = DIMS[src] ?? [16, 10];
  return d[0] / d[1];
};
