import { PLAYBOOK_CTA } from '@/content/texte';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

/**
 * Stufe 1 — Playbook ansehen (§10.1). Für ALLE sichtbar.
 * Der Produktname darf hier NICHT erscheinen (§17).
 */
export function Stufe1Playbook({ href = '#playbook' }: { href?: string }) {
  return (
    <Section titel="Stufe 1 — Methodik">
      <p>
        Im Playbook finden Sie die vollständige Methodenbibliothek: alle Hebel, Benchmarks und
        Rechenwege — strukturiert nach den 8 Lebenszyklusphasen Ihres Bestands.
      </p>
      <a href={href} style={{ textDecoration: 'none' }}>
        <Button variante="sekundär">{PLAYBOOK_CTA}</Button>
      </a>
    </Section>
  );
}
