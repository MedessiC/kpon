import { describe, it, expect } from "vitest";
import { LoginSchema, SignupSchema, ProjectSchema, PaymentSchema } from "@/lib/schemas";

describe("Validation Schemas", () => {
  describe("LoginSchema", () => {
    it("should validate correct login credentials", () => {
      const validData = {
        email: "test@example.com",
        password: "password123",
      };
      expect(() => LoginSchema.parse(validData)).not.toThrow();
    });

    it("should reject invalid email", () => {
      const invalidData = {
        email: "invalid-email",
        password: "password123",
      };
      expect(() => LoginSchema.parse(invalidData)).toThrow();
    });

    it("should reject short password", () => {
      const invalidData = {
        email: "test@example.com",
        password: "123",
      };
      expect(() => LoginSchema.parse(invalidData)).toThrow();
    });
  });

  describe("SignupSchema", () => {
    it("should validate correct signup data", () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        confirmPassword: "password123",
      };
      expect(() => SignupSchema.parse(validData)).not.toThrow();
    });

    it("should reject mismatched passwords", () => {
      const invalidData = {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
        confirmPassword: "different",
      };
      expect(() => SignupSchema.parse(invalidData)).toThrow();
    });

    it("should reject short name", () => {
      const invalidData = {
        name: "J",
        email: "john@example.com",
        password: "password123",
        confirmPassword: "password123",
      };
      expect(() => SignupSchema.parse(invalidData)).toThrow();
    });
  });

  describe("ProjectSchema", () => {
    it("should validate correct project data", () => {
      const validData = {
        title: "My Project",
        description: "This is a detailed project description",
        price: 50000,
      };
      expect(() => ProjectSchema.parse(validData)).not.toThrow();
    });

    it("should reject short title", () => {
      const invalidData = {
        title: "ABC",
        description: "This is a detailed project description",
        price: 50000,
      };
      expect(() => ProjectSchema.parse(invalidData)).toThrow();
    });

    it("should reject low price", () => {
      const invalidData = {
        title: "My Project",
        description: "This is a detailed project description",
        price: 500,
      };
      expect(() => ProjectSchema.parse(invalidData)).toThrow();
    });
  });

  describe("PaymentSchema", () => {
    it("should validate correct payment data", () => {
      const validData = {
        amount: 50000,
        projectId: "proj123",
        phoneNumber: "+22312345678",
      };
      expect(() => PaymentSchema.parse(validData)).not.toThrow();
    });

    it("should reject invalid phone number", () => {
      const invalidData = {
        amount: 50000,
        projectId: "proj123",
        phoneNumber: "invalid",
      };
      expect(() => PaymentSchema.parse(invalidData)).toThrow();
    });

    it("should reject zero amount", () => {
      const invalidData = {
        amount: 0,
        projectId: "proj123",
        phoneNumber: "+22312345678",
      };
      expect(() => PaymentSchema.parse(invalidData)).toThrow();
    });
  });
});
