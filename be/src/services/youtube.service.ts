import youtubedl from "youtube-dl-exec";
import type { Readable } from "stream";
import { AppError } from "../utils/appError";

export class YoutubeService {
  static getAudioStream(videoUrl: string): Readable {
    const subprocess = youtubedl.exec(videoUrl, {
      format: "bestaudio",
      noPlaylist: true,
      output: "-",
    });

    if (!subprocess.stdout) {
      throw new AppError("Failed to create audio stream", 400);
    }

    subprocess.stderr?.on("data", (data: Buffer) => {
      console.error(`yt-dlp stderr: ${data.toString()}`);
    });

    return subprocess.stdout;
  }

  static async getVideoInfo(videoUrl: string) {
    const info = (await youtubedl(videoUrl, {
      dumpSingleJson: true,
      noWarnings: true,
      noPlaylist: true,
      skipDownload: true,
    })) as any;

    return {
      title: info.title,
      lengthSeconds: String(info.duration),
      thumbnail: info.thumbnail,
    };
  }
}
