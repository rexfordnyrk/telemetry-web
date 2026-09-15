import { test as base } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

type AuthFixtures = { authedPage: import('@playwright/test').Page };

export const test = base.extend<AuthFixtures>({
  authedPage: async ({ browser }, use) => {
    const state = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../.auth/admin.json'), 'utf8'),
    );
    const ctx = await browser.newContext();
    await ctx.addInitScript(({ token }) => {
      window.localStorage.setItem(
        'auth_state',
        JSON.stringify({
          token,
          refreshToken: null,
          expiresIn: null,
          user: null,
          isAuthenticated: true,
          initialized: true,
        }),
      );
    }, { token: state.token });
    const page = await ctx.newPage();
    await use(page);
    await ctx.close();
  },
});

export { expect } from '@playwright/test';
