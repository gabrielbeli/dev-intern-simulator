import { addXpToIntern, getInternData } from "../services/internService.js";
import { ObjectId } from "mongodb";

export async function getIntern(request, response) {
    try {
        
        const { id } = request.params;

        if (!ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "Invalid intern id"
            });
        }
        
        const intern = await getInternData(id);

        if (!intern) {
            return response.status(404).json({
                message: "Intern not found"
            });
        }

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