import {
  validateBeneficiaryCreate,
  validateBeneficiaryUpdate,
} from "../beneficiaryValidation";

describe("validateBeneficiaryCreate", () => {
  describe("name validation", () => {
    it("rejects <script>alert(1)</script> with 'invalid characters' message", () => {
      const result = validateBeneficiaryCreate({
        name: "<script>alert(1)</script>",
        email: "test@example.com",
        phone: "0551234567",
        organization: "Org",
        district: "District",
        programme: "Programme",
      });
      expect(result.name).toBe("name contains invalid characters");
    });

    it("rejects 5001-char name with 'maximum' message", () => {
      const longName = "a".repeat(5001);
      const result = validateBeneficiaryCreate({
        name: longName,
        email: "test@example.com",
        phone: "0551234567",
        organization: "Org",
        district: "District",
        programme: "Programme",
      });
      expect(result.name).toMatch(/maximum/i);
    });

    it("rejects '12345' (digits only)", () => {
      const result = validateBeneficiaryCreate({
        name: "12345",
        email: "test@example.com",
        phone: "0551234567",
        organization: "Org",
        district: "District",
        programme: "Programme",
      });
      expect(result.name).toBeTruthy();
    });

    it("accepts 'O'Brien'", () => {
      const result = validateBeneficiaryCreate({
        name: "O'Brien",
        email: "test@example.com",
        phone: "0551234567",
        organization: "Org",
        district: "District",
        programme: "Programme",
      });
      expect(result.name).toBeUndefined();
    });

    it("rejects name with < or > characters", () => {
      const result = validateBeneficiaryCreate({
        name: "John <script>",
        email: "test@example.com",
        phone: "0551234567",
        organization: "Org",
        district: "District",
        programme: "Programme",
      });
      expect(result.name).toBe("name contains invalid characters");
    });

    it("requires name on create", () => {
      const result = validateBeneficiaryCreate({
        name: "",
        email: "test@example.com",
        phone: "0551234567",
        organization: "Org",
        district: "District",
        programme: "Programme",
      });
      expect(result.name).toMatch(/required/i);
    });
  });

  describe("email validation", () => {
    it("rejects '<a@b.com>' email", () => {
      const result = validateBeneficiaryCreate({
        name: "John Doe",
        email: "<a@b.com>",
        phone: "0551234567",
        organization: "Org",
        district: "District",
        programme: "Programme",
      });
      expect(result.email).toBe("email is invalid");
    });

    it("requires email on create", () => {
      const result = validateBeneficiaryCreate({
        name: "John Doe",
        email: "",
        phone: "0551234567",
        organization: "Org",
        district: "District",
        programme: "Programme",
      });
      expect(result.email).toMatch(/required/i);
    });

    it("accepts valid email", () => {
      const result = validateBeneficiaryCreate({
        name: "John Doe",
        email: "john@example.com",
        phone: "0551234567",
        organization: "Org",
        district: "District",
        programme: "Programme",
      });
      expect(result.email).toBeUndefined();
    });
  });

  describe("phone validation", () => {
    it("rejects 'abc055' phone with 'invalid'", () => {
      const result = validateBeneficiaryCreate({
        name: "John Doe",
        email: "test@example.com",
        phone: "abc055",
        organization: "Org",
        district: "District",
        programme: "Programme",
      });
      expect(result.phone).toBe("phone is invalid");
    });

    it("accepts '0551234567'", () => {
      const result = validateBeneficiaryCreate({
        name: "John Doe",
        email: "test@example.com",
        phone: "0551234567",
        organization: "Org",
        district: "District",
        programme: "Programme",
      });
      expect(result.phone).toBeUndefined();
    });

    it("accepts '+233551234567'", () => {
      const result = validateBeneficiaryCreate({
        name: "John Doe",
        email: "test@example.com",
        phone: "+233551234567",
        organization: "Org",
        district: "District",
        programme: "Programme",
      });
      expect(result.phone).toBeUndefined();
    });

    it("rejects phone with double plus", () => {
      const result = validateBeneficiaryCreate({
        name: "John Doe",
        email: "test@example.com",
        phone: "++233551234567",
        organization: "Org",
        district: "District",
        programme: "Programme",
      });
      expect(result.phone).toBe("phone is invalid");
    });
  });

  describe("organization validation", () => {
    it("rejects '@@@@@' organization", () => {
      const result = validateBeneficiaryCreate({
        name: "John Doe",
        email: "test@example.com",
        phone: "0551234567",
        organization: "@@@@@",
        district: "District",
        programme: "Programme",
      });
      expect(result.organization).toBeTruthy();
    });

    it("requires organization on create", () => {
      const result = validateBeneficiaryCreate({
        name: "John Doe",
        email: "test@example.com",
        phone: "0551234567",
        organization: "",
        district: "District",
        programme: "Programme",
      });
      expect(result.organization).toMatch(/required/i);
    });
  });

  describe("integration", () => {
    it("requires all fields on create", () => {
      const result = validateBeneficiaryCreate({});
      expect(Object.keys(result).length).toBeGreaterThan(0);
    });

    it("accepts valid complete form", () => {
      const result = validateBeneficiaryCreate({
        name: "John Doe",
        email: "john@example.com",
        phone: "0551234567",
        organization: "Global NGO",
        district: "Accra",
        programme: "Education Initiative",
      });
      expect(result).toEqual({});
    });
  });
});

describe("validateBeneficiaryUpdate", () => {
  describe("field optionality", () => {
    it("allows empty fields", () => {
      const result = validateBeneficiaryUpdate({});
      expect(result).toEqual({});
    });

    it("allows partial updates", () => {
      const result = validateBeneficiaryUpdate({
        name: "Jane Doe",
      });
      expect(result).toEqual({});
    });

    it("validates only non-empty fields", () => {
      const result = validateBeneficiaryUpdate({
        name: "Jane Doe",
        email: "", // empty, should not be validated
      });
      expect(result).toEqual({});
    });

    it("rejects invalid values in non-empty fields", () => {
      const result = validateBeneficiaryUpdate({
        name: "<script>alert(1)</script>",
        email: "", // This is empty, so no error
      });
      expect(result.name).toBe("name contains invalid characters");
      expect(result.email).toBeUndefined();
    });
  });

  describe("name validation in update", () => {
    it("accepts O'Brien on update", () => {
      const result = validateBeneficiaryUpdate({
        name: "O'Brien",
      });
      expect(result.name).toBeUndefined();
    });

    it("rejects digits-only name", () => {
      const result = validateBeneficiaryUpdate({
        name: "12345",
      });
      expect(result.name).toBeTruthy();
    });
  });

  describe("email validation in update", () => {
    it("validates email format when provided", () => {
      const result = validateBeneficiaryUpdate({
        email: "invalid-email",
      });
      expect(result.email).toBeTruthy();
    });
  });

  describe("phone validation in update", () => {
    it("validates phone format when provided", () => {
      const result = validateBeneficiaryUpdate({
        phone: "invalid-phone",
      });
      expect(result.phone).toBeTruthy();
    });
  });
});
