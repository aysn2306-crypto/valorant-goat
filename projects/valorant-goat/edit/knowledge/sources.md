# Music and sound effect sources

Prices and terms checked 17 Nov 2026. Re-check a licence before a file goes in the final video. Every file used gets
a manifest row (source page, licence, SHA-256) as [[SOUND]] rule 9 says.

## 1. VALORANT Creator-Safe Playlist (free)

- **What:** 40 tracks of VALORANT music, described by Riot as "100% owned by Riot Games" and usable in streams and
  content if Riot's rules are followed. Spotify: https://open.spotify.com/playlist/4tyTLcBxJnf7DcQcHjwt0W
- **Rules** (Riot Music creator-safe guidelines, https://www.riotgames.com/en/riot-music-creator-safe-guidelines):
  - Monetised YouTube is fine if the video uses only songs on the creator-safe lists; Riot says these carry no risk
    of demonetisation or claims.
  - Credit each song in the description: title, artist, "Riot Games", and a link to the guidelines.
  - Don't repost a song unchanged (a song cut into an edit is fine). Don't sell it or use it mainly to advertise.
  - Songs **not** on the list need a licence. Riot names collaborations with outside labels (K/DA, True Damage) as
    ones it can't clear, so VCT and Champions anthems made with outside artists are out unless they are on the list.
- **Getting the files:** Spotify can't export audio. Riot's League creator-safe set is on SoundCloud with downloads
  turned on; check on ay's PC whether the VALORANT set is too. If not, Riot's site or the official soundtrack
  release are the next places to look. Don't rip from YouTube.
- **To do:** list all 40 track names and tempos, and mark the 3 to 5 that fit the cold open, the countdowns and the
  GOAT reveal.
- **Also from Riot's legal page** (https://www.riotgames.com/en/legal), relevant to the whole video, not just
  sound: fan projects must say they are fan made and not endorsed by Riot, and Riot's logos and trademarks may not
  be used in the project. Ads on YouTube videos are allowed.

## 2. Epidemic Sound with its Claude connector (paid)

- **Price:** Creator plan $17.99 a month, or $119.88 a year (US prices, checked by recurdash.com on 17 Oct 2026).
  Covers one YouTube channel plus one account each on TikTok, Instagram, Facebook and Twitch.
- **After cancelling:** Epidemic's help centre: "If you cancel, content published during your subscription will
  still be covered." So one month is enough if the video and its Shorts are **published** inside that month.
  Register the channel first (whitelisting can take 24 to 48 hours).
- **Catalogue:** about 55,000 tracks and 250,000 sound effects, stems on tracks.
- **The connector** (launched in Claude's directory on 31 Aug 2026; docs https://developers.epidemicsound.com/docs/mcp/):
  - Search tools: `SearchRecordings`, `SearchSimilarToRecording`, `SearchExternalReferences` (find tracks like a
    song you name), `SearchSoundEffects`, `SearchSimilarToSoundEffect`.
  - Edit tools (beta): `EditRecording` makes a new version of a track up to 5 minutes long and can pin sections to
    exact times, then `DownloadRecordingEdit`. Edits come as a full mix; stems come from the original track.
  - Downloads: `DownloadRecording`, `DownloadSoundEffect`. A free account can search and preview; downloads need a
    paid plan.
  - Setup in claude.ai: Settings, Connectors, add Epidemic Sound from the directory (or the custom URL below).
  - Setup in Claude Code on ay's PC: make an API key on epidemicsound.com (Account, API keys), then

```bash
claude mcp add -s user --transport http epidemic-sound https://www.epidemicsound.com/a/mcp-service/mcp \
  --header 'Authorization: Bearer ${EPIDEMIC_SOUND_MCP_API_KEY}'
```

- **Catch:** the Creator licence is for your own channels, not client work.

## 3. Sonniss GameAudioGDC archive (free)

- **What:** every free GDC bundle from 2015 to 2024 (opened as an archive in Aug 2026) plus the 2026 bundle
  (7.47 GB, 347+ WAV files). Professional game sound libraries: impacts, whooshes, UI, weapons, foley, ambiences.
  Site: https://gdc.sonniss.com (direct downloads and torrents).
- **Licence:** royalty free, commercial use, no attribution, unlimited projects. **Not allowed:** sharing the raw
  sounds on their own (they may only ship inside a finished work) and AI or ML training.
- **How we use it:** download one year at a time on ay's PC, never the whole archive at once (disk is limited).
  Pick by category folder, copy only the chosen files into `video/public/sfx/`, and keep them out of git (below).

## 4. Others, ranked

| Source | Cost | Licence in short | Use it for |
| --- | --- | --- | --- |
| YouTube Audio Library | free | no credit on the tracks we picked | current beds in `edit/MUSIC.md` |
| StreamBeats (Harris Heller) | free | monetised YouTube allowed, credit optional | instrumental lofi, synthwave, EDM, hip hop beds; weak search |
| Uppbeat | 3 free downloads; Creator $8.99 a month yearly | channel safelisting on paid plans | a backup if Epidemic is skipped |
| Artlist | from $9.99 a month | each download licensed for good | if we want to keep tracks without staying subscribed |
| Freesound (CC0) and Mixkit | free | already wired in `tools/audio/` | single specific sounds |

## Keep licensed audio out of the public repo

The repo is public. Sonniss forbids sharing raw sounds on their own, and Epidemic, Pixabay and Uppbeat files are
licensed to us, not to everyone who clones the repo. Keep audio in `video/public/sfx/` and `video/public/music/`
**local only** (gitignored) and commit the manifest instead. The six Pixabay files already in
`video/public/sfx/` came from the HyperFrames repo; they can stay until the next sound pass, then move to the
local folder too.

## Skills and repos checked and not imported

| Checked | Licence | Verdict |
| --- | --- | --- |
| ECC `video-editing` skill (affaan-m/everything-claude-code) | MIT | Pipeline only (FFmpeg cuts, Remotion, ElevenLabs). Nothing on sound placement. Skip. |
| AbsolutelySkilled `video-audio-design` | MIT | Makes effects with FFmpeg synthesis, three layer mix and ducking. [[SOUND]] already covers more, and real recorded libraries sound better than synthesised clicks. Skip. |
| Tella skills (tella.com/skills) | free | Visual effects (hard hit transition on the downbeat, zoom blur, glitch). Worth a look when we build transitions; not sound. |
| `retention-editing` skill (thecraighewitt/skills) | not stated | A persona and questions, no concrete rules visible. Skip. |
| Public Obsidian vaults (search across GitHub, Obsidian Publish, ecosyste.ms) | | None on YouTube editing or sound design. |
| Remotion official skills, video-shotcraft, HyperFrames sound notes | | Already in the repo. |

### The TikTok ay sent (17 Nov 2026)

"10 GitHub repos that turn Claude into a video editor", a photo slideshow by @promptifexappofficial (an ad account
for a prompt app), posted 14 Nov 2026, no narration. Frames and notes on ay's PC in
`Documents\valorant-goat-research\tiktok-ZN8aSVTvQ\`. None of the nine tools covers sound or music.

| Tool | Verdict for us |
| --- | --- |
| claude-shorts (AgriciDaniel, MIT) | Worth a trial later for cutting Shorts from the finished video (Remotion captions). |
| ffmpeg-skill (`npx ffmpeg-skill`, MIT) | Same ground as the toolkit's `ffmpeg` skill plus `qc.py`. Skip. |
| yt-dlp, Whisper | Already in our pipeline. |
| Ghost Editor | Talking-head reels, renders on a Mac. Not our format. Skip. |
| MotionClone | Rebuilds a reference motion clip as a project; early access, needs a ChatGPT plan. Skip for now. |
| "Motion Skills" (iArt.ai) | A paid website, no repo. Skip. |
| Agent Skills Hub list | A directory of Remotion tools, not a tool. |
| threejs-skills | 3D scenes; we don't need 3D. Skip. |
