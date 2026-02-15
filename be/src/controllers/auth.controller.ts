import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
  static async register(req: Request, res: Response) {
    const { email } = req.body;
    await AuthService.register(email);
    res.status(200).json("OTP sent successfully");
  }

  static async verifyOtp(req: Request, res: Response) {
    const { email, otp } = req.body;
    const result = await AuthService.verifyOtp(email, otp);
    res.status(200).json(result);
  }
}
