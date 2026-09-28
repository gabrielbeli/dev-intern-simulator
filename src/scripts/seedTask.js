import { connectToDatabase, getDatabase } from "../config/database.js";

async function seedTask() {

    await connectToDatabase();

    const database = getDatabase();

    const interns = database.collection("interns");

    const tasks = database.collection("tasks");

    const intern = await interns.findOne({
        name: "Gabriel"
    })

    if (!intern) {
        console.log("Intern not found");
    return;
    }

    const taskList = [
    {
        title: "Fix login bug",
        type: "bug",
        difficulty: "easy",
        xpReward: 30,
        status: "pending",
        internId: intern._id
    },
    {
        title: "Create unit tests",
        type: "testing",
        difficulty: "medium",
        xpReward: 50,
        status: "pending",
        internId: intern._id
    },
    {
        title: "Update API documentation",
        type: "documentation",
        difficulty: "easy",
        xpReward: 20,
        status: "completed",
        internId: intern._id
    }
    ];

        for (const task of taskList) {
        await tasks.updateOne(
            {
                title: task.title,
                internId: task.internId
            },
            { $setOnInsert: task },
            { upsert: true }
        );
    }

    console.log("Tasks seeded successfully");
    
}

seedTask();