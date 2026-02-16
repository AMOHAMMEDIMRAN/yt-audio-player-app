import { Router } from "express";
import { asynHandler } from "../middlewares/asyncHandler.middleware";
import { PlaylistController } from "../controllers/playlist.controller";

const router = Router();


router.post("/", asynHandler(PlaylistController.createPlaylist));
router.get("/", asynHandler(PlaylistController.getPlaylists));
router.get("/:playlistId", asynHandler(PlaylistController.getPlaylist));
router.put("/:playlistId", asynHandler(PlaylistController.updatePlaylist));
router.delete("/:playlistId", asynHandler(PlaylistController.deletePlaylist));


router.get(
  "/:playlistId/items",
  asynHandler(PlaylistController.getPlaylistItems),
);
router.post(
  "/:playlistId/items",
  asynHandler(PlaylistController.addVideoToPlaylist),
);
router.delete(
  "/:playlistId/items/:itemId",
  asynHandler(PlaylistController.removeVideoFromPlaylist),
);
router.put(
  "/:playlistId/reorder",
  asynHandler(PlaylistController.reorderPlaylistItems),
);

export default router;
