import { loadIntern, saveIntern } from "../storage.js";
import { addXpToIntern } from "../services/internService.js";

export async function getIntern(request, response) {
    try {
        const intern = await loadIntern();

        return response.status(200).json(intern);

    } catch (error) {
        
        console.error("Error loading intern:", error.message);

        return response.status(500).json({
            message: "Could not load intern"
        });
    }
}

export async function addInternXp(request, response) {
    try {
        const { amount } = request.body;

        if (typeof amount !== "number" || amount <= 0) {
            return response.status(400).json({
                message: "Amount must be a positive number"
            });
        }

        const intern = await addXpToIntern(amount);

        return response.status(200).json(intern);

    } catch (error) {
        
        console.error("Error updating intern:", error.message);

        return response.status(500).json({
            message: "Could not update intern"
        });
    }
}