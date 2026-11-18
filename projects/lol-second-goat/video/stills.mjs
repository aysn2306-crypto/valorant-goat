// node stills.mjs <frame> [<frame>...]  -> out/stills/f<frame>.jpg  (one bundle, many stills)
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
const frames = process.argv.slice(2).map(Number);
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const composition = await selectComposition({ serveUrl, id: "Main", browserExecutable });
const dir = process.env.OUTDIR || "out/stills"; fs.mkdirSync(dir, { recursive: true });
for (const f of frames) {
  await renderStill({ composition, serveUrl, frame: f, output: `${dir}/f${f}.jpg`, imageFormat: "jpeg", jpegQuality: 80, browserExecutable, scale: 0.5 });
  console.log("ok", f);
}
