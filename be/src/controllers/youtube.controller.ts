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
}
