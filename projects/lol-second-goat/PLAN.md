# Who is the second greatest League player of all time? (production plan, DRAFT)

Working title: "Using AI to find the 2nd greatest League of Legends player of all time".
Premise: Faker is the undisputed GOAT (6 Worlds). Who has the best resume after him?
Goes out before the Valorant video (ay, 17 Nov 2026) to catch the window after Worlds 2026.

## Facts checked for the hook (Liquipedia and Leaguepedia, 17 Nov 2026)
- Worlds 2026 ended 14 Nov 2026 at Barclays Center, New York. Champion: **Bilibili Gaming** (Bin, Xun, Knight, Viper, ON; head coach Daeny).
- **Knight** was Finals MVP: the first Chinese mid laner to win Worlds (Liquipedia, Knight page).
- **Viper** now has **two** Worlds titles: EDward Gaming 2021 and BLG 2026 (Liquipedia, Viper page). ay's "Viper has 2" is right.
- **Bin**: first Worlds title.
- Faker: 6 Worlds (2013, 2015, 2016, 2023, 2024, 2025). Keria, Oner and Gumayusi: 3 each (2023 to 2025). Zeus: 2.
- Still to check before the script: the Worlds 2026 final opponent and score, and BLG's path.

## Chapters and panels (the data is pulled to fill these)
| # | Chapter | Panel | Data it needs |
|---|---|---|---|
| P01 | Cold open | "Worlds just ended": BLG lift the trophy (official footage), Knight Finals MVP card | Worlds 2026 facts above |
| P02 | Cold open | Faker's six trophies in a row, then an empty podium spot labelled "#2 ?" | Faker titles |
| P03 | Cold open | Wall of contenders (photos): Knight, Viper, Bin, Uzi, Deft, Ruler, Chovy, Canyon, Keria, Gumayusi, Oner, Bengi, Rookie, TheShy, Caps... | candidate list from the data, not guesses |
| P04 | Mission | Why other sports have undisputed GOATs (Jordan, Brady) and #2 is the real debate | none |
| P05 | Research | Counter: 15 seasons, 300+ tournaments, N games, N players scraped | pull totals |
| P06 | Research | Map of regions with their strength by year (LCK, LPL, LEC, LCS) | region strength table |
| P07 | Formula | The four ideas: trophies by tier, carry share, peak, era and region | config/weights.yaml |
| P08 | Formula | Trophy tier ladder: Worlds > MSI > First Stand > domestic (by region strength) | tier table |
| P09 | Formula | Carry share explained on one title (e.g. Worlds 2026: Knight vs Bin vs Viper credit) | per-event impact |
| P10 | Formula | Faker = 100, the measuring stick | Faker benchmark |
| P11 | Surprises | 3 to 4 data surprises (beats chosen after the run) | report |
| P12-P19 | Categories | Top 5 per category, one panel each (8 categories, below) | scores |
| P20 | Overall | Countdown 5 to 2, then the #2 reveal, gap to Faker shown as a bar | scores |
| P21 | Twist | Tipping-point slider: how much trophy weight flips #2 | weight sweep |
| P22 | Twist | Side-boards: Most Decorated vs Most Dominant | scores |
| P23 | Twist | 1,000 random weight shuffles: "chance to be #2" | robustness run |
| P24 | Close | Where the new champions (Knight, Viper, Bin) landed; end card, "not endorsed by Riot" | scores |

## Scoring (v3 method carried over from the Valorant video)
- **Pool:** players with 150+ games in the major leagues or Worlds/MSI since 2011. Faker scored but left out of the ranking (benchmark = 100).
- **Trophies at full value, no diminishing returns** (ay's rule): Worlds 100, MSI 50, First Stand 25, Mid-Season Cup 2020 15; domestic title 20 times the region's strength that year (LCK/LPL near 1.0, LEC, LCS and LMS lower, measured from international results). Runner-up and top 4 earn a share, as in the Valorant table. A player needs half the team's games at that event to count.
- **Carry share per title:** 0.5x to 1.5x, from the player's role-adjusted impact at that event vs teammates.
- **Impact** (per game, compared inside the same role and year): KDA, kill participation, damage per minute, gold share, deaths per minute (lower is better). Leaguepedia scoreboards only, so laning numbers like gold diff at 15 are not used.
- **Region and era:** stats are compared inside role and year; domestic numbers are scaled by region strength; international events are the neutral ground.
- **Categories (weight):** Trophies 28, Big-stage form (Worlds/MSI impact) 15, Peak (best calendar year) 12, Winning (win rate, region-adjusted) 10, Longevity (years at an elite level) 10, Carry (damage and gold share) 10, Clean play (KDA, deaths) 8, Consistency 7.
- **Twists:** tipping-point sweep of trophy weight, Most Decorated vs Most Dominant, 1,000-run weight shuffle (each weight moved up to 30%).

## Sources
- Leaguepedia (lol.fandom.com) Cargo API: tournaments, placements, per-game scoreboards. Main source.
- Liquipedia: cross-check of titles, rosters and Finals MVPs.
- gol.gg and Oracle's Elixir: blocked from the cloud (connection reset, Cloudflare 403); not needed for the draft.

## Music, sound and Riot rules
- Riot's **Creator-Safe Playlist** covers League too (Riot Music guidelines on leagueoflegends.com): free, monetisable, credit "Song title, Artists, Courtesy of Riot Games, link". K/DA, True Damage and other partner songs are NOT included; Worlds anthems only if they are on the playlist. Download from Riot's SoundCloud set.
- Plus the free sources already chosen: YouTube Audio Library, Sonniss, Freesound CC0.
- No Riot or League logos in graphics; "not endorsed by Riot" in the end card and description.
