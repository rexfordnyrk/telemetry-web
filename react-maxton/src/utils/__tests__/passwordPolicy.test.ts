import {
  validatePassword,
  formatPolicyHint,
  fetchPasswordPolicy,
  DEFAULT_PASSWORD_POLICY,
} from '../passwordPolicy';
import { buildApiUrl, API_CONFIG } from '../../config/api';

const defaultPolicy = DEFAULT_PASSWORD_POLICY;

describe('validatePassword', () => {
  it('accepts password meeting all policy rules', () => {
    expect(validatePassword('ValidPass1!', defaultPolicy)).toEqual([]);
  });

  it('rejects password that is too short', () => {
    const violations = validatePassword('Ab1!', defaultPolicy);
    expect(violations).toContain('must be at least 8 characters');
  });

  it('rejects missing uppercase', () => {
    const violations = validatePassword('validpass1!', defaultPolicy);
    expect(violations).toContain('must contain at least one uppercase letter');
  });

  it('rejects missing lowercase', () => {
    const violations = validatePassword('VALIDPASS1!', defaultPolicy);
    expect(violations).toContain('must contain at least one lowercase letter');
  });

  it('rejects missing digit', () => {
    const violations = validatePassword('ValidPass!', defaultPolicy);
    expect(violations).toContain('must contain at least one digit');
  });

  it('rejects missing special character', () => {
    const violations = validatePassword('ValidPass1', defaultPolicy);
    expect(violations).toContain('must contain at least one special character');
  });

  it('respects disabled rules in custom policy', () => {
    const relaxed = {
      ...defaultPolicy,
      require_uppercase: false,
      require_special: false,
    };
    expect(validatePassword('validpass1', relaxed)).toEqual([]);
  });
});

describe('formatPolicyHint', () => {
  it('lists active rules for default policy', () => {
    const hint = formatPolicyHint(defaultPolicy);
    expect(hint).toMatch(/8 characters/i);
    expect(hint).toMatch(/uppercase/i);
    expect(hint).toMatch(/lowercase/i);
    expect(hint).toMatch(/digit/i);
    expect(hint).toMatch(/special/i);
  });

  it('omits disabled rules', () => {
    const hint = formatPolicyHint({
      ...defaultPolicy,
      require_special: false,
      require_uppercase: false,
    });
    expect(hint).toMatch(/lowercase/i);
    expect(hint).not.toMatch(/special/i);
    expect(hint).not.toMatch(/uppercase/i);
  });
});

describe('fetchPasswordPolicy', () => {
  const mockFetch = jest.fn();

  beforeEach(() => {
    mockFetch.mockReset();
    global.fetch = mockFetch;
  });

  it('returns policy from API on success', async () => {
    const apiPolicy = {
      min_length: 10,
      require_uppercase: true,
      require_lowercase: true,
      require_digit: false,
      require_special: true,
      history_count: 3,
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => apiPolicy,
    });

    const policy = await fetchPasswordPolicy();
    expect(mockFetch).toHaveBeenCalledWith(
      buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.PASSWORD_POLICY),
    );
    expect(policy).toEqual(apiPolicy);
  });

  it('falls back to defaults when API fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });

    const policy = await fetchPasswordPolicy();
    expect(policy).toEqual(DEFAULT_PASSWORD_POLICY);
  });
});
