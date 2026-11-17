// Channel style. Mirrors valorant-goat/graphics/style.py so PNGs and motion match.
// Gold is ONLY for titles won, the top 3 and the GOAT reveal.
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const C = {
  bg: "#0E1116",
  panel: "#1B212B",
  panelHi: "#252D3A",
  cyan: "#22D3EE",
  gold: "#F5B83D",
  red: "#FF5A5F",
  mint: "#34D399",
  text: "#EDEFF2",
  muted: "#6B7685",
};

export const F = {
  title: "Anton",
  alt: "Bebas Neue",
  body: "Inter",
};

export const W = 1920;
export const H = 1080;
export const FPS = 30;

let loaded = false;
export const loadFonts = () => {
  if (loaded) return;
  loaded = true;
  loadFont({ family: "Anton", url: staticFile("fonts/Anton-Regular.ttf") });
  loadFont({ family: "Bebas Neue", url: staticFile("fonts/BebasNeue-Regular.ttf") });
  loadFont({ family: "Inter", url: staticFile("fonts/Inter-Variable.ttf"), weight: "100 900" });
};
