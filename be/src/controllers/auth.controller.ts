import type { Request, Response } from "express";

export class AuthController {
    static async register(req: Request, res: Response) {
        const {email} = req.body;
        await
        res.status(200).json("OTP sent successfully")
    }
}