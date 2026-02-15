import { Router } from "express";
import { asynHandler } from "../middlewares/asyncHandler.middleware";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.post("/register", asynHandler(AuthController.register));

export default router;