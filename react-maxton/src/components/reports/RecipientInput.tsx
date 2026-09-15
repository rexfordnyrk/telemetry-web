import React from 'react';
import { Badge, Button, Form, InputGroup } from 'react-bootstrap';

export type Recipient =
  | { kind: 'user'; id: string }
  | { kind: 'email'; address: string };

export interface RecipientUser { id: string; name: string; email: string }

export interface RecipientInputProps {
  value: Recipient[];
  onChange: (rs: Recipient[]) => void;
  users: RecipientUser[];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RecipientInput: React.FC<RecipientInputProps> = ({ value, onChange, users }) => {
  const [draft, setDraft] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const label = (r: Recipient): string => {
    if (r.kind === 'user') {
      const u = users.find((x) => x.id === r.id);
      return u ? u.name : r.id;
    }
    return r.address;
  };

  const dedup = (rs: Recipient[]): Recipient[] => {
    const seen = new Set<string>();
    const out: Recipient[] = [];
    for (const r of rs) {
      const key = r.kind === 'user' ? `u:${r.id}` : `e:${r.address.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(r);
    }
    return out;
  };

  const add = () => {
    const raw = draft.trim();
    if (!raw) { setError(null); return; }
    const matchUser = users.find((u) =>
      u.name.toLowerCase() === raw.toLowerCase() || u.email.toLowerCase() === raw.toLowerCase());
    if (matchUser) {
      onChange(dedup([...value, { kind: 'user', id: matchUser.id }]));
      setDraft('');
      setError(null);
      return;
    }
    if (EMAIL_RE.test(raw)) {
      onChange(dedup([...value, { kind: 'email', address: raw }]));
      setDraft('');
      setError(null);
      return;
    }
    setError('Enter a valid email or a user name');
  };

  const remove = (idx: number) => {
    const next = value.slice();
    next.splice(idx, 1);
    onChange(next);
  };

  return (
    <div>
      <div className="mb-2 d-flex flex-wrap gap-2">
        {value.length === 0 && <span className="text-muted small">No recipients yet</span>}
        {value.map((r, i) => (
          <Badge
            key={i}
            bg="light"
            text="dark"
            className="d-flex align-items-center gap-2 rounded-4 px-3 py-2"
          >
            <span>{label(r)}</span>
            <button
              type="button"
              className="btn btn-link p-0 text-body"
              aria-label={`Remove ${label(r)}`}
              onClick={() => remove(i)}
            >
              <i className="material-icons-outlined" style={{ fontSize: 16 }}>close</i>
            </button>
          </Badge>
        ))}
      </div>
      <InputGroup>
        <Form.Control
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder="User name or email address"
          isInvalid={!!error}
          aria-label="Add recipient"
        />
        <Button variant="outline-primary" onClick={add}>Add</Button>
      </InputGroup>
      {error && <div className="text-danger small mt-1">{error}</div>}
    </div>
  );
};

export default RecipientInput;
