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

    await YoutubeService.saveUrlToHistory(
      url,
      videoId,
      info.title,
      info.thumbnail,
      req.user?.id,
    );

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${info.title}.mp3"`,
    );

    const stream = YoutubeService.getAudioStream(videoUrl);

    stream.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ error: "Failed to stream audio" });
      }
    });

    stream.pipe(res);
  }

  static async getHistory(req: Request, res: Response) {
    const limit = parseInt(req.query.limit as string) || 20;
    const history = await YoutubeService.getUrlHistory(req.user?.id, limit);

    res.json({
      success: true,
      data: history,
    });
  }

  static async clearHistory(req: Request, res: Response) {
    await YoutubeService.clearUrlHistory(req.user?.id);

    res.json({
      success: true,
      message: "History cleared successfully",
    });
  }
}
