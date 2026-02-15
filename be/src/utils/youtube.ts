import { AppError } from "./appError";

export const extractVideo = (url: string): string => {
    const match = url.match( /(?:youtube\.com\/.*v=|youtu\.be\/)([^&\n?#]+)/);

    if(!match){
        throw new AppError("Invaild url", 400);
    }

    return match[1]!;
}