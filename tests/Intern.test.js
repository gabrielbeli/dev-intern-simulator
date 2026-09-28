import { describe, it, expect } from "vitest";
import { Intern } from "../src/models/Intern.js";

describe("Intern", () => {

    it("should gain XP", () => {
        const intern = new Intern(
            null,
            "Gabriel",
            "Intern",
            1,
            0,
            ["JavaScript"]
        );

        intern.gainXp(50);

        expect(intern.xp).toBe(50);
    });

    it("should level up when reaching the required XP", () => {
        const intern = new Intern(
            null,
            "Gabriel",
            "Intern",
            1,
            90,
            ["JavaScript"]
        );

        intern.gainXp(30);

        expect(intern.xp).toBe(120);
        expect(intern.level).toBe(2);
    });

    it("should level up multiple times when XP crosses multiple thresholds", () => {
        const intern = new Intern(
            null,
            "Gabriel",
            "Intern",
            1,
            0,
            ["JavaScript"]
        );

        intern.gainXp(350);

        expect(intern.xp).toBe(350);
        expect(intern.level).toBe(4);
    });

});