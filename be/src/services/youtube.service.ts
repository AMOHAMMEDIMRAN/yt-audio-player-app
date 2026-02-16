import youtubedl from "youtube-dl-exec";
import type { Readable } from "stream";
import { AppError } from "../utils/appError";
import { prisma } from "../database/db";

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

  static async saveUrlToHistory(
    url: string,
    videoId: string,
    title?: string,
    thumbnail?: string,
    userId?: string,
  ) {
    // Save the URL to history
    await prisma.urlHistory.create({
      data: {
        url,
        videoId,
        title,
        thumbnail,
        userId,
      },
    });

    // Keep only the last 20 URLs
    const allHistory = await prisma.urlHistory.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: "desc" },
    });

    // If more than 20, delete the oldest ones
    if (allHistory.length > 20) {
      const toDelete = allHistory.slice(20);
      await prisma.urlHistory.deleteMany({
        where: {
          id: {
            in: toDelete.map((h) => h.id),
          },
        },
      });
    }
  }

  static async getUrlHistory(userId?: string, limit: number = 20) {
    return await prisma.urlHistory.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }

  static async clearUrlHistory(userId?: string) {
    await prisma.urlHistory.deleteMany({
      where: userId ? { userId } : {},
    });
  }
}
