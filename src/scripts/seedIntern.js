import { connectToDatabase, getDatabase } from "../config/database.js";

async function seedIntern() {
    
    await connectToDatabase();

    const database = getDatabase();

    const interns = database.collection("interns");

    const existingIntern = await interns.findOne({

        name: "Gabriel"
    });

    if (existingIntern) {

        console.log("Intern already exists:");
        console.log(existingIntern);

        return;
    }

    const intern = {
        name: "Gabriel",
        role: "Intern",
        level: 1,
        xp: 0,
        skills: ["JavaScript"]
    };

    const result = await interns.insertOne(intern);

    console.log("Intern created:", result.insertedId);
}

seedIntern();