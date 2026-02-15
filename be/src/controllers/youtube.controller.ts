import type { Request, Response } from "express";
import { AppError } from "../utils/appError";
import { extractVideo } from "../utils/youtube";
import { YoutubeService } from "../services/youtube.service";

export class YoutubeController {
  static async convert(req: Request, res: Response) {
    const { url } = req.body;

    if (!url) {
      throw new AppError("URL is required", 400);
    }

    const videoId = extractVideo(url);
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const info = await YoutubeService.getVideoInfo(videoUrl);

    const safeTitle = info.title.replace(/[^\w\s-]/gi, "").replace(/\s+/g, "_");

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", `inline; filename="${safeTitle}.mp3"`);

    const stream = YoutubeService.getAudioStream(videoUrl);

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to stream audio" });
      }
    });

    stream.pipe(res);
  }

  static async createPlaylist(req: Request, res: Response) {
    const {playlistName} = req.body;
    // const userId = req.user?.id;

    // await YoutubeService.createPlayList(userId, playlistName);

    res.status(201).json({ message: "Playlist created successfully" });
  }

  static async addPlaylistItem(req: Request, res: Response) {
    const { url } = req.body;
    const { id } = req.params;
    // const userId = req.user?.id;
    
    // await YoutubeService.addPlayListItem(id,userId,extractVideo(url));
  }

  static async getPlaylist(req: Request, res: Response) {
    const { id } = req.params;
  }
}
