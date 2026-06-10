/**
 * Client-side mirror of `backend/internal/validation/user.go`.
 *
 * The forms use these to fail fast — backend is still the source of truth.
 */

export interface UserCreateInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  username?: string;
  designation?: string;
  organization?: string;
}

export interface SelfProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export type UserValidationErrors = Record<string, string>;

const SCRIPT_PATTERNS = [
  /<script/i,
  /<\/script/i,
  /<%/,
  /%>/,
  /javascript:/i,
  /onerror=/i,
  /onload=/i,
];

const containsScriptPattern = (value: string): boolean =>
  SCRIPT_PATTERNS.some((re) => re.test(value));

const NAME_ALLOWED_RE = /^[\p{L}\s\-'.]+$/u;
const USERNAME_RE = /^[A-Za-z0-9_.]+$/;
const PHONE_LOCAL_RE = /^0[2-5]\d{8}$/;
const PHONE_INTL_RE = /^\+233[2-5]\d{8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateName(raw: string | undefined, field: string, required: boolean): string | undefined {
  const value = (raw ?? "").trim();
  if (!value) return required ? `${field} is required` : undefined;
  if (value.length > 100) return `${field} must not exceed 100 characters`;
  if (containsScriptPattern(value)) return `${field} contains invalid characters`;
  if (/[<>"]/.test(value)) return `${field} contains invalid characters`;
  if (!/[\p{L}]/u.test(value)) return `${field} must contain at least one letter`;
  if (!NAME_ALLOWED_RE.test(value)) return `${field} contains invalid characters`;
  return undefined;
}

function validateEmail(raw: string | undefined, required: boolean): string | undefined {
  const value = (raw ?? "").trim();
  if (!value) return required ? "email is required" : undefined;
  if (value.length > 254) return "email maximum length exceeded";
  if (/[<>]/.test(value)) return "email is invalid";
  if (!EMAIL_RE.test(value)) return "email is invalid";
  return undefined;
}

function validatePhone(raw: string | undefined, required: boolean): string | undefined {
  const value = (raw ?? "").trim();
  if (!value) return required ? "phone is required" : undefined;
  if (/[a-z]/i.test(value)) return "phone is invalid";
  if (value.includes("++")) return "phone is invalid";
  if (!PHONE_LOCAL_RE.test(value) && !PHONE_INTL_RE.test(value)) return "phone is invalid";
  return undefined;
}

function validateUsername(raw: string | undefined): string | undefined {
  const value = (raw ?? "").trim();
  if (!value) return undefined;
  if (value.includes("@")) {
    // Allow email-as-username; validate as email instead.
    return validateEmail(value, false);
  }
  if (value.length < 3) return "username must be at least 3 characters";
  if (value.length > 50) return "username must not exceed 50 characters";
  if (!USERNAME_RE.test(value)) return "username contains invalid characters";
  return undefined;
}

function validateFreeText(raw: string | undefined, field: string): string | undefined {
  const value = (raw ?? "").trim();
  if (!value) return undefined; // optional
  if (value.length < 2) return `${field} must be at least 2 characters`;
  if (value.length > 255) return `${field} must not exceed 255 characters`;
  if (containsScriptPattern(value)) return `${field} contains invalid characters`;
  if (/[<>]/.test(value)) return `${field} contains invalid characters`;
  if (!/[\p{L}\p{N}]/u.test(value)) return `${field} must contain at least one alphanumeric character`;
  return undefined;
}

export function validateUserCreate(input: UserCreateInput): UserValidationErrors {
  const errs: UserValidationErrors = {};
  const firstName = validateName(input.firstName, "first_name", true);
  if (firstName) errs.first_name = firstName;
  const lastName = validateName(input.lastName, "last_name", true);
  if (lastName) errs.last_name = lastName;
  const email = validateEmail(input.email, true);
  if (email) errs.email = email;
  const phone = validatePhone(input.phone, true);
  if (phone) errs.phone = phone;
  const username = validateUsername(input.username);
  if (username) errs.username = username;
  const designation = validateFreeText(input.designation, "designation");
  if (designation) errs.designation = designation;
  const organization = validateFreeText(input.organization, "organization");
  if (organization) errs.organization = organization;
  return errs;
}

export function validateSelfProfileUpdate(input: SelfProfileInput): UserValidationErrors {
  const errs: UserValidationErrors = {};
  if (input.firstName) {
    const e = validateName(input.firstName, "first_name", false);
    if (e) errs.first_name = e;
  }
  if (input.lastName) {
    const e = validateName(input.lastName, "last_name", false);
    if (e) errs.last_name = e;
  }
  if (input.phone) {
    const e = validatePhone(input.phone, false);
    if (e) errs.phone = e;
  }
  return errs;
}
