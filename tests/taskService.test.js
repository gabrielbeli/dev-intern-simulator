import { describe, it, expect, vi, beforeEach } from "vitest";
import { Task } from "../src/models/Task.js";
import { Intern } from "../src/models/Intern.js";
import { findTaskById, updateTask } from "../src/repositories/taskRepository.js";
import { findIntern, updateIntern } from "../src/repositories/internRepository.js";
import { completeTask } from "../src/services/taskService.js";

vi.mock("../src/repositories/taskRepository.js", () => ({
    findTasksByInternId: vi.fn(),
    findTaskById: vi.fn(),
    updateTask: vi.fn()
}));

vi.mock("../src/repositories/internRepository.js", () => ({
    findIntern: vi.fn(),
    updateIntern: vi.fn()
}));

describe("completeTask", () => {

    it("should complete the task and reward XP to the intern", async () => {

        const task = new Task(
            "task-1",
            "Fix login bug",
            "bug",
            "easy",
            30,
            "pending",
            "intern-1"
        );

        const intern = new Intern(
            "intern-1",
            "Gabriel",
            "Intern",
            1,
            50,
            ["JavaScript"]
        );

        findTaskById.mockResolvedValue(task);
        findIntern.mockResolvedValue(intern);

        beforeEach(() => {
            vi.clearAllMocks();
        });

        const result = await completeTask("task-1");

        expect(result.task.status).toBe("completed");
        expect(result.intern.xp).toBe(80);

        expect(updateTask).toHaveBeenCalledWith(task);
        expect(updateIntern).toHaveBeenCalledWith(intern);

        expect(updateTask).toHaveBeenCalledTimes(1);
        expect(updateIntern).toHaveBeenCalledTimes(1);

        
    });

    it("should return null when task does not exist", async () => {
        findTaskById.mockResolvedValue(null);

        const result = await completeTask("task-999");

        expect(result).toBeNull();

        expect(findIntern).not.toHaveBeenCalled();
        expect(updateTask).not.toHaveBeenCalled();
        expect(updateIntern).not.toHaveBeenCalled();
    });

    it("should not reward XP when task is already completed", async () => {
        const task = new Task(
            "task-1",
            "Fix login bug",
            "bug",
            "easy",
            30,
            "completed",
            "intern-1"
        );

        findTaskById.mockResolvedValue(task);

        await expect(
            completeTask("task-1")
        ).rejects.toThrow("Task already completed");

        expect(findIntern).not.toHaveBeenCalled();
        expect(updateTask).not.toHaveBeenCalled();
        expect(updateIntern).not.toHaveBeenCalled();
    });

});