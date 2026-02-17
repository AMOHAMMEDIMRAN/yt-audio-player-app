import jwt, { type SignOptions } from "jsonwebtoken";
import { config } from "../config/settings";

export const generateToken = (userId: string, email: string) => {
  const payload = { userId, email };
  const secret = config.get("JWT_SECRET");
  const options = { expiresIn: config.get("JWT_EXP") } as SignOptions;
  return jwt.sign(payload, secret, options);
};
