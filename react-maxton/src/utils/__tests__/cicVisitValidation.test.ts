import { validateCICVisitCreate, validateCICVisitUpdate } from "../cicVisitValidation";

describe("cicVisitValidation (§7.3 phase-2)", () => {
  describe("validateCICVisitCreate", () => {
    it("accepts a well-formed input", () => {
      expect(
        validateCICVisitCreate({
          activityName: "Digital Literacy Training",
          assistedBy: "Kofi Mensah",
          notes: "Beneficiary finished module 1.",
        }),
      ).toEqual({});
    });

    it("requires activity_name", () => {
      expect(validateCICVisitCreate({ activityName: "", assistedBy: "Kofi Mensah" }).activity_name)
        .toMatch(/required/);
    });

    it("requires assisted_by", () => {
      expect(validateCICVisitCreate({ activityName: "Training", assistedBy: "" }).assisted_by)
        .toMatch(/required/);
    });

    it.each([
      ["<script>alert(1)</script>"],
      ["<SCRIPT src=evil.js></script>"],
      ["<img onerror=alert(1)>"],
      ["javascript:void(0)"],
      ["<%= rce %>"],
    ])("rejects XSS payload in notes (%s)", (payload) => {
      const errs = validateCICVisitCreate({
        activityName: "Training",
        assistedBy: "Kofi Mensah",
        notes: payload,
      });
      expect(errs.notes).toMatch(/invalid/);
    });

    it("rejects script payload in activity_name", () => {
      const errs = validateCICVisitCreate({
        activityName: "<script>alert(1)</script>",
        assistedBy: "Kofi Mensah",
      });
      expect(errs.activity_name).toMatch(/invalid/);
    });

    it("rejects activity_name shorter than 2 characters", () => {
      const errs = validateCICVisitCreate({ activityName: "a", assistedBy: "Kofi Mensah" });
      expect(errs.activity_name).toMatch(/2 characters/);
    });

    it("rejects assisted_by longer than 255 characters", () => {
      const errs = validateCICVisitCreate({
        activityName: "Training",
        assistedBy: "a".repeat(256),
      });
      expect(errs.assisted_by).toMatch(/255/);
    });

    it("rejects notes longer than 5000 characters", () => {
      const errs = validateCICVisitCreate({
        activityName: "Training",
        assistedBy: "Kofi Mensah",
        notes: "a".repeat(5001),
      });
      expect(errs.notes).toMatch(/5000/);
    });
  });

  describe("validateCICVisitUpdate", () => {
    it("allows empty input on partial update", () => {
      expect(validateCICVisitUpdate({})).toEqual({});
    });

    it("validates non-empty fields", () => {
      expect(validateCICVisitUpdate({ activityName: "a" }).activity_name).toMatch(/2 characters/);
    });

    it("validates notes even when other fields are empty", () => {
      expect(
        validateCICVisitUpdate({ notes: "<script>alert(1)</script>" }).notes,
      ).toMatch(/invalid/);
    });
  });
});
