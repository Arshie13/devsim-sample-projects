import "dotenv/config";
import { z } from "zod";

const EnvSchema = z.object({
  MONGO_URI: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(5000),
  JWT_SECRET: z.string().min(8),
});

export const env = EnvSchema.parse(process.env);
export type Env = z.infer<typeof EnvSchema>;
