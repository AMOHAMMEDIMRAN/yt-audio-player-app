import { config as loadENV } from "dotenv";
import { envSchema, type EnvSchema } from "../validators/env.schema";

loadENV();

class SettingENV {
  private static instance: SettingENV;
  private static env: EnvSchema;

  private constructor() {
    const parsed = envSchema.safeParse(process.env);

    if (!parsed.success) {
      console.error("Invalid environment variables:");
      console.error(parsed.error.format());
      process.exit(1);
    }
    SettingENV.env = parsed.data;
  }

  public static getInstance(): SettingENV {
    if (!SettingENV.instance) {
      SettingENV.instance = new SettingENV();
    }
    return SettingENV.instance;
  }
  public get<T extends keyof EnvSchema>(key: T): EnvSchema[T] {
    return SettingENV.env[key];
  }
}

export const config = SettingENV.getInstance();
