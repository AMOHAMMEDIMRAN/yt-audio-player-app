import type { Request, Response } from "express";
import { prisma } from "../database/db";
import { AppError } from "../utils/appError";
import { redis } from "../config/redis";
import { generateToken } from "../utils/generateToken";
import { sendEmailOtp } from "../config/mail";

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
export class AuthService {
  static async register(email: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError("User already existing", 400);
    }
    const otp = generateOtp();

    await redis.set(`otp:${email}`, otp, {
      EX: 300,
    });

    await sendEmailOtp(email, otp);
    console.log("Otp generated");
  }
  static async verifyOtp(email: string, otp: string) {
    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp) {
      throw new AppError("OTP expired", 400);
    }

    if (storedOtp !== otp) {
      throw new AppError("Invalid OTP", 400);
    }

    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { email },
      });
    }

    await redis.del(`otp:${email}`);

    const token = generateToken(user.id, user.email);

    return { token, user };
  }
}
