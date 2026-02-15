import ytdl from "@distube/ytdl-core";

export class YoutubeService{
    static getAudioStream(videoId: string) {
    return ytdl(videoId, {
      quality: "highestaudio",
      filter: "audioonly",
      highWaterMark: 1 << 25, 
    });
  }

  static async getVideoInfo(videoId: string) {
    const info = await ytdl.getInfo(videoId);

    return {
      title: info.videoDetails.title,
      lengthSeconds: info.videoDetails.lengthSeconds,
      thumbnail: info.videoDetails.thumbnails.at(-1)?.url,
    };
  }
}