import { describe, it, expect, vi } from "vitest";
import { requireAuth } from "../src/middlewares/requireAuth.js";

function createResponse() {
    const res = {};

    res.status = vi.fn(() => res);
    res.json = vi.fn(() => res);

    return res;
}

describe("requireAuth", () => {
    it("should continue when the user is authenticated", () => {
        const req = {
            session: {
                userId: "user-1"
            }
        };

        const res = createResponse();
        const next = vi.fn();

        requireAuth(
            req,
            res,
            next
        );

        expect(next).toHaveBeenCalled();

        expect(
            res.status
        ).not.toHaveBeenCalled();
    });

    it("should return 401 when there is no authenticated user", () => {
        const req = {
            session: {}
        };

        const res = createResponse();
        const next = vi.fn();

        requireAuth(
            req,
            res,
            next
        );

        expect(next).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(
            401
        );

        expect(res.json).toHaveBeenCalledWith({
            error: "Not authenticated"
        });
    });

    it("should return 401 when there is no session", () => {
        const req = {};

        const res = createResponse();
        const next = vi.fn();

        requireAuth(
            req,
            res,
            next
        );

        expect(next).not.toHaveBeenCalled();

        expect(res.status).toHaveBeenCalledWith(
            401
        );
    });
});