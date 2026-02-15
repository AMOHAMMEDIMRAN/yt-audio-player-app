import { Router } from "express";
import { asynHandler } from "../middlewares/asyncHandler.middleware";

const router = Router();

router.post("/url", asynHandler);

export default router;