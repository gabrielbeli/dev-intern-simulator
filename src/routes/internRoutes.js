import { Router } from "express";
import { getIntern, addInternXp } from "../controllers/internController.js";

const internRoutes = Router();

internRoutes.get("/", getIntern);

internRoutes.post("/xp", addInternXp);

export { internRoutes };

