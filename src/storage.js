import { readFile, writeFile } from "node:fs/promises";

export async function saveIntern(intern) {
    const data = JSON.stringify(intern, null, 2);

    await writeFile("data/intern.json", data);
}

export async function loadIntern() {
    const data = await readFile("data/intern.json", "utf-8");

    return JSON.parse(data);    
}