import { Router } from "express";
import { createProfile, getProfile } from "../controllers/profileController.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.post(
    "/",
    requireAuth,
    createProfile
);

router.get(
    "/",
    requireAuth,
    getProfile
);

export default router;