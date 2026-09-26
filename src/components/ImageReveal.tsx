import { Img, ratio } from './Img';

/**
 * Masked image reveal: the frame wipes open (clip-path) while the image settles from a
 * slight over-scale. Aspect ratio is reserved up front.
 */
export function ImageReveal({
  src,
  alt,
  className = '',
  from = 'bottom',
  delay = 0,
  eager,
  cursor = 'explore',
  onClick,
  fit,
}: {
  src: string;
  alt: string;
  className?: string;
  from?: 'bottom' | 'left' | 'right' | 'top';
  delay?: number;
  eager?: boolean;
  cursor?: string;
  onClick?: () => void;
  fit?: 'cover' | 'contain';
}) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      className={`imgr imgr--${from} ${fit === 'cover' ? 'imgr--cover' : ''} ${className}`}
      data-rv=""
      style={{ '--d': `${delay}ms`, '--ar': String(ratio(src)) }}
      data-cursor={onClick ? cursor : undefined}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      aria-label={onClick ? `Open image: ${alt}` : undefined}
    >
      <span className="imgr__mask">
        <Img src={src} alt={alt} eager={eager} />
      </span>
    </Tag>
  );
}
