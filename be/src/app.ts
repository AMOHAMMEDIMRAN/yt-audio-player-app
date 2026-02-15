import express from "express";
import authRouter from "./routes/auth.route";
import helmet from "helmet";
import cors from "cors";
import { config } from "./config/settings";

export const app = express();

app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (config.get("CORS_ALLOWED_ORIGINS").includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use("/api/v1/auth", authRouter);
