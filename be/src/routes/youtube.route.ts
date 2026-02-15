import { Router } from "express";
import { asynHandler } from "../middlewares/asyncHandler.middleware";
import { YoutubeController } from "../controllers/youtube.controller";

const router = Router();

router.post("/url", asynHandler(YoutubeController.convert));
router.post("/playlist", asynHandler(YoutubeController.createPlaylist));
router.post("/playlist/:id/addplaylistitem", asynHandler(YoutubeController.addPlaylistItem));

router.get("/playlist/:id", asynHandler(YoutubeController.getPlaylist));

export default router;