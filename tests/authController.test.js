import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerUser, loginUser } from "../src/services/authService.js";
import { findUserById } from "../src/repositories/userRepository.js";
import { register, login, logout, me } from "../src/controllers/authController.js";

vi.mock("../src/services/authService.js", () => ({
    registerUser: vi.fn(),
    loginUser: vi.fn()
}));

vi.mock("../src/repositories/userRepository.js", () => ({
    findUserById: vi.fn()
}));

function createResponse() {
    const res = {};

    res.status = vi.fn(() => res);
    res.json = vi.fn(() => res);
    res.send = vi.fn(() => res);
    res.clearCookie = vi.fn(() => res);

    return res;
}

describe("authController", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should login and store user id in the session", async () => {
        const user = {
            id: {
                toString() {
                    return "user-1";
                }
            },
            email: "gabriel@example.com",
            createdAt: new Date("2026-10-25")
        };

        loginUser.mockResolvedValue(user);

        const req = {
            body: {
                email: "gabriel@example.com",
                password: "securePassword123"
            },

            session: {
                regenerate: vi.fn(callback => {
                    callback(null);
                }),

                save: vi.fn(callback => {
                    callback(null);
                })
            }
        };

        const res = createResponse();

        await login(req, res);

        expect(loginUser).toHaveBeenCalledWith(
            "gabriel@example.com",
            "securePassword123"
        );

        expect(
            req.session.regenerate
        ).toHaveBeenCalled();

        expect(req.session.userId).toBe(
            "user-1"
        );

        expect(
            req.session.save
        ).toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(
            200
        );

        expect(res.json).toHaveBeenCalledWith({
            user: {
                id: "user-1",
                email: "gabriel@example.com",
                createdAt: user.createdAt
            }
        });
    });

    it("should return 401 for invalid credentials", async () => {
        loginUser.mockRejectedValue(
            new Error("Invalid email or password")
        );

        const req = {
            body: {
                email: "gabriel@example.com",
                password: "wrongPassword"
            },

            session: {}
        };

        const res = createResponse();

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(
            401
        );

        expect(res.json).toHaveBeenCalledWith({
            error: "Invalid email or password"
        });
    });

    it("should return the authenticated user", async () => {
        const user = {
            id: {
                toString() {
                    return "user-1";
                }
            },
            email: "gabriel@example.com",
            createdAt: new Date("2026-10-25")
        };

        findUserById.mockResolvedValue(user);

        const req = {
            session: {
                userId: "user-1"
            }
        };

        const res = createResponse();

        await me(req, res);

        expect(findUserById).toHaveBeenCalledWith(
            "user-1"
        );

        expect(res.status).toHaveBeenCalledWith(
            200
        );

        expect(res.json).toHaveBeenCalledWith({
            user: {
                id: "user-1",
                email: "gabriel@example.com",
                createdAt: user.createdAt
            }
        });
    });

    it("should return 401 when there is no authenticated session", async () => {
        const req = {
            session: {}
        };

        const res = createResponse();

        await me(req, res);

        expect(
            findUserById
        ).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(
            401
        );

        expect(res.json).toHaveBeenCalledWith({
            error: "Not authenticated"
        });
    });

    it("should register a new user and return 201", async () => {
        const user = {
            id: {
                toString() {
                    return "user-1";
                }
            },
            email: "gabriel@example.com",
            createdAt: new Date("2026-10-25")
        };

        registerUser.mockResolvedValue(user);

        const req = {
            body: {
                email: "gabriel@example.com",
                password: "securePassword123"
            }
        };

        const res = createResponse();

        await register(req, res);

        expect(registerUser).toHaveBeenCalledWith(
            "gabriel@example.com",
            "securePassword123"
        );

        expect(res.status).toHaveBeenCalledWith(201);

        expect(res.json).toHaveBeenCalledWith({
            user: {
                id: "user-1",
                email: "gabriel@example.com",
                createdAt: user.createdAt
            }
        });
    });

    it("should return 409 when email is already registered", async () => {
        registerUser.mockRejectedValue(
            new Error("Email already registered")
        );

        const req = {
            body: {
                email: "gabriel@example.com",
                password: "securePassword123"
            }
        };

        const res = createResponse();

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(409);

        expect(res.json).toHaveBeenCalledWith({
            error: "Email already registered"
        });
    });

    it("should destroy the session and clear the cookie on logout", () => {
        const req = {
            session: {
                destroy: vi.fn(callback => {
                    callback(null);
                })
            }
        };

        const res = createResponse();

        logout(req, res);

        expect(req.session.destroy).toHaveBeenCalled();

        expect(res.clearCookie).toHaveBeenCalledWith(
            "devIntern.sid"
        );

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalled();
    });

    it("should return 500 when the session cannot be destroyed", () => {
        const req = {
            session: {
                destroy: vi.fn(callback => {
                    callback(
                        new Error("Session store error")
                    );
                })
            }
        };

        const res = createResponse();

        logout(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            error: "Could not logout"
        });

        expect(res.clearCookie).not.toHaveBeenCalled();
    });

})
