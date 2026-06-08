/**
 * Client-side mirror of `backend/internal/validation/cic_visit.go`.
 *
 * Used by check-in / edit-visit forms so users see the same validation
 * messages the server would return, and obvious bad input is rejected
 * before the round trip. The backend is still the source of truth.
 */

export interface CICVisitInput {
  activityName?: string;
  assistedBy?: string;
  notes?: string;
}

export type CICVisitValidationErrors = Partial<Record<"activity_name" | "assisted_by" | "notes", string>>;

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

const validateActivityName = (raw: string | undefined, required: boolean): string | undefined => {
  const value = (raw ?? "").trim();
  if (!value) {
    return required ? "activity_name is required" : undefined;
  }
  if (value.length < 2) return "activity_name must be at least 2 characters";
  if (value.length > 255) return "activity_name must not exceed 255 characters";
  if (containsScriptPattern(value)) return "activity_name contains invalid characters";
  return undefined;
};

const validateAssistedBy = (raw: string | undefined, required: boolean): string | undefined => {
  const value = (raw ?? "").trim();
  if (!value) {
    return required ? "assisted_by is required" : undefined;
  }
  if (value.length < 2) return "assisted_by must be at least 2 characters";
  if (value.length > 255) return "assisted_by must not exceed 255 characters";
  if (containsScriptPattern(value)) return "assisted_by contains invalid characters";
  return undefined;
};

const validateNotes = (raw: string | undefined): string | undefined => {
  const value = raw ?? "";
  if (!value) return undefined;
  if (value.length > 5000) return "notes must not exceed 5000 characters";
  if (containsScriptPattern(value)) return "notes contains invalid characters";
  return undefined;
};

export const validateCICVisitCreate = (input: CICVisitInput): CICVisitValidationErrors => {
  const errs: CICVisitValidationErrors = {};
  const a = validateActivityName(input.activityName, true);
  if (a) errs.activity_name = a;
  const b = validateAssistedBy(input.assistedBy, true);
  if (b) errs.assisted_by = b;
  const n = validateNotes(input.notes);
  if (n) errs.notes = n;
  return errs;
};

export const validateCICVisitUpdate = (input: CICVisitInput): CICVisitValidationErrors => {
  const errs: CICVisitValidationErrors = {};
  if ((input.activityName ?? "").trim()) {
    const a = validateActivityName(input.activityName, false);
    if (a) errs.activity_name = a;
  }
  if ((input.assistedBy ?? "").trim()) {
    const b = validateAssistedBy(input.assistedBy, false);
    if (b) errs.assisted_by = b;
  }
  const n = validateNotes(input.notes);
  if (n) errs.notes = n;
  return errs;
};
