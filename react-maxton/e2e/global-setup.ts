import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const API_URL = process.env.E2E_API_URL ?? 'http://localhost:8080';

async function ping(url: string): Promise<boolean> {
  try {
    const r = await fetch(url);
    return r.ok;
  } catch { return false; }
}

async function globalSetup() {
  // 1. Backend reachable
  if (!(await ping(`${API_URL}/api/v1/health`))) {
    throw new Error(`backend not reachable at ${API_URL}/api/v1/health — start it first`);
  }

  // 2. Seed
  const backendDir = path.resolve(__dirname, '../../../backend');
  const seed = spawnSync('go', ['run', './cmd/seed-e2e'], {
    cwd: backendDir,
    env: { ...process.env, E2E_MODE: '1' },
    encoding: 'utf8',
  });
  if (seed.status !== 0) {
    throw new Error(`seed-e2e failed: ${seed.stdout}\n${seed.stderr}`);
  }

  // 3. Login as admin
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'admin@e2e.test', password: 'E2eAdmin!2026' }),
  });
  if (!res.ok) throw new Error(`login failed: ${res.status} ${await res.text()}`);
  const body = await res.json();
  const token = body?.token ?? body?.data?.token ?? body?.access_token;
  if (!token) throw new Error(`login response has no token: ${JSON.stringify(body)}`);

  const authDir = path.resolve(__dirname, '.auth');
  fs.mkdirSync(authDir, { recursive: true });
  fs.writeFileSync(path.join(authDir, 'admin.json'), JSON.stringify({ token }, null, 2));
}

export default globalSetup;
