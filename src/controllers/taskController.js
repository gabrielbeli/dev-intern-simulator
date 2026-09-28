import { ObjectId } from "mongodb";
import { getTasksByInternId, completeTask as completeTaskService } from "../services/taskService.js";

export async function getInternTasks(request, response) {
    try {
        const { id } = request.params;

        const { status } = request.query;

        const validStatuses = ["pending", "completed"];

        if (status && !validStatuses.includes(status)) {
            return response.status(400).json({
                message: "Invalid task status"
            });
        }

        if (!ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "Invalid intern id"
            });
        }

        const tasks = await getTasksByInternId(id, status);

        return response.status(200).json(tasks);
    } catch (error) {
        
        console.error("Error loading tasks:", error.message);

        return response.status(500).json({
            message: "Could not load tasks"
        });
    }
}

export async function completeTaskHandler(request, response) {
  try {
        const { id } = request.params;

        if (!ObjectId.isValid(id)) {
            return response.status(400).json({
                message: "Invalid task id"
            });
        }

        const result = await completeTaskService(id);

        if (!result) {
            return response.status(404).json({
                message: "Task not found"
            });
        }

        return response.status(200).json(result);

    } catch (error) {
        if (error.message === "Task already completed") {
            return response.status(409).json({
                message: "Task already completed"
            });
        }

        console.error("Error completing task:", error.message);

        return response.status(500).json({
            message: "Could not complete task"
        });
    }
}