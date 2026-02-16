import type { Request, Response } from "express";
import { AppError } from "../utils/appError";
import { PlaylistService } from "../services/playlist.service";
import { extractVideo } from "../utils/youtube";
import { YoutubeService } from "../services/youtube.service";

export class PlaylistController {
  
  static async createPlaylist(req: Request, res: Response) {
    const { name, description } = req.body;

    if (!name) {
      throw new AppError("Playlist name is required", 400);
    }

    const playlist = await PlaylistService.createPlaylist(
      name,
      description,
      req.user?.id,
    );

    res.status(201).json({
      success: true,
      data: playlist,
    });
  }


  static async getPlaylists(req: Request, res: Response) {
    const playlists = await PlaylistService.getUserPlaylists(req.user?.id);

    res.json({
      success: true,
      data: playlists,
    });
  }


  static async getPlaylist(req: Request, res: Response) {
    const playlistId = req.params.playlistId as string;

    if (!playlistId) {
      throw new AppError("Playlist ID is required", 400);
    }

    const playlist = await PlaylistService.getPlaylistById(
      playlistId,
      req.user?.id,
    );

    res.json({
      success: true,
      data: playlist,
    });
  }

  
  static async updatePlaylist(req: Request, res: Response) {
    const playlistId = req.params.playlistId as string;
    const { name, description } = req.body;

    if (!playlistId) {
      throw new AppError("Playlist ID is required", 400);
    }

    const playlist = await PlaylistService.updatePlaylist(
      playlistId,
      name,
      description,
      req.user?.id,
    );

    res.json({
      success: true,
      data: playlist,
    });
  }

  
  static async deletePlaylist(req: Request, res: Response) {
    const playlistId = req.params.playlistId as string;

    if (!playlistId) {
      throw new AppError("Playlist ID is required", 400);
    }

    await PlaylistService.deletePlaylist(playlistId, req.user?.id);

    res.json({
      success: true,
      message: "Playlist deleted successfully",
    });
  }

  
  static async addVideoToPlaylist(req: Request, res: Response) {
    const playlistId = req.params.playlistId as string;
    const { url } = req.body;

    if (!playlistId) {
      throw new AppError("Playlist ID is required", 400);
    }

    if (!url) {
      throw new AppError("Video URL is required", 400);
    }

   
    const videoId = extractVideo(url);
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    let title: string | undefined;
    let thumbnail: string | undefined;

    try {
      const info = await YoutubeService.getVideoInfo(videoUrl);
      title = info.title;
      thumbnail = info.thumbnail;
    } catch (error) {
     
      console.error("Failed to get video info:", error);
    }

    const item = await PlaylistService.addVideoToPlaylist(
      playlistId,
      url,
      videoId,
      title,
      thumbnail,
      req.user?.id,
    );

    res.status(201).json({
      success: true,
      data: item,
    });
  }

  
  static async removeVideoFromPlaylist(req: Request, res: Response) {
    const playlistId = req.params.playlistId as string;
    const itemId = req.params.itemId as string;

    if (!playlistId || !itemId) {
      throw new AppError("Playlist ID and Item ID are required", 400);
    }

    await PlaylistService.removeVideoFromPlaylist(
      playlistId,
      itemId,
      req.user?.id,
    );

    res.json({
      success: true,
      message: "Video removed from playlist",
    });
  }


  static async reorderPlaylistItems(req: Request, res: Response) {
    const playlistId = req.params.playlistId as string;
    const { itemOrders } = req.body;

    if (!playlistId) {
      throw new AppError("Playlist ID is required", 400);
    }

    if (!itemOrders || !Array.isArray(itemOrders)) {
      throw new AppError("Item orders array is required", 400);
    }

    const playlist = await PlaylistService.reorderPlaylistItems(
      playlistId,
      itemOrders,
      req.user?.id,
    );

    res.json({
      success: true,
      data: playlist,
    });
  }

 
  static async getPlaylistItems(req: Request, res: Response) {
    const playlistId = req.params.playlistId as string;

    if (!playlistId) {
      throw new AppError("Playlist ID is required", 400);
    }

    const items = await PlaylistService.getPlaylistItems(
      playlistId,
      req.user?.id,
    );

    res.json({
      success: true,
      data: items,
    });
  }
}
