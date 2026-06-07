import { buildApiUrl, API_CONFIG } from '../config/api';

export interface PasswordPolicy {
  min_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_digit: boolean;
  require_special: boolean;
  history_count: number;
}

export const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  min_length: 8,
  require_uppercase: true,
  require_lowercase: true,
  require_digit: true,
  require_special: true,
  history_count: 5,
};

/** Mirror backend password complexity rules for instant client-side feedback. */
export function validatePassword(
  password: string,
  policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY,
): string[] {
  const violations: string[] = [];

  if (password.length < policy.min_length) {
    violations.push(`must be at least ${policy.min_length} characters`);
  }

  let hasUpper = false;
  let hasLower = false;
  let hasDigit = false;
  let hasSpecial = false;

  for (const char of password) {
    if (/[A-Z]/.test(char)) {
      hasUpper = true;
    } else if (/[a-z]/.test(char)) {
      hasLower = true;
    } else if (/\d/.test(char)) {
      hasDigit = true;
    } else if (!/\s/.test(char)) {
      hasSpecial = true;
    }
  }

  if (policy.require_uppercase && !hasUpper) {
    violations.push('must contain at least one uppercase letter');
  }
  if (policy.require_lowercase && !hasLower) {
    violations.push('must contain at least one lowercase letter');
  }
  if (policy.require_digit && !hasDigit) {
    violations.push('must contain at least one digit');
  }
  if (policy.require_special && !hasSpecial) {
    violations.push('must contain at least one special character');
  }

  return violations;
}

/** Build human-readable hint text from active policy flags. */
export function formatPolicyHint(policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY): string {
  const rules: string[] = [`at least ${policy.min_length} characters`];

  if (policy.require_uppercase) {
    rules.push('one uppercase letter');
  }
  if (policy.require_lowercase) {
    rules.push('one lowercase letter');
  }
  if (policy.require_digit) {
    rules.push('one digit');
  }
  if (policy.require_special) {
    rules.push('one special character');
  }

  if (rules.length === 1) {
    return `Password must be ${rules[0]}.`;
  }

  const last = rules.pop();
  return `Password must contain ${rules.join(', ')}, and ${last}.`;
}

/** Fetch public password policy from the API; falls back to defaults on failure. */
export async function fetchPasswordPolicy(): Promise<PasswordPolicy> {
  try {
    const response = await fetch(
      buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.PASSWORD_POLICY),
    );
    if (!response.ok) {
      return DEFAULT_PASSWORD_POLICY;
    }
    return response.json();
  } catch {
    return DEFAULT_PASSWORD_POLICY;
  }
}

export interface PasswordPolicyErrorResponse {
  error: string;
  description?: string;
  violations?: string[];
}

/** Extract violation messages from a password_policy API error body. */
export function extractPolicyViolations(data: PasswordPolicyErrorResponse): string[] {
  if (data.error === 'password_policy' && Array.isArray(data.violations)) {
    return data.violations;
  }
  return [];
}
