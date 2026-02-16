import { prisma } from "../database/db";
import { AppError } from "../utils/appError";

export class PlaylistService {

  static async createPlaylist(
    name: string,
    description?: string,
    userId?: string,
  ) {
    return await prisma.playlist.create({
      data: {
        name,
        description,
        userId,
      },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
      },
    });
  }

 
  static async getUserPlaylists(userId?: string) {
    return await prisma.playlist.findMany({
      where: userId ? { userId } : {},
      include: {
        items: {
          orderBy: { order: "asc" },
        },
        _count: {
          select: { items: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

 
  static async getPlaylistById(playlistId: string, userId?: string) {
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!playlist) {
      throw new AppError("Playlist not found", 404);
    }

    
    if (userId && playlist.userId && playlist.userId !== userId) {
      throw new AppError("Unauthorized access to playlist", 403);
    }

    return playlist;
  }

  
  static async updatePlaylist(
    playlistId: string,
    name?: string,
    description?: string,
    userId?: string,
  ) {
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      throw new AppError("Playlist not found", 404);
    }

    
    if (userId && playlist.userId && playlist.userId !== userId) {
      throw new AppError("Unauthorized access to playlist", 403);
    }

    return await prisma.playlist.update({
      where: { id: playlistId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
      },
      include: {
        items: {
          orderBy: { order: "asc" },
        },
      },
    });
  }

  
  static async deletePlaylist(playlistId: string, userId?: string) {
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      throw new AppError("Playlist not found", 404);
    }

  
    if (userId && playlist.userId && playlist.userId !== userId) {
      throw new AppError("Unauthorized access to playlist", 403);
    }

    await prisma.playlist.delete({
      where: { id: playlistId },
    });
  }

  
  static async addVideoToPlaylist(
    playlistId: string,
    url: string,
    videoId: string,
    title?: string,
    thumbnail?: string,
    userId?: string,
  ) {
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      include: {
        items: true,
      },
    });

    if (!playlist) {
      throw new AppError("Playlist not found", 404);
    }

  
    if (userId && playlist.userId && playlist.userId !== userId) {
      throw new AppError("Unauthorized access to playlist", 403);
    }

    const existingItem = playlist.items.find(
      (item) => item.videoId === videoId,
    );
    if (existingItem) {
      throw new AppError("Video already exists in playlist", 400);
    }

  
    const maxOrder =
      playlist.items.length > 0
        ? Math.max(...playlist.items.map((item) => item.order))
        : -1;

    return await prisma.playlistItem.create({
      data: {
        playlistId,
        url,
        videoId,
        title,
        thumbnail,
        order: maxOrder + 1,
      },
    });
  }


  static async removeVideoFromPlaylist(
    playlistId: string,
    itemId: string,
    userId?: string,
  ) {
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      throw new AppError("Playlist not found", 404);
    }

    
    if (userId && playlist.userId && playlist.userId !== userId) {
      throw new AppError("Unauthorized access to playlist", 403);
    }

    const item = await prisma.playlistItem.findUnique({
      where: { id: itemId },
    });

    if (!item || item.playlistId !== playlistId) {
      throw new AppError("Item not found in playlist", 404);
    }

    await prisma.playlistItem.delete({
      where: { id: itemId },
    });
  }

 
  static async reorderPlaylistItems(
    playlistId: string,
    itemOrders: { itemId: string; order: number }[],
    userId?: string,
  ) {
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      throw new AppError("Playlist not found", 404);
    }

    
    if (userId && playlist.userId && playlist.userId !== userId) {
      throw new AppError("Unauthorized access to playlist", 403);
    }

   
    await prisma.$transaction(
      itemOrders.map((item) =>
        prisma.playlistItem.update({
          where: { id: item.itemId },
          data: { order: item.order },
        }),
      ),
    );

    return await this.getPlaylistById(playlistId, userId);
  }

  
  static async getPlaylistItems(playlistId: string, userId?: string) {
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
    });

    if (!playlist) {
      throw new AppError("Playlist not found", 404);
    }

    if (userId && playlist.userId && playlist.userId !== userId) {
      throw new AppError("Unauthorized access to playlist", 403);
    }

    return await prisma.playlistItem.findMany({
      where: { playlistId },
      orderBy: { order: "asc" },
    });
  }
}
