import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "./auth";

describe("loginSchema", () => {
  it("trims and lowercases email", () => {
    const result = loginSchema.safeParse({
      email: "  User@Example.com  ",
      password: "anything",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("user@example.com");
    }
  });

  it("rejects an invalid email format", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "x",
    });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepts a valid password with letters and numbers", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "abcd1234",
      confirmPassword: "abcd1234",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a password without a digit", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "abcdefgh",
      confirmPassword: "abcdefgh",
    });
    expect(result.success).toBe(false);
  });

  it("rejects mismatched confirmation", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "abcd1234",
      confirmPassword: "abcd9999",
    });
    expect(result.success).toBe(false);
  });
});
