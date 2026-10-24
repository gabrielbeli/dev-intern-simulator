import { findUserByEmail, saveUser } from "../repositories/userRepository.js";
import { User } from "../models/User.js";
import { hashPassword, verifyPassword } from "./passwordService.js";

function validateRegistration(email, password) {
    if (
        typeof email !== "string" ||
        !email.trim()
    ) {
        throw new Error("Email is required");
    }

    const normalizedEmail =
        email.trim().toLowerCase();

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
        throw new Error("Invalid email");
    }

    if (
        typeof password !== "string" ||
        password.length < 8
    ) {
        throw new Error(
            "Password must be at least 8 characters"
        );
    }
}

export async function registerUser(
    email,
    password
) {
    validateRegistration(
        email,
        password
    );

    const existingUser =
        await findUserByEmail(email);

    if (existingUser) {
        throw new Error(
            "Email already registered"
        );
    }

    const passwordHash =
        await hashPassword(password);

    const user = new User(
        null,
        email,
        passwordHash
    );

    await saveUser(user);

    return user;
}

export async function loginUser(
    email,
    password
) {
    if (
        typeof email !== "string" ||
        !email.trim() ||
        typeof password !== "string" ||
        !password
    ) {
        throw new Error(
            "Email and password are required"
        );
    }

    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error(
            "Invalid email or password"
        );
    }

    const passwordMatches =
        await verifyPassword(
            password,
            user.passwordHash
        );

    if (!passwordMatches) {
        throw new Error(
            "Invalid email or password"
        );
    }

    return user;
}