import { getDatabase } from "../config/database.js";
import { Intern } from "../models/Intern.js";

export async function findIntern() {

    const database = getDatabase();

    const interns = database.collection("interns");

    const data = await interns.findOne({
        name: "Gabriel"
    });

    if (!data) {
        return null;
    }
    
    return new Intern(
        data.name,
        data.role,
        data.level,
        data.xp,
        data.skills
    );
}

export async function updateIntern(intern) {
    
    const database = getDatabase();

    const interns = database.collection("interns");

    await interns.updateOne(
        { name: intern.name },
        { $set: {
            role: intern.role,
            level: intern.level,
            xp: intern.xp,
            skills: intern.skills
            }
        }
    );

    return intern;
}