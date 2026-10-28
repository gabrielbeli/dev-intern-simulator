import { registerUser, loginUser } from "../services/authService.js";
import { findUserById } from "../repositories/userRepository.js";

function toPublicUser(user) {
    return {
        id: user.id.toString(),
        email: user.email,
        createdAt: user.createdAt
    };
}

export async function register(req, res) {
    try {
        const { email, password } = req.body;

        const user = await registerUser(
            email,
            password
        );

        return res.status(201).json({
            user: toPublicUser(user)
        });
    } catch (error) {
        if (
            error.message === "Email already registered"
        ) {
            return res.status(409).json({
                error: error.message
            });
        }

        if (
            error.message === "Email is required" ||
            error.message === "Invalid email" ||
            error.message ===
            "Password must be at least 8 characters"
        ) {
            return res.status(400).json({
                error: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await loginUser(
            email,
            password
        );

        req.session.regenerate(error => {
            if (error) {
                console.error(error);

                return res.status(500).json({
                    error: "Could not create session"
                });
            }

            req.session.userId =
                user.id.toString();

            req.session.save(error => {
                if (error) {
                    console.error(error);

                    return res.status(500).json({
                        error: "Could not save session"
                    });
                }

                return res.status(200).json({
                    user: toPublicUser(user)
                });
            });
        });
    } catch (error) {
        if (
            error.message ===
            "Email and password are required"
        ) {
            return res.status(400).json({
                error: error.message
            });
        }

        if (
            error.message ===
            "Invalid email or password"
        ) {
            return res.status(401).json({
                error: error.message
            });
        }

        console.error(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

export async function me(req, res) {
    try {
        if (!req.session.userId) {
            return res.status(401).json({
                error: "Not authenticated"
            });
        }

        const user = await findUserById(
            req.session.userId
        );

        if (!user) {
            return res.status(401).json({
                error: "Not authenticated"
            });
        }

        return res.status(200).json({
            user: toPublicUser(user)
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "Internal server error"
        });
    }
}

export function logout(req, res) {
    req.session.destroy(error => {
        if (error) {
            console.error(error);

            return res.status(500).json({
                error: "Could not logout"
            });
        }

        res.clearCookie("devIntern.sid");

        return res.status(204).send();
    });
}