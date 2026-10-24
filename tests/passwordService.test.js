import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../src/services/passwordService.js";

describe("passwordService", () => {
    it("should hash a password", async () => {
        const password = "MySecurePassword123!";

        const passwordHash =
            await hashPassword(password);

        expect(passwordHash).not.toBe(password);

        expect(passwordHash.length).toBeGreaterThan(
            password.length
        );
    });

    it("should verify the correct password", async () => {
        const password = "MySecurePassword123!";

        const passwordHash =
            await hashPassword(password);

        const matches =
            await verifyPassword(
                password,
                passwordHash
            );

        expect(matches).toBe(true);
    });

    it("should reject an incorrect password", async () => {
        const passwordHash =
            await hashPassword(
                "MySecurePassword123!"
            );

        const matches =
            await verifyPassword(
                "WrongPassword",
                passwordHash
            );

        expect(matches).toBe(false);
    });
}); 