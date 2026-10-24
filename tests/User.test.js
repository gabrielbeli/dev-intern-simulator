import { describe,it, expect } from "vitest";

import { User } from "../src/models/User.js";

describe("User", () => {
    it("should normalize the email", () => {
        const user = new User(
            "user-1",
            "  Gabriel@Example.COM  ",
            "hashed-password"
        );

        expect(user.email).toBe(
            "gabriel@example.com"
        );
    });

    it("should store the password hash", () => {
        const user = new User(
            "user-1",
            "gabriel@example.com",
            "hashed-password"
        );

        expect(user.passwordHash).toBe(
            "hashed-password" 
        );
    });
});