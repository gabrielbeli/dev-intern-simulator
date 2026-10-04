import { describe, it, expect } from "vitest";
import { TaskDefinition } from "../src/models/TaskDefinition.js";
import { BADGES } from "../src/config/gameConfig.js";

function createTask() {
    return new TaskDefinition(
        null,
        "Test Task",
        "A task used for testing.",
        "Intern",
        true,
        "easy",
        15,
        1,
        30,
        1,
        "npc",
        "alex",
        {},
        [
            {
                id: "A",
                text: "Communicate with the team.",
                badgeImpact: {
                    [BADGES.COMMUNICATION]: 2,
                    [BADGES.INCLUSION]: 1
                }
            },
            {
                id: "B",
                text: "Focus on delivery.",
                badgeImpact: {
                    [BADGES.DELIVERY]: 2,
                    [BADGES.IMPACT]: 1
                }
            }
        ]
    );
}

describe("TaskDefinition", () => {
    it("should return a choice by id", () => {
        const task = createTask();

        const choice = task.getChoice("B");

        expect(choice.id).toBe("B");
        expect(choice.badgeImpact.delivery).toBe(2);
    });
});

it("should reject an invalid choice", () => {
    const task = createTask();

    expect(() => {
        task.getChoice("Z");
    }).toThrow("Invalid task choice");
});

it("should return base XP when choice does not match dominant badges", () => {
    const task = createTask();

    const xp = task.calculateXp(
        "B",
        ["communication", "inclusion"]
    );

    expect(xp).toBe(30);
});

it("should add 10 percent XP for one badge match", () => {
    const task = createTask();

    const xp = task.calculateXp(
        "B",
        ["communication", "delivery", "inclusion"]
    );

    expect(xp).toBe(33);
});

it("should add 20 percent XP for two badge matches", () => {
    const task = createTask();

    const xp = task.calculateXp(
        "B",
        ["delivery", "impact", "communication"]
    );

    expect(xp).toBe(36);
});