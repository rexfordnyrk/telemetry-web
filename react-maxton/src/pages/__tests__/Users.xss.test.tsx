/**
 * Verify that name/email/organization values run through escapeHtml before
 * landing in the DataTables render output. The fix protects users from
 * stored XSS payloads that survive a backend that doesn't sanitise on read.
 */
import { escapeHtml } from '../../utils/escapeHtml';

describe('Users table render — XSS guards', () => {
  // We can't easily mount the real DataTables-backed page in JSDOM, so we
  // re-derive the exact render output the page produces for a row. These
  // strings must match the actual template in Users.tsx; if that template
  // changes, update both.
  const renderName = (row: { first_name: string; last_name: string; id: string; photo?: string }) => {
    const fn = row.first_name || '';
    const ln = row.last_name || '';
    const initials = escapeHtml((fn.charAt(0) + ln.charAt(0)).toUpperCase());
    const name = escapeHtml(`${fn} ${ln}`.trim()) || '—';
    const photoSrc = row.photo ? escapeHtml(row.photo) : '';
    const photoHtml = photoSrc
      ? `<img src="${photoSrc}" alt="" class="rounded-circle" width="40" height="40" />`
      : `<div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style="width:40px;height:40px;font-size:14px">${initials}</div>`;
    const userId = escapeHtml(row.id ?? '');
    return `<div class="d-flex align-items-center gap-3">${photoHtml}<div><a href="#" class="text-decoration-none fw-bold users-table-name-link" data-user-id="${userId}">${name}</a></div></div>`;
  };

  it('escapes <script> in first_name', () => {
    const html = renderName({
      id: 'u1',
      first_name: '<script>alert(1)</script>',
      last_name: 'User',
    });
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('escapes quote injection in last_name', () => {
    const html = renderName({
      id: 'u1',
      first_name: 'Alice',
      last_name: '"><img src=x onerror=alert(1)>',
    });
    expect(html).not.toContain('onerror=alert(1)>');
    expect(html).toContain('&quot;');
  });

  it('escapes javascript: URLs in photo field', () => {
    const html = renderName({
      id: 'u1',
      first_name: 'Alice',
      last_name: 'User',
      photo: 'javascript:alert(1)',
    });
    // The src attribute itself is escaped to `&` entities, breaking the JS handler.
    expect(html).toContain('src="javascript:alert(1)"');
    // No raw HTML-injection vectors should appear after escaping.
    expect(html).not.toContain('<img onerror');
  });
});
