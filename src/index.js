import { welcomeIntern, intern, gainXp, addSkill, getInternSummary, getXpToNextLevel } from "./intern.js";
import { saveIntern, loadIntern } from "./storage.js";

const message = welcomeIntern("Gabriel");

console.log(message);
console.log(intern);
console.log(intern.name);
console.log(intern.skills[0]);

async function main() {
    
    gainXp(intern, 350);
    addSkill("Node.js");
    
    await saveIntern(intern);
    
    const savedItern = await loadIntern();
    
    console.log(savedItern);
}

main();

const summary = getInternSummary();
const nextLevel = getXpToNextLevel();

console.log(intern);
console.log(summary);
console.log(nextLevel);
