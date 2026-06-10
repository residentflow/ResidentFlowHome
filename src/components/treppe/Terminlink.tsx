import { TERMINLINK_TEXT } from '@/content/texte';
import { Button } from '@/components/ui/Button';
import { schatzsucheConfig } from '@/content/schatzsuche.config';

/**
 * Terminlink (§10.1). Text exakt TERMINLINK_TEXT — nie „Gespräch buchen", nie der reservierte Begriff (§17).
 * Einzige Stelle, an der der Terminlink-Text verbindlich ausgegeben wird.
 * Ziel kommt aus der Config (globalConfig.terminLink); externe Ziele öffnen in neuem Tab.
 */
export function Terminlink({
  href = schatzsucheConfig.globalConfig.terminLink,
}: {
  href?: string;
}) {
  const extern = href.startsWith('http');
  return (
    <a
      href={href}
      target={extern ? '_blank' : undefined}
      rel={extern ? 'noreferrer' : undefined}
      style={{ textDecoration: 'none' }}
    >
      <Button variante="primär">{TERMINLINK_TEXT}</Button>
    </a>
  );
}
