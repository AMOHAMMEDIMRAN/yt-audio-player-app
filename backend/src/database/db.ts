import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "../config/settings";

const adapter = new PrismaPg({
  connectionString: config.get("DATABASE_URL"),
});

export const prisma = new PrismaClient({
  adapter,
});
