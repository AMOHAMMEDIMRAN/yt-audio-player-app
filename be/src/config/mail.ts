import nodemailer from "nodemailer";
import { config } from "./settings";

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.get("EMAIL_USER"),
        pass: config.get("EMAIL_PASS")
    }
});

export const sendEmailOtp = async(to: string, otp: string) => {
    await transport.sendMail({
        from: config.get("EMAIL_USER"),
        to,
        subject: "Your OTP Code",
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Your Verification Code</h2>
        <p>Your OTP is:</p>
        <h1 style="letter-spacing: 5px;">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      </div>
    `,
    });
}