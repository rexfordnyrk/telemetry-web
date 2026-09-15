import React from 'react';

const EMPTY = '—';

function relativeTime(d: Date): string {
  const s = Math.round((Date.now() - d.getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export const renderLastSynced = (v: string | null): React.ReactNode => {
  if (!v) return EMPTY;
  const d = new Date(v);
  if (isNaN(d.getTime())) return EMPTY;
  return React.createElement('span', { title: d.toLocaleString() }, relativeTime(d));
};

export const renderMostUsedApp = (a: { name: string; package: string } | null): React.ReactNode => {
  if (!a) return EMPTY;
  return React.createElement(
    React.Fragment,
    null,
    React.createElement('div', null, a.name),
    React.createElement('small', { className: 'text-muted' }, a.package),
  );
};
