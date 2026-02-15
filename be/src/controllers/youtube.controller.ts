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

    const info = await YoutubeService.getVideoInfo(videoId);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${info.title}.mp3"`
    );

    const stream = YoutubeService.getAudioStream(videoId);
    stream.pipe(res);
  }
}