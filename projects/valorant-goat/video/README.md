# video/ : the edit, built in Remotion

ay picked Remotion (17 Nov 2026): every section of the video is React code that renders to MP4.
Free Remotion licence covers individuals and companies of up to 3 people.

```bash
cd video
npm install
npx remotion studio                         # live preview in the browser, scrub the timeline
npx remotion render ClutchSample out/clutch_sample.mp4
npx remotion skills add                     # optional: official Remotion skills for Claude Code (run on the PC)
```

In the cloud container add `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`.

| Path | What |
| --- | --- |
| `src/theme.ts` | Palette and fonts (mirrors `graphics/style.py`) |
| `src/sample/` | Sample section: P21 category intro, P22 field histogram -> top 5 countdown (27 s) |
| `src/components/Leaderboard.tsx` | P07/P08 reshuffle leaderboard (rows slide, mint/red arrows) |
| `src/data/clutchDemo.ts` | DEMO numbers only, until scoring outputs real ones |
| `public/sfx/` | Pixabay-licensed SFX (see CREDITS.md) |
| `public/fonts/` | Anton, Bebas Neue, Inter (SIL OFL) |

Rules used: sound peaks land one frame after the picture; exits shorter than entrances; one idea per beat; gold only for trophies/top 3/GOAT.
