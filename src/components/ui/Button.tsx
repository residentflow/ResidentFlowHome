import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primär' | 'sekundär';
  children: ReactNode;
}

/** Ruhiger, wertiger Button im Editorial-Stil (§15.5). */
export function Button({ variante = 'primär', children, style, ...rest }: ButtonProps) {
  const primär = variante === 'primär';
  return (
    <button
      {...rest}
      style={{
        font: 'inherit',
        fontWeight: 600,
        cursor: 'pointer',
        padding: '0.75rem 1.5rem',
        borderRadius: 'var(--radius)',
        border: primär ? 'none' : '1px solid var(--farbe-akzent)',
        background: primär ? 'var(--farbe-akzent)' : 'transparent',
        color: primär ? '#fff' : 'var(--farbe-akzent)',
        ...style,
      }}
    >
      {children}
    </button>
  );
}
