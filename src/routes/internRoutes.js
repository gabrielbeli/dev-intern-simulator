import { Router } from "express";
import { getIntern, addInternXp } from "../controllers/internController.js";
import { getInternTasks } from "../controllers/taskController.js";

const internRoutes = Router();

internRoutes.get("/:id", getIntern);

internRoutes.post("/xp", addInternXp);

internRoutes.get("/:id/tasks", getInternTasks);

export { internRoutes };

