import { chromium } from "@playwright/test";
import { createServer } from "http";
import { readFileSync, existsSync } from "fs";
import { join, extname, dirname } from "path";
import { fileURLToPath } from "url";
import { games } from "../src/data/games";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, "..", "public");
const VIEWPORT = { width: 1280, height: 720 };
const LOAD_WAIT_MS = 5000;

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".wav": "audio/wav",
};

function startStaticServer(port: number): Promise<ReturnType<typeof createServer>> {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url || "/", `http://localhost:${port}`);
      let filePath = join(PUBLIC_DIR, url.pathname);

      if (filePath.endsWith("/")) filePath += "index.html";
      if (!existsSync(filePath)) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }

      const ext = extname(filePath);
      const mime = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": mime });
      res.end(readFileSync(filePath));
    });

    server.listen(port, () => resolve(server));
  });
}

async function main() {
  const port = 8787;
  const server = await startStaticServer(port);
  console.log(`Static server running on http://localhost:${port}`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: VIEWPORT });

  for (const game of games) {
    const url = `http://localhost:${port}/games/${game.id}/`;
    const outPath = join(PUBLIC_DIR, "games", game.id, "thumbnail.png");

    console.log(`Capturing ${game.id}...`);
    const page = await context.newPage();

    page.on("console", (msg) => {
      if (msg.type() === "error") console.log(`  [console.error] ${msg.text()}`);
    });
    page.on("pageerror", (err) => {
      console.log(`  [page error] ${err.message}`);
    });

    try {
      await page.goto(url, { waitUntil: "load", timeout: 30000 });
      // Click to trigger any interaction-gated rendering
      await page.mouse.click(VIEWPORT.width / 2, VIEWPORT.height / 2);
      await page.waitForTimeout(LOAD_WAIT_MS);
      await page.screenshot({ path: outPath, type: "png" });
      console.log(`  -> ${outPath}`);
    } catch (err) {
      console.error(`  Failed to capture ${game.id}:`, err);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  server.close();
  console.log("Done!");
}

main();
