import { validateUserCreate, validateSelfProfileUpdate } from '../userValidation';

describe('validateUserCreate', () => {
  it('flags every required field as missing on an empty input', () => {
    const errs = validateUserCreate({});
    expect(errs.first_name).toMatch(/required/);
    expect(errs.last_name).toMatch(/required/);
    expect(errs.email).toMatch(/required/);
    expect(errs.phone).toMatch(/required/);
  });

  it('accepts a valid payload', () => {
    const errs = validateUserCreate({
      firstName: 'Alice',
      lastName: "O'Brien",
      email: 'alice@example.com',
      phone: '+233244000000',
      designation: 'Engineer',
      organization: 'Acme Co.',
    });
    expect(errs).toEqual({});
  });

  it('rejects <script> in names', () => {
    const errs = validateUserCreate({
      firstName: '<script>alert(1)</script>',
      lastName: 'Tester',
      email: 'a@example.com',
      phone: '+233244000000',
    });
    expect(errs.first_name).toBeTruthy();
  });

  it('rejects onerror= handlers in free text', () => {
    const errs = validateUserCreate({
      firstName: 'Alice',
      lastName: 'Tester',
      email: 'a@example.com',
      phone: '+233244000000',
      designation: 'Engineer onerror=alert(1)',
    });
    expect(errs.designation).toBeTruthy();
  });

  it('rejects HTML brackets and quotes in last_name', () => {
    const errs = validateUserCreate({
      firstName: 'Alice',
      lastName: 'Bad" name',
      email: 'a@example.com',
      phone: '+233244000000',
    });
    expect(errs.last_name).toBeTruthy();
  });

  it('rejects invalid email and phone', () => {
    const errs = validateUserCreate({
      firstName: 'Alice',
      lastName: 'Tester',
      email: 'not-an-email',
      phone: 'abc123',
    });
    expect(errs.email).toBeTruthy();
    expect(errs.phone).toBeTruthy();
  });
});

describe('validateSelfProfileUpdate', () => {
  it('returns empty errors on an empty input', () => {
    expect(validateSelfProfileUpdate({})).toEqual({});
  });

  it('rejects scripted first_name', () => {
    const errs = validateSelfProfileUpdate({ firstName: '<script>alert(1)</script>' });
    expect(errs.first_name).toBeTruthy();
  });

  it('rejects bad phone', () => {
    const errs = validateSelfProfileUpdate({ phone: 'abc' });
    expect(errs.phone).toBeTruthy();
  });

  it('accepts a valid partial profile', () => {
    const errs = validateSelfProfileUpdate({ firstName: 'Alice', lastName: 'Tester', phone: '+233244000000' });
    expect(errs).toEqual({});
  });
});
