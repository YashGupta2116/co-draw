import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const packageRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const envPath = path.join(packageRoot, ".env");

let loaded = false;

function loadEnv(): void {
  if (loaded) return;

  dotenv.config({ path: envPath });
  loaded = true;
}

export function getDatabaseUrl(): string {
  loadEnv();

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(`DATABASE_URL is not set. Add it to ${envPath}.`);
  }

  return url;
}
