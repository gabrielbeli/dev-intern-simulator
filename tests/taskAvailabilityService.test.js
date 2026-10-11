import { describe, it, expect } from "vitest";
import { isTaskUnlocked, getAvailableTasks, canStartTask } from "../src/services/taskAvailabilityService.js"; { }

describe("isTaskUnlocked", () => {
    it("should unlock a task with no additional requirements", () => {
        const player = {
            role: "Intern",
            badgeScores: {}
        };

        const task = {
            id: "task-1",
            role: "Intern",
            requirements: {}
        };

        expect(
            isTaskUnlocked(player, task, [])
        ).toBe(true);
    });

    it("should not unlock a task from another role", () => {
        const player = {
            role: "Intern",
            badgeScores: {}
        };

        const task = {
            id: "task-1",
            role: "Intern Bronze",
            requirements: {}
        };

        expect(
            isTaskUnlocked(player, task, [])
        ).toBe(false);
    });

    it("should not unlock a task already completed", () => {
        const player = {
            role: "Intern",
            badgeScores: {}
        };

        const task = {
            id: "task-1",
            role: "Intern",
            requirements: {}
        };

        const progress = [
            {
                taskId: "task-1"
            }
        ];

        expect(
            isTaskUnlocked(
                player,
                task,
                progress
            )
        ).toBe(false);
    });

    it("should require prerequisite tasks to be completed", () => {
        const player = {
            role: "Intern",
            badgeScores: {}
        };

        const task = {
            id: "task-3",
            role: "Intern",

            requirements: {
                completedTasks: [
                    "task-1",
                    "task-2"
                ]
            }
        };

        const progress = [
            {
                taskId: "task-1"
            }
        ];

        expect(
            isTaskUnlocked(
                player,
                task,
                progress
            )
        ).toBe(false);
    });
});

it("should unlock a task when badge requirements are met", () => {
    const player = {
        role: "Intern",
        badgeScores: {
            communication: 6,
            inclusion: 4
        }
    };

    const task = {
        id: "task-4",
        role: "Intern",

        requirements: {
            badgeScores: {
                communication: 5,
                inclusion: 3
            }
        }
    };

    expect(
        isTaskUnlocked(player, task, [])
    ).toBe(true);
});

it("should not unlock a task when badge requirements are not met", () => {
    const player = {
        role: "Intern",
        badgeScores: {
            communication: 4,
            inclusion: 4
        }
    };

    const task = {
        id: "task-4",
        role: "Intern",

        requirements: {
            badgeScores: {
                communication: 5,
                inclusion: 3
            }
        }
    };

    expect(
        isTaskUnlocked(player, task, [])
    ).toBe(false);
});

it("should require both prerequisite tasks and badge scores", () => {
    const player = {
        role: "Intern",
        badgeScores: {
            impact: 5,
            delivery: 4
        }
    };

    const task = {
        id: "task-5",
        role: "Intern",

        requirements: {
            completedTasks: [
                "task-1"
            ],

            badgeScores: {
                impact: 5
            }
        }
    };

    const progress = [
        {
            taskId: "task-1"
        }
    ];

    expect(
        isTaskUnlocked(
            player,
            task,
            progress
        )
    ).toBe(true);
});

describe("getAvailableTasks", () => {
    it("should return only tasks available to the player", () => {
        const player = {
            role: "Intern",

            badgeScores: {
                communication: 5,
                inclusion: 2,
                impact: 1,
                delivery: 0
            }
        };

        const tasks = [
            {
                id: "task-1",
                role: "Intern",
                requirements: {}
            },

            {
                id: "task-2",
                role: "Intern",
                requirements: {
                    badgeScores: {
                        communication: 5
                    }
                }
            },

            {
                id: "task-3",
                role: "Intern",
                requirements: {
                    badgeScores: {
                        delivery: 5
                    }
                }
            },

            {
                id: "task-4",
                role: "Intern Bronze",
                requirements: {}
            }
        ];

        const progress = [];

        const result = getAvailableTasks(
            player,
            tasks,
            progress
        );

        expect(
            result.map(task => task.id)
        ).toEqual([
            "task-1",
            "task-2"
        ]);
    });

    it("should exclude completed tasks from the available list", () => {
        const player = {
            role: "Intern",
            badgeScores: {}
        };

        const tasks = [
            {
                id: "task-1",
                role: "Intern",
                requirements: {}
            },

            {
                id: "task-2",
                role: "Intern",
                requirements: {}
            }
        ];

        const progress = [
            {
                taskId: "task-1"
            }
        ];

        const result = getAvailableTasks(
            player,
            tasks,
            progress
        );

        expect(
            result.map(task => task.id)
        ).toEqual([
            "task-2"
        ]);
    });
});

describe("canStartTask", () => {
    it("should allow starting a task with enough stamina", () => {
        const player = {
            stamina: 30
        };

        const task = {
            staminaCost: 25
        };

        expect(
            canStartTask(player, task)
        ).toBe(true);
    });

    it("should allow starting a task when stamina exactly matches the cost", () => {
        const player = {
            stamina: 25
        };

        const task = {
            staminaCost: 25
        };

        expect(
            canStartTask(player, task)
        ).toBe(true);
    });

    it("should reject starting a task without enough stamina", () => {
        const player = {
            stamina: 15
        };

        const task = {
            staminaCost: 25
        };

        expect(
            canStartTask(player, task)
        ).toBe(false);
    });

    it("should unlock a task when one alternative requirement is met", () => {
        const player = {
            role: "Intern",

            badgeScores: {
                communication: 2,
                inclusion: 6,
                impact: 0,
                delivery: 0
            }
        };

        const task = {
            id: "task-6",
            role: "Intern",

            requirements: {
                anyOf: [
                    {
                        badgeScores: {
                            communication: 5
                        }
                    },
                    {
                        badgeScores: {
                            inclusion: 5
                        }
                    }
                ]
            }
        };

        expect(
            isTaskUnlocked(player, task, [])
        ).toBe(true);
    });

    it("should keep a task locked when no alternative requirement is met", () => {
        const player = {
            role: "Intern",

            badgeScores: {
                communication: 2,
                inclusion: 3,
                impact: 0,
                delivery: 0
            }
        };

        const task = {
            id: "task-6",
            role: "Intern",

            requirements: {
                anyOf: [
                    {
                        badgeScores: {
                            communication: 5
                        }
                    },
                    {
                        badgeScores: {
                            inclusion: 5
                        }
                    }
                ]
            }
        };

        expect(
            isTaskUnlocked(player, task, [])
        ).toBe(false);
    });
});