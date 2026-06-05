import { describe, it, expect } from 'vitest';
import { routes, istCmsRoute } from '@/router';

describe('Routing-Skelett', () => {
  it('stellt eine Route für die Startseite bereit', () => {
    const pfade = routes.map((r) => r.path);
    expect(pfade).toContain('/');
  });

  it('stellt Routen für Inhaltsseiten bereit (Founder, FAQ, Impressum, Datenschutz)', () => {
    const pfade = routes.map((r) => r.path);
    expect(pfade).toContain('/founder');
    expect(pfade).toContain('/faq');
    expect(pfade).toContain('/impressum');
    expect(pfade).toContain('/datenschutz');
  });

  it('erkennt die CMS-Route als reine Dev-Route', () => {
    expect(istCmsRoute('/admin')).toBe(true);
    expect(istCmsRoute('/')).toBe(false);
  });

  it('enthält die CMS-Route nur, wenn der Dev-Modus aktiv ist', () => {
    const pfade = routes.map((r) => r.path);
    if (import.meta.env.DEV) {
      expect(pfade).toContain('/admin');
    } else {
      expect(pfade).not.toContain('/admin');
    }
  });
});
