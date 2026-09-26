import { loadIntern, saveIntern } from "../storage.js";
import { Intern } from "../models/Intern.js";

export async function findIntern() {

    const data = await loadIntern();
    
    return new Intern(
        data.name,
        data.role,
        data.level,
        data.xp,
        data.skills
    );
}

export async function updateIntern(intern) {
    
    await saveIntern(intern);

    return intern;
}