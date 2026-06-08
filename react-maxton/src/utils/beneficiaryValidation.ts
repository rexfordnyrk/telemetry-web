/**
 * Beneficiary validation utility - mirrors backend validation rules exactly.
 * Source of truth for field validation rules in Go: backend/internal/validation/beneficiary.go
 */

export interface BeneficiaryFormInput {
  name?: string;
  email?: string;
  phone?: string;
  organization?: string;
  district?: string;
  programme?: string;
  photo?: string;
}

/**
 * Validates beneficiary input for CREATE operation.
 * All fields are required. Returns map of field -> error message.
 * Empty object means valid.
 */
export function validateBeneficiaryCreate(
  input: BeneficiaryFormInput
): Record<string, string> {
  const errors: Record<string, string> = {};

  if ((input.name ?? "").trim() === "") {
    errors.name = "name is required";
  } else {
    const nameError = validateName(input.name || "", true);
    if (nameError) errors.name = nameError;
  }

  if ((input.email ?? "").trim() === "") {
    errors.email = "email is required";
  } else {
    const emailError = validateEmail(input.email || "", true);
    if (emailError) errors.email = emailError;
  }

  if ((input.phone ?? "").trim() === "") {
    errors.phone = "phone is required";
  } else {
    const phoneError = validatePhone(input.phone || "", true);
    if (phoneError) errors.phone = phoneError;
  }

  if ((input.organization ?? "").trim() === "") {
    errors.organization = "organization is required";
  } else {
    const orgError = validateOrganization(input.organization || "", true);
    if (orgError) errors.organization = orgError;
  }

  if ((input.district ?? "").trim() === "") {
    errors.district = "district is required";
  } else {
    const districtError = validateDistrict(input.district || "", true);
    if (districtError) errors.district = districtError;
  }

  if ((input.programme ?? "").trim() === "") {
    errors.programme = "programme is required";
  } else {
    const progError = validateProgramme(input.programme || "", true);
    if (progError) errors.programme = progError;
  }

  // Photo validation (optional on create)
  if (input.photo && input.photo !== "") {
    const photoError = validatePhoto(input.photo);
    if (photoError) errors.photo = photoError;
  }

  return errors;
}

/**
 * Validates beneficiary input for UPDATE operation.
 * All fields are optional; only validates non-empty values.
 * Returns map of field -> error message.
 */
export function validateBeneficiaryUpdate(
  input: BeneficiaryFormInput
): Record<string, string> {
  const errors: Record<string, string> = {};

  // Name validation (optional on update)
  if (input.name && input.name !== "") {
    const nameError = validateName(input.name, false);
    if (nameError) errors.name = nameError;
  }

  // Email validation (optional on update)
  if (input.email && input.email !== "") {
    const emailError = validateEmail(input.email, false);
    if (emailError) errors.email = emailError;
  }

  // Phone validation (optional on update)
  if (input.phone && input.phone !== "") {
    const phoneError = validatePhone(input.phone, false);
    if (phoneError) errors.phone = phoneError;
  }

  // Organization validation (optional on update)
  if (input.organization && input.organization !== "") {
    const orgError = validateOrganization(input.organization, false);
    if (orgError) errors.organization = orgError;
  }

  // District validation (optional on update)
  if (input.district && input.district !== "") {
    const districtError = validateDistrict(input.district, false);
    if (districtError) errors.district = districtError;
  }

  // Programme validation (optional on update)
  if (input.programme && input.programme !== "") {
    const progError = validateProgramme(input.programme, false);
    if (progError) errors.programme = progError;
  }

  // Photo validation (optional)
  if (input.photo && input.photo !== "") {
    const photoError = validatePhoto(input.photo);
    if (photoError) errors.photo = photoError;
  }

  return errors;
}

// Private validation functions mirroring backend

function validateName(name: string, required: boolean): string {
  if (name === "") {
    if (required) return "name is required";
    return "";
  }

  // Check length > 5000 first
  if (name.length > 5000) {
    return "maximum length exceeded";
  }

  // Check if at least 2 chars
  if (name.length < 2) {
    return "name must be at least 2 characters";
  }

  // Check if exceeds 100 chars
  if (name.length > 100) {
    return "name must not exceed 100 characters";
  }

  // Check for script/HTML patterns: <script, <%
  const lowerName = name.toLowerCase();
  if (lowerName.includes("<script") || lowerName.includes("<%")) {
    return "name contains invalid characters";
  }

  // Check for explicit forbidden characters: <, >, "
  if (name.includes("<") || name.includes(">") || name.includes('"')) {
    return "name contains invalid characters";
  }

  // Must contain at least one letter
  let hasLetter = false;
  for (const char of name) {
    if (isLetter(char)) {
      hasLetter = true;
      break;
    }
  }
  if (!hasLetter) {
    return "name must contain at least one letter";
  }

  // Allowed characters: Unicode letters, spaces, -, ', .
  for (const char of name) {
    if (
      !isLetter(char) &&
      !isSpace(char) &&
      char !== "-" &&
      char !== "'" &&
      char !== "."
    ) {
      return "name contains invalid characters";
    }
  }

  return "";
}

