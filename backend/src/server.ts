import { config } from "./config/settings";
import { prisma } from "./database/db";
import { app } from "./app";
import { redis } from "./config/redis";

class Bootstrap {
  public static async startServer() {
    try {
      await prisma.$connect();
      console.log("Database connected");
      if (!redis.isOpen) {
        await redis.connect();
        console.log("Redis connected");
      }

      app.listen(config.get("PORT"), () => {
        console.log(`Server running on port ${config.get("PORT")}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  }
}

Bootstrap.startServer();
