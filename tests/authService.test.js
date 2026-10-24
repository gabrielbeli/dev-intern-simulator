import { describe, it, expect, vi, beforeEach } from "vitest";
import { findUserByEmail, saveUser } from "../src/repositories/userRepository.js";
import { hashPassword, verifyPassword } from "../src/services/passwordService.js";
import { registerUser, loginUser } from "../src/services/authService.js";

vi.mock("../src/repositories/userRepository.js", () => ({
    findUserByEmail: vi.fn(),
    saveUser: vi.fn()
}));

vi.mock("../src/services/passwordService.js", () => ({
    hashPassword: vi.fn(),
    verifyPassword: vi.fn()
}));

describe("registerUser", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        saveUser.mockResolvedValue(undefined);

        hashPassword.mockResolvedValue(
            "hashed-password"
        );
    });

    it("should register a new user", async () => {
        findUserByEmail.mockResolvedValue(null);

        const user = await registerUser(
            "  Gabriel@Example.COM  ",
            "securePassword123"
        );

        expect(user.email).toBe(
            "gabriel@example.com"
        );

        expect(user.passwordHash).toBe(
            "hashed-password"
        );

        expect(hashPassword).toHaveBeenCalledWith(
            "securePassword123"
        );

        expect(saveUser).toHaveBeenCalledWith(
            user
        );
    });

    it("should reject an already registered email", async () => {
        findUserByEmail.mockResolvedValue({
            id: "user-1"
        });

        await expect(
            registerUser(
                "gabriel@example.com",
                "securePassword123"
            )
        ).rejects.toThrow(
            "Email already registered"
        );

        expect(hashPassword).not.toHaveBeenCalled();
        expect(saveUser).not.toHaveBeenCalled();
    });

    it("should reject an invalid email", async () => {
        await expect(
            registerUser(
                "not-an-email",
                "securePassword123"
            )
        ).rejects.toThrow("Invalid email");

        expect(
            findUserByEmail
        ).not.toHaveBeenCalled();

        expect(hashPassword).not.toHaveBeenCalled();
    });

    it("should reject a short password", async () => {
        await expect(
            registerUser(
                "gabriel@example.com",
                "1234567"
            )
        ).rejects.toThrow(
            "Password must be at least 8 characters"
        );

        expect(
            findUserByEmail
        ).not.toHaveBeenCalled();

        expect(hashPassword).not.toHaveBeenCalled();
    });
});

describe("loginUser", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should login with valid credentials", async () => {
        const user = {
            id: "user-1",
            email: "gabriel@example.com",
            passwordHash: "hashed-password"
        };

        findUserByEmail.mockResolvedValue(user);

        verifyPassword.mockResolvedValue(true);

        const result = await loginUser(
            "gabriel@example.com",
            "securePassword123"
        );

        expect(result).toBe(user);

        expect(
            verifyPassword
        ).toHaveBeenCalledWith(
            "securePassword123",
            "hashed-password"
        );
    });

    it("should reject an unknown email", async () => {
        findUserByEmail.mockResolvedValue(null);

        await expect(
            loginUser(
                "unknown@example.com",
                "securePassword123"
            )
        ).rejects.toThrow(
            "Invalid email or password"
        );

        expect(
            verifyPassword
        ).not.toHaveBeenCalled();
    });

    it("should reject an incorrect password", async () => {
        const user = {
            id: "user-1",
            email: "gabriel@example.com",
            passwordHash: "hashed-password"
        };

        findUserByEmail.mockResolvedValue(user);

        verifyPassword.mockResolvedValue(false);

        await expect(
            loginUser(
                "gabriel@example.com",
                "wrongPassword"
            )
        ).rejects.toThrow(
            "Invalid email or password"
        );
    });

    it("should require email and password", async () => {
        await expect(
            loginUser("", "")
        ).rejects.toThrow(
            "Email and password are required"
        );

        expect(
            findUserByEmail
        ).not.toHaveBeenCalled();
    });
});