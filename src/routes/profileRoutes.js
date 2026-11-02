import { Router } from "express";
import { createProfile, getProfile, updateAvatar } from "../controllers/profileController.js";
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

router.patch(
  "/avatar",
  requireAuth,
  updateAvatar
);

export default router;