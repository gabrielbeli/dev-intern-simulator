import { findIntern, updateIntern } from "../repositories/internRepository.js";

export async function addXpToIntern(amount) {
    
    const intern = await findIntern();

    intern.gainXp(amount);

    await updateIntern(intern);

    return intern;
}

export async function getInternData(id) {
    
    const intern = await findIntern(id);

    return intern;
}