import { Router } from "express";
import { completeTaskHandler } from "../controllers/taskController.js";

const taskRoutes = Router();

taskRoutes.patch("/:id/complete", completeTaskHandler);

export default taskRoutes;