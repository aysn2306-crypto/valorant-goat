# valorant-goat

Data, scoring, graphics and rough-cut editing for the YouTube video
**"Using AI to Find the Greatest Valorant Player of All Time"**.

Ranking method: see the ranking plan doc (weights draft in `config/weights.yaml`, **not approved yet**).

## Folders

| Folder | What's in it |
| --- | --- |
| `data/sources/` | `vlr.py` (vlr.gg via vlrdevapi + local vlrggapi), `liquipedia.py` (polite Liquipedia API client), `cache.py` (every page fetched once, saved in `data/raw/`) |
| `data/csv/` | Clean CSVs the scoring reads. Right now: a Champions 2022 sample from the smoke test |
| `config/` | `weights.yaml`: every weight and twist switch in one place |
| `scoring/` | Empty until the weights are approved |
| `graphics/` | `style.py` (channel palette and fonts), `cards.py` (chapter cards, player stat cards), `charts.py` (leaderboard bars), `fonts/` (Anton, Bebas Neue, Inter; SIL OFL) |
| `graphics/panels.py` | Beat-by-beat panels (P02, P06, P07, P12, P13, P14 so far): one PNG per beat plus a reveal video. `python -m graphics.panels` |
| `research/` | `log.csv`, the research log |
| `edit/` | `rough_cut.py` builds a timed rough cut from `timeline.yaml` (cards, clips, voiceover, music bed) |
| `vendor/vlrggapi/` | Pinned copy of vlrggapi (MIT), run locally for event stats |

## Setup

```bash
uv venv .venv && source .venv/bin/activate   # or python -m venv .venv
uv pip install -r requirements.txt           # or pip install -r requirements.txt
# also needs ffmpeg on the system (brew install ffmpeg / winget install ffmpeg)
```

## Try it

```bash
scripts/start_vlrggapi.sh &        # local vlr.gg API on :3001
python -m data.smoke_test          # pulls Champions 2022 stats, standings, MVP -> data/csv/
python -m graphics.cards           # chapter + stat card PNGs -> graphics/out/
python -m graphics.charts          # demo leaderboard chart -> graphics/out/
python -m edit.rough_cut edit/timeline.example.yaml   # 14 s demo rough cut -> edit/out/
```

## Data rules

- vlr.gg: no official API; 1.5 s between requests, each page fetched once and cached.
- Liquipedia: max one request per 2 s, gzip, generic user agent, wikitext only (no bulk `action=parse`).
  Credit "Data: Liquipedia (CC-BY-SA)" on screen when showing its data.
- Footage: only clips you have rights to use (your own recordings, VODs within Riot's
  community content rules). Music: royalty-free only.
