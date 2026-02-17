import { Router } from "express";
import { asynHandler } from "../middlewares/asyncHandler.middleware";
import { YoutubeController } from "../controllers/youtube.controller";

const router = Router();

router.post("/url", asynHandler(YoutubeController.convert));
router.get("/history", asynHandler(YoutubeController.getHistory));
router.delete("/history", asynHandler(YoutubeController.clearHistory));

export default router;
