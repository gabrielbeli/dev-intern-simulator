import { TaskDefinition } from "../models/TaskDefinition.js";
import { BADGES } from "../config/gameConfig.js";

const task = new TaskDefinition(
    null,
    "Unexpected Production Issue",
    "A problem was detected shortly before a release.",
    "Intern",
    true,
    "medium",
    25,
    2,
    50,
    1,
    "npc",
    "alex",
    {},
    [
        {
            id: "A",
            text: "Gather the team and clarify what happened.",
            badgeImpact: {
                [BADGES.COMMUNICATION]: 2,
                [BADGES.INCLUSION]: 1
            }
        },

        {
            id: "B",
            text: "Focus immediately on restoring the service.",
            badgeImpact: {
                [BADGES.DELIVERY]: 2,
                [BADGES.IMPACT]: 1
            }
        },

        {
            id: "C",
            text: "Investigate the root cause before deciding what to change.",
            badgeImpact: {
                [BADGES.IMPACT]: 2,
                [BADGES.DELIVERY]: 1
            }
        },

        {
            id: "D",
            text: "Ask everyone involved to propose a solution together.",
            badgeImpact: {
                [BADGES.INCLUSION]: 2,
                [BADGES.COMMUNICATION]: 1
            }
        }
    ]
);

console.log(task);