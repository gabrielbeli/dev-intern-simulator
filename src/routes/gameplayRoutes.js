import { Router } from "express";
import { getFloor } from "../controllers/gameplayController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.get(
    "/floors/:floor",
    requireAuth,
    getFloor
);

export default router;