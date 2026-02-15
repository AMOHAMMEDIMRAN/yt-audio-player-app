import youtubedl from "youtube-dl-exec";
import type { Readable } from "stream";
import { prisma } from "../database/db";
import { AppError } from "../utils/appError";

export class YoutubeService {
  static getAudioStream(videoUrl: string): Readable {
    const subprocess = youtubedl.exec(videoUrl, {
      format: "bestaudio",
      noPlaylist: true,
      output: "-",
    });

    if (!subprocess.stdout) {
      throw new Error("Failed to create audio stream");
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

  static async createPlayList(userId: string, playlistName: string) {
    const existPlaylistName = await prisma.playList.findUnique({
      where: {
        name: playlistName,
        id: userId,
      },
    });

    if (existPlaylistName) {
      throw new AppError("Playlist name already exists", 400);
    }

    const playlist = await prisma.playList.create({
      data: {
        name: playlistName,
        id: userId,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return playlist;
  }

  static async addPlayListItem(
    playlistId: string,
    userId: string,
    videoUrl: string,
  ) {
    const existingItem = await prisma.playListItem.findUnique({
      where: {
        url: videoUrl,
      },
    });

    if (existingItem) {
      throw new AppError("Item already exists in playlist", 400);
    }

    const videourl = await prisma.playListItem.create({
      data: {
        url: videoUrl,
        playList: {
          connect: {
            id: playlistId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return videourl;
  }

  static async getPlaylist(playlistId: string) {
    const playlist = await prisma.playList.findUnique({
      where: {
        id: playlistId,
      },
    });

    return playlist;
  }
}
