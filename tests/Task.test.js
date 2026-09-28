import { describe, it, expect } from "vitest";
import { Task } from "../src/models/Task.js";

describe("Task", () => {

    it("should complete a pending task", () => {
        const task = new Task(
            null,
            "Fix login bug",
            "bug",
            "easy",
            30
        );

        task.complete();

        expect(task.status).toBe("completed");
    });

    it("should not complete an already completed task", () => {
        const task = new Task(
            null,
            "Fix login bug",
            "bug",
            "easy",
            30,
            "completed"
        );

        expect(() => {
            task.complete();
        }).toThrow("Task already completed");
    });

});