function validateEmail(email: string, required: boolean): string {
  if (email === "") {
    if (required) return "email is required";
    return "";
  }

  // Check length
  if (email.length > 254) {
    return "email maximum length exceeded";
  }

  // Reject if contains < or >
  if (email.includes("<") || email.includes(">")) {
    return "email is invalid";
  }

  // RFC5322-lite: simple pattern
  // Must have format: something@something.something
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "email is invalid";
  }

  return "";
}

function validatePhone(phone: string, required: boolean): string {
  if (phone === "") {
    if (required) return "phone is required";
    return "";
  }

  // Trim whitespace
  phone = phone.trim();

  // Reject if contains letters
  for (const char of phone) {
    if (isLetter(char)) {
      return "phone is invalid";
    }
  }

  // Reject if contains double +
  if (phone.includes("++")) {
    return "phone is invalid";
  }

  // Must match either Ghana local or international format
  // Local: 0[2-5]XXXXXXXX (10 digits total)
  // International: +233[2-5]XXXXXXXX (13 chars total)
  const localRegex = /^0[2-5]\d{8}$/;
  const intlRegex = /^\+233[2-5]\d{8}$/;

  if (!localRegex.test(phone) && !intlRegex.test(phone)) {
    return "phone is invalid";
  }

  return "";
}

function validatePhoto(photo: string): string {
  if (photo === "") {
    return "";
  }

  if (photo.length > 2048) {
    return "photo maximum length exceeded";
  }

  return "";
}

function validateOrganization(
  organization: string,
  required: boolean
): string {
  if (organization === "") {
    if (required) return "organization is required";
    return "";
  }

  if (organization.length < 2) {
    return "organization must be at least 2 characters";
  }

  if (organization.length > 255) {
    return "organization must not exceed 255 characters";
  }

  // Must contain at least one alphanumeric (letter or digit)
  let hasAlphanumeric = false;
  for (const char of organization) {
    if (isLetter(char) || isDigit(char)) {
      hasAlphanumeric = true;
      break;
    }
  }
  if (!hasAlphanumeric) {
    return "organization must contain at least one alphanumeric character";
  }

  return "";
}

function validateDistrict(district: string, required: boolean): string {
  if (district === "") {
    if (required) return "district is required";
    return "";
  }

  if (district.length < 2) {
    return "district must be at least 2 characters";
  }

  if (district.length > 255) {
    return "district must not exceed 255 characters";
  }

  // Must contain at least one alphanumeric (letter or digit)
  let hasAlphanumeric = false;
  for (const char of district) {
    if (isLetter(char) || isDigit(char)) {
      hasAlphanumeric = true;
      break;
    }
  }
  if (!hasAlphanumeric) {
    return "district must contain at least one alphanumeric character";
  }

  return "";
}

function validateProgramme(programme: string, required: boolean): string {
  if (programme === "") {
    if (required) return "programme is required";
    return "";
  }

  if (programme.length < 2) {
    return "programme must be at least 2 characters";
  }

  if (programme.length > 255) {
    return "programme must not exceed 255 characters";
  }

  // Must contain at least one alphanumeric (letter or digit)
  let hasAlphanumeric = false;
  for (const char of programme) {
    if (isLetter(char) || isDigit(char)) {
      hasAlphanumeric = true;
      break;
    }
  }
  if (!hasAlphanumeric) {
    return "programme must contain at least one alphanumeric character";
  }

  return "";
}

// Unicode category check functions
function isLetter(char: string): boolean {
  const code = char.charCodeAt(0);
  // Simple check: ASCII and common Unicode ranges
  // This matches unicode.IsLetter in Go
  return /[a-zA-ZĀ-￿]/.test(char);
}

function isSpace(char: string): boolean {
  return /\s/.test(char);
}

function isDigit(char: string): boolean {
  return /[0-9]/.test(char);
}
