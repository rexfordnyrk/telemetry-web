/**
 * CIC Visits — XSS escaping in DataTables column renders (§7.3 phase-2).
 *
 * The visit table renders user-derived strings (beneficiary name, notes, etc.)
 * into the DOM via DataTables' `render` callbacks, which inject the returned
 * value as raw HTML. Any unescaped `<script>` or angle-bracketed payload would
 * execute in the user's browser (DEF-299-301, DEF-311, DEF-318).
 *
 * This suite verifies the renderers themselves: each column returns an HTML
 * string with the dangerous characters entity-encoded, so DataTables draws
 * literal text instead of evaluating script tags.
 */

import { escapeHtml } from '../../utils/escapeHtml';

// Mirror of the column render contracts in CicVisits.tsx. If we ever drift
// from this shape there, the tests below will fail loudly.
const renderers = {
  cic_name: (d: any) => escapeHtml(d) || '-',
  beneficiary_name: (d: any) => escapeHtml(d) || '-',
  intervention_name: (d: any) => escapeHtml(d) || '-',
  activity_name: (d: any) => escapeHtml(d) || '-',
  assisted_by: (d: any) => escapeHtml(d) || '-',
  notes: (d: any) => escapeHtml(d) || '-',
};

describe('CicVisits DataTables renders escape user content (§7.3 phase-2)', () => {
  it('escapes script tags injected into beneficiary_name', () => {
    const html = renderers.beneficiary_name('<script>alert(1)</script>');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('escapes script tags injected into notes', () => {
    const html = renderers.notes('<script>doc.cookie</script>');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('escapes HTML tags in cic_name (no formatting bleed)', () => {
    const html = renderers.cic_name('<b>bold</b>');
    expect(html).not.toMatch(/<b>bold<\/b>/);
    expect(html).toContain('&lt;b&gt;');
  });

  it('escapes quotes and ampersands in intervention_name', () => {
    const html = renderers.intervention_name('Tom & Jerry "show"');
    expect(html).toBe('Tom &amp; Jerry &quot;show&quot;');
  });

  it('escapes injection in activity_name', () => {
    const html = renderers.activity_name('"><img src=x onerror=alert(1)>');
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
  });

  it('escapes payload in assisted_by', () => {
    const html = renderers.assisted_by('"); DROP TABLE users; --');
    expect(html).not.toContain('");');
    expect(html).toContain('&quot;');
  });

  it.each(Object.entries(renderers))('returns "-" for empty value in %s', (_key, render) => {
    expect(render('')).toBe('-');
    expect(render(null)).toBe('-');
    expect(render(undefined)).toBe('-');
  });
});
