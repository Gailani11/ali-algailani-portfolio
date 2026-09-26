import type { ReactNode } from 'react';

/**
 * Line-mask text reveal: each line slides up out of its own mask.
 * Pass an array of lines (explicit breaks keep control over the rag).
 */
export function MaskLines({
  lines,
  as: Tag = 'span',
  className = '',
  delay = 0,
  step = 90,
}: {
  lines: ReactNode[];
  as?: any;
  className?: string;
  delay?: number;
  step?: number;
}) {
  return (
    <Tag className={`mlines ${className}`} data-rv="">
      {lines.map((l, i) => (
        <span className="mline" key={i}>
          <span className="mline__in" style={{ '--d': `${delay + i * step}ms` }}>
            {l}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** Small uppercase label with the portfolio's wide tracking. */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`eyebrow ${className}`}>{children}</span>;
}

/** Arabic run with correct direction and language for shaping and screen readers. */
export function Ar({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span lang="ar" dir="rtl" className={`ar ${className}`}>
      {children}
    </span>
  );
}

/** "Label — 01 / 08" numbering used across the book. */
export function Numbering({ label, i, total, accent }: { label: string; i: number; total: number; accent?: string }) {
  return (
    <span className="numbering">
      <span className="numbering__label">{label}</span>
      <span className="numbering__dash" style={accent ? { background: accent } : undefined} />
      <span className="numbering__n num" style={accent ? { color: accent } : undefined}>
        {String(i).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </span>
  );
}
