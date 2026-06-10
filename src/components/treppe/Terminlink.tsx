import { TERMINLINK_TEXT } from '@/content/texte';
import { Button } from '@/components/ui/Button';

/**
 * Terminlink (§10.1). Text exakt TERMINLINK_TEXT — nie „Gespräch buchen", nie der reservierte Begriff (§17).
 * Einzige Stelle, an der der Terminlink-Text verbindlich ausgegeben wird.
 */
export function Terminlink({ href = '#termin' }: { href?: string }) {
  return (
    <a href={href} style={{ textDecoration: 'none' }}>
      <Button variante="primär">{TERMINLINK_TEXT}</Button>
    </a>
  );
}